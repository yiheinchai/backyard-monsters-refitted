import { ISFSArray } from "../data/ISFSArray";
import { SFSArray } from "../data/SFSArray";
import { IMatcher } from "./IMatcher";
import { LogicOperator } from "./LogicOperator";

/**
 * MatchExpression - Chainable match expression for filtering.
 */
export class MatchExpression {
    private _varName: string;
    private _condition: IMatcher;
    private _value: any;
    public _logicOp: LogicOperator | null = null;
    public _parent: MatchExpression | null = null;
    public _next: MatchExpression | null = null;

    constructor(varName: string, condition: IMatcher, value: any) {
        this._varName = varName;
        this._condition = condition;
        this._value = value;
    }

    public static chainedMatchExpression(varName: string, condition: IMatcher, value: any, 
            logicOp: LogicOperator, parent: MatchExpression): MatchExpression {
        const expr = new MatchExpression(varName, condition, value);
        expr._logicOp = logicOp;
        expr._parent = parent;
        return expr;
    }

    public and(varName: string, condition: IMatcher, value: any): MatchExpression {
        this._next = MatchExpression.chainedMatchExpression(varName, condition, value, LogicOperator.AND, this);
        return this._next;
    }

    public or(varName: string, condition: IMatcher, value: any): MatchExpression {
        this._next = MatchExpression.chainedMatchExpression(varName, condition, value, LogicOperator.OR, this);
        return this._next;
    }

    public get varName(): string {
        return this._varName;
    }

    public get condition(): IMatcher {
        return this._condition;
    }

    public get value(): any {
        return this._value;
    }

    public get logicOp(): LogicOperator | null {
        return this._logicOp;
    }

    public hasNext(): boolean {
        return this._next !== null;
    }

    public get next(): MatchExpression | null {
        return this._next;
    }

    public rewind(): MatchExpression {
        let expr: MatchExpression = this;
        while (expr._parent !== null) {
            expr = expr._parent;
        }
        return expr;
    }

    public asString(): string {
        let result = "";
        if (this._logicOp !== null) {
            result += " " + this.logicOp!.id + " ";
        }
        result += "(";
        result += this._varName + " " + this._condition.symbol + " " + 
            (typeof this.value === 'string' ? "'" + this.value + "'" : this.value);
        return result + ")";
    }

    public toString(): string {
        let expr = this.rewind();
        let result = expr.asString();
        while (expr.hasNext()) {
            expr = expr.next!;
            result += expr.asString();
        }
        return result;
    }

    public toSFSArray(): ISFSArray {
        let expr = this.rewind();
        const arr: ISFSArray = new SFSArray();
        arr.addSFSArray(expr.expressionAsSFSArray());
        while (expr.hasNext()) {
            expr = expr.next!;
            arr.addSFSArray(expr.expressionAsSFSArray());
        }
        return arr;
    }

    private expressionAsSFSArray(): ISFSArray {
        const arr: ISFSArray = new SFSArray();
        if (this._logicOp !== null) {
            arr.addUtfString(this._logicOp.id);
        } else {
            arr.addNull();
        }
        arr.addUtfString(this._varName);
        arr.addByte(this._condition.type);
        arr.addUtfString(this._condition.symbol);
        if (this._condition.type === 0) {
            arr.addBool(this._value);
        } else if (this._condition.type === 1) {
            arr.addDouble(this._value);
        } else {
            arr.addUtfString(this._value);
        }
        return arr;
    }
}
