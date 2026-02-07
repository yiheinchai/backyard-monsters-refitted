import { BYMDevConfig } from './com/monsters/configs/BYMDevConfig';
import { ImageCache } from './com/monsters/display/ImageCache';
import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { SALESPECIALSPOPUP } from './SALESPECIALSPOPUP';
import { TweenLite } from './gs/TweenLite';

// Lazy imports to break circular dependency chains
function getInventoryManager(): any { return require("./com/monsters/inventory/InventoryManager").InventoryManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBUILDINGOPTIONS(): any { return require("./BUILDINGOPTIONS").BUILDINGOPTIONS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSTORE(): any { return require("./STORE").STORE; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }


/**
 * BUY - Purchase and Payment System
 * Handles in-app purchases, offers, and premium currency transactions
 */
export class BUY {
    public static forceNCP: boolean = false;
    public static cacheNCPAvailable: string = "";

    constructor() {}

    public static Show(event: MouseEvent | null = null): void {
        getLOGGER().Stat([22]);
        getGLOBAL().CallJS("cc.showTopup", [{ type: "fbc", callback: "fbcAdd" }]);
    }

    public static Offers(offerType: string): void {
        switch (offerType) {
            case "daily":
                getGLOBAL().CallJS("cc.showTopup", [{ type: "daily", callback: "fbcOfferDaily" }]);
                break;
            case "earn":
                getGLOBAL().CallJS("cc.showTopup", [{ type: "offers", callback: "fbcOfferEarn" }]);
                break;
        }
    }

    public static FBCAdd(response: string): void {
        const data: any = JSON.parse(response);
        if (!data.status) {
            getLOGGER().Log("err", "FBCAdd " + response);
        }
    }

    public static FBCOfferEarn(response: string): void {
        const data: any = JSON.parse(response);
        if (!data.status) {
            getLOGGER().Log("err", "FBCDailyEarn " + response);
        }
    }

    public static FBCOfferDaily(response: string): void {
        const data: any = JSON.parse(response);
        if (!data.status) {
            getLOGGER().Log("err", "FBCDailyEarn " + response);
        }
    }

    public static FBCNcpCheckEligibility(): boolean {
        if (getGLOBAL()._fbcncp > 0 && getGLOBAL()._flags && getGLOBAL()._flags.fbcncpshow !== -1) {
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && getBASE().isMainYard && getTUTORIAL()._stage > 200 && getGLOBAL()._sessionCount >= 5) {
                if (!getGLOBAL()._flags.viximo && !getGLOBAL()._flags.kongregate) {
                    if (BUY.cacheNCPAvailable) {
                        BUY.FBCNcp(BUY.cacheNCPAvailable);
                    } else {
                        if (BYMDevConfig.instance.USE_CLIENT_WITH_CALLBACK) {
                            getGLOBAL().CallJSWithClient("cc.ncp", "fbcNcp", ["checkEligibility"]);
                        } else {
                            getGLOBAL().CallJS("cc.ncp", ["checkEligibility", "fbcNcp"]);
                        }
                        BUY.FBCNcpUpgradeTimeout();
                    }
                    return true;
                }
            }
        }
        return false;
    }

    public static FBCNcpUpgradeTimeout(): void {
        TweenLite.killDelayedCallsTo(BUY.FBCNcpCancelled);
        TweenLite.delayedCall(5, BUY.FBCNcpCancelled, ["timeout", false]);
    }

    public static FBCNcp(response: string): void {
        console.log("|BUY| - FBCNCP CallBack");
        TweenLite.killDelayedCallsTo(BUY.FBCNcpCancelled);
        if (response === "1" || response === "2") {
            BUY.cacheNCPAvailable = response;
            const mc: any = new (GLOBAL as any).FACEBOOK_NCP_CLIP();
            mc.bYes.buttonMode = true;
            mc.bYes.useHandCursor = true;
            mc.bYes.mouseChildren = false;
            mc.bYes.alpha = 0;
            mc.bYes.addEventListener(MouseEvent.CLICK, BUY.FBCNcp_Click);
            mc.bNo.buttonMode = true;
            mc.bNo.useHandCursor = true;
            mc.bNo.mouseChildren = false;
            mc.bNo.alpha = 0;
            mc.bNo.addEventListener(MouseEvent.CLICK, BUY.FBCNcpCancelled);
            BUY.FBCNcpRender("upgrade", mc.imageHolder);
            getPOPUPS().Push(mc, null, null, "", "", false);
        } else {
            if (response === "0") {
                BUY.cacheNCPAvailable = response;
            }
            getLOGGER().Log("log", "FBCNcp Not Elligible" + response);
            BUY.FBCNcpUpgradeCB();
        }
    }

    public static FBCNcp_Click(event: MouseEvent): void {
        if (BYMDevConfig.instance.USE_CLIENT_WITH_CALLBACK) {
            getGLOBAL().CallJSWithClient("cc.ncp", "fbcNcpConfirm", ["showPaymentDialog"]);
        } else {
            getGLOBAL().CallJS("cc.ncp", ["showPaymentDialog", "fbcNcpConfirm"]);
        }
        getPOPUPS().Next();
    }

    public static FBCNcpConfirm(response: string): void {
        const building: BFOUNDATION = getGLOBAL().townHall;
        if (response === "1") {
            const canUpgrade: any = getBASE().CanUpgrade(building);
            if (canUpgrade.error && !canUpgrade.needResource) {
                getGLOBAL().Message(canUpgrade.errorMessage);
            } else {
                building.Upgraded();
                getBASE().Purchase("NCP", 1, "upgrade");
                BUY.cacheNCPAvailable = "";
            }
        }
    }

    public static FBCNcpCancelled(reason: string = "", sendToJS: boolean = true): void {
        if (sendToJS) {
            if (BYMDevConfig.instance.USE_CLIENT_WITH_CALLBACK) {
                getGLOBAL().CallJSWithClient("cc.ncp", "fbcNcpConfirm", ["showPaymentDialog"]);
            } else {
                getGLOBAL().CallJS("cc.ncp", ["userCancelled"]);
            }
        }
        getPOPUPS().Next();
        BUY.FBCNcpUpgradeCB();
    }

    public static FBCNcpUpgradeCB(): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && !getGLOBAL().isMapOpen()) {
            getGLOBAL()._selectedBuilding = getGLOBAL().townHall;
            getBUILDINGOPTIONS().Show(getGLOBAL().townHall, "upgrade");
        }
    }

    private static FBCNcpRender(mode: string, imageContainer: MovieClip): string {
        const building: BFOUNDATION = getGLOBAL().townHall;
        const buildingProps: any = getGLOBAL()._buildingProps[building._type - 1];
        let img: string = "";

        if (mode === "fortify") {
            let nextFortifyLevel: number = building._fortification.Get() + 1;
            if (nextFortifyLevel > 4) nextFortifyLevel = 4;
            img = "fortifybuttons/fort" + nextFortifyLevel + ".png";
            ImageCache.GetImageWithCallBack(img, (path: string, bmd: BitmapData) => {
                imageContainer.addChild(new Bitmap(bmd));
            });
        } else if (buildingProps.upgradeImgData) {
            const imageDataA: any = buildingProps.upgradeImgData;
            let imageLevel: number = building._lvl.Get() === 0 ? 1 : building._lvl.Get();
            if (imageDataA[imageLevel + 1]) imageLevel++;
            img = buildingProps.upgradeImgData.baseurl + buildingProps.upgradeImgData[imageLevel].img;
            ImageCache.GetImageWithCallBack(img, (path: string, bmd: BitmapData) => {
                imageContainer.addChild(new Bitmap(bmd));
            });
        } else {
            if (buildingProps.buildingbuttons && buildingProps.buildingbuttons.length >= building._lvl.Get()) {
                img = "buildingbuttons/" + buildingProps.buildingbuttons[building._lvl.Get() - 1] + ".jpg";
            } else {
                img = "buildingbuttons/" + building._type + ".jpg";
            }
            ImageCache.GetImageWithCallBack(img, (path: string, bmd: BitmapData) => {
                imageContainer.addChild(new Bitmap(bmd));
            });
        }
        return img;
    }

    public static MidGameOffers(offerType: string): void {
        switch (offerType) {
            case "text":
                getGLOBAL().CallJS("cc.showTopup", [{ type: "fbc", callback: "fbcAdd" }]);
                break;
            case "gift":
                getGLOBAL().CallJS("cc.showTopup", [{ special: "gift", callback: "fbcAdd" }]);
                break;
            case "shinydiscount":
                getGLOBAL().CallJS("cc.showTopup", [{ special: "discount", callback: "fbcAdd" }]);
                break;
            case "shinybonus":
                getGLOBAL().CallJS("cc.showTopup", [{ special: "bonus", callback: "fbcAdd" }]);
                break;
        }
    }

    public static purchaseReceive(response: string): void {
        getPOPUPS().Next();
        const data: any = JSON.parse(response);
        if (data.error === 0) {
            if (getLOGIN().checkHash(response)) {
                BUY.purchaseProcess(data.items);
                BUY.purchaseComplete(response);
                getBASE()._pendingPromo = 1;
                getBASE().Save();
            } else {
                getLOGGER().Log("err", "BUY.purchaseReceive " + response);
            }
        }
    }

    public static purchaseComplete(response: string): void {
        if (response === "biggulp") {
            SALESPECIALSPOPUP.Show("biggulp");
        } else {
            SALESPECIALSPOPUP.EndSale();
            SALESPECIALSPOPUP.Show("giftconfirm");
        }
        getBASE().Save();
    }

    public static startPromo(response: string): void {
        const data: any = JSON.parse(response);
        if (data.endtime) {
            SALESPECIALSPOPUP.StartSale(data.endtime);
        } else {
            getLOGGER().Log("err", "startPromo " + data.endtime);
        }
    }

    public static purchaseProcess(items: any[]): void {
        for (let i = 0; i < items.length; i++) {
            const itemId: string = String(items[i][0]);
            const quantity: number = Number(items[i][1]);
            for (let j = 0; j < quantity; j++) {
                if (itemId === "BIGGULP") {
                    getInventoryManager().buildingStorageAdd(120);
                } else {
                    getSTORE().AddInventory(itemId);
                }
            }
        }
    }

    public static logPromoShown(promo: string | null = null): void {
        getLOGGER().Log("pro", "getPOPUPS().CallbackShiny " + promo);
    }

    public static logFB711PromoShown(data: string | null = null): void {
        getLOGGER().Stat([74, "popupshow"]);
    }

    public static logFB711RedeemShown(data: string | null = null): void {
        if (getTUTORIAL()._stage < 200) {
            getLOGGER().Stat([77, getTUTORIAL()._stage]);
        } else {
            getLOGGER().Stat([78, "claimed"]);
        }
    }
}
