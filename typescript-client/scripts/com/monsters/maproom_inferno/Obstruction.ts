import Rectangle from "openfl/geom/Rectangle";

/**
 * Obstruction (Inferno) - manages blocked areas on the inferno map room.
 */
export class Obstruction {
    public static Obstructions: Array<Rectangle> = [];
    public static Reserved: Array<Rectangle> = [
        new Rectangle(196, 771, 209, 184),
        new Rectangle(605, 478, 186, 174),
        new Rectangle(917, 1137, 191, 162),
        new Rectangle(1238, 1084, 198, 174)
    ];
    public static Slots: Array<Rectangle> = [
        new Rectangle(350, 320, 160, 160),
        new Rectangle(170, 610, 160, 160),
        new Rectangle(670, 540, 160, 160),
        new Rectangle(145, 890, 160, 160),
        new Rectangle(570, 1000, 160, 160),
        new Rectangle(1060, 340, 160, 160),
        new Rectangle(1400, 1000, 160, 160),
        new Rectangle(1100, 600, 160, 160),
        new Rectangle(1500, 580, 160, 160),
        new Rectangle(1220, 800, 160, 160)
    ];

    constructor() {
    }

    public static Clear(): void {
        Obstruction.Obstructions = [];
    }

    public static pointIsBlocked(x: number, y: number): boolean {
        for (const rect of Obstruction.Obstructions) {
            if (x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height) {
                return true;
            }
        }
        return false;
    }

    public static Register(rect: Rectangle, reserved: boolean = false): void {
        Obstruction.Obstructions.push(rect);
        if (reserved) {
            Obstruction.Reserved.push(rect);
        }
    }
}
