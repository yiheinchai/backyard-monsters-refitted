/**
 * NumberFormat - Number formatting utilities.
 */
export class NumberFormat {
    public static _hexLUT: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    /**
     * Converts an integer to binary string representation.
     */
    public static toBin(value: number, separator: string = "", pad32: boolean = false): string {
        if (value === 0) return pad32 ? "00000000000000000000000000000000" : "0";
        
        let result = "";
        let v = value >>> 0; // Convert to unsigned 32-bit integer
        let bits = 0;
        
        while (v > 0) {
            result = (v & 1) + (bits > 0 && (bits & 7) === 0 && separator ? separator : "") + result;
            v >>>= 1;
            bits++;
        }
        
        if (pad32) {
            while (result.replace(new RegExp(separator, 'g'), '').length < 32) {
                result = "0" + result;
            }
        }
        
        return result;
    }

    /**
     * Converts an integer to hexadecimal string representation.
     */
    public static toHex(value: number): string {
        if (value === 0) return "0";
        let result = "";
        let v = value >>> 0; // Convert to unsigned
        while (v !== 0) {
            result = NumberFormat._hexLUT[v & 15] + result;
            v >>>= 4;
        }
        return result;
    }

    /**
     * Converts an integer to octal string representation.
     */
    public static toOct(value: number): string {
        if (value === 0) return "0";
        let result = "";
        let v = value;
        while (v > 0) {
            result = (v & 7) + result;
            v >>= 3;
        }
        return result;
    }

    /**
     * Converts an integer to a string in the given radix.
     */
    public static toRadix(value: number, radix: number): string {
        if (value === 0) return "0";
        let result = "";
        let v = value;
        while (v > 0) {
            result = (v % radix) + result;
            v = Math.floor(v / radix);
        }
        return result;
    }

    /**
     * Formats a number to a fixed number of decimal places.
     */
    public static toFixed(value: number, precision: number): string {
        if (isNaN(value)) return "NaN";
        return value.toFixed(precision);
    }

    /**
     * Formats milliseconds as MM:SS.
     */
    public static toMMSS(ms: number): string {
        const remainder = ms % 1000;
        const seconds = (ms - remainder) / 1000;
        const secs = seconds % 60;
        const mins = (seconds - secs) / 60;
        return ("0" + mins).substr(-2) + ":" + ("0" + secs).substr(-2);
    }

    /**
     * Groups digits with a separator (e.g., 1000000 -> 1.000.000).
     */
    public static groupDigits(value: number, separator: string = "."): string {
        const str = String(value);
        if (str.length <= 3) return str;
        
        let result = "";
        let count = 0;
        for (let i = str.length - 1; i >= 0; i--) {
            if (count === 3) {
                result = separator + result;
                count = 0;
            }
            result = str.charAt(i) + result;
            count++;
        }
        return result;
    }

    /**
     * Formats cents as Euro currency (e.g., 12345 -> 123,45).
     */
    public static centToEuro(cents: number, decimalSep: string = ",", thousandSep: string = "."): string {
        const euros = Math.floor(cents / 100);
        const remainder = cents - euros * 100;
        
        let decimalPart: string;
        if (remainder < 10) {
            decimalPart = decimalSep + "0" + remainder;
        } else {
            decimalPart = decimalSep + remainder;
        }
        
        if (euros === 0) {
            return "0" + decimalPart;
        }
        
        if (euros >= 1000) {
            return NumberFormat.groupDigits(euros, thousandSep) + decimalPart;
        }
        
        return euros + decimalPart;
    }
}
