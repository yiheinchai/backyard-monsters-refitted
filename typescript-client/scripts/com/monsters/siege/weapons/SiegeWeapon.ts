import { SecNum } from "../../../cc/utils/SecNum";
import { SiegeWeaponProperty } from "../SiegeWeaponProperty";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getSTORE(): any { return require("../../../../STORE").STORE; }



/**
 * SiegeWeapon - base class for siege weapons.
 */
export class SiegeWeapon {
    public static readonly RANGE: string = "siegeWeaponRange";
    public static readonly UPGRADE_COSTS: string = "siegeWeaponUpgradeCosts";
    public static readonly BUILD_COSTS: string = "siegeWeaponBuildCosts";
    public static readonly DURATION: string = "siegeWeaponDuration";
    public static readonly DURABILITY: string = "siegeWeaponDurability";
    public static readonly MAX_LEVEL: number = 10;

    private static readonly _IMAGE_FOLDER_URL: string = "siegebuttons/";
    private static readonly _ICON_FOLDER_URL: string = "popups/";
    private static readonly _STREAMPOST_FOLDER_URL: string = "quests/";

    public weaponID: string = "";
    public name: string = "";
    public icon: string = "";
    public image: string = "";
    public video: string = "";
    public videopreview: string = "";
    public description: string = "";
    public tooltip: string = "";
    public dropTarget: number = 0;
    public canUseInOutposts: boolean = true;

    protected _quantity: SecNum;
    protected _level: SecNum;
    private _properties: Record<string, SiegeWeaponProperty> = {};

    constructor() {
        this._quantity = new SecNum(0);
        this._level = new SecNum(0);
        this._properties = {};
        this.image = SiegeWeapon._IMAGE_FOLDER_URL + this.weaponID + ".png";
        this.icon = SiegeWeapon._ICON_FOLDER_URL + "siege_icon_" + this.weaponID + ".png";
        this.video = "assets/videos/" + this.weaponID + "400x175.flv";
        this.videopreview = "videos/" + this.weaponID + "_preview" + ".png";
        this.name = getKEYS().Get("#w_" + this.weaponID + "#");
        this.description = getKEYS().Get("w_" + this.weaponID + "desc");
        this.tooltip = getKEYS().Get("w_" + this.weaponID + "_tooltip");
        this.quantity = 0;
    }

    public canFire(): boolean {
        return getGLOBAL().isInAttackMode;
    }

    public get buildCosts(): Record<string, any> {
        return this.getProperty(SiegeWeapon.BUILD_COSTS).getValueForLevel(this.level);
    }

    public get upgradeCosts(): Record<string, any> {
        return this.getProperty(SiegeWeapon.UPGRADE_COSTS).getValueForLevel(this.level + 1);
    }

    public get level(): number {
        return Math.min(SiegeWeapon.MAX_LEVEL, this._level.Get());
    }

    public set level(value: number) {
        this._level.Set(Math.min(SiegeWeapon.MAX_LEVEL, value));
    }

    public get quantity(): number {
        return this._quantity.Get();
    }

    public set quantity(value: number) {
        this._quantity.Set(value);
    }

    public get instantUpgradeCost(): number {
        return getSTORE().GetInstantBuyCost(this.upgradeCosts);
    }

    public get instantBuildCost(): number {
        return getSTORE().GetInstantBuyCost(this.buildCosts);
    }

    public get logMessage(): string {
        return getKEYS().Get("attack_log_siege", { "v1": this.level, "v2": this.name });
    }

    public get warnPopupImage(): string {
        return "siegebuild_" + this.weaponID + ".png";
    }

    public get streamImage(): string {
        return SiegeWeapon._STREAMPOST_FOLDER_URL + "siege_" + this.weaponID + "_stream" + ".png";
    }

    public get rewardImage(): string {
        return "siegebuttons/" + this.weaponID + "_tiny.png";
    }

    public importVariables(data: Record<string, any>): void {
        this.level = data["level"];
        this.quantity = data["quantity"];
    }

    public exportVariables(): Record<string, any> {
        return { "level": Math.min(SiegeWeapon.MAX_LEVEL, this.level), "quantity": this.quantity };
    }

    public onActivation(x: number, y: number): void {
    }

    public onDeactivation(): void {
    }

    public get range(): number {
        return this.getProperty(SiegeWeapon.RANGE).getValueForLevel(this.level);
    }

    public get duration(): number {
        return this.getProperty(SiegeWeapon.DURATION).getValueForLevel(this.level);
    }

    public getProperties(): Array<SiegeWeaponProperty> {
        const result: Array<SiegeWeaponProperty> = [];
        for (const key in this._properties) {
            const prop = this._properties[key];
            if (prop.order) {
                result.push(prop);
            }
        }
        return result.sort(this.sortOnOrder.bind(this));
    }

