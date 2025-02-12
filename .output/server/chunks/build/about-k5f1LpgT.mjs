import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';

const l = function() {
  return jsxs(Fragment, { children: [jsxs("nav", { style: { display: "flex", gap: "4px" }, children: [jsx(Link, { to: "/", children: "Home" }), jsx(Link, { to: "/abou", children: "About" })] }), jsx("h1", { children: "About" }), jsx("p", { children: "TanStack router is dope" })] });
};

export { l as component };
//# sourceMappingURL=about-k5f1LpgT.mjs.map
