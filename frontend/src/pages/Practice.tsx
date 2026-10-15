import Quiz from "@/components/Quiz";
import WhatIf from "@/components/WhatIf";

export default function Practice() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl p-6 text-white shadow-lg bg-[linear-gradient(135deg,#0ea5e9_0%,#4f46e5_100%)]">
        <h1 className="text-2xl font-bold">Practice Corner ✨</h1>
        <p className="text-sm text-white/85 mt-1 max-w-xl">
          Learn by playing. Try pretend investing and test what you know. No real money is used
          here.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">What if I had invested?</h2>
        <WhatIf />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Quick quiz</h2>
        <Quiz />
      </section>

      <p className="text-xs text-muted-foreground">
        Real investing is for adults. If you are young, talk to a parent or guardian first.
      </p>
    </div>
  );
}