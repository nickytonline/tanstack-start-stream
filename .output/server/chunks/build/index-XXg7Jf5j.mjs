import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useRouter, Link, warning, defaultTransformer, isPlainObject, encode, isRedirect, isNotFound } from '@tanstack/react-router';
import { B as B$1, M } from '../nitro/nitro.mjs';
import E from 'tiny-invariant';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:async_hooks';
import 'react';
import 'jsesc';
import '@tanstack/react-cross-context';
import 'isbot';
import 'react-dom/server';

const N = [];
function p(e, t) {
  const n = t || e || {};
  return typeof n.method > "u" && (n.method = "GET"), { options: n, middleware: (r) => p(undefined, Object.assign(n, { middleware: r })), validator: (r) => p(undefined, Object.assign(n, { validator: r })), handler: (...r) => {
    const [a, s] = r;
    Object.assign(n, { ...a, extractedFn: a, serverFn: s }), a.url || (console.warn(a), warning(false, "createServerFn must be called with a function that has a 'url' property. Ensure that the @tanstack/start-plugin is ordered **before** the @tanstack/server-functions-plugin."));
    const i = [...n.middleware || [], H(n)];
    return Object.assign(async (o) => _(i, "client", { ...a, method: n.method, data: o == null ? undefined : o.data, headers: o == null ? undefined : o.headers, context: {} }).then((d) => {
      if (d.error) throw d.error;
      return d.result;
    }), { ...a, __executeServer: async (o) => {
      const d = o instanceof FormData ? P(o) : o;
      return await _(i, "server", { ...a, ...d }).then((c) => ({ result: c.result, error: c.error, context: c.sendContext }));
    } });
  } };
}
function P(e) {
  const t = e.get("__TSR_CONTEXT");
  if (e.delete("__TSR_CONTEXT"), typeof t != "string") return { context: {}, data: e };
  try {
    return { context: defaultTransformer.parse(t), data: e };
  } catch {
    return { data: e };
  }
}
function $(e) {
  const t = /* @__PURE__ */ new Set(), n = [], r = (a) => {
    a.forEach((s) => {
      s.options.middleware && r(s.options.middleware), t.has(s) || (t.add(s), n.push(s));
    });
  };
  return r(e), n;
}
const v = async (e, t, n) => e({ ...t, next: async (r = {}) => {
  var _a, _b;
  return n({ ...t, ...r, context: { ...t.context, ...r.context }, sendContext: { ...t.sendContext, ...(_a = r.sendContext) != null ? _a : {} }, headers: M(t.headers, r.headers), result: r.result !== undefined ? r.result : t.result, error: (_b = r.error) != null ? _b : t.error });
} });
function k(e, t) {
  if (e == null) return {};
  if ("~standard" in e) {
    const n = e["~standard"].validate(t);
    if (n instanceof Promise) throw new Error("Async validation not supported");
    if (n.issues) throw new Error(JSON.stringify(n.issues, undefined, 2));
    return n.value;
  }
  if ("parse" in e) return e.parse(t);
  if (typeof e == "function") return e(t);
  throw new Error("Invalid validator type!");
}
async function _(e, t, n) {
  const r = $([...N, ...e]), a = async (s) => {
    const i = r.shift();
    if (!i) return s;
    i.options.validator && (t !== "client" || i.options.validateClient) && (s.data = await k(i.options.validator, s.data));
    const o = t === "client" ? i.options.client : i.options.server;
    return o ? v(o, s, async (d) => {
      const f = i.options.clientAfter;
      if (t === "client" && f) {
        const c = await a(d);
        return v(f, { ...d, ...c }, (h) => h);
      }
      return a(d).catch((c) => {
        if (isRedirect(c) || isNotFound(c)) return { ...d, error: c };
        throw c;
      });
    }) : a(s);
  };
  return a({ ...n, headers: n.headers || {}, sendContext: n.sendContext || {}, context: n.context || {} });
}
function H(e) {
  return { _types: undefined, options: { validator: e.validator, validateClient: e.validateClient, client: async ({ next: t, sendContext: n, ...r }) => {
    var a;
    const s = await ((a = e.extractedFn) == null ? undefined : a.call(e, { ...r, context: n }));
    return t(s);
  }, server: async ({ next: t, ...n }) => {
    var r;
    const a = await ((r = e.serverFn) == null ? undefined : r.call(e, n));
    return t({ ...n, result: a });
  } } };
}
async function B(e, t, n) {
  var r;
  const a = t[0];
  if (isPlainObject(a) && a.method) {
    const o = a, d = o.data instanceof FormData ? "formData" : "payload", f = new Headers({ ...d === "payload" ? { "content-type": "application/json", accept: "application/json" } : {}, ...o.headers instanceof Headers ? Object.fromEntries(o.headers.entries()) : o.headers });
    if (o.method === "GET") {
      const l = encode({ payload: defaultTransformer.stringify({ data: o.data, context: o.context }) });
      l && (e.includes("?") ? e += `&${l}` : e += `?${l}`);
    }
    const c = await n(e, { method: o.method, headers: f, ...J(o) }), h = await g(c);
    if ((r = h.headers.get("content-type")) != null && r.includes("application/json")) {
      const l = defaultTransformer.decode(await h.json());
      if (isRedirect(l) || isNotFound(l) || l instanceof Error) throw l;
      return l;
    }
    return h;
  }
  const s = await g(await n(e, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(t) })), i = s.headers.get("content-type");
  return i && i.includes("application/json") ? defaultTransformer.decode(await s.json()) : s.text();
}
function J(e) {
  var _a;
  return e.method === "POST" ? e.data instanceof FormData ? (e.data.set("__TSR_CONTEXT", defaultTransformer.stringify(e.context)), { body: e.data }) : { body: defaultTransformer.stringify({ data: (_a = e.data) != null ? _a : null, context: e.context }) } : {};
}
async function g(e) {
  if (!e.ok) {
    const t = e.headers.get("content-type");
    throw t && t.includes("application/json") ? defaultTransformer.decode(await e.json()) : new Error(await e.text());
  }
  return e;
}
const x = "/_server";
function G(e) {
  return e.replace(/^\/|\/$/g, "");
}
const T = (e) => {
  E(x, "\u{1F6A8}A process.env.TSS_SERVER_FN_BASE env variable is required for the server functions ssr runtime, but was not provided.");
  const t = `/${G(x)}/${e}`;
  return Object.assign((...r) => B(t, r, $fetch.native), { url: t, functionId: e });
}, X = T("app_routes_index_tsx--getCount_createServerFn_handler"), q = p({ method: "GET" }).handler(X), z = T("app_routes_index_tsx--updateCount_createServerFn_handler"), D = p({ method: "POST" }).validator((e) => e).handler(z), re = function() {
  const t = useRouter(), n = B$1.useLoaderData();
  return jsxs(Fragment, { children: [jsxs("nav", { style: { display: "flex", gap: "4px" }, children: [jsx(Link, { to: "/", children: "Home" }), jsx(Link, { to: "/about", children: "About" })] }), jsxs("button", { type: "button", onClick: () => {
    D({ data: 1 }).then(() => {
      t.invalidate();
    });
  }, children: ["Add 1 to ", n, "?"] })] });
}, ae = async () => await q();

export { re as component, ae as loader };
//# sourceMappingURL=index-XXg7Jf5j.mjs.map
