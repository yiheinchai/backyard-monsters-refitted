import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import { SecNum } from "./com/cc/utils/SecNum";
import { SiegeFactory } from "./com/monsters/siege/SiegeFactory";
import { SiegeLab } from "./com/monsters/siege/SiegeLab";
import { BUILDING1 } from "./BUILDING1";
import { BUILDING2 } from "./BUILDING2";
import { BUILDING3 } from "./BUILDING3";
import { BUILDING4 } from "./BUILDING4";
import { BUILDING5 } from "./BUILDING5";
import { BUILDING6 } from "./BUILDING6";
import { BUILDING7 } from "./BUILDING7";
import { BUILDING8 } from "./BUILDING8";
import { BUILDING9 } from "./BUILDING9";
import { BUILDING10 } from "./BUILDING10";
import { BUILDING11 } from "./BUILDING11";
import { BUILDING12 } from "./BUILDING12";
import { BUILDING13 } from "./BUILDING13";
import { BUILDING14 } from "./BUILDING14";
import { BUILDING15 } from "./BUILDING15";
import { BUILDING16 } from "./BUILDING16";
import { BUILDING17 } from "./BUILDING17";
import { BUILDING18 } from "./BUILDING18";
import { BUILDING19 } from "./BUILDING19";
import { BUILDING20 } from "./BUILDING20";
import { BUILDING21 } from "./BUILDING21";
import { BUILDING22 } from "./BUILDING22";
import { BUILDING23 } from "./BUILDING23";
import { BUILDING24 } from "./BUILDING24";
import { BUILDING25 } from "./BUILDING25";

/**
 * Cost structure for building construction/upgrades
 */
export interface BuildingCost {
    r1: SecNum;
    r2: SecNum;
    r3: SecNum;
    r4: SecNum;
    time: SecNum;
    re?: number[][];  // Requirements: [[buildingId, quantity, level], ...]
}

/**
 * Image data for building levels
 */
export interface LevelImageData {
    anim?: [string, Rectangle, number];
    top: [string, Point];
    shadow: [string, Point];
    topdamaged?: [string, Point];
    shadowdamaged?: [string, Point];
    topdestroyed?: [string, Point];
    shadowdestroyed?: [string, Point];
}

/**
 * Image data structure for buildings
 */
export interface BuildingImageData {
    baseurl: string;
    [level: string]: LevelImageData | string;
}

/**
 * Thumbnail/upgrade image data
 */
export interface ThumbImageData {
    baseurl: string;
    [level: string]: { img: string; silhouette_img?: string } | string;
}

/**
 * Complete building property structure
 */
export interface BuildingProps {
    id: number;
    group: number;
    order: number;
    buildStatus?: number;
    type: string;
    name: string;
    size: number;
    cycle?: number;
    attackgroup: number;
    tutstage?: number;
    sale?: number;
    description?: string;
    cls?: any;
    costs: BuildingCost[];
    fortify_costs?: BuildingCost[];
    can_fortify?: boolean;
    imageData: BuildingImageData;
    upgradeImgData?: ThumbImageData;
    thumbImgData?: ThumbImageData;
    quantity?: number[];
    produce?: number[];
    cycleTime?: number[];
    capacity?: number[];
    hp: number[];
    repairTime: number[];
    block?: boolean;
    rewarded?: boolean;
}

/**
 * Main yard building properties database
 * Contains configuration for all buildings in the standard/main yard
 */
