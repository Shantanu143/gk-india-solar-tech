import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Footer } from "./Footer";
import { Header } from "./Header";

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-orange" aria-hidden="true" />
    </div>
  );
}

export function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
