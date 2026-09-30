import { Link } from "react-router-dom";
import { Settings, Wrench } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ROUTES } from "@/constant/routes";

const items = [
  { icon: Wrench, title: "Professional Installation", text: "Project support managed end-to-end by our EPC team." },
  { icon: Settings, title: "AMC & Support", text: "Service, maintenance and support to keep your system performing." },
];

export function SupportSection() {
  return (
    <section className="relative isolate overflow-hidden bg-sky-deep py-14 text-white sm:py-20">
      <ParallaxImage src="/images/technician-bg.jpg" alt="" strength={60} className="absolute inset-0 -z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sky-deep/80" />
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <Reveal direction="left">
          <span className="text-xs font-bold tracking-[0.14em] text-white/80 uppercase">Installation & AMC</span>
          <h2 className="mt-3 font-serif text-4xl font-medium text-white sm:text-5xl">
            Support That Continues After Installation
          </h2>
          <Button asChild variant="white" size="lg" className="mt-8">
            <Link to={ROUTES.contact}>Contact Our Team</Link>
          </Button>
        </Reveal>
        <div className="grid gap-4">
          {items.map((it, i) => (
            <Reveal key={it.title} direction="right" delay={i * 0.1}>
              <div className="glass flex gap-4 rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sky">
                  <it.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{it.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{it.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
