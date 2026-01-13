import { SmartFox } from "../SmartFox";
import { MatchExpression } from "../entities/match/MatchExpression";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * FindRoomsRequest - Request to find rooms matching criteria.
 */
export class FindRoomsRequest extends BaseRequest {
    public static readonly KEY_EXPRESSION: string = "e";
    public static readonly KEY_GROUP: string = "g";
    public static readonly KEY_LIMIT: string = "l";
    public static readonly KEY_FILTERED_ROOMS: string = "fr";

    private _matchExpr: MatchExpression;
    private _groupId: string | null;
    private _limit: number;

    constructor(matchExpr: MatchExpression, groupId: string | null = null, limit: number = 0) {
        super(BaseRequest.FindRooms);
        this._matchExpr = matchExpr;
        this._groupId = groupId;
        this._limit = limit;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._matchExpr === null) {
            errors.push("Missing Match Expression");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("FindRooms request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putSFSArray(FindRoomsRequest.KEY_EXPRESSION, this._matchExpr.toSFSArray());
        if (this._groupId !== null) {
            this._sfso.putUtfString(FindRoomsRequest.KEY_GROUP, this._groupId);
        }
        if (this._limit > 0) {
            this._sfso.putShort(FindRoomsRequest.KEY_LIMIT, this._limit);
        }
    }
}
