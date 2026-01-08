import { Loader } from "openfl/display/Loader";

/**
 * Asset loader with retry logic and priority queue support.
 */
export class Loadable {
    public callbacks: Function[] = [];
    public tries: number = 0;
    public loadState: number = 0;
    public loader: Loader;
    public key: string = "";
    public tryLimit: number = 5;
    public shouldPrepend: boolean = true;
    public priority: number = 0;

    constructor() {
        this.callbacks = [];
        this.tries = 0;
        this.loader = new Loader();
    }

    public toString(): string {
        return "[object Loadable key:" + this.key + ", loadState:" + this.loadState + "]";
    }
}
