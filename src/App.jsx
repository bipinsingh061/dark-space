import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { VariableManager } from './components/VariableManager';
import { CodeEditor } from './components/CodeEditor';
import { Visualizer } from './components/Visualizer';
import { executeCode } from './utils/executor';
import { Play } from 'lucide-react';

function App() {
  const [variables, setVariables] = useState({
    // Initial example variable
    'arr': { type: 'vector<int>', value: [1, 2, 3, 4, 5] }
  });

  const [code, setCode] = useState(`// Example: Double each element
for(int i=0; i<arr.size(); i++) {
  arr[i] = arr[i] * 2;
}`);

  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1); // -1 means not started or show all? Let's say -1 is show nothing, 0 is start.
  // Actually, let's make it: -1 = not running. 0 to N = showing steps 0 to N.
  // Wait, user wants "click run, it runs it all... I want to see it step by step".
  // So "Run" -> resets and starts at step 0. "Next" -> increments.

  const [error, setError] = useState(null);

  const handleRun = () => {
    setError(null);
    setHistory([]);
    setCurrentStep(-1);

    // Small delay to reset animation if re-running
    setTimeout(() => {
      const result = executeCode(code, variables);
      if (result.success) {
        setHistory(result.history);
        setCurrentStep(0); // Start at step 0 (first state)
      } else {
        setError(result.error);
      }
    }, 100);
  };

  const handleNext = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentStep(-1);
  };

  const handleShowAll = () => {
    setCurrentStep(history.length - 1);
  };

  return (
    <Layout
      sidebar={
        <VariableManager variables={variables} setVariables={setVariables} />
      }
      editor={
        <div className="flex flex-col h-full">
          <div className="flex-1 relative">
            <CodeEditor code={code} setCode={setCode} />
          </div>
          <div className="p-4 border-t border-slate-700 bg-surface/50 flex flex-wrap gap-3 justify-between items-center">
            <div className="text-red-400 text-sm font-mono">{error}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                disabled={history.length === 0}
              >
                Reset
              </button>
              <button
                onClick={handleRun}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors"
              >
                <Play size={16} />
                Run
              </button>
              {history.length > 0 && (
                <>
                  <button
                    onClick={handleNext}
                    disabled={currentStep >= history.length - 1}
                    className="bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors"
                  >
                    Next Step
                  </button>
                  <button
                    onClick={handleShowAll}
                    disabled={currentStep >= history.length - 1}
                    className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded flex items-center gap-2 font-medium transition-colors"
                  >
                    Show All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      }
      output={
        <Visualizer history={history} variables={variables} currentStep={currentStep} />
      }
    />
  );
}

export default App;
