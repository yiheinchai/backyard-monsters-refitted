import ByteArray from "openfl/utils/ByteArray";
import { ISFSArray } from "../../entities/data/ISFSArray";
import { ISFSObject } from "../../entities/data/ISFSObject";

/**
 * ISFSDataSerializer - Interface for SFS data serialization.
 */
export interface ISFSDataSerializer {
    object2binary(obj: ISFSObject): ByteArray;
    array2binary(arr: ISFSArray): ByteArray;
    binary2object(data: ByteArray): ISFSObject;
    binary2array(data: ByteArray): ISFSArray;
}
