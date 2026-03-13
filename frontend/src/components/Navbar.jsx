import { useMemo, useState } from "react";

function Icon({ name }) {
  const paths = useMemo(() => {
    switch (name) {
      case "browse":
        return "M12 3l9 4.5-9 4.5-9-4.5L12 3zm0 10l9-4.5V19l-9 4.5L3 19V8.5L12 13z";
      case "manage":
        return "M7 7h10v4H7V7zm0 6h10v4H7v-4z";
      case "groups":
        return "M7 12a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm10 0a3 3 0 1 1 3-3 3 3 0 0 1-3 3zM2 20a5 5 0 0 1 10 0H2zm10 0a5 5 0 0 1 10 0H12z";
      case "bell":
        return "M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2z";
      case "msg":
        return "M4 4h16v12H7l-3 3V4z";
      case "plus":
        return "M19 11H13V5h-2v6H5v2h6v6h2v-6h6v-2z";
      case "menu":
        return "M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z";
      default:
        return "";
    }
  }, [name]);

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d={paths} />
    </svg>
  );
}

export function Navbar() {
  const primary = [
    { label: "Browse", href: "/browse" },
    { label: "Manage", href: "/manage" },
    { label: "Groups", href: "/groups" },
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <a href="/" className="flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500">
          <img
            src="https://www.f-cdn.com/assets/main/en/assets/freelancer-logo-light.svg"
            alt="Logo"
            className="hidden h-6 md:block"
          />
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white md:hidden">
            BB
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {primary.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {l.label === "Browse" ? <Icon name="browse" /> : null}
              {l.label === "Manage" ? <Icon name="manage" /> : null}
              {l.label === "Groups" ? <Icon name="groups" /> : null}
              <span>{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a
            href="/notifications"
            className="hidden items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 md:inline-flex"
            aria-label="Notifications"
          >
            <Icon name="bell" />
          </a>
          <a
            href="/messages"
            className="hidden items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 md:inline-flex"
            aria-label="Messages"
          >
            <Icon name="msg" />
          </a>

          <a
            href="/post-project"
            className="hidden rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 md:inline-flex"
          >
            Post a Project
          </a>

          <a
            href="/post-project"
            className="inline-flex items-center justify-center rounded-md p-2 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-slate-900 md:hidden"
            aria-label="Post"
          >
            <Icon name="plus" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900 md:hidden"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            <Icon name="menu" />
          </button>

          <div className="hidden items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-900 md:flex">
            <img
              src="https://www.freelancer.com/img/unknown.png?image-optimizer=force&format=webply&width=120"
              alt="User avatar"
              className="h-8 w-8 rounded-full"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">@Yug0407</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">₹0.00 INR</div>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="grid gap-1">
            {primary.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/post-project"
              className="mt-2 rounded-md bg-violet-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-violet-700"
            >
              Post a Project
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

