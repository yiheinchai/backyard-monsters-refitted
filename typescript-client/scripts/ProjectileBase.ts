import { MovieClip } from 'openfl/display/MovieClip';
import { EventDispatcher } from 'openfl/events/EventDispatcher';
import { IEventDispatcher } from 'openfl/events/IEventDispatcher';
import { Point } from 'openfl/geom/Point';
import { ITargetable } from './com/monsters/interfaces/ITargetable';
import { IAttackable } from './com/monsters/interfaces/IAttackable';

export class ProjectileBase extends EventDispatcher implements ITargetable {
    public _startPoint: Point;
    public _targetPoint: Point;
    public _speed: number;
    public _yd: number;
    public _xd: number;
    public _newX: number;
    public _newY: number;
    public _damage: number;
    public _splash: number;
    public _maxSpeed: number;
    public _graphic: MovieClip;
    public _rotation: number;
    public _targetRotation: number;
    public _rotationDifference: number;
    public _rotationChange: number;
    public _rotationEasing: number;
    public _startDistance: number;
    public _distance: number;
    public _targetType: number;
    public _tmpX: number;
    public _tmpY: number;
    public _xChange: number;
    public _yChange: number;
    public _id: number;
    public _frameNumber: number = 4;
    public _glaves: number = 0;
    public _source: IAttackable;

    constructor(param1: IEventDispatcher = null) {
        super(param1);
    }

    public get x(): number {
        return this._graphic.x;
    }

    public get y(): number {
        return this._graphic.y;
    }

    public get defenseFlags(): number {
        return 0;
    }
}
