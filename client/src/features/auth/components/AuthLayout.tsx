import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/Logo";
import { SolarScene } from "@/components/marketing/illustrations/SolarScene";
import { ROUTES } from "@/constant/routes";
import { trustItems } from "@/data/whyChooseUs";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden lg:flex-row">
      {/* Form side — its own scroll container is a safety net for very short viewports; the
          compact spacing below is tuned to fit without needing it on realistic screen sizes. */}
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-5 py-6 sm:px-8 lg:w-1/2 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          <Link to={ROUTES.home} className="inline-block">
            <Logo />
          </Link>

          <h1 className="mt-5 text-2xl font-bold text-navy">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}

          <div className="mt-5">{children}</div>

          {footer && <div className="mt-5 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>

      {/* Branded illustration side — hidden below lg, where the form takes the full width */}
      <div className="relative hidden overflow-hidden bg-navy lg:flex lg:h-full lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:p-10 xl:p-14">
        <div aria-hidden="true" className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-navy-light/40 blur-3xl" />

        <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
          <SolarScene variant="hero" className="h-40 w-auto rounded-2xl shadow-soft-lg xl:h-48" />

          <h2 className="mt-5 text-xl font-bold text-white xl:text-2xl">
            Power Your Future With <span className="text-orange">Solar Energy</span>
          </h2>
          <p className="mt-2 text-sm text-white/70">
            End-to-end solar EPC solutions — from your free estimate through installation, net metering and ongoing
            support.
          </p>

          <ul className="mt-5 grid w-full grid-cols-2 gap-2.5 text-left">
            {trustItems.map(({ icon: Icon, label }, index) => (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm",
                  index === 0 && "col-span-2",
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange/20 text-orange">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-white/90">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