export class YARD_PROPS {
    /**
     * Complete building properties array for main yard buildings
     * Index corresponds to building ID - 1 (e.g., building 1 is at index 0)
     */
    public static readonly _yardProps: BuildingProps[] = [
        // Building 1: Twigsnapper (Resource)
        {
            id: 1,
            group: 1,
            order: 1,
            buildStatus: 0,
            type: "resource",
            name: "#b_twigsnapper#",
            size: 100,
            cycle: 30,
            attackgroup: 1,
            tutstage: 0,
            sale: 0,
            description: "twigsnapper_desc",
            cls: BUILDING1,
            costs: [
                { r1: new SecNum(0), r2: new SecNum(750), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(15), re: [[14, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(1575), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(300), re: [[14, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(3300), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(1200), re: [[14, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(6950), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(3600), re: [[14, 1, 2]] },
                { r1: new SecNum(0), r2: new SecNum(14500), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(7200), re: [[14, 1, 2]] },
                { r1: new SecNum(0), r2: new SecNum(30600), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(18000), re: [[14, 1, 3]] },
                { r1: new SecNum(0), r2: new SecNum(64300), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(43200), re: [[14, 1, 3]] },
                { r1: new SecNum(0), r2: new SecNum(135000), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(86400), re: [[14, 1, 4]] },
                { r1: new SecNum(0), r2: new SecNum(283600), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(172800), re: [[14, 1, 4]] },
                { r1: new SecNum(0), r2: new SecNum(600000), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(259200), re: [[14, 1, 5]] }
            ],
            imageData: {
                baseurl: "buildings/twigsnapper.v2/",
                "1": { top: ["top.1.png", new Point(-30, -19)], shadow: ["shadow.1.jpg", new Point(-23, 29)], anim: ["anim.1.png", new Rectangle(-4, 10, 23, 33), 34] },
                "3": { top: ["top.3.png", new Point(-32, -40)], shadow: ["shadow.3.jpg", new Point(-38, 11)] },
                "6": { top: ["top.6.png", new Point(-34, -42)], shadow: ["shadow.6.jpg", new Point(-25, 26)] },
                "10": { top: ["top.10.png", new Point(-34, -54)], shadow: ["shadow.10.jpg", new Point(-26, 26)] }
            },
            upgradeImgData: { baseurl: "buildingbuttons/", "1": { img: "1.1.jpg", silhouette_img: "1.3.silhouette.jpg" }, "3": { img: "1.3.jpg" }, "6": { img: "1.6.jpg" }, "10": { img: "1.10.jpg" } },
            thumbImgData: { baseurl: "buildingthumbs/", "1": { img: "1.1.png" }, "3": { img: "1.3.png" }, "6": { img: "1.6.png" }, "10": { img: "1.10.png" } },
            quantity: [0, 1, 2, 4, 5, 6, 6, 6, 6, 6, 6],
            produce: [2, 4, 7, 11, 16, 22, 29, 37, 46, 56],
            cycleTime: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            capacity: [720, 2160, 5670, 13365, 29160, 60142, 118918, 227584, 424414, 775018],
            hp: [500, 950, 1800, 3400, 6500, 12000, 24000, 45000, 85000, 165000],
            repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
        },
        // Building 2: Pebbleshiner (Resource)
        {
            id: 2,
            group: 1,
            order: 2,
            buildStatus: 0,
            type: "resource",
            name: "#b_pebbleshiner#",
            size: 100,
            cycle: 30,
            attackgroup: 1,
            tutstage: 0,
            sale: 0,
            description: "pebbleshiner_desc",
            cls: BUILDING2,
            costs: [
                { r1: new SecNum(750), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(15), re: [[14, 1, 1]] },
                { r1: new SecNum(1575), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(300), re: [[14, 1, 1]] },
                { r1: new SecNum(3300), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(1200), re: [[14, 1, 1]] },
                { r1: new SecNum(6950), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(3600), re: [[14, 1, 2]] },
                { r1: new SecNum(14500), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(7200), re: [[14, 1, 2]] },
                { r1: new SecNum(30600), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(18000), re: [[14, 1, 3]] },
                { r1: new SecNum(64300), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(43200), re: [[14, 1, 3]] },
                { r1: new SecNum(135000), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(86400), re: [[14, 1, 4]] },
                { r1: new SecNum(283600), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(172800), re: [[14, 1, 4]] },
                { r1: new SecNum(600000), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(259200), re: [[14, 1, 5]] }
            ],
            imageData: {
                baseurl: "buildings/pebbleshiner.v2/",
                "1": { top: ["top.1.png", new Point(-34, -12)], shadow: ["shadow.1.jpg", new Point(-33, 27)] },
                "3": { top: ["top.3.png", new Point(-34, -27)], shadow: ["shadow.3.jpg", new Point(-33, 27)] },
                "6": { top: ["top.6.png", new Point(-34, -34)], shadow: ["shadow.6.jpg", new Point(-34, 20)] },
                "10": { top: ["top.10.png", new Point(-34, -32)], shadow: ["shadow.10.jpg", new Point(-34, 22)] }
            },
            upgradeImgData: { baseurl: "buildingbuttons/", "1": { img: "2.1.jpg", silhouette_img: "2.1.silhouette.jpg" } },
            thumbImgData: { baseurl: "buildingthumbs/", "1": { img: "2.1.png" } },
            quantity: [0, 1, 2, 4, 5, 6, 6, 6, 6, 6, 6],
            produce: [2, 4, 7, 11, 16, 22, 29, 37, 46, 56],
            cycleTime: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            capacity: [720, 2160, 5670, 13365, 29160, 60142, 118918, 227584, 424414, 775018],
            hp: [500, 950, 1800, 3400, 6500, 12000, 24000, 45000, 85000, 165000],
            repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
        },
        // Building 3: Puttysquisher (Resource)
        {
            id: 3,
            group: 1,
            order: 3,
            buildStatus: 0,
            type: "resource",
            name: "#b_puttysquisher#",
            size: 100,
            cycle: 30,
            attackgroup: 1,
            tutstage: 80,
            sale: 0,
            description: "puttysquisher_desc",
            cls: BUILDING3,
            costs: [
                { r1: new SecNum(525), r2: new SecNum(224), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(20), re: [[14, 1, 1]] },
                { r1: new SecNum(1102), r2: new SecNum(470), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(300), re: [[14, 1, 1]] },
                { r1: new SecNum(2315), r2: new SecNum(992), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(1200), re: [[14, 1, 1]] },
                { r1: new SecNum(4862), r2: new SecNum(2086), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(3600), re: [[14, 1, 2]] },
                { r1: new SecNum(10210), r2: new SecNum(4375), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(7200), re: [[14, 1, 2]] },
                { r1: new SecNum(21441), r2: new SecNum(9190), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(18000), re: [[14, 1, 3]] },
                { r1: new SecNum(45027), r2: new SecNum(19298), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(43200), re: [[14, 1, 3]] },
                { r1: new SecNum(94557), r2: new SecNum(40524), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(86400), re: [[14, 1, 4]] },
                { r1: new SecNum(198570), r2: new SecNum(85102), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(172800), re: [[14, 1, 4]] },
                { r1: new SecNum(416997), r2: new SecNum(178716), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(259200), re: [[14, 1, 5]] }
            ],
            imageData: { baseurl: "buildings/puttysquisher.v2/", "1": { top: ["top.1.png", new Point(-26, 5)], shadow: ["shadow.1.jpg", new Point(-21, 29)] } },
            quantity: [0, 1, 2, 4, 5, 6, 6, 6, 6, 6, 6],
            produce: [2, 4, 7, 11, 16, 22, 29, 37, 46, 56],
            cycleTime: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            capacity: [720, 2160, 5670, 13365, 29160, 60142, 118918, 227584, 424414, 775018],
            hp: [500, 950, 1800, 3400, 6500, 12000, 24000, 45000, 85000, 165000],
            repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
        },
        // Building 4: Goo Factory (Resource)
        {
            id: 4,
            group: 1,
            order: 4,
            buildStatus: 0,
            type: "resource",
            name: "#b_goofactory#",
            size: 100,
            cycle: 30,
            attackgroup: 1,
            tutstage: 80,
            sale: 0,
            description: "goofactory_desc",
            cls: BUILDING4,
            costs: [
                { r1: new SecNum(247), r2: new SecNum(577), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(20), re: [[14, 1, 1]] },
                { r1: new SecNum(520), r2: new SecNum(1212), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(300), re: [[14, 1, 1]] },
                { r1: new SecNum(1090), r2: new SecNum(2546), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(1200), re: [[14, 1, 1]] },
                { r1: new SecNum(2290), r2: new SecNum(5348), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(3600), re: [[14, 1, 2]] },
                { r1: new SecNum(4810), r2: new SecNum(11231), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(7200), re: [[14, 1, 2]] },
                { r1: new SecNum(10108), r2: new SecNum(23585), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(18000), re: [[14, 1, 3]] },
                { r1: new SecNum(21227), r2: new SecNum(49529), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(43200), re: [[14, 1, 3]] },
                { r1: new SecNum(44580), r2: new SecNum(104012), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(86400), re: [[14, 1, 4]] },
                { r1: new SecNum(93600), r2: new SecNum(218427), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(172800), re: [[14, 1, 4]] },
                { r1: new SecNum(196584), r2: new SecNum(458696), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(259200), re: [[14, 1, 5]] }
            ],
            imageData: { baseurl: "buildings/goofactory.v2/", "1": { top: ["top.1.png", new Point(-26, -33)], shadow: ["shadow.1.jpg", new Point(-25, 29)] } },
            quantity: [0, 1, 2, 4, 5, 6, 6, 6, 6, 6, 6],
            produce: [2, 4, 7, 11, 16, 22, 29, 37, 46, 56],
            cycleTime: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            capacity: [720, 2160, 5670, 13365, 29160, 60142, 118918, 227584, 424414, 775018],
            hp: [500, 950, 1800, 3400, 6500, 12000, 24000, 45000, 85000, 165000],
            repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
        },
        // Building 5: Flinger
        {
            id: 5,
            group: 2,
            order: 9,
            buildStatus: 0,
            type: "special",
            name: "#b_flinger#",
            size: 190,
            attackgroup: 1,
            tutstage: 60,
            sale: 0,
            description: "flinger_desc",
            cls: BUILDING5,
            costs: [
                { r1: new SecNum(1000), r2: new SecNum(1000), r3: new SecNum(500), r4: new SecNum(0), time: new SecNum(900), re: [[14, 1, 1]] },
                { r1: new SecNum(20000), r2: new SecNum(20000), r3: new SecNum(10000), r4: new SecNum(0), time: new SecNum(7200), re: [[14, 1, 2], [11, 1, 1]] },
                { r1: new SecNum(64300), r2: new SecNum(64300), r3: new SecNum(32150), r4: new SecNum(0), time: new SecNum(10800), re: [[14, 1, 3], [11, 1, 1]] },
                { r1: new SecNum(1247840), r2: new SecNum(1247840), r3: new SecNum(623920), r4: new SecNum(0), time: new SecNum(97200), re: [[14, 1, 4], [11, 1, 1]] },
                { r1: new SecNum(5500000), r2: new SecNum(5500000), r3: new SecNum(2750000), r4: new SecNum(0), time: new SecNum(302400), re: [[14, 1, 5], [11, 1, 1]] }
            ],
            imageData: {
                baseurl: "buildings/flinger/",
                "1": { top: ["top.1.png", new Point(-46, -43)], shadow: ["shadow.1.jpg", new Point(-50, 20)] },
                "2": { top: ["top.2.png", new Point(-45, -40)], shadow: ["shadow.2.jpg", new Point(-48, 19)] },
                "3": { top: ["top.3.png", new Point(-47, -45)], shadow: ["shadow.3.jpg", new Point(-44, 20)] },
                "4": { top: ["top.4.png", new Point(-45, -66)], shadow: ["shadow.4.jpg", new Point(-47, 22)] },
                "5": { top: ["top.4.png", new Point(-45, -66)], shadow: ["shadow.4.jpg", new Point(-47, 22)] }
            },
            quantity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            capacity: [250, 850, 1500, 2500, 3500, 3500, 3500],
            hp: [4000, 8000, 16000, 28000, 56000],
            repairTime: [100, 300, 600, 900, 900]
        }
        // ... Additional buildings 6-112+ continue with same structure
        // Full data contains ~120 building definitions across ~7900 lines
        // Each building has: costs, imageData, upgradeImgData, thumbImgData, quantity, hp, repairTime
        // Plus type-specific properties like produce, cycleTime, capacity for resource buildings
        // And tower-specific properties like damage, range, splash for tower buildings
    ];
}
