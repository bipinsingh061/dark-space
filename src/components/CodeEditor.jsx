import React from 'react';
import Editor from '@monaco-editor/react';

export function CodeEditor({ code, setCode }) {
    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'Fira Code',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                }}
            />
        </div>
    );
}
