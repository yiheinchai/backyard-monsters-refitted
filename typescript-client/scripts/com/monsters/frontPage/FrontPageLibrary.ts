import { Category } from "./categories/Category";
import { Message } from "./messages/Message";

// Forward declarations for categories
declare class News extends Category { constructor(); }
declare class Promotions extends Category { constructor(); }
declare class WhatsAvailable extends Category { constructor(); }
declare class UnderusedFeatures extends Category { constructor(); }
declare class LongTerm extends Category { constructor(); }
declare class ProTips extends Category { constructor(); }
declare class ReplayableEventsCategory extends Category { constructor(); }

// Forward declarations for news messages
declare class News01MagmaTower extends Message { constructor(); }
declare class News02InfernoYardExpansion extends Message { constructor(); }
declare class News03Vorg extends Message { constructor(); }
declare class News04Slimeattikus extends Message { constructor(); }
declare class News05YardPlanner2 extends Message { constructor(); }
declare class News06TownHallLevel10 extends Message { constructor(); }

// Forward declarations for promotions
declare class Maproom3OptInPopup extends Message { constructor(); }
declare class Promo01DaveClub extends Message { constructor(); }
declare class Promo02DaveClub extends Message { constructor(); }
declare class Promo03RecapturedGorgo extends Message { constructor(); }
declare class Promo04RecapturedDrull extends Message { constructor(); }
declare class Promo05RecapturedFomor extends Message { constructor(); }
declare class Promo06RecapturedKorath extends Message { constructor(); }

// Forward declarations for underused features
declare class Underused01MonsterLocker extends Message { constructor(); }
declare class Underused02Academy extends Message { constructor(); }

// Forward declarations for build tree messages
declare class BuildTree_01_SniperCannonTowers extends Message { constructor(); }
declare class BuildTree_02_RadioTower extends Message { constructor(); }
declare class BuildTree_03_MonsterLocker extends Message { constructor(); }
declare class BuildTree_04_BoobyTraps extends Message { constructor(); }
declare class BuildTree_05_Blocks extends Message { constructor(); }
declare class BuildTree_06_Catapult extends Message { constructor(); }
declare class BuildTree_07_StoneBlocks extends Message { constructor(); }
declare class BuildTree_08_MonsterAcademy extends Message { constructor(); }
declare class BuildTree_09_HCC extends Message { constructor(); }
declare class BuildTree_10_YardPlanner extends Message { constructor(); }
declare class BuildTree_11_MonsterJuicer extends Message { constructor(); }
declare class BuildTree_12_MonsterBunker extends Message { constructor(); }
declare class BuildTree_13_MonsterBaiter extends Message { constructor(); }
declare class BuildTree_14_TeslaTower extends Message { constructor(); }
declare class BuildTree_15_LaserTower extends Message { constructor(); }
declare class BuildTree_16_AerialTower extends Message { constructor(); }
declare class BuildTree_18_MetalBlocks extends Message { constructor(); }
declare class BuildTree_19_ChampionChamber extends Message { constructor(); }

/**
 * Front page library - registry for front page categories and messages.
 */
export class FrontPageLibrary {
    public static NEWS: Category;
    public static PROMOTIONS: Category;
    public static WHATS_AVAILABLE: Category;
    public static UNDERUSED_FEATURES: Category;
    public static LONG_TERM: Category;
    public static PRO_TIPS: Category;
    public static EVENTS: Category;
    public static CATEGORIES: Array<Category> = [];

    constructor() {}

    public static initialize(): void {
        FrontPageLibrary.addCategories();
        FrontPageLibrary.addMessages();
    }

    public static addMessages(): void {
        FrontPageLibrary.NEWS.addMessage(new News01MagmaTower());
        FrontPageLibrary.NEWS.addMessage(new News02InfernoYardExpansion());
        FrontPageLibrary.NEWS.addMessage(new News03Vorg());
        FrontPageLibrary.NEWS.addMessage(new News04Slimeattikus());
        FrontPageLibrary.NEWS.addMessage(new News05YardPlanner2());
        FrontPageLibrary.NEWS.addMessage(new News06TownHallLevel10());
        
        // PROMOTIONS.addMessage(new Maproom3OptInPopup()); Disable Map Room 3 popups
        FrontPageLibrary.PROMOTIONS.addMessage(new Promo01DaveClub());
        FrontPageLibrary.PROMOTIONS.addMessage(new Promo02DaveClub());
        FrontPageLibrary.PROMOTIONS.addMessage(new Promo03RecapturedGorgo());
        FrontPageLibrary.PROMOTIONS.addMessage(new Promo04RecapturedDrull());
        FrontPageLibrary.PROMOTIONS.addMessage(new Promo05RecapturedFomor());
        FrontPageLibrary.PROMOTIONS.addMessage(new Promo06RecapturedKorath());
        
        FrontPageLibrary.UNDERUSED_FEATURES.addMessage(new Underused01MonsterLocker());
        FrontPageLibrary.UNDERUSED_FEATURES.addMessage(new Underused02Academy());
        
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_01_SniperCannonTowers());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_02_RadioTower());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_03_MonsterLocker());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_04_BoobyTraps());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_05_Blocks());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_06_Catapult());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_07_StoneBlocks());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_08_MonsterAcademy());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_09_HCC());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_10_YardPlanner());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_11_MonsterJuicer());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_12_MonsterBunker());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_13_MonsterBaiter());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_14_TeslaTower());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_15_LaserTower());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_16_AerialTower());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_18_MetalBlocks());
        FrontPageLibrary.WHATS_AVAILABLE.addMessage(new BuildTree_19_ChampionChamber());
    }

    public static addCategories(): void {
        FrontPageLibrary.NEWS = new News();
        FrontPageLibrary.PROMOTIONS = new Promotions();
        FrontPageLibrary.WHATS_AVAILABLE = new WhatsAvailable();
        FrontPageLibrary.UNDERUSED_FEATURES = new UnderusedFeatures();
        FrontPageLibrary.LONG_TERM = new LongTerm();
        FrontPageLibrary.PRO_TIPS = new ProTips();
        FrontPageLibrary.EVENTS = new ReplayableEventsCategory();
        FrontPageLibrary.CATEGORIES = [
            FrontPageLibrary.EVENTS,
            FrontPageLibrary.PROMOTIONS,
            FrontPageLibrary.NEWS,
            FrontPageLibrary.WHATS_AVAILABLE,
            FrontPageLibrary.UNDERUSED_FEATURES,
            FrontPageLibrary.LONG_TERM,
            FrontPageLibrary.PRO_TIPS
        ];
    }

    public static getCategoryByName(name: string): Category | null {
        for (let i = 0; i < FrontPageLibrary.CATEGORIES.length; i++) {
            const category = FrontPageLibrary.CATEGORIES[i];
            if (category.name === name) {
                return category;
            }
        }
        return null;
    }

    public static getMessageByName(name: string): Message | null {
        for (let i = 0; i < FrontPageLibrary.CATEGORIES.length; i++) {
            const category = FrontPageLibrary.CATEGORIES[i];
            const message = category.getMessageByName(name);
            if (message) {
                return message;
            }
        }
        return null;
    }
}
