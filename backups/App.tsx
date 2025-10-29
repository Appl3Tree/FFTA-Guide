import FFTAProgressionGuide from "./fftaprogression_guide";

export default function App() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Final Fantasy Tactics Advance Progression Guide</h1>
        <p className="text-zinc-400 text-sm mt-1">by appl3tree</p>
      </header>
      <main className="w-full max-w-5xl">
        <div className="canvas-card">
          <FFTAProgressionGuide />
        </div>
      </main>
      <footer className="text-zinc-500 text-xs mt-12">Built with React, Tailwind, and lucide-react</footer>
    </div>
  );
}
