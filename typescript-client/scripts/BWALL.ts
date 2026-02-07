import Rectangle from 'openfl/geom/Rectangle';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getPATHING(): any { return require("./com/monsters/pathing/PATHING").PATHING; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }


/**
 * BWALL - Wall building class
 * Extends BFOUNDATION for wall defense buildings
 */
export class BWALL extends BFOUNDATION {
    constructor() {
        super();
    }

    public override GridCost(add: boolean = true): void {
        super.GridCost(add);
        getPATHING().RegisterBuilding(new Rectangle(this._mc!.x, this._mc!.y, 20, 20), this, add);
    }

    public override Description(): void {
        super.Description();
        if (this._lvl.Get() < this._buildingProps.hp.length) {
            const currentHp: number = this._buildingProps.hp[this._lvl.Get() - 1];
            const nextHp: number = this._buildingProps.hp[this._lvl.Get()];
            this._upgradeDescription = getKEYS().Get("building_wall_upgrade", {
                v1: getGLOBAL().FormatNumber(currentHp),
                v2: getGLOBAL().FormatNumber(nextHp),
                v3: Math.floor(100 / currentHp * nextHp) - 100
            });
        }
    }

    public override RecycleC(): void {
        getPATHING().RegisterBuilding(new Rectangle(this._mc!.x, this._mc!.y, 20, 20), this, false);
        super.RecycleC();
    }
}
