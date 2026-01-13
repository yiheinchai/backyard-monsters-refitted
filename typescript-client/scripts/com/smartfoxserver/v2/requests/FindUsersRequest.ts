import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { MatchExpression } from "../entities/match/MatchExpression";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { Logger } from "../logging/Logger";
import { BaseRequest } from "./BaseRequest";

/**
 * FindUsersRequest - Request to find users matching criteria.
 */
export class FindUsersRequest extends BaseRequest {
    public static readonly KEY_EXPRESSION: string = "e";
    public static readonly KEY_GROUP: string = "g";
    public static readonly KEY_ROOM: string = "r";
    public static readonly KEY_LIMIT: string = "l";
    public static readonly KEY_FILTERED_USERS: string = "fu";

    private _matchExpr: MatchExpression;
    private _target: any;
    private _limit: number;

    constructor(matchExpr: MatchExpression, target: any = null, limit: number = 0) {
        super(BaseRequest.FindUsers);
        this._matchExpr = matchExpr;
        this._target = target;
        this._limit = limit;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._matchExpr === null) {
            errors.push("Missing Match Expression");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("FindUsers request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putSFSArray(FindUsersRequest.KEY_EXPRESSION, this._matchExpr.toSFSArray());
        if (this._target !== null) {
            if (this._target instanceof Object && 'id' in this._target) {
                // Assuming it's a Room
                this._sfso.putInt(FindUsersRequest.KEY_ROOM, (this._target as Room).id);
            } else if (typeof this._target === 'string') {
                this._sfso.putUtfString(FindUsersRequest.KEY_GROUP, this._target);
            } else {
                Logger.getInstance().warn("Unsupport target type for FindUsersRequest: " + this._target);
            }
        }
        if (this._limit > 0) {
            this._sfso.putShort(FindUsersRequest.KEY_LIMIT, this._limit);
        }
    }
}
