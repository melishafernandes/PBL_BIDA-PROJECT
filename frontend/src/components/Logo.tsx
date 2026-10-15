// NEW FILE: frontend/src/components/Logo.tsx
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="InvestIQ logo">
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <rect x="7" y="17" width="4" height="8" rx="1.5" fill="white" opacity="0.7" />
      <rect x="14" y="12" width="4" height="13" rx="1.5" fill="white" opacity="0.85" />
      <rect x="21" y="7" width="4" height="18" rx="1.5" fill="white" />
    </svg>
  );
}

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span className="font-heading text-lg font-bold tracking-tight">
        Invest<span className="text-primary">IQ</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------
   ALSO CREATE: frontend/public/favicon.svg  with exactly this content:

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="9" fill="#4f46e5"/>
  <rect x="7" y="17" width="4" height="8" rx="1.5" fill="#fff" opacity="0.7"/>
  <rect x="14" y="12" width="4" height="13" rx="1.5" fill="#fff" opacity="0.85"/>
  <rect x="21" y="7" width="4" height="18" rx="1.5" fill="#fff"/>
</svg>

   Then in frontend/index.html make the <head> contain:

<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<title>InvestIQ: Sector intelligence for beginners</title>
<meta name="theme-color" content="#4f46e5" />
<script>
  // prevents a white flash when dark mode is saved
  try {
    var t = localStorage.getItem("investiq_theme");
    if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
</script>
------------------------------------------------------------------ */