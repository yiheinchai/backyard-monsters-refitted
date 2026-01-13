import { User } from "../User";
import { ISFSObject } from "../data/ISFSObject";
import { Invitation } from "./Invitation";

/**
 * SFSInvitation - Implementation of the Invitation interface.
 */
export class SFSInvitation implements Invitation {
    protected _id: number = 0;
    protected _inviter: User;
    protected _invitee: User;
    protected _secondsForAnswer: number;
    protected _params: ISFSObject | null;

    constructor(inviter: User, invitee: User, secondsForAnswer: number = 15, params: ISFSObject | null = null) {
        this._inviter = inviter;
        this._invitee = invitee;
        this._secondsForAnswer = secondsForAnswer;
        this._params = params;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get inviter(): User {
        return this._inviter;
    }

    public get invitee(): User {
        return this._invitee;
    }

    public get secondsForAnswer(): number {
        return this._secondsForAnswer;
    }

    public get params(): ISFSObject {
        return this._params!;
    }
}
