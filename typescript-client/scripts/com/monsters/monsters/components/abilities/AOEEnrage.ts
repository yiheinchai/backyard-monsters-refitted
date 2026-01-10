import Point from "openfl/geom/Point";

import { MonsterBase } from "../../MonsterBase";
import { Component } from "../Component";
import { Enrage } from "./Enrage";
import { Targeting } from "../../Targeting";

/**
 * AOE Enrage - enrages nearby friendly units, boosting speed and armor.
 */
export class AOEEnrage extends Component {
    private m_radius: number;
    private m_duration: number;
    private m_speedMultiplier: number;
    private m_armorMultiplier: number;
    private m_enragedFriends: Array<MonsterBase>;
    private m_targetFlags: number = 0;
    private m_rangeCheckCounter: number = 0;
    private static readonly RANGE_CHECK_INTERVAL: number = 30;

    constructor(radius: number, speedMultiplier: number, armorMultiplier: number, duration: number = 0) {
        super();
        this.m_radius = radius;
        this.m_duration = duration;
        this.m_speedMultiplier = speedMultiplier;
        this.m_armorMultiplier = armorMultiplier;
        this.m_enragedFriends = [];
    }

    protected override onRegister(): void {
        this.m_targetFlags = Targeting.getFriendlyFlag(this.owner) | Targeting.k_TARGETS_GROUND | Targeting.k_TARGETS_FLYING | Targeting.k_TARGETS_INVISIBLE;
    }

    protected override onUnregister(): void {
        this.removeEnrageFromOutOfRangeFriendlies();
    }

    private getFriendliesInRange(): Array<MonsterBase> {
        const targets: Array<any> = Targeting.getTargetsInRange(this.m_radius, new Point(this.owner.x, this.owner.y), this.m_targetFlags);
        const friendlies: Array<MonsterBase> = [];
        for (let i = 0; i < targets.length; i++) {
            const creep = targets[i].creep;
            if (creep instanceof MonsterBase && creep !== this.owner) {
                friendlies.push(creep as MonsterBase);
            }
        }
        return friendlies;
    }

    public override tick(delta: number = 1): void {
        // Only check range every 30 ticks instead of every tick
        // This reduces expensive range calculations from 60fps to 2fps with no gameplay impact
        this.m_rangeCheckCounter += delta;

        if (this.m_rangeCheckCounter >= AOEEnrage.RANGE_CHECK_INTERVAL) {
            this.m_rangeCheckCounter = 0;

            const friendlies: Array<MonsterBase> = this.getFriendliesInRange();
            if (this.owner.inBattleState) {
                this.addEnrageToFriendliesInRange(friendlies);
                this.removeEnrageFromOutOfRangeFriendlies(friendlies);
            } else {
                this.removeEnrageFromOutOfRangeFriendlies();
            }
        }
    }

    private addEnrageToFriendliesInRange(friendlies: Array<MonsterBase>): void {
        for (let i = 0; i < friendlies.length; i++) {
            const friend: MonsterBase = friendlies[i];
            const component: Component | null = friend.getComponentByName(this.name);
            if (!component) {
                friend.addComponent(new Enrage(this.m_speedMultiplier, this.m_armorMultiplier, this.owner._creatureID), this.name);
                this.m_enragedFriends.push(friend);
            }
        }
    }

    private removeEnrageFromOutOfRangeFriendlies(inRangeFriends: Array<MonsterBase> | null = null): void {
        if (!inRangeFriends) {
            inRangeFriends = [];
        }
        for (let i = 0; i < this.m_enragedFriends.length; i++) {
            const friend: MonsterBase = this.m_enragedFriends[i];
            const component: Component | null = friend.getComponentByName(this.name);
            if (Boolean(component) && inRangeFriends.indexOf(friend) < 0) {
                friend.removeComponent(component!);
                this.m_enragedFriends.splice(i, 1);
                i--;
            }
        }
    }
}
