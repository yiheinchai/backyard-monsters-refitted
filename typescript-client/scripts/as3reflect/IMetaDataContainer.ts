import { MetaData } from "./MetaData";

/**
 * IMetaDataContainer - Interface for objects that can contain metadata.
 */
export interface IMetaDataContainer {
    addMetaData(metaData: MetaData): void;
    hasMetaData(name: string): boolean;
    getMetaData(name: string): Array<MetaData>;
    get metaData(): Array<MetaData>;
}
