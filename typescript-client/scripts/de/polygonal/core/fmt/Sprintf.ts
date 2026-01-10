import { NumberFormat } from "./NumberFormat";

/**
 * Sprintf - C-style string formatting.
 * Supports format specifiers: %d, %i, %u, %f, %e, %E, %g, %G, %s, %c, %x, %X, %o, %b
 * Flags: -, +, space, #, 0
 * Width and precision are supported.
 */
export class Sprintf {
    private static _instance: Sprintf | null = null;

    public static format(fmt: string, args: Array<any>): string {
        if (Sprintf._instance === null) {
            Sprintf._instance = new Sprintf();
        }
        return Sprintf._instance._format(fmt, args);
    }

    private _format(fmt: string, args: Array<any>): string {
        let result = "";
        let argIndex = 0;
        let i = 0;

        while (i < fmt.length) {
            const c = fmt.charAt(i);
            if (c === '%') {
                i++;
                if (i >= fmt.length) break;
                
                // Check for %%
                if (fmt.charAt(i) === '%') {
                    result += '%';
                    i++;
                    continue;
                }

                // Parse flags
                let leftAlign = false;
                let showSign = false;
                let spaceSign = false;
                let altForm = false;
                let zeroPad = false;

                while (i < fmt.length) {
                    const fc = fmt.charAt(i);
                    if (fc === '-') { leftAlign = true; i++; }
                    else if (fc === '+') { showSign = true; i++; }
                    else if (fc === ' ') { spaceSign = true; i++; }
                    else if (fc === '#') { altForm = true; i++; }
                    else if (fc === '0') { zeroPad = true; i++; }
                    else break;
                }

                // Parse width
                let width = 0;
                if (fmt.charAt(i) === '*') {
                    width = args[argIndex++];
                    i++;
                } else {
                    while (i < fmt.length && fmt.charAt(i) >= '0' && fmt.charAt(i) <= '9') {
                        width = width * 10 + parseInt(fmt.charAt(i));
                        i++;
                    }
                }

                // Parse precision
                let precision = -1;
                if (fmt.charAt(i) === '.') {
                    i++;
                    precision = 0;
                    if (fmt.charAt(i) === '*') {
                        precision = args[argIndex++];
                        i++;
                    } else {
                        while (i < fmt.length && fmt.charAt(i) >= '0' && fmt.charAt(i) <= '9') {
                            precision = precision * 10 + parseInt(fmt.charAt(i));
                            i++;
                        }
                    }
                }

                // Skip length modifiers (h, l, L)
                while (i < fmt.length && (fmt.charAt(i) === 'h' || fmt.charAt(i) === 'l' || fmt.charAt(i) === 'L')) {
                    i++;
                }

                // Parse specifier
                const spec = fmt.charAt(i);
                i++;
                let formatted = "";

                switch (spec) {
                    case 'd':
                    case 'i': {
                        const val = Math.floor(Number(args[argIndex++]));
                        formatted = String(val);
                        if (showSign && val >= 0) formatted = '+' + formatted;
                        else if (spaceSign && val >= 0) formatted = ' ' + formatted;
                        break;
                    }
                    case 'u': {
                        const val = Math.abs(Math.floor(Number(args[argIndex++])));
                        formatted = String(val);
                        break;
                    }
                    case 'f': {
                        const val = Number(args[argIndex++]);
                        const prec = precision === -1 ? 6 : precision;
                        formatted = NumberFormat.toFixed(val, prec);
                        if (showSign && val >= 0) formatted = '+' + formatted;
                        else if (spaceSign && val >= 0) formatted = ' ' + formatted;
                        break;
                    }
                    case 'e':
                    case 'E': {
                        const val = Number(args[argIndex++]);
                        const prec = precision === -1 ? 6 : precision;
                        formatted = val.toExponential(prec);
                        if (spec === 'E') formatted = formatted.toUpperCase();
                        break;
                    }
                    case 'g':
                    case 'G': {
                        const val = Number(args[argIndex++]);
                        const prec = precision === -1 ? 6 : precision;
                        const expFmt = val.toExponential(prec);
                        const fixFmt = NumberFormat.toFixed(val, prec);
                        formatted = expFmt.length < fixFmt.length ? expFmt : fixFmt;
                        if (spec === 'G') formatted = formatted.toUpperCase();
                        break;
                    }
                    case 's': {
                        formatted = String(args[argIndex++]);
                        if (precision >= 0) formatted = formatted.substr(0, precision);
                        break;
                    }
                    case 'c': {
                        formatted = String.fromCharCode(Math.floor(Number(args[argIndex++])));
                        break;
                    }
                    case 'x':
                    case 'X': {
                        const val = Math.floor(Number(args[argIndex++]));
                        formatted = NumberFormat.toHex(val);
                        if (spec === 'X') formatted = formatted.toUpperCase();
                        if (altForm && val !== 0) formatted = (spec === 'X' ? '0X' : '0x') + formatted;
                        break;
                    }
                    case 'o': {
                        const val = Math.floor(Number(args[argIndex++]));
                        formatted = NumberFormat.toOct(val);
                        if (altForm) formatted = '0' + formatted;
                        break;
                    }
                    case 'b': {
                        const val = Math.floor(Number(args[argIndex++]));
                        formatted = NumberFormat.toBin(val);
                        if (altForm) formatted = 'b' + formatted;
                        break;
                    }
                    default:
                        formatted = spec;
                }

                // Apply width padding
                if (width > formatted.length) {
                    const padChar = zeroPad && !leftAlign ? '0' : ' ';
                    const padding = padChar.repeat(width - formatted.length);
                    if (leftAlign) {
                        formatted = formatted + padding;
                    } else {
                        formatted = padding + formatted;
                    }
                }

                result += formatted;
            } else {
                result += c;
                i++;
            }
        }

        return result;
    }
}
