import React from 'react';
import { motion } from 'framer-motion';

export function Visualizer({ history, variables, currentStep }) {
    if (!history || history.length === 0) {
        return (
            <div className="text-slate-500 text-sm text-center mt-10">
                Run the code to see visualization steps here.
            </div>
        );
    }

    // Only show steps up to currentStep
    const visibleHistory = history.slice(0, currentStep + 1);

    return (
        <div className="space-y-4">
            {visibleHistory.map((step, index) => {
                if (step.type === 'log') {
                    return (
                        <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded p-2 flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-500">Step {step.step}</span>
                            <span className={`text-xs font-mono font-semibold ${step.message.includes('started') ? 'text-yellow-400' : 'text-green-400'}`}>
                                {step.message}
                            </span>
                        </div>
                    );
                }

                return (
                    <div key={index} className="bg-slate-900 border border-slate-700 rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono text-slate-500">Step {step.step}</span>
                            <span className="text-xs font-mono text-primary">{step.variable} updated</span>
                        </div>

                        {/* Check if 2D Array */}
                        {Array.isArray(step.value[0]) ? (
                            <div className="flex flex-col gap-2">
                                {step.value.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex gap-2">
                                        {row.map((val, colIndex) => {
                                            // Check if this cell changed: indexChanged is [row, col]
                                            const isChanged = Array.isArray(step.indexChanged) &&
                                                step.indexChanged[0] === rowIndex &&
                                                step.indexChanged[1] === colIndex;

                                            return (
                                                <motion.div
                                                    key={`${index}-${rowIndex}-${colIndex}`}
                                                    initial={isChanged ? { scale: 1.5, backgroundColor: '#3b82f6' } : {}}
                                                    animate={{ scale: 1, backgroundColor: isChanged ? '#1e293b' : '#0f172a' }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`
                                          w-10 h-10 flex items-center justify-center rounded border
                                          ${isChanged
                                                            ? 'border-primary text-primary font-bold'
                                                            : 'border-slate-700 text-slate-400'}
                                        `}
                                                >
                                                    {val}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* 1D Array */
                            <div className="flex flex-wrap gap-2">
                                {step.value.map((val, idx) => (
                                    <motion.div
                                        key={`${index}-${idx}`}
                                        initial={step.indexChanged === idx ? { scale: 1.5, backgroundColor: '#3b82f6' } : {}}
                                        animate={{ scale: 1, backgroundColor: step.indexChanged === idx ? '#1e293b' : '#0f172a' }}
                                        transition={{ duration: 0.5 }}
                                        className={`
                    w-10 h-10 flex items-center justify-center rounded border
                    ${step.indexChanged === idx
                                                ? 'border-primary text-primary font-bold'
                                                : 'border-slate-700 text-slate-400'}
                  `}
                                    >
                                        {val}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
            {currentStep < history.length - 1 && (
                <div className="text-center py-4">
                    <span className="text-xs text-slate-500 animate-pulse">...waiting for next step...</span>
                </div>
            )}
        </div>
    );
}
