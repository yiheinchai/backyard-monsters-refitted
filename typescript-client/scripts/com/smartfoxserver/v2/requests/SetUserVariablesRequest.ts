import { SmartFox } from "../SmartFox";
import { ISFSArray } from "../entities/data/ISFSArray";
import { SFSArray } from "../entities/data/SFSArray";
import { UserVariable } from "../entities/variables/UserVariable";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { BaseRequest } from "./BaseRequest";

/**
 * SetUserVariablesRequest - Request to set user variables.
 */
export class SetUserVariablesRequest extends BaseRequest {
    public static readonly KEY_USER: string = "u";
    public static readonly KEY_VAR_LIST: string = "vl";

    private _userVariables: Array<UserVariable>;

    constructor(userVariables: Array<UserVariable>) {
        super(BaseRequest.SetUserVariables);
        this._userVariables = userVariables;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._userVariables === null || this._userVariables.length === 0) {
            errors.push("No variables were specified");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("SetUserVariables request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        const varList: ISFSArray = SFSArray.newInstance();
        for (const uVar of this._userVariables) {
            varList.addSFSArray(uVar.toSFSArray());
        }
        this._sfso.putSFSArray(SetUserVariablesRequest.KEY_VAR_LIST, varList);
    }
}
