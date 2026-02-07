import { EnumYardType } from './com/monsters/enums/EnumYardType';
import Loader from 'openfl/display/Loader';
import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import IOErrorEvent from 'openfl/events/IOErrorEvent';
import MouseEvent from 'openfl/events/MouseEvent';
import URLRequest from 'openfl/net/URLRequest';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getQUESTS(): any { return require("./QUESTS").QUESTS; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }


/**
 * GIFTS - Gift System Manager
 * Manages sending and receiving gifts between players
 */
export class GIFTS {
    public static _giftsAccepted: string[] = [];
    public static _sentGiftsAccepted: string[] = [];
    public static _sentInvitesAccepted: string[] = [];
    public static _mc: MovieClip | null = null;
    public static _maxXPReward: number = 100000;

    constructor() {}

    public static Process(gifts: any[]): void {
        if (getTUTORIAL()._stage >= 69) {
            for (const gift of gifts) {
                let multiplier: number;
                if (Math.random() * 100 > 75) {
                    multiplier = 0.07 + Math.random() * 0.05;
                } else {
                    multiplier = 0.02 + Math.random() * 0.02;
                }
                const resourceId = 1 + Math.floor(Math.random() * 4);
                const giftValue = Math.floor(getBASE()._resources["r" + resourceId + "max"] * multiplier);
                GIFTS.Show(resourceId, gift[0], gift[1], gift[2], gift[3], giftValue);
            }
        }
    }

    public static ProcessAcceptedGifts(gifts: any[]): void {
        console.log("Processing Accepted Gifts, " + gifts);
        if (getTUTORIAL()._stage >= 69) {
            for (const gift of gifts) {
                let multiplier: number;
                if (Math.random() * 100 > 75) {
                    multiplier = 0.07 + Math.random() * 0.05;
                } else {
                    multiplier = 0.02 + Math.random() * 0.02;
                }
                const resourceId = 1 + Math.floor(Math.random() * 4);
                const giftValue = Math.floor(getBASE()._resources["r" + resourceId + "max"] * multiplier);
                GIFTS.ShowSentGift(resourceId, gift[0], gift[1], gift[2], gift[3], giftValue);
            }
        }
    }

    public static ProcessAcceptedInvites(invites: any[]): void {
        if (getTUTORIAL()._stage >= 69) {
            for (const invite of invites) {
                let multiplier: number;
                if (Math.random() * 100 > 75) {
                    multiplier = 0.07 + Math.random() * 0.05;
                } else {
                    multiplier = 0.02 + Math.random() * 0.02;
                }
                const resourceId = 1 + Math.floor(Math.random() * 4);
                const giftValue = Math.floor(getBASE()._resources["r" + resourceId + "max"] * multiplier);
                GIFTS.ShowSentInvite(resourceId, invite[0], invite[1], invite[2], invite[3], giftValue);
            }
        }
    }

    public static Show(resourceID: number, giftID: string, giftFromName: string, giftFromID: string, profilePic: string, giftValue: number): void {
        GIFTS._mc = new (GLOBAL as any).popup_gift();
        GIFTS._mc!.gotoAndStop(resourceID);
        (GIFTS._mc as any).tA.htmlText = getKEYS().Get("pop_gift_title", { v1: giftFromName });
        (GIFTS._mc as any).tB.htmlText = "<b>" + getGLOBAL().FormatNumber(giftValue) + " " + getKEYS().Get(getGLOBAL()._resourceNames[resourceID - 1]) + "</b>";
        (GIFTS._mc as any).bReturn.SetupKey("pop_giftback_btn");
        (GIFTS._mc as any).bReturn.Highlight = true;
        (GIFTS._mc as any).bReturn.addEventListener(MouseEvent.CLICK, GIFTS.SendGift);
        (GIFTS._mc as any).bReturn.visible = true;
        (GIFTS._mc as any).bReturn.mouseEnabled = true;
        (GIFTS._mc as any).bThanks.SetupKey("pop_saythanks_btn");
        (GIFTS._mc as any).bThanks.Highlight = true;
        (GIFTS._mc as any).bThanks.addEventListener(MouseEvent.CLICK, GIFTS.GiveThanks(resourceID, giftFromID, giftValue));

        if (profilePic) {
            try {
                const loader = new Loader();
                loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, () => {});
                loader.contentLoaderInfo.addEventListener(Event.COMPLETE, () => {
                    loader.width = loader.height = 50;
                });
                (GIFTS._mc as any).mcPic.mcBG.addChild(loader);
                loader.load(new URLRequest(profilePic));
            } catch (e) {}
        }

        let img = "resourcetwigs.png";
        if (!getBASE().isInfernoMainYardOrOutpost) {
            if (resourceID === 2) img = "resourcepebbles.png";
            if (resourceID === 3) img = "resourceputty.png";
            if (resourceID === 4) img = "resourcegoo.png";
        } else {
            if (resourceID === 1) img = "resource-cauldron_bones.png";
            if (resourceID === 2) img = "resource-cauldron_coal.png";
            if (resourceID === 3) img = "resource-cauldron_sulphur.png";
            if (resourceID === 4) img = "resource-cauldron_magma.png";
        }

