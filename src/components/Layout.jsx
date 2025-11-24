import React from 'react';

export function Layout({ sidebar, editor, output }) {
    return (
        <div className="flex h-screen w-full bg-background text-white overflow-hidden">
            {/* Sidebar - Variables */}
            <aside className="w-80 border-r border-slate-700 bg-surface/50 backdrop-blur-sm flex flex-col">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-lg font-semibold text-primary">Variables</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {sidebar}
                </div>
            </aside>

            {/* Main Content - Editor */}
            <main className="flex-1 flex flex-col min-w-0">
                <div className="p-4 border-b border-slate-700 bg-surface/30">
                    <h2 className="text-lg font-semibold text-secondary">Code Editor (C++)</h2>
                </div>
                <div className="flex-1 relative">
                    {editor}
                </div>
            </main>

            {/* Right Panel - Visualization */}
            <aside className="w-96 border-l border-slate-700 bg-surface/50 backdrop-blur-sm flex flex-col">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-lg font-semibold text-accent">Visualization</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-slate-900/50">
                    {output}
                </div>
            </aside>
        </div>
    );
}
