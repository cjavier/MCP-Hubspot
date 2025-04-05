import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Mobile Navbar */}
      <MobileNavbar isOpen={mobileNavOpen} setIsOpen={setMobileNavOpen} />
      
      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden h-16 bg-white border-b border-gray-200" />
        <main className="flex-1 mt-16 md:mt-0">
          {children}
        </main>
      </div>
      
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
}
