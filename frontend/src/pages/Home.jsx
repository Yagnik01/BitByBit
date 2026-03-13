import { Navbar } from "../components/Navbar.jsx";

export function Home() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h1 className="text-balance text-3xl font-bold leading-tight md:text-5xl">
              BitByBit — build projects with an AI intermediary
            </h1>
            <p className="text-pretty text-base text-slate-600 dark:text-slate-300 md:text-lg">
              Submit requirements, get a structured roadmap, and track milestones end‑to‑end.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/post-project"
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Post a Project
              </a>
              <a
                href="/browse"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Browse
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Quick demo</div>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>1) Employer submits project requirements</li>
              <li>2) AI generates a roadmap + milestones</li>
              <li>3) Delivery gets verified via QA endpoint</li>
            </ol>
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              Next we’ll connect this page to the backend proxy (/api/ai/analyze-requirements) and render the roadmap.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

