/**
 * Wave object - defines a wave of monsters for invasion events.
 */
export class WaveObj {
    public static readonly DIR: Record<string, number> = {
        "N": 270,
        "S": 90,
        "E": 0,
        "W": 180
    };

    public creatureID: string;
    public behavior: string;
    public numCreep: number;
    public direction: number;
    public level: number;
    public powerLevel: number;
    public cameraFocus: boolean;

    constructor(
        creatureID: string,
        behavior: string,
        numCreep: number,
        direction: number,
        level: number = 0,
        powerLevel: number = 0,
        cameraFocus: boolean = false
    ) {
        this.creatureID = creatureID;
        this.behavior = behavior;
        this.numCreep = numCreep;
        this.direction = direction;
        this.level = level;
        this.powerLevel = powerLevel;
        this.cameraFocus = cameraFocus;
    }
}
