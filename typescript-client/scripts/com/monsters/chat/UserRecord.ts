/**
 * User record for chat system - holds user ID and name.
 */
export class UserRecord {
    private name: string;
    private id: string;

    constructor(id: string, name: string | null = null) {
        this.name = name || "";
        this.id = id;
    }

    public get Name(): string {
        return this.name;
    }

    public get Id(): string {
        return this.id;
    }
}
