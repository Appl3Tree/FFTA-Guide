import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import FFTAProgressionGuide from "./fftaprogression_guide";
export default function App() {
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8\r\n                        bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors", children: [_jsxs("header", { className: "mb-8 text-center", children: [_jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Final Fantasy Tactics Advance Progression Guide" }), _jsx("p", { className: "text-zinc-600 dark:text-zinc-400 text-sm mt-1", children: "by appl3tree" })] }), _jsx("main", { className: "w-full max-w-5xl", children: _jsx("div", { className: "canvas-card", children: _jsx(FFTAProgressionGuide, {}) }) }), _jsx("footer", { className: "text-zinc-600 dark:text-zinc-400 text-xs mt-12", children: "Built with React, Tailwind, and lucide-react" })] }));
}
