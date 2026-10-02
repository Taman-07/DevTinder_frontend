export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const target = new URL(
        url.pathname.replace(/^\/api/, "") + url.search,
        "https://pair-up-api.onrender.com"
      );
      return fetch(new Request(target, request));
    }

    return env.ASSETS.fetch(request);
  },
};