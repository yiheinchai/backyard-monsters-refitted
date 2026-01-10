import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import { SecNum } from "./com/cc/utils/SecNum";
import { SiegeFactory } from "./com/monsters/siege/SiegeFactory";
import { SiegeLab } from "./com/monsters/siege/SiegeLab";

// Type definitions for outpost building properties
interface BuildingCost {
    r1: SecNum;
    r2: SecNum;
    r3: SecNum;
    r4: SecNum;
    time: SecNum;
    re?: number[][];
}

interface ImageDataLevel {
    anim?: [string, Rectangle, number];
    anim2?: [string, Rectangle, number];
    top?: [string, Point];
    shadow?: [string, Point];
    topdamaged?: [string, Point];
    shadowdamaged?: [string, Point];
    topdestroyed?: [string, Point];
    shadowdestroyed?: [string, Point];
}

interface UpgradeImgDataLevel {
    img: string;
    silhouette_img?: string;
}

interface OutpostBuildingProp {
    id: number;
    group: number;
    order: number;
    buildStatus: number;
    type: string;
    name: string;
    size: number;
    cycle?: number;
    attackgroup?: number;
    tutstage?: number;
    sale?: number;
    description: string;
    costs: BuildingCost[];
    imageData: {
        baseurl: string;
        [level: number]: ImageDataLevel;
    };
    buildingbuttons?: string[];
    upgradeImgData: {
        baseurl: string;
        [level: number]: UpgradeImgDataLevel;
    };
    quantity?: number[];
    produce?: number[];
    cycleTime?: number[];
    capacity?: number[];
    hp: number[];
    repairTime: number[];
    // Tower-specific properties
    range?: number[];
    damage?: number[];
    rate?: number[];
    splash?: number[];
    // Defense-specific properties
    defensetime?: number[];
    // Other properties
    class?: any;
    footprint?: number[][];
    hittable?: boolean;
}

