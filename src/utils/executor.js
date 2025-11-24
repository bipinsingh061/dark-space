/**
 * Simple C++ to JS Transpiler for MVP
 * Supports:
 * - int variable declarations (int x = 10;)
 * - vector<int> declarations (vector<int> v = {1, 2};)
 * - for loops (for(int i=0; i<n; i++))
 * - basic arithmetic and array access
 */
function transpileCppToJs(code) {
    let jsCode = code;

    // Replace 'int ' with 'let '
    jsCode = jsCode.replace(/\bint\s+/g, 'let ');

    // Replace 'vector<vector<int>> name = ...;' with 'let name = ...;'
    // We rely on the user providing valid JS-like array syntax for initialization or empty init
    jsCode = jsCode.replace(/vector\s*<\s*vector\s*<\s*int\s*>\s*>\s+(\w+)(\s*=\s*\{[^;]+\})?\s*;/g, (match, name, init) => {
        if (init) {
            // Replace { } with [ ] in initialization
            const jsInit = init.replace(/\{/g, '[').replace(/\}/g, ']');
            return `let ${name} ${jsInit};`;
        }
        return `let ${name} = [];`;
    });

    // Replace 'vector<int> name = { ... };' with 'let name = [ ... ];'
    jsCode = jsCode.replace(/vector\s*<\s*int\s*>\s+(\w+)\s*=\s*\{([^}]+)\}\s*;/g, 'let $1 = [$2];');

    // Replace 'vector<int> name;' with 'let name = [];'
    jsCode = jsCode.replace(/vector\s*<\s*int\s*>\s+(\w+)\s*;/g, 'let $1 = [];');

    // Handle 'name.push_back(val)' -> 'name.push(val)'
    jsCode = jsCode.replace(/\.push_back\(/g, '.push(');

    // Handle 'name.size()' -> 'name.length'
    jsCode = jsCode.replace(/\.size\(\)/g, '.length');

    // Inject loop logging
    // Matches: for (...) {
    // Replaces with: recordLog("Loop started"); for (...) { recordLog("Loop iteration");
    jsCode = jsCode.replace(/for\s*\((.*?)\)\s*\{/g, 'recordLog("Loop started"); for ($1) { recordLog("Loop iteration");');

    return jsCode;
}

export function executeCode(userCode, variables) {
    const history = [];

    // Create a context object with proxied variables
    const context = {};

    // Helper to record state
    const recordState = (varName, newValue, index = null) => {
        // Deep copy the value to store in history
        const valueCopy = JSON.parse(JSON.stringify(newValue));

        history.push({
            type: 'update',
            step: history.length + 1,
            variable: varName,
            value: valueCopy,
            indexChanged: index, // Can be int or [row, col]
            timestamp: Date.now()
        });
    };

    // Helper to record logs
    const recordLog = (message) => {
        history.push({
            type: 'log',
            step: history.length + 1,
            message: message,
            timestamp: Date.now()
        });
    };

    // Initialize context with variables
    Object.entries(variables).forEach(([name, data]) => {
        if (Array.isArray(data.value)) {
            // We need a mutable copy of the data
            const mutableData = JSON.parse(JSON.stringify(data.value));

            const handler = {
                get(target, property, receiver) {
                    const value = Reflect.get(target, property, receiver);
                    // If accessing a row in a 2D array, return a proxy for that row
                    if (Array.isArray(value) && !isNaN(property)) {
                        return new Proxy(value, {
                            set(rowTarget, rowProperty, rowValue) {
                                rowTarget[rowProperty] = rowValue;
                                if (!isNaN(rowProperty)) {
                                    recordState(name, mutableData, [parseInt(property), parseInt(rowProperty)]);
                                }
                                return true;
                            }
                        });
                    }
                    return value;
                },
                set(target, property, value) {
                    target[property] = value;
                    if (!isNaN(property)) {
                        recordState(name, mutableData, parseInt(property));
                    }
                    return true;
                }
            };

            context[name] = new Proxy(mutableData, handler);
        } else {
            context[name] = data.value;
        }
    });

    // Add recordLog to context so it can be called from transpiled code
    context.recordLog = recordLog;

    try {
        const transpiledCode = transpileCppToJs(userCode);

        const varNames = Object.keys(context);
        const varValues = Object.values(context);

        const run = new Function(...varNames, `"use strict";\n${transpiledCode}`);

        run(...varValues);

        return { success: true, history };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
