import React from 'react';
import { Header } from '@/components/Header';
import { Dropzone } from '@/components/Dropzone';
import { PrivacyCard } from '@/components/PrivacyCard';
import { FileQueue } from '@/components/FileQueue';
import { DebugConsole } from '@/components/DebugConsole';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 selection:text-blue-200 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Bento Grid Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
          <div className="lg:col-span-2 h-full">
            <Dropzone />
          </div>
          <div className="lg:col-span-1 h-full">
            <PrivacyCard />
          </div>
        </div>

        {/* Queue Section */}
        <div className="w-full">
          <FileQueue />
        </div>
      </main>

      <DebugConsole />
    </div>
  );
}
