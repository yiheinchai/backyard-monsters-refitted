/**
 * TweenInfo - Stores information about a single tweening property.
 */
export class TweenInfo {
    public target: any;
    public property: string;
    public start: number;
    public change: number;
    public name: string;
    public isPlugin: boolean;

    constructor(target: any, property: string, start: number, change: number, name: string, isPlugin: boolean) {
        this.target = target;
        this.property = property;
        this.start = start;
        this.change = change;
        this.name = name;
        this.isPlugin = isPlugin;
    }
}