        getPOPUPS().Push(GIFTS._mc, GIFTS.Fund, [giftID, resourceID, giftValue], "", img, false, "gifts");
    }

    public static ShowSentGift(resourceID: number, giftID: string, giftFromName: string, giftFromID: string, profilePic: string, giftValue: number): void {
        const lvlInfo = getBASE().BaseLevel();
        let onePctNextLevelXP = Math.floor((lvlInfo as any).upper * 0.01);
        onePctNextLevelXP = onePctNextLevelXP > GIFTS._maxXPReward ? GIFTS._maxXPReward : onePctNextLevelXP;

        GIFTS._mc = new (GLOBAL as any).popup_gift();
        (GIFTS._mc as any).tA.htmlText = getKEYS().Get("pop_sentgift_title", { v1: giftFromName });
        (GIFTS._mc as any).tB.htmlText = "<b>" + getGLOBAL().FormatNumber(onePctNextLevelXP) + " " + getKEYS().Get("#r_points#") + "</b>";
        (GIFTS._mc as any).bReturn.SetupKey("btn_close");
        (GIFTS._mc as any).bReturn.Highlight = true;
        (GIFTS._mc as any).bReturn.visible = false;
        (GIFTS._mc as any).bReturn.mouseEnabled = false;
        (GIFTS._mc as any).bThanks.SetupKey("btn_close");
        (GIFTS._mc as any).bThanks.Highlight = true;
        (GIFTS._mc as any).bThanks.addEventListener(MouseEvent.CLICK, GIFTS.ClosePopup);

        if (profilePic) {
            try {
                const loader = new Loader();
                loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, () => {});
                loader.contentLoaderInfo.addEventListener(Event.COMPLETE, () => {
                    loader.width = loader.height = 50;
                });
                (GIFTS._mc as any).mcPic.mcBG.addChild(loader);
                loader.load(new URLRequest(profilePic));
            } catch (e) {}
        }

        getPOPUPS().Push(GIFTS._mc, GIFTS.AddXP, [giftID, giftValue], "", "fantastic.png", false, "gifts");
    }

    public static ShowSentInvite(resourceID: number, giftID: string, giftFromName: string, giftFromID: string, profilePic: string, giftValue: number): void {
        const lvlInfo = getBASE().BaseLevel();
        let onePctNextLevelXP = Math.floor((lvlInfo as any).upper * 0.01);
        onePctNextLevelXP = onePctNextLevelXP > GIFTS._maxXPReward ? GIFTS._maxXPReward : onePctNextLevelXP;

        GIFTS._mc = new (GLOBAL as any).popup_gift();
        (GIFTS._mc as any).tA.htmlText = getKEYS().Get("pop_sentinvite_title", { v1: giftFromName });
        (GIFTS._mc as any).tB.htmlText = "<b>" + getGLOBAL().FormatNumber(onePctNextLevelXP) + " " + getKEYS().Get("#r_points#") + "</b>";
        (GIFTS._mc as any).bReturn.SetupKey("pop_sentinvite_gift");
        (GIFTS._mc as any).bReturn.Highlight = true;
        (GIFTS._mc as any).bReturn.addEventListener(MouseEvent.CLICK, GIFTS.SendGift);
        (GIFTS._mc as any).bReturn.visible = true;
        (GIFTS._mc as any).bReturn.mouseEnabled = true;
        (GIFTS._mc as any).bThanks.SetupKey("pop_sentinvite_visit");
        (GIFTS._mc as any).bThanks.Highlight = true;
        (GIFTS._mc as any).bThanks.addEventListener(MouseEvent.CLICK, GIFTS.HelpFriend(giftFromID));

        if (profilePic) {
            try {
                const loader = new Loader();
                loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, () => {});
                loader.contentLoaderInfo.addEventListener(Event.COMPLETE, () => {
                    loader.width = loader.height = 50;
                });
                (GIFTS._mc as any).mcPic.mcBG.addChild(loader);
                loader.load(new URLRequest(profilePic));
            } catch (e) {}
        }

        getPOPUPS().Push(GIFTS._mc, GIFTS.AddXP, [giftID, giftValue], "", "fantastic.png", false, "gifts");
    }

    public static Fund(giftID: string, resourceID: number, giftValue: number): void {
        GIFTS._giftsAccepted.push(giftID);
        getBASE().Fund(resourceID, giftValue);
        getBASE().Save();
        getLOGGER().Stat([19, resourceID, giftValue, Math.floor(100 / getBASE()._resources["r" + resourceID + "max"] * giftValue)]);
    }

    public static AddXP(giftID: string, giftValue: number): void {
        GIFTS._sentGiftsAccepted.push(giftID);
        ++getQUESTS()._global.gift_accept;
        getQUESTS().Check();
        getBASE().PointsAdd(giftValue);
        getBASE().Save();
    }

    public static HelpFriend(giftFromID: string): (event: MouseEvent | null) => void {
        return (event: MouseEvent | null = null): void => {
            getPOPUPS().Next();
            const yardType = getMapRoomManager().instance.isInMapRoom3 ? EnumYardType.PLAYER : EnumYardType.MAIN_YARD;
            getBASE().LoadBase(null, parseInt(giftFromID), 0, "help", false, yardType);
        };
    }

    public static GiveThanks(resourceID: number, giftFromID: string, giftValue: number): (event: MouseEvent | null) => void {
        return (event: MouseEvent | null = null): void => {
            const adjustedResourceID = getBASE().isInfernoMainYardOrOutpost ? resourceID + 4 : resourceID;
            const img = "gift" + adjustedResourceID + ".png";
            getGLOBAL().CallJS("sendFeed", ["thanks", getKEYS().Get("pop_givethanks_streamtitle"), getKEYS().Get("pop_givethanks_streambody", {
                v1: getGLOBAL().FormatNumber(giftValue),
                v2: getKEYS().Get(getGLOBAL()._resourceNames[resourceID - 1])
            }), img, giftFromID]);
            getPOPUPS().Next();
        };
    }

    public static SendGift(event: MouseEvent): void {
        getGLOBAL().CallJS("cc.showFeedDialog", ["gift", "callbackgift"]);
        getPOPUPS().Next();
    }

    public static ClosePopup(event: MouseEvent): void {
        getPOPUPS().Next(event);
    }
}
