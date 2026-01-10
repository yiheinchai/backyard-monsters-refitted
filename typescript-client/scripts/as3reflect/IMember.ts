import { IMetaDataContainer } from "./IMetaDataContainer";
import { Type } from "./Type";

/**
 * IMember - Interface for class members (methods, properties, etc.).
 */
export interface IMember extends IMetaDataContainer {
    get declaringType(): Type;
    get type(): Type;
    get name(): string;
}
