import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./shared/Sidebar";
import { Navbar } from "./shared/Navbar";
import { cn } from "../lib/utils";

export default function MainLayout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location = useLocation();

  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto">
           {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Fixed */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarExpanded ? "lg:ml-64" : "lg:ml-24"
        )}
      >
        <Navbar isSidebarExpanded={isSidebarExpanded} />
        
        <main className="flex-1 mt-20 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
