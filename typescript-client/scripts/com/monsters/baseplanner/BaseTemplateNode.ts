import { IExportable } from "../interfaces/IExportable";

/**
 * Base template node - represents a single building position in a base template.
 */
export class BaseTemplateNode implements IExportable {
    public x: number;
    public y: number;
    public id: number;
    public type: number;

    constructor(x: number = 0, y: number = 0, id: number = 0, type: number = 0) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.type = type;
    }

    public exportData(): any {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            type: this.type
        };
    }

    public importData(data: any): void {
        this.x = data.x;
        this.y = data.y;
        this.id = data.id;
        this.type = data.type;
    }
}
