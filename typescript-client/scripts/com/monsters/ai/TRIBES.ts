
import { PROCESS3 } from "./PROCESS3";
import { PROCESS4 } from "./PROCESS4";
import { PROCESS5 } from "./PROCESS5";
import { PROCESS7 } from "./PROCESS7";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getWMATTACK(): any { return require("../../../WMATTACK").WMATTACK; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }


interface TribeData {
    id: number;
    nid?: number;
    name: string;
    process: any;
    type: number;
    taunt: string;
    splash: string;
    description: string;
    succ: string;
    succ_stream: string;
    fail: string;
    profilepic: string;
    streampostpic: string;
    behaviour?: string;
}

/**
 * Tribe definitions and lookup functions for AI bases.
 */
export class TRIBES {
    private static _tribes: { [key: string]: TribeData } = {};
    private static _infernotribes: { [key: string]: TribeData } = {};
    private static _eventtribes: { [key: string]: TribeData } = {};
    private static _assoc: { [key: string]: number[] } = {};

    public static readonly L_IDS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 41, 42];
    public static readonly K_IDS: number[] = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 43, 44];
    public static readonly A_IDS: number[] = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 45, 46];
    public static readonly D_IDS: number[] = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 47, 48, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];

    public static readonly k_DIGIT_LEVEL: number = 0;
    public static readonly k_DIGIT_TRIBE: number = 1;
    public static readonly k_DIGIT_CELLTYPE: number = 2;

    public static B_IDS: number[] = [];

    constructor() {}

    public static Setup(): void {
        TRIBES._tribes = {};
        TRIBES._assoc = {
            l: TRIBES.L_IDS,
            k: TRIBES.K_IDS,
            a: TRIBES.A_IDS,
            d: TRIBES.D_IDS,
            b: TRIBES.B_IDS
        };

        TRIBES._tribes.l = {
            id: 1,
            name: getKEYS().Get("ai_legion_name"),
            process: PROCESS3,
            type: getWMATTACK().TYPE_TOWERS,
            taunt: getKEYS().Get("ai_legion_taunt"),
            splash: "popups/tribe_legionnaire.v2.png",
            description: getKEYS().Get("ai_legion_description"),
            succ: getKEYS().Get("ai_legion_succ"),
            succ_stream: getKEYS().Get("ai_legion_succstream"),
            fail: getKEYS().Get("ai_legion_fail"),
            profilepic: "monsters/tribe_legionnaire_50.v2.jpg",
            streampostpic: "tribe-legionnaire.v2.png"
        };

        TRIBES._tribes.k = {
            id: 2,
            name: getKEYS().Get("ai_kozu_name"),
            process: PROCESS4,
            type: getWMATTACK().TYPE_SWARM,
            taunt: getKEYS().Get("ai_kozu_taunt"),
            splash: "popups/tribe_kozu.v2.png",
            description: getKEYS().Get("ai_kozu_description"),
            succ: getKEYS().Get("ai_kozu_succ"),
            succ_stream: getKEYS().Get("ai_kozu_succstream"),
            fail: getKEYS().Get("ai_kozu_fail"),
            profilepic: "monsters/tribe_kozu_50.v2.jpg",
            streampostpic: "tribe-kozu.v2.png"
        };

        TRIBES._tribes.a = {
            id: 3,
            name: getKEYS().Get("ai_abunakki_name"),
            process: PROCESS5,
            type: getWMATTACK().TYPE_KAMIKAZE,
            taunt: getKEYS().Get("ai_abunakki_taunt"),
            splash: "popups/tribe_abunakki.v2.png",
            description: getKEYS().Get("ai_abunakki_description"),
            succ: getKEYS().Get("ai_abunakki_succ"),
            succ_stream: getKEYS().Get("ai_abunakki_succstream"),
            fail: getKEYS().Get("ai_abunakki_fail"),
            profilepic: "monsters/tribe_abunakki_50.v2.jpg",
            streampostpic: "tribe-abunakki.v2.png",
            behaviour: "juice"
        };

        TRIBES._tribes.d = {
            id: 4,
            name: getKEYS().Get("ai_dread_name"),
            process: PROCESS7,
            type: getWMATTACK().TYPE_NERD,
            taunt: getKEYS().Get("ai_dread_taunt"),
            splash: "popups/tribe_dreadnaut.v2.png",
            description: getKEYS().Get("ai_dread_description"),
            succ: getKEYS().Get("ai_dread_succ"),
            succ_stream: getKEYS().Get("ai_dread_succstream"),
            fail: getKEYS().Get("ai_dread_fail"),
            profilepic: "monsters/tribe_dreadnaut_50.v2.jpg",
            streampostpic: "tribe-dreadnaut.v2.png"
        };

        TRIBES._infernotribes = {};
        TRIBES._infernotribes.d = {
            id: 1,
            name: getKEYS().Get("ai_descenttribe_name"),
            process: PROCESS7,
            type: getWMATTACK().TYPE_NERD,
            taunt: getKEYS().Get("ai_descenttribe_taunt"),
            splash: "popups/tribe_moloch.png",
            description: getKEYS().Get("ai_descenttribe_description"),
            succ: getKEYS().Get("ai_descenttribe_succ"),
            succ_stream: getKEYS().Get("ai_descenttribe_succstream"),
            fail: getKEYS().Get("ai_descenttribe_fail"),
            profilepic: "monsters/tribe_moloch_50.jpg",
            streampostpic: "tribe-moloch.v2.png"
        };

        TRIBES._eventtribes = {};
        TRIBES._eventtribes.b = {
            id: 1,
            name: getKEYS().Get("ai_brukkarg_name"),
            process: PROCESS7,
            type: getWMATTACK().TYPE_NERD,
            taunt: getKEYS().Get("ai_brukkarg_taunt"),
            splash: "popups/tribe_brukkarg.png",
            description: getKEYS().Get("ai_brukkarg_description"),
            succ: getKEYS().Get("ai_brukkarg_succ"),
            succ_stream: getKEYS().Get("ai_brukkarg_succstream"),
            fail: getKEYS().Get("ai_brukkarg_fail"),
            profilepic: "monsters/tribe_brukkarg_50.jpg",
            streampostpic: "tribe_brukkarg.png"
        };
    }

    public static TribeForID(id: number, tableType: number = 0): TribeData | null {
        if (getGLOBAL()._loadmode !== getGLOBAL().mode) {
            return TRIBES._infernotribes.d;
        }
        
        const tribes = TRIBES.ChooseTribesTable(tableType);
        for (const key in tribes) {
            if (tribes[key].nid === id) {
                return tribes[key];
            }
        }
        
        // MapRoom3 digit separation logic
        const digits = TRIBES.separateDigitsFromInt(id);
        const tribeDigit = digits[TRIBES.k_DIGIT_TRIBE];
        for (const key in TRIBES._tribes) {
            if (TRIBES._tribes[key].id === tribeDigit) {
                return TRIBES._tribes[key];
            }
        }
        
        return null;
    }

    public static TribeForBaseID(baseId: number, tableType: number = 0): TribeData | null {
        if (getGLOBAL()._loadmode !== getGLOBAL().mode) {
            return TRIBES._infernotribes.d;
        }
        
        if (TRIBES.B_IDS.length && baseId >= TRIBES.B_IDS[0] || baseId === 0) {
            return TRIBES._eventtribes.b;
        }
        
        for (const key in TRIBES._assoc) {
            for (let i = 0; i < TRIBES._assoc[key].length; i++) {
                if (baseId === TRIBES._assoc[key][i]) {
                    return TRIBES._tribes[key];
                }
            }
        }
        
        // MapRoom3 digit separation logic
        const digits = TRIBES.separateDigitsFromInt(baseId);
        const tribeDigit = digits[TRIBES.k_DIGIT_TRIBE];
        let lastTribe: TribeData | null = null;
        for (const key in TRIBES._tribes) {
            lastTribe = TRIBES._tribes[key];
            if (TRIBES._tribes[key].id === tribeDigit) {
                return TRIBES._tribes[key];
            }
        }
        return lastTribe;
    }

    private static separateDigitsFromInt(num: number): number[] {
        const digits: number[] = [];
        while (num) {
            digits.push(num % 10);
            num = Math.floor(num * 0.1);
        }
        return digits;
    }

    public static ChooseTribesTable(tableType: number = 0): { [key: string]: TribeData } {
        let type = tableType;
        if (type <= 0) {
            type = getBASE().isInfernoMainYardOrOutpost ? 2 : 1;
        }
        switch (type) {
            case 0:
            case 1:
                return TRIBES._tribes;
            case 2:
                return TRIBES._infernotribes;
            default:
                return TRIBES._tribes;
        }
    }
}
