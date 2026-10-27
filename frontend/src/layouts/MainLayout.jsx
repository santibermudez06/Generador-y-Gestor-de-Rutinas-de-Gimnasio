import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-fixed">
      {/* Sidebar (Desktop) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Navigation (Desktop Header & Mobile Bar) */}
      <Navbar />

      {/* Main Page Area */}
      <div className="lg:pl-72 flex-1 flex flex-col">
        <main className="w-full flex-1 p-space-md sm:p-space-lg lg:p-margin max-w-[1720px] mx-auto pb-24 lg:pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
