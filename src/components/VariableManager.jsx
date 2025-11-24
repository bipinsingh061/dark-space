import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function VariableManager({ variables, setVariables }) {
  const [newName, setNewName] = useState('');
  const [newValues, setNewValues] = useState('');
  const [type, setType] = useState('vector<int>');

  const addVariable = () => {
    if (!newName || !newValues) return;

    let values;
    try {
      if (type === 'vector<vector<int>>') {
        // Parse 2D array: "[[1,2], [3,4]]"
        // Using JSON.parse for simplicity as per plan, but we can make it more robust if needed
        // We'll replace simple braces with brackets if user types {1,2} style
        const formatted = newValues.replace(/{/g, '[').replace(/}/g, ']');
        values = JSON.parse(formatted);
        if (!Array.isArray(values) || !values.every(Array.isArray)) {
          throw new Error('Invalid 2D array');
        }
      } else {
        // Parse 1D array: "1, 2, 3"
        values = newValues.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n));
      }

      setVariables(prev => ({
        ...prev,
        [newName]: { type, value: values }
      }));

      setNewName('');
      setNewValues('');
    } catch (e) {
      alert('Invalid format for ' + type);
    }
  };

  const removeVariable = (name) => {
    setVariables(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Add Variable</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name (e.g., arr)"
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            <option value="vector<int>">vector&lt;int&gt;</option>
            <option value="vector<vector<int>>">vector&lt;vector&lt;int&gt;&gt;</option>
          </select>
          <input
            type="text"
            placeholder={type === 'vector<int>' ? "Values (e.g., 1, 2, 3)" : "Values (e.g., [[1,2], [3,4]])"}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            value={newValues}
            onChange={(e) => setNewValues(e.target.value)}
          />
          <button
            onClick={addVariable}
            className="w-full bg-primary hover:bg-blue-600 text-white rounded px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Variable
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Current Variables</h3>
        <div className="space-y-2">
          {Object.entries(variables).map(([name, data]) => (
            <div key={name} className="bg-slate-900 border border-slate-700 rounded p-3 flex items-start justify-between group">
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-secondary font-semibold">{name}</span>
                  <span className="text-xs text-slate-500">{data.type}</span>
                </div>
                <div className="font-mono text-xs text-slate-400 mt-1 truncate">
                  {JSON.stringify(data.value)}
                </div>
              </div>
              <button
                onClick={() => removeVariable(name)}
                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {Object.keys(variables).length === 0 && (
            <div className="text-xs text-slate-600 italic text-center py-4">
              No variables defined
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
