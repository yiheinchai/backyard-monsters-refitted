

// Lazy imports to break circular dependency chains
function getINFERNOPORTAL(): any { return require("./INFERNOPORTAL").INFERNOPORTAL; }
function getBASE(): any { return require("./BASE").BASE; }
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }

export class INFERNO_PORTAL_ATTACK {
    constructor() {
        // Empty constructor
    }

    public static GetVariableCreeps(): Array<any> {
        const _loc1_: number = 186;
        let _loc2_: number = getINFERNOPORTAL().building._lvl.Get() - 1;
        const _loc3_: number = Number(getBASE().BaseLevel().level);
        let _loc4_: number = (_loc3_ - 30) / 16 + 0.25;
        if (_loc2_ < 0) {
            _loc2_ = 0;
        }
        if (_loc2_ > 4) {
            _loc2_ = 4;
        }
        if (_loc3_ <= 30) {
            _loc4_ = _loc3_ / 60 - 0.25;
            if (_loc4_ < 0.01) {
                _loc4_ = 0.01;
            }
        } else {
            if (_loc4_ < 0.25) {
                _loc4_ = 0.25;
            }
            if (_loc4_ > 1) {
                _loc4_ = 1;
            }
        }
        const _loc5_: Array<Array<any>> = [
            [
                ["IC1", "bounce", Math.ceil(_loc4_ * 25), 400, _loc1_, 0, 0],
                ["IC1", "bounce", Math.ceil(_loc4_ * 25), 400, _loc1_, 0, 0],
                ["IC2", "bounce", Math.floor(_loc4_ * 50), 500, _loc1_, 0, 1],
                ["IC3", "bounce", Math.floor(_loc4_ * 15), 300, _loc1_, 0, 0]
            ],
            [
                ["IC1", "bounce", Math.ceil(_loc4_ * 45), 400, _loc1_, 0, 0],
                ["IC2", "bounce", Math.ceil(_loc4_ * 60), 500, _loc1_, 0, 0],
                ["IC3", "bounce", Math.floor(_loc4_ * 25), 300, _loc1_, 0, 1],
                ["IC5", "bounce", Math.floor(_loc4_ * 10), 500, _loc1_, 0, 0]
            ],
            [
                ["IC1", "bounce", Math.ceil(_loc4_ * 65), 400, _loc1_, 0, 0],
                ["IC2", "bounce", Math.ceil(_loc4_ * 60), 500, _loc1_, 0, 1],
                ["IC7", "bounce", Math.floor(_loc4_ * 15), 300, _loc1_, 0, 0],
                ["IC5", "bounce", Math.floor(_loc4_ * 15), 400, _loc1_, 0, 0],
                ["IC4", "bounce", Math.ceil(_loc4_ * 10), 600, _loc1_, 0, 0]
            ],
            [
                ["IC2", "bounce", Math.ceil(_loc4_ * 65), 500, _loc1_, 0, 1],
                ["IC6", "bounce", Math.floor(_loc4_ * 30), 300, _loc1_, 0, 0],
                ["IC3", "bounce", Math.ceil(_loc4_ * 40), 500, _loc1_, 0, 0],
                ["IC5", "bounce", Math.floor(_loc4_ * 20), 500, _loc1_, 0, 0],
                ["IC7", "bounce", Math.floor(_loc4_ * 20), 350, _loc1_, 0, 0]
            ],
            [
                ["IC2", "bounce", Math.ceil(_loc4_ * 70), 600, _loc1_, 0, 1],
                ["IC7", "bounce", Math.floor(_loc4_ * 30), 300, _loc1_, 0, 1],
                ["IC5", "bounce", Math.ceil(_loc4_ * 20), 500, _loc1_, 0, 0],
                ["IC6", "bounce", Math.ceil(_loc4_ * 30), 300, _loc1_, 0, 0],
                ["IC8", "bounce", Math.floor(_loc4_ * 25), 700, _loc1_, 0, 0]
            ]
        ];
        const _loc6_: Array<any> = [];
        let _loc7_: number = 0;
        while (_loc7_ < _loc5_[_loc2_].length) {
            if (_loc5_[_loc2_][_loc7_][2] > 0) {
                _loc6_.push(_loc5_[_loc2_][_loc7_]);
            }
            _loc7_++;
        }
        return _loc6_;
    }

    public static SpawnAttack(): void {
        getWMATTACK()._isAI = false;
        getWMATTACK().AttackB();
        getWMATTACK().SpawnA(INFERNO_PORTAL_ATTACK.GetVariableCreeps());
    }
}
