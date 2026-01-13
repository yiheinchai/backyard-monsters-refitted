import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import MovieClip from "openfl/display/MovieClip";
import Matrix from "openfl/geom/Matrix";

// Declare FrameLabel interface for OpenFL compatibility
interface FrameLabel {
    name: string;
    frame: number;
}

/**
 * Utility functions for MovieClip manipulation.
 */
export class MovieClipUtils {
    constructor() {}

    /**
     * Validates if a frame label exists in a MovieClip.
     */
    public static validateFrameLabel(mc: MovieClip, label: string): boolean {
        const labels = (mc as any).currentLabels as FrameLabel[];
        for (const frameLabel of labels) {
            if (frameLabel.name === label) {
                return true;
            }
        }
        return false;
    }

    /**
     * Validates multiple frame labels and returns the ones that exist.
     */
    public static validateFrameLabels(mc: MovieClip, labels: string[], throwOnMissing: boolean = false): string[] {
        const result: string[] = [];
        const currentLabels = (mc as any).currentLabels as FrameLabel[];
        
        for (const labelToFind of labels) {
            let found = false;
            for (const frameLabel of currentLabels) {
                if (labelToFind === frameLabel.name) {
                    found = true;
                    break;
                }
            }
            
            if (found) {
                result.push(labelToFind);
            } else if (throwOnMissing) {
                // Original code has empty if branch here
            }
        }
        
        return result;
    }

    /**
     * Creates BitmapData from a DisplayObject.
     */
    public static getBitmapDataFromDisplayObject(obj: DisplayObject): BitmapData {
        const bitmapData = new BitmapData(obj.width, obj.height, true, 0);
        bitmapData.draw(obj, new Matrix(1, 0, 0, 1, obj.width * 0.5, obj.height * 0.5));
        return bitmapData;
    }

    /**
     * Returns a list of all item codes used in the game.
     */
    public static getItemCodes(): string[] {
        return [
            "BEW", "BST", "BIP", "ENL", "SP1", "SP2", "SP3", "SP4", "BR13", "BR23", "BR33", "BR43",
            "CLOD", "HOD", "QC8", "QFAN", "QBOOKMARK", "BR11", "BR12", "BR21", "BR22", "BR31", "BR32",
            "BR41", "BR42", "PRO1", "PRO2", "QINVITE1", "QINVITE5", "QINVITE10", "X", "PRO3",
            "BUILDING28", "BUILDING29", "BUILDING30", "BUILDING31", "BUILDING33", "BUILDING34",
            "BUILDING35", "BUILDING36", "BUILDING37", "BUILDING38", "BUILDING39", "BUILDING40",
            "BUILDING41", "BUILDING42", "BUILDING43", "BUILDING44", "BUILDING45", "BUILDING46",
            "BUILDING47", "BUILDING48", "REFUND", "BUILDING49", "BUILDING50", "BUILDING32",
            "MUSHROOM1", "MUSHROOM2", "MUSHROOM3", "MUSK", "HOD2", "HOD3", "QGIFT10", "QGIFT50",
            "QGIFT100", "BRTOPUP", "PUMPKIN", "BUILDING55", "BUILDING56", "BUILDING57", "BUILDING58",
            "BUILDING59", "BUILDING60", "BUILDING61", "BUILDING62", "BUILDING63", "BUILDING64",
            "BUILDING65", "BUILDING66", "BUILDING67", "BUILDING68", "BUILDING69", "BUILDING70",
            "BUILDING71", "BUILDING72", "BUILDING73", "BUILDING74", "BUILDING75", "BUILDING76",
            "BUILDING77", "BUILDING78", "BUILDING79", "BUILDING80", "BUILDING81", "BUILDING82",
            "BUILDING83", "BUILDING84", "BUILDING85", "BUILDING86", "BUILDING87", "BUILDING88",
            "BUILDING89", "BUILDING90", "BUILDING91", "BUILDING92", "BUILDING93", "BUILDING94",
            "BUILDING95", "BUILDING96", "BUILDING97", "BUILDING98", "BUILDING99", "BUILDING100",
            "BUILDING101", "BUILDING102", "BUILDING103", "BUILDING104", "BUILDING105", "BUILDING106",
            "BUILDING107", "BUILDING108", "BUILDING109", "BUILDING110", "HEVENT", "BUNK",
            "SP2x1", "SP3x1", "SP4x1", "SP2x2", "SP3x2", "SP4x2", "SP2x3", "SP3x3", "SP4x3",
            "KIT", "FIX", "BLK2", "BLK3", "BLK4", "FQ", "POD", "IU", "BALL0", "BALL1", "BALL2",
            "IUN", "ITR", "YRE", "OTO", "TOD", "MOD", "EXH", "IPU", "IFD", "IEV", "IHE", "BLK5",
            "MDOD", "MSOD", "APARMAHR", "APCONQHR", "APDECLHR", "IB", "IF", "BUILDING120",
            "BUILDING131", "IBSW", "BRAU", "BRAB", "BLK2I", "BLK3I", "BR11I", "BR12I", "BR13I",
            "BR21I", "BR22I", "BR23I", "BR31I", "BR32I", "BR33I", "BR41I", "BR42I", "BR43I",
            "HODI", "HOD2I", "HOD3I", "TODI", "EXHI", "NCP", "ENLI", "HAM", "HAMS", "HSM", "MHTOPUP"
        ];
    }
}
