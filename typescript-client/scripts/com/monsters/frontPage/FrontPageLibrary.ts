import { Category } from "./categories/Category";
import { Message } from "./messages/Message";
import { News } from "./categories/News";
import { Promotions } from "./categories/Promotions";
import { WhatsAvailable } from "./categories/WhatsAvailable";
import { UnderusedFeatures } from "./categories/UnderusedFeatures";
import { LongTerm } from "./categories/LongTerm";
import { ProTips } from "./categories/ProTips";
import { ReplayableEventsCategory } from "./categories/ReplayableEventsCategory";
import { News01MagmaTower } from "./messages/news/News01MagmaTower";
import { News02InfernoYardExpansion } from "./messages/news/News02InfernoYardExpansion";
import { News03Vorg } from "./messages/news/News03Vorg";
import { News04Slimeattikus } from "./messages/news/News04Slimeattikus";
import { News05YardPlanner2 } from "./messages/news/News05YardPlanner2";
import { News06TownHallLevel10 } from "./messages/news/News06TownHallLevel10";
import { Maproom3OptInPopup } from "./messages/promotions/Maproom3OptInPopup";
import { Promo01DaveClub } from "./messages/promotions/Promo01DaveClub";
import { Promo02DaveClub } from "./messages/promotions/Promo02DaveClub";
import { Promo03RecapturedGorgo } from "./messages/promotions/Promo03RecapturedGorgo";
import { Promo04RecapturedDrull } from "./messages/promotions/Promo04RecapturedDrull";
import { Promo05RecapturedFomor } from "./messages/promotions/Promo05RecapturedFomor";
import { Promo06RecapturedKorath } from "./messages/promotions/Promo06RecapturedKorath";
import { Underused01MonsterLocker } from "./messages/underusedFeatures/Underused01MonsterLocker";
import { Underused02Academy } from "./messages/underusedFeatures/Underused02Academy";
import { BuildTree_01_SniperCannonTowers } from "./messages/buildtree/BuildTree_01_SniperCannonTowers";
import { BuildTree_02_RadioTower } from "./messages/buildtree/BuildTree_02_RadioTower";
import { BuildTree_03_MonsterLocker } from "./messages/buildtree/BuildTree_03_MonsterLocker";
import { BuildTree_04_BoobyTraps } from "./messages/buildtree/BuildTree_04_BoobyTraps";
import { BuildTree_05_Blocks } from "./messages/buildtree/BuildTree_05_Blocks";
import { BuildTree_06_Catapult } from "./messages/buildtree/BuildTree_06_Catapult";
import { BuildTree_07_StoneBlocks } from "./messages/buildtree/BuildTree_07_StoneBlocks";
import { BuildTree_08_MonsterAcademy } from "./messages/buildtree/BuildTree_08_MonsterAcademy";
import { BuildTree_09_HCC } from "./messages/buildtree/BuildTree_09_HCC";
import { BuildTree_10_YardPlanner } from "./messages/buildtree/BuildTree_10_YardPlanner";
import { BuildTree_11_MonsterJuicer } from "./messages/buildtree/BuildTree_11_MonsterJuicer";
import { BuildTree_12_MonsterBunker } from "./messages/buildtree/BuildTree_12_MonsterBunker";
import { BuildTree_13_MonsterBaiter } from "./messages/buildtree/BuildTree_13_MonsterBaiter";
import { BuildTree_14_TeslaTower } from "./messages/buildtree/BuildTree_14_TeslaTower";
import { BuildTree_15_LaserTower } from "./messages/buildtree/BuildTree_15_LaserTower";
import { BuildTree_16_AerialTower } from "./messages/buildtree/BuildTree_16_AerialTower";
import { BuildTree_18_MetalBlocks } from "./messages/buildtree/BuildTree_18_MetalBlocks";
import { BuildTree_19_ChampionChamber } from "./messages/buildtree/BuildTree_19_ChampionChamber";

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
