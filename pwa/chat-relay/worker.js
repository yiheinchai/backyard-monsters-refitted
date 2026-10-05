/**
 * Chat relay for the browser client.
 *
 * A page served over HTTPS may only open wss:// sockets, and a chat server that only speaks
 * plain ws:// can't be reached from it. This Cloudflare Worker accepts the page's wss://
 * connection and forwards every message, unchanged, to the chat server over ws://.
 *
 * The page names the chat server the game was given as `?to=host:port` (play.js does this when
 * BYMR_CONFIG.chatRelay is set). Settings (wrangler.toml `[vars]`):
 * - CHAT_HOSTS: comma-separated chat server host names the relay may connect to.
 * - ALLOWED_ORIGINS: comma-separated page origins allowed to connect, so other sites can't
 *   use the relay.
 */
export default {
  async fetch(request, env) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected a WebSocket connection", { status: 426 });
    }

    if (!list(env.ALLOWED_ORIGINS).includes(request.headers.get("Origin"))) {
      return new Response("Origin not allowed", { status: 403 });
    }

    const [host, port] = (new URL(request.url).searchParams.get("to") || "").split(":");
    if (!list(env.CHAT_HOSTS).includes(host) || !/^\d{1,5}$/.test(port || "")) {
      return new Response("Chat server not allowed", { status: 403 });
    }

    const upstreamResponse = await fetch(`http://${host}:${port}/`, { headers: { Upgrade: "websocket" } });
    const upstream = upstreamResponse.webSocket;
    if (!upstream) {
      return new Response("Chat server unavailable", { status: 502 });
    }

    const [client, relay] = Object.values(new WebSocketPair());
    upstream.accept();
    relay.accept();

    pipe(relay, upstream);
    pipe(upstream, relay);

    return new Response(null, { status: 101, webSocket: client });
  },
};

function list(value) {
  return (value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

/** Forwards messages from one socket to the other, and closes the other when one closes. */
function pipe(from, to) {
  from.addEventListener("message", (event) => {
    try {
      to.send(event.data);
    } catch {
      from.close(1011, "Relay closed");
    }
  });
  from.addEventListener("close", (event) => closeQuietly(to, event.code, event.reason));
  from.addEventListener("error", () => closeQuietly(to, 1011, "Relay error"));
}

function closeQuietly(socket, code, reason) {
  try {
    // 1005 and 1006 are reported to listeners but can't be sent.
    socket.close(code === 1005 || code === 1006 ? 1000 : code, reason);
  } catch {
    // Already closed.
  }
}
