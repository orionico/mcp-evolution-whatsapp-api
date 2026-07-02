#!/usr/bin/env node

// Version is automatically updated during release process
export const VERSION = "0.1.0";

import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	isInitializeRequest,
	type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { createTools } from "./tools";

const tools = createTools();

// sessionInstance is captured in the closure of the CallToolRequestSchema
// handler below, so each HTTP session (its own Server instance, from its own
// buildServer() call) resolves instanceName against its own bound instance —
// no shared mutable state, no reliance on AsyncLocalStorage surviving the
// SDK's internal Web Standard Request/Response conversion.
function buildServer(sessionInstance?: string): Server {
	const server = new Server(
		{
			name: "Evolution API MCP Server",
			version: VERSION,
		},
		{
			capabilities: {
				tools: {},
			},
		},
	);

	server.setRequestHandler(ListToolsRequestSchema, async () => {
		return {
			tools: tools.map(({ handler, ...tool }) => ({
				name: tool.name,
				description: tool.description,
				inputSchema: tool.inputSchema,
			})),
		};
	});

	server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
		try {
			const { name, arguments: args } = request.params;
			const tool = tools.find((t) => t.name === name);

			if (!tool) {
				throw new Error(`Unknown tool: ${name}`);
			}

			try {
				const argsWithInstance =
					sessionInstance && args && typeof args === "object" && !("instanceName" in args)
						? { ...args, instanceName: sessionInstance }
						: args;
				return await tool.handler(argsWithInstance);
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message.includes("EVOLUTION_API_KEY") ||
						error.message.includes("EVOLUTION_API_URL"))
				) {
					return {
						content: [
							{
								type: "text",
								text: "Authentication required: Please provide your Evolution API credentials in the configuration settings.",
							},
						],
						isError: true,
					};
				}
				throw error;
			}
		} catch (error) {
			return {
				content: [
					{
						type: "text",
						text: `Error: ${error instanceof Error ? error.message : String(error)}`,
					},
				],
				isError: true,
			};
		}
	});

	return server;
}

async function runStdio() {
	const server = buildServer();
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Evolution API MCP Server running on stdio");
}

async function runHttp() {
	const port = Number(process.env.PORT ?? 3000);
	const mcpPath = process.env.MCP_PATH ?? "/mcp-evolution-whatsapp-api";
	const authToken = process.env.MCP_HTTP_AUTH_TOKEN;

	if (!authToken) {
		throw new Error("MCP_HTTP_AUTH_TOKEN environment variable is required when MCP_TRANSPORT=http");
	}

	const app = createMcpExpressApp({ host: "0.0.0.0" });

	// Registered both at root and under mcpPath since Traefik forwards the full
	// PathPrefix without stripping it.
	app.get(["/health", `${mcpPath}/health`], (_req, res) => {
		res.status(200).json({ status: "ok" });
	});

	function requireAuth(req: import("express").Request, res: import("express").Response, next: () => void) {
		const header = req.headers.authorization;
		if (header !== `Bearer ${authToken}`) {
			res.status(401).json({
				jsonrpc: "2.0",
				error: { code: -32001, message: "Unauthorized" },
				id: null,
			});
			return;
		}
		next();
	}

	// One transport (and one connected Server) per MCP session, keyed by mcp-session-id.
	const transports: Record<string, StreamableHTTPServerTransport> = {};

	function instanceHeader(req: import("express").Request): string | undefined {
		const value = req.headers["x-evolution-instance"];
		return Array.isArray(value) ? value[0] : value;
	}

	const mcpPostHandler = async (req: import("express").Request, res: import("express").Response) => {
		const sessionId = req.headers["mcp-session-id"] as string | undefined;

		try {
			let transport: StreamableHTTPServerTransport;

			if (sessionId && transports[sessionId]) {
				transport = transports[sessionId];
			} else if (!sessionId && isInitializeRequest(req.body)) {
				transport = new StreamableHTTPServerTransport({
					sessionIdGenerator: () => randomUUID(),
					onsessioninitialized: (newSessionId) => {
						transports[newSessionId] = transport;
					},
				});

				transport.onclose = () => {
					const sid = transport.sessionId;
					if (sid && transports[sid]) {
						delete transports[sid];
					}
				};

				const server = buildServer(instanceHeader(req));
				await server.connect(transport);
				await transport.handleRequest(req, res, req.body);
				return;
			} else {
				res.status(400).json({
					jsonrpc: "2.0",
					error: { code: -32000, message: "Bad Request: No valid session ID provided" },
					id: null,
				});
				return;
			}

			await transport.handleRequest(req, res, req.body);
		} catch (error) {
			console.error("Error handling MCP request:", error);
			if (!res.headersSent) {
				res.status(500).json({
					jsonrpc: "2.0",
					error: { code: -32603, message: "Internal server error" },
					id: null,
				});
			}
		}
	};

	const mcpGetHandler = async (req: import("express").Request, res: import("express").Response) => {
		const sessionId = req.headers["mcp-session-id"] as string | undefined;
		if (!sessionId || !transports[sessionId]) {
			res.status(400).send("Invalid or missing session ID");
			return;
		}
		await transports[sessionId].handleRequest(req, res);
	};

	const mcpDeleteHandler = async (req: import("express").Request, res: import("express").Response) => {
		const sessionId = req.headers["mcp-session-id"] as string | undefined;
		if (!sessionId || !transports[sessionId]) {
			res.status(400).send("Invalid or missing session ID");
			return;
		}
		try {
			await transports[sessionId].handleRequest(req, res);
		} catch (error) {
			console.error("Error handling session termination:", error);
			if (!res.headersSent) {
				res.status(500).send("Error processing session termination");
			}
		}
	};

	app.post(mcpPath, requireAuth, mcpPostHandler);
	app.get(mcpPath, requireAuth, mcpGetHandler);
	app.delete(mcpPath, requireAuth, mcpDeleteHandler);

	app.listen(port, () => {
		console.error(`Evolution API MCP Server listening on port ${port}, path ${mcpPath}`);
	});

	process.on("SIGINT", async () => {
		for (const sessionId in transports) {
			try {
				await transports[sessionId].close();
				delete transports[sessionId];
			} catch (error) {
				console.error(`Error closing transport for session ${sessionId}:`, error);
			}
		}
		process.exit(0);
	});
}

const transportMode = process.env.MCP_TRANSPORT ?? "stdio";

const run = transportMode === "http" ? runHttp() : runStdio();

run.catch((error) => {
	console.error("Fatal error running server:", error);
	process.exit(1);
});
