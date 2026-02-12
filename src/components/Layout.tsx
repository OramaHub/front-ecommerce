import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./Header";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
