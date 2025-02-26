import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

export default function AppLayout() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-200 font-sans">
        <main className="flex-grow container mx-auto p-6">
          <Outlet />
          <Toaster />
        </main>
      </div>
      <Footer />
    </>
  );
}
