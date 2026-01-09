import { ByteArray } from "openfl/utils/ByteArray";
import { SFSError } from "../../exceptions/SFSError";

/**
 * DefaultObjectDumpFormatter - Formats object dumps for debugging.
 */
export class DefaultObjectDumpFormatter {
    public static readonly TOKEN_INDENT_OPEN: string = "{";
    public static readonly TOKEN_INDENT_CLOSE: string = "}";
    public static readonly TOKEN_DIVIDER: string = ";";
    public static readonly NEW_LINE: string = "\n";
    public static readonly TAB: string = "\t";
    public static readonly DOT: string = ".";
    public static readonly HEX_BYTES_PER_LINE: number = 16;

    constructor() { }

    public static prettyPrintByteArray(ba: ByteArray | null): string {
        if (ba === null) {
            return "Null";
        }
        return "Byte[" + ba.length + "]";
    }

    public static prettyPrintDump(rawDump: string): string {
        let result = "";
        let indentPos = 0;

        for (let i = 0; i < rawDump.length; i++) {
            const ch = rawDump.charAt(i);
            if (ch === DefaultObjectDumpFormatter.TOKEN_INDENT_OPEN) {
                indentPos++;
                result += DefaultObjectDumpFormatter.NEW_LINE + DefaultObjectDumpFormatter.getFormatTabs(indentPos);
            } else if (ch === DefaultObjectDumpFormatter.TOKEN_INDENT_CLOSE) {
                indentPos--;
                if (indentPos < 0) {
                    throw new SFSError("DumpFormatter: the indentPos is negative. TOKENS ARE NOT BALANCED!");
                }
                result += DefaultObjectDumpFormatter.NEW_LINE + DefaultObjectDumpFormatter.getFormatTabs(indentPos);
            } else if (ch === DefaultObjectDumpFormatter.TOKEN_DIVIDER) {
                result += DefaultObjectDumpFormatter.NEW_LINE + DefaultObjectDumpFormatter.getFormatTabs(indentPos);
            } else {
                result += ch;
            }
        }

        if (indentPos !== 0) {
            throw new SFSError("DumpFormatter: the indentPos is not == 0. TOKENS ARE NOT BALANCED!");
        }
        return result;
    }

    private static getFormatTabs(count: number): string {
        return DefaultObjectDumpFormatter.strFill(DefaultObjectDumpFormatter.TAB, count);
    }

    private static strFill(str: string, count: number): string {
        let result = "";
        for (let i = 0; i < count; i++) {
            result += str;
        }
        return result;
    }

    public static hexDump(ba: ByteArray, bytesPerLine: number = -1): string {
        const savedPos = ba.position;
        ba.position = 0;
        if (bytesPerLine === -1) {
            bytesPerLine = DefaultObjectDumpFormatter.HEX_BYTES_PER_LINE;
        }

        let result = "Binary Size: " + ba.length + DefaultObjectDumpFormatter.NEW_LINE;
        let hexLine = "";
        let chrLine = "";
        let byteCount = 0;
        let lineCount = 0;

        while (byteCount < ba.length) {
            const b = ba.readByte() & 0xFF;
            let hexStr = b.toString(16).toUpperCase();
            if (hexStr.length === 1) {
                hexStr = "0" + hexStr;
            }
            hexLine += hexStr + " ";

            let chrStr: string;
            if (b >= 33 && b <= 126) {
                chrStr = String.fromCharCode(b);
            } else {
                chrStr = DefaultObjectDumpFormatter.DOT;
            }
            chrLine += chrStr;

            lineCount++;
            if (lineCount === bytesPerLine) {
                lineCount = 0;
                result += hexLine + DefaultObjectDumpFormatter.TAB + chrLine + DefaultObjectDumpFormatter.NEW_LINE;
                hexLine = "";
                chrLine = "";
            }
            byteCount++;
        }

        if (lineCount !== 0) {
            let padding = bytesPerLine - lineCount;
            while (padding > 0) {
                hexLine += "   ";
                chrLine += " ";
                padding--;
            }
            result += hexLine + DefaultObjectDumpFormatter.TAB + chrLine + DefaultObjectDumpFormatter.NEW_LINE;
        }

        ba.position = savedPos;
        return result;
    }
}
