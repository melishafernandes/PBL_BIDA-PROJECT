// REPLACE: frontend/src/components/AppLayout.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Compass,
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  Globe,
  History,
  User,
  Sparkles,
  Layers,
} from "lucide-react";
import { useSimpleMode } from "@/components/SimpleMode";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const GROUPS = [
  {
    title: "Learn",
    items: [
      { to: "/dashboard", label: "My Journey", short: "Journey", icon: Compass },
      { to: "/practice", label: "Practice Corner", short: "Practice", icon: Sparkles },
      { to: "/profile", label: "My Profile", short: "Profile", icon: User },
    ],
  },
  {
    title: "Analytics",
    items: [
      { to: "/analytics", label: "Analytics Hub", short: "Analytics", icon: BarChart3 },
      { to: "/learning", label: "Learning Analytics", short: "Learning", icon: GraduationCap },
      { to: "/sectors", label: "Sector Outlook", short: "Sectors", icon: LayoutDashboard },
      { to: "/markets", label: "Market Overview", short: "Markets", icon: Globe },
      { to: "/backtest", label: "Past Performance", short: "History", icon: History },
      { to: "/project", label: "How it was built", short: "Project", icon: Layers },
    ],
  },
];

const NAV = GROUPS.flatMap((g) => g.items);

function SimpleToggle() {
  const { simple, toggle } = useSimpleMode();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={simple}
      onClick={toggle}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-secondary"
    >
      <span>
        <span className="block font-medium">Simple Mode</span>
        <span className="block text-xs text-muted-foreground">Easier words</span>
      </span>
      <span className={`h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors ${simple ? "bg-primary" : "bg-muted"}`}>
        <span className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${simple ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const isActive = (to: string) =>
    pathname === to ||
    pathname.startsWith(to + "/") ||
    (to === "/dashboard" && pathname.startsWith("/journey"));

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col self-start overflow-y-auto border-r border-border bg-card p-4 lg:flex">
        <div className="mb-6 flex items-center justify-between px-2">
          <Link to="/dashboard">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-5" aria-label="Main menu">
          {GROUPS.map((g) => (
            <div key={g.title} className="space-y-1">
              <p className="px-2 text-xs font-medium text-muted-foreground">{g.title}</p>
              {g.items.map(({ to, label, icon: Icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg border-l-2 px-2 py-2 text-sm transition-colors ${
                      active
                        ? "border-primary bg-secondary font-semibold"
                        : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-3 pt-6">
          <SimpleToggle />
          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
            Educational tool. Not personal investment advice.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 pb-24 md:p-10 lg:pb-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <Logo size={28} />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="w-44">
                <SimpleToggle />
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex overflow-x-auto border-t border-border bg-card py-2 lg:hidden"
        aria-label="Main menu"
      >
        {NAV.map(({ to, short, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-[68px] shrink-0 flex-col items-center gap-0.5 text-[10px] ${
                active ? "font-semibold text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}