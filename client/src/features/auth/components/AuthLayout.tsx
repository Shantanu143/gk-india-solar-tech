import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { ROUTES } from "@/constant/routes";
import { trustItems } from "@/data/whyChooseUs";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:flex-row lg:overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full flex-col items-center justify-center overflow-y-auto bg-background px-5 py-10 sm:px-8 lg:h-full lg:w-1/2 lg:px-12 xl:px-20"
      >
        <div className="w-full max-w-md">
          <Link to={ROUTES.home} className="inline-block">
            <Logo />
          </Link>

          <h1 className="mt-6 font-serif text-4xl font-medium text-navy">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}

          <div className="mt-6">{children}</div>

          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </motion.div>

      <div className="relative isolate hidden overflow-hidden bg-sky-deep text-white lg:flex lg:h-full lg:w-1/2 lg:flex-col lg:justify-end lg:p-12">
        <motion.img
          src="/images/hero.jpg"
          alt=""
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(11_47_107/0.9)_0%,rgb(20_80_170/0.35)_60%,rgb(20_80_170/0.2)_100%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h2 className="max-w-md font-serif text-5xl leading-[1.05] font-normal text-white">
            Power Your Future With Solar
          </h2>
          <p className="mt-4 max-w-md text-base text-white/85">
            End-to-end solar EPC solutions — from your free estimate through installation, net metering and ongoing
            support.
          </p>
          <ul className="mt-6 grid max-w-lg grid-cols-2 gap-2.5">
            {trustItems.slice(0, 4).map(({ icon: Icon, label }) => (
              <li key={label} className="glass flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium">{label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
