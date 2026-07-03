import React from 'react';
import { Package } from 'lucide-react';

export default function Layout({ children }) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200">
            {/* Top Navigation */}
            <header className="bg-slate-950 text-white border-b border-slate-800 shadow-sm z-10 sticky top-0">
                <div className="max-w-[90rem] mx-auto w-full px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-indigo-500" />
                        <span className="text-xl font-bold tracking-tight">SalesDesk</span>
                    </div>
                    <div className="text-sm font-medium text-slate-400">
                        {today}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[90rem] mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
