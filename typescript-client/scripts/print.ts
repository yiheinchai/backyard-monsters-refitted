

// Lazy imports to break circular dependency chains
function getConsole(): any { return require("./com/monsters/debug/Console").Console; }

export function print(param1: any, param2: boolean = false): void {
    getConsole().print(param1, param2);
}
