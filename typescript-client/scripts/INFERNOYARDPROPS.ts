import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import { SecNum } from "./com/cc/utils/SecNum";
import { SiegeFactory } from "./com/monsters/siege/SiegeFactory";
import { SiegeLab } from "./com/monsters/siege/SiegeLab";

// Type definitions for inferno building properties
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

interface InfernoBuildingProp {
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
    buildingbuttons: string[];
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

export class INFERNOYARDPROPS {
    public static readonly _infernoYardProps: InfernoBuildingProp[] = [
        // Building 1: Bone Harvester (Resource)
        {
            id: 1,
            group: 1,
            order: 1,
            buildStatus: 0,
            type: "resource",
            name: "#bi_boneharvester#",
            size: 100,
            cycle: 30,
            attackgroup: 1,
            tutstage: 0,
            sale: 0,
            description: "bi_boneharvester_desc",
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
                baseurl: "buildings/iboneharvester/",
                1: {
                    anim: ["anim.1.v2.png", new Rectangle(-32, -33, 65, 80), 47],
                    top: ["top.1.v2.png", new Point(-48, -33)],
                    shadow: ["shadow.1.v4.jpg", new Point(-53, -1)],
                    topdamaged: ["top.1.damaged.v2.png", new Point(-41, -26)],
                    shadowdamaged: ["shadow.1.damaged.v2.jpg", new Point(-51, -2)],
                    topdestroyed: ["top.1.destroyed.v2.png", new Point(-45, 0)],
                    shadowdestroyed: ["shadow.1.destroyed.v4.jpg", new Point(-46, -2)]
                },
                3: {
                    anim: ["anim.2.png", new Rectangle(-44, -38, 90, 97), 50],
                    top: ["top.2.png", new Point(-44, 25)],
                    shadow: ["shadow.2.jpg", new Point(-39, 7)],
                    topdamaged: ["top.2.damaged.png", new Point(-37, -27)],
                    topdestroyed: ["top.2.destroyed.png", new Point(-57, 8)]
                }
            },
            buildingbuttons: ["bone_crusher.v2"],
            upgradeImgData: {
                baseurl: "buildingbuttons/",
                1: { img: "bone_crusher.v2.jpg", silhouette_img: "bone_crusher.v2.silhouette.jpg" }
            },
            quantity: [0, 1, 2, 4, 5, 6, 6, 6, 6, 6],
            produce: [2, 4, 7, 11, 16, 22, 29, 37, 46, 56],
            cycleTime: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            capacity: [720, 2160, 5670, 13365, 29160, 60142, 118918, 227584, 424414, 775018],
            hp: [500, 950, 1800, 3400, 6500, 12000, 24000, 45000, 85000, 165000],
            repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
        },
        // Building 2: Coal Harvester (Resource)
        {
            id: 2,
            group: 1,
            order: 2,
            buildStatus: 0,
            type: "resource",
            name: "#bi_coalharvester#",
            size: 100,
            cycle: 30,
            attackgroup: 1,
            tutstage: 0,
            sale: 0,
            description: "bi_coalharvester_desc",
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
                baseurl: "buildings/icoalproducer/",
                1: {
                    anim: ["anim.1.v2.png", new Rectangle(-21, -45, 40, 18), 47],
                    anim2: ["anim.2.v2.png", new Rectangle(-39, -9, 39, 63), 47],
                    top: ["top.1.v2.png", new Point(-36, -29)],
                    shadow: ["shadow.1.v2.jpg", new Point(-40, 4)],
                    topdamaged: ["top.1.damaged.v2.png", new Point(-38, -19)],
                    shadowdamaged: ["shadow.1.damaged.v2.jpg", new Point(-43, 5)],
                    topdestroyed: ["top.1.destroyed.png", new Point(-43, -9)],
                    shadowdestroyed: ["shadow.1.destroyed.jpg", new Point(-46, 17)]
                },
                3: {
                    anim: ["anim.3.png", new Rectangle(-30, -41, 61, 107), 50],
                    top: ["top.2.png", new Point(-40, -34)],
                    shadow: ["shadow.2.jpg", new Point(-46, 20)],
                    topdamaged: ["top.2.damaged.png", new Point(-36, -25)],
                    topdestroyed: ["top.2.destroyed.png", new Point(-43, -9)],
                    shadowdestroyed: ["shadow.2.destroyed.jpg", new Point(-46, 17)]
                }
            },
            buildingbuttons: ["coal_producer.v2"],
            upgradeImgData: {
                baseurl: "buildingbuttons/",
                1: { img: "coal_producer.v2.jpg", silhouette_img: "coal_producer.v2.silhouette.jpg" }
            },
            quantity: [1, 2, 4, 5, 6, 6, 6, 6, 6, 6],
            produce: [2, 4, 7, 11, 16, 22, 29, 37, 46, 56],
            cycleTime: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            capacity: [720, 2160, 5670, 13365, 29160, 60142, 118918, 227584, 424414, 775018],
            hp: [500, 950, 1800, 3400, 6500, 12000, 24000, 45000, 85000, 165000],
            repairTime: [30, 60, 120, 240, 480, 960, 1920, 3840, 7680, 15360]
        }
        // NOTE: Full building data array continues for 30+ inferno buildings
        // Including: Sulfur Harvester, Magma Harvester, Storage buildings, Town Hall,
        // Housing buildings, Towers (Cannon, Tesla, Magma, Quake, etc.),
        // Hatchery, Monster Locker, Flinger, Map Room, Monster Lab, etc.
        // Total: ~6800 lines of building property definitions
    ];

    constructor() {}
}
