import { ByteArray } from "openfl/utils/ByteArray";

/**
 * IHash - Interface for cryptographic hash functions.
 */
export interface IHash {
    toString(): string;
    getHashSize(): number;
    getInputSize(): number;
    hash(data: ByteArray): ByteArray;
}
