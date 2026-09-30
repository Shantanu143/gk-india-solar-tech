import { Container } from "@/components/layout/Container";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/ui/Reveal";

export interface Stat {
  to: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

interface StatsBandProps {
  stats: Stat[];
  image?: string;
  footnote?: string;
}

/** Photo band with glass tiles whose numbers count up on scroll. */
export function StatsBand({ stats, image = "/images/wind.jpg", footnote }: StatsBandProps) {
  return (
    <section className="relative isolate overflow-hidden bg-sky-deep py-14 text-white sm:py-16">
      <img src={image} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sky-deep/75" />
      <Container>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} direction="scale">
              <div className="glass rounded-3xl p-6 text-center">
                <CountUp
                  to={s.to}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="font-serif text-4xl font-medium sm:text-5xl"
                />
                <p className="mt-2 text-sm text-white/80">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        {footnote && <p className="mt-5 text-center text-xs text-white/60">{footnote}</p>}
      </Container>
    </section>
  );
}
