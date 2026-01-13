/**
 * LogicOperator - Logical operators for match expressions.
 */
export class LogicOperator {
    public static readonly AND: LogicOperator = new LogicOperator("AND");
    public static readonly OR: LogicOperator = new LogicOperator("OR");

    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    public get id(): string {
        return this._id;
    }
}
