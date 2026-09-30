import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { getWhatsAppLink } from "@/config/contact";
import { Footer } from "./Footer";
import { Header } from "./Header";

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-sky" aria-hidden="true" />
    </div>
  );
}

export function MainLayout() {
  const { pathname } = useLocation();
  const whatsapp = getWhatsAppLink("Hi GK India SolarTech, I'd like to know more about solar for my property.");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ScrollProgress />
      <Header />
      <motion.main
        key={pathname}
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </motion.main>
      <Footer />

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="animate-pulse-ring fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft-lg transition-transform hover:scale-110 sm:right-6 sm:bottom-6"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      )}
    </div>
  );
}
