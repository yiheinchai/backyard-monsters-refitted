import { IMetaDataContainer } from "./IMetaDataContainer";
import { MetaData } from "./MetaData";

/**
 * MetaDataContainer - Base implementation of IMetaDataContainer.
 */
export class MetaDataContainer implements IMetaDataContainer {
    private _metaData: Array<MetaData>;

    constructor(metaData: Array<MetaData> | null = null) {
        this._metaData = metaData === null ? [] : metaData;
    }

    public addMetaData(metaData: MetaData): void {
        this._metaData.push(metaData);
    }

    public getMetaData(name: string): Array<MetaData> {
        const result: Array<MetaData> = [];
        for (const md of this._metaData) {
            if (md.name === name) {
                result.push(md);
            }
        }
        return result;
    }

    public get metaData(): Array<MetaData> {
        return [...this._metaData];
    }

    public hasMetaData(name: string): boolean {
        return this.getMetaData(name).length > 0;
    }
}
