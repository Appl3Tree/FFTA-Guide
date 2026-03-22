import FFTAProgressionGuide from "./fftaprogression_guide";
import { Github, Coffee } from "lucide-react";

export default function App() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8
                        bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 transition-colors">
            {/*<header className="mb-8 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Final Fantasy Tactics Advance Progression Guide</h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">by appl3tree</p>
            </header>*/}
            <main className="w-full max-w-5xl">
                <div className="canvas-card">
                    <FFTAProgressionGuide />
                </div>
            </main>
            <footer className="text-zinc-600 dark:text-zinc-400 text-xs mt-12 flex items-center gap-3">
                <span>Built with React, Tailwind, and lucide-react</span>
                <a
                    href="https://github.com/appl3tree/FFTA-Guide/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Repository"
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <Github size={16} />
                </a>
                <a
                    href="https://ko-fi.com/appl3tree"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Support on Ko-fi"
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <Coffee size={16} />
                </a>
            </footer>
        </div>
    );
}

