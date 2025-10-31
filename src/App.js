"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var jsx_runtime_1 = require("react/jsx-runtime");
var fftaprogression_guide_1 = require("./fftaprogression_guide");
function App() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8\n                        bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors", children: [(0, jsx_runtime_1.jsxs)("header", { className: "mb-8 text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-semibold tracking-tight", children: "Final Fantasy Tactics Advance Progression Guide" }), (0, jsx_runtime_1.jsx)("p", { className: "text-zinc-600 dark:text-zinc-400 text-sm mt-1", children: "by appl3tree" })] }), (0, jsx_runtime_1.jsx)("main", { className: "w-full max-w-5xl", children: (0, jsx_runtime_1.jsx)("div", { className: "canvas-card", children: (0, jsx_runtime_1.jsx)(fftaprogression_guide_1.default, {}) }) }), (0, jsx_runtime_1.jsx)("footer", { className: "text-zinc-600 dark:text-zinc-400 text-xs mt-12", children: "Built with React, Tailwind, and lucide-react" })] }));
}
