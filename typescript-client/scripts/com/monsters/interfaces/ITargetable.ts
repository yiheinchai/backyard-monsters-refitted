/**
 * Interface for objects that can be targeted in combat.
 */
export interface ITargetable {
    get x(): number;
    get y(): number;
    get defenseFlags(): number;
}