    private sortOnOrder(a: SiegeWeaponProperty, b: SiegeWeaponProperty): number {
        return a.order - b.order;
    }

    public addProperty(name: string, prop: SiegeWeaponProperty): void {
        this._properties[name] = prop;
        if (prop.order) {
            prop.label = getKEYS().Get("label_" + this.weaponID + "_stat" + prop.order);
            prop.descriptionKey = this.weaponID + "_stat" + prop.order;
        }
    }

    public getProperty(name: string): SiegeWeaponProperty {
        return this._properties[name];
    }

    public activate(x: number, y: number): boolean {
        this.onActivation(x, y);
        return true;
    }

    public deactivate(): void {
        this.onDeactivation();
    }

    public get hasCapacityToUpgrade(): boolean {
        for (let i = 1; i < 5; i++) {
            if (getBASE()._iresources["r" + i + "max"] < this.upgradeCosts["r" + i]) {
                return false;
            }
        }
        return true;
    }

    public get hasCapacityToBuild(): boolean {
        for (let i = 1; i < 5; i++) {
            if (getBASE()._iresources["r" + i + "max"] < this.buildCosts["r" + i]) {
                return false;
            }
        }
        return true;
    }

    public get hasResourcesToUpgrade(): boolean {
        return this.numResourcesToUpgradeNeeded <= 0;
    }

    public get hasResourcesToBuild(): boolean {
        return this.numResourcesToBuildNeeded <= 0;
    }

    public get numResourcesToUpgradeNeeded(): number {
        let total = 0;
        for (let i = 1; i < 5; i++) {
            total += Math.max(this.upgradeCosts["r" + i] - getBASE()._iresources["r" + i].Get(), 0);
        }
        return total;
    }

    public get numResourcesToBuildNeeded(): number {
        let total = 0;
        for (let i = 1; i < 5; i++) {
            total += Math.max(this.buildCosts["r" + i] - getBASE()._iresources["r" + i].Get(), 0);
        }
        return total;
    }

    public get numResourcesToUpgradeTotal(): number {
        let total = 0;
        for (let i = 1; i < 5; i++) {
            if (this.upgradeCosts["r" + i] > 0) {
                total += this.upgradeCosts["r" + i];
            }
        }
        return total;
    }

    public get numResourcesToBuildTotal(): number {
        let total = 0;
        for (let i = 1; i < 5; i++) {
            if (this.buildCosts["r" + i] > 0) {
                total += this.buildCosts["r" + i];
            }
        }
        return total;
    }

    public get instantBuildResourceCost(): number {
        const needed: Record<string, number> = {};
        for (let i = 1; i < 5; i++) {
            needed["r" + i] = Math.max(this.buildCosts["r" + i] - getBASE()._iresources["r" + i].Get(), 0);
        }
        return getSTORE().GetInstantBuyCost(needed);
    }

    public get instantUpgradeResourceCost(): number {
        const needed: Record<string, number> = {};
        for (let i = 1; i < 5; i++) {
            needed["r" + i] = Math.max(this.upgradeCosts["r" + i] - getBASE()._iresources["r" + i].Get(), 0);
        }
        return getSTORE().GetInstantBuyCost(needed);
    }

    public buyResourcesAndUpgrade(): void {
        const cost = this.instantUpgradeResourceCost;
        getBASE().Fund(1, Math.max(this.upgradeCosts.r1 - getBASE()._iresources.r1, 0), false, null, true);
        getBASE().Fund(2, Math.max(this.upgradeCosts.r2 - getBASE()._iresources.r2, 0), false, null, true);
        getBASE().Fund(3, Math.max(this.upgradeCosts.r3 - getBASE()._iresources.r3, 0), false, null, true);
        getBASE().Fund(4, Math.max(this.upgradeCosts.r4 - getBASE()._iresources.r4, 0), false, null, true);
        getGLOBAL()._bSiegeLab.StartUpgradingWeapon(this.weaponID);
        getBASE().Purchase("BRAU", cost, "building");
    }

    public buyResourcesAndBuild(): void {
        const cost = this.instantBuildResourceCost;
        getBASE().Fund(1, Math.max(this.buildCosts.r1 - getBASE()._iresources.r1, 0), false, null, true);
        getBASE().Fund(2, Math.max(this.buildCosts.r2 - getBASE()._iresources.r2, 0), false, null, true);
        getBASE().Fund(3, Math.max(this.buildCosts.r3 - getBASE()._iresources.r3, 0), false, null, true);
        getBASE().Fund(4, Math.max(this.buildCosts.r4 - getBASE()._iresources.r4, 0), false, null, true);
        getGLOBAL()._bSiegeFactory.StartUpgradingWeapon(this.weaponID);
        getBASE().Purchase("BRAB", cost, "building");
    }
}
