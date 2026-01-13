/**
 * MetaDataArgument - Represents a key-value argument in metadata.
 */
export class MetaDataArgument {
    public value: string;
    public key: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}