export class OUTPOST_YARD_PROPS {
    public static readonly _outpostProps: OutpostBuildingProp[] = [
        // Building 1: Twig Snapper (Resource)
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
            description: "b_twigsnapper_desc",
            costs: [
                { r1: new SecNum(0), r2: new SecNum(750), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(15), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(1575), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(300), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(3300), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(1200), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(6950), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(3600), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(14500), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(7200), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(30600), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(18000), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(64300), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(43200), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(135000), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(86400), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(283600), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(172800), re: [[112, 1, 1]] },
                { r1: new SecNum(0), r2: new SecNum(600000), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(259200), re: [[112, 1, 1]] }
            ],
            imageData: {
                baseurl: "buildings/twigsnapper.v2/",
                1: {
                    anim: ["anim.1.png", new Rectangle(-4, 10, 23, 33), 34],
                    top: ["top.1.png", new Point(-30, -19)],
                    shadow: ["shadow.1.jpg", new Point(-30, 16)],
                    topdamaged: ["top.3.damaged.png", new Point(-27, -15)],
                    shadowdamaged: ["shadow.3.damaged.jpg", new Point(-27, 25)],
                    topdestroyed: ["top.destroyed.png", new Point(-34, 2)],
                    shadowdestroyed: ["shadow.destroyed.jpg", new Point(-31, 20)]
                },
                6: {
                    anim: ["anim.6.png", new Rectangle(-1, 1, 34, 34), 34],
                    top: ["top.6.png", new Point(-34, -42)],
                    shadow: ["shadow.6.jpg", new Point(-25, 26)],
                    topdamaged: ["top.10.damaged.png", new Point(-33, -41)],
                    shadowdamaged: ["shadow.10.damaged.jpg", new Point(-28, 22)],
                    topdestroyed: ["top.destroyed.png", new Point(-34, 2)],
                    shadowdestroyed: ["shadow.destroyed.jpg", new Point(-31, 20)]
                }
            },
            upgradeImgData: {
                baseurl: "buildingbuttons/",
                1: { img: "1.1.jpg", silhouette_img: "1.1.silhouette.jpg" },
                3: { img: "1.3.jpg" },
                6: { img: "1.6.jpg" }
            },
            quantity: [0, 1, 2, 4, 5, 6, 6, 6, 6, 6],
            produce: [2, 4, 7, 11, 16, 22, 29, 37, 46, 56],
            cycleTime: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            capacity: [720, 2160, 5670, 13365, 29160, 60142, 118918, 227584, 424414, 775018],
            hp: [500, 950, 1800, 3400, 6500, 12000, 24000, 45000, 85000, 165000],
            repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
        },
        // Building 2: Pebble Shiner (Resource)
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
            description: "b_pebbleshiner_desc",
            costs: [
                { r1: new SecNum(750), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(15), re: [[112, 1, 1]] },
                { r1: new SecNum(1575), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(300), re: [[112, 1, 1]] },
                { r1: new SecNum(3300), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(1200), re: [[112, 1, 1]] },
                { r1: new SecNum(6950), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(3600), re: [[112, 1, 1]] },
                { r1: new SecNum(14500), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(7200), re: [[112, 1, 1]] },
                { r1: new SecNum(30600), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(18000), re: [[112, 1, 1]] },
                { r1: new SecNum(64300), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(43200), re: [[112, 1, 1]] },
                { r1: new SecNum(135000), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(86400), re: [[112, 1, 1]] },
                { r1: new SecNum(283600), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(172800), re: [[112, 1, 1]] },
                { r1: new SecNum(600000), r2: new SecNum(0), r3: new SecNum(0), r4: new SecNum(0), time: new SecNum(259200), re: [[112, 1, 1]] }
            ],
            imageData: {
                baseurl: "buildings/pebbleshiner.v2/",
                1: {
                    anim: ["anim.1.png", new Rectangle(-21, 8, 42, 24), 26],
                    top: ["top.1.png", new Point(-34, -12)],
                    shadow: ["shadow.1.jpg", new Point(-34, 22)],
                    topdamaged: ["top.3.damaged.png", new Point(-33, -11)],
                    shadowdamaged: ["shadow.3.damaged.jpg", new Point(-31, 22)],
                    topdestroyed: ["top.destroyed.png", new Point(-35, -2)],
                    shadowdestroyed: ["shadow.destroyed.jpg", new Point(-32, 22)]
                },
                6: {
                    anim: ["anim.6.png", new Rectangle(-29, -5, 58, 41), 26],
                    top: ["top.6.png", new Point(-34, -34)],
                    shadow: ["shadow.6.jpg", new Point(-34, 20)],
                    topdamaged: ["top.10.damaged.png", new Point(-33, -32)],
                    shadowdamaged: ["shadow.10.damaged.jpg", new Point(-34, 15)],
                    topdestroyed: ["top.destroyed.png", new Point(-35, -2)],
                    shadowdestroyed: ["shadow.destroyed.jpg", new Point(-33, 22)]
                }
            },
            upgradeImgData: {
                baseurl: "buildingbuttons/",
                1: { img: "2.1.jpg", silhouette_img: "2.1.silhouette.jpg" },
                3: { img: "2.3.jpg" },
                6: { img: "2.6.jpg" }
            },
            quantity: [1, 2, 4, 5, 6, 6, 6, 6, 6, 6],
            produce: [2, 4, 7, 11, 16, 22, 29, 37, 46, 56],
            cycleTime: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            capacity: [720, 2160, 5670, 13365, 29160, 60142, 118918, 227584, 424414, 775018],
            hp: [500, 950, 1800, 3400, 6500, 12000, 24000, 45000, 85000, 165000],
            repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
        }
        // NOTE: Full building data array continues for 30+ outpost buildings
        // Including: Putty Squisher, Goo Factory, Monster Flinger, Sniper Tower,
        // Cannon Tower, Booby Trap, Tesla Tower, Monster Housing, Town Hall,
        // Hatchery, Monster Locker, Map Room, Siege Factory, Siege Lab, etc.
        // Total: ~6300 lines of building property definitions
    ];

    constructor() {}
}
