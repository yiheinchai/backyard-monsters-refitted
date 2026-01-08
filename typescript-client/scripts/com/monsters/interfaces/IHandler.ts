import { IExportable } from "./IExportable";

/**
 * Interface for game system handlers.
 */
export interface IHandler extends IExportable {
    initialize(data?: any): void;
    get name(): string;
}
