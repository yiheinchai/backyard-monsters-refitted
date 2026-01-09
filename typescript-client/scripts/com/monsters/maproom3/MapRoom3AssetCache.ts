import { BitmapData } from "openfl/display/BitmapData";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";

import { ImageCache } from "../display/ImageCache";
import { SpriteData } from "../display/SpriteData";
import { SingletonLock } from "../../config/singletonlock/SingletonLock";

/**
 * MapRoom3AssetCache - caches and manages assets for the MapRoom3 world map.
 */
export class MapRoom3AssetCache {
    private static s_Instance: MapRoom3AssetCache | null = null;

    static readonly CELL_ICON_DAMAGE_PROTECTION: string = "worldmap/icons/damage_protection.png";
    static readonly CELL_ICON_PLAYER_BASE: string = "worldmap/icons/player_base.png";
    static readonly CELL_ICON_RESOURCE_CELL: string = "worldmap/icons/resource_cell.png";
    static readonly CELL_ICON_STRONGHOLD: string = "worldmap/icons/guard_tower.png";
    static readonly CELL_ICON_STRONGHOLD_BUFF_EFFECT_NEUTRAL: string = "worldmap/icons/guard_tower_buff_effect.v2.png";
    static readonly CELL_ICON_STRONGHOLD_BUFF_EFFECT_ENEMY: string = "worldmap/icons/guard_tower_buff_effect_enemy.v3.png";
    static readonly CELL_ICON_STRONGHOLD_BUFF_EFFECT_PLAYER: string = "worldmap/icons/guard_tower_buff_effect_player.v3.png";
    static readonly CELL_ICON_STRONGHOLD_BUFF_EFFECT_MIXED: string = "worldmap/icons/guard_tower_buff_effect_mixed.v3.png";
    static readonly CELL_ICON_WILD_MONSTER_BASE: string = "worldmap/icons/wild_monster_base_v2.png";
    static readonly CELL_ICON_HELLRAISER_EVENT_BASE: string = "worldmap/icons/hellraiser_event_base.png";
    static readonly CELL_ICON_HELLRAISER_EVENT_BASE_TILE: string = "worldmap/icons/hellraiser_event_base_tile.png";
    static readonly CELL_ICON_FORTIFICATION: string = "worldmap/icons/fortification_v2.png";
    static readonly CELL_ICON_FORTIFICATION_EAST: string = "worldmap/icons/fortification_east_v2.png";
    static readonly CELL_ICON_FORTIFICATION_WEST: string = "worldmap/icons/fortification_west_v2.png";
    static readonly CELL_ICON_FORTIFICATION_NORTH_EAST: string = "worldmap/icons/fortification_north_east_v2.png";
    static readonly CELL_ICON_FORTIFICATION_NORTH_WEST: string = "worldmap/icons/fortification_north_west_v2.png";
    static readonly CELL_ICON_FORTIFICATION_SOUTH_EAST: string = "worldmap/icons/fortification_south_east_v2.png";
    static readonly CELL_ICON_FORTIFICATION_SOUTH_WEST: string = "worldmap/icons/fortification_south_west_v2.png";
    static readonly CELL_ICON_FORTIFICATION_LIGHT_BLUE: string = "worldmap/icons/fortification_light_blue_v2.png";
    static readonly CELL_ICON_FORTIFICATION_LIGHT_GREEN: string = "worldmap/icons/fortification_light_green_v2.png";
    static readonly CELL_ICON_FORTIFICATION_LIGHT_RED: string = "worldmap/icons/fortification_light_red_v2.png";
    static readonly CELL_ICON_FORTIFICATION_LIGHT_YELLOW: string = "worldmap/icons/fortification_light_yellow_v2.png";
    static readonly CELL_ICON_FULLY_FORTIFIED_BACK: string = "worldmap/icons/fully_fortified_back.png";
    static readonly CELL_ICON_FULLY_FORTIFIED_FRONT: string = "worldmap/icons/fully_fortified_front.png";
    static readonly CELL_OVERLAY_GLOW_RED: string = "worldmap/overlays/glow_red.png";
    static readonly CELL_OVERLAY_GLOW_BLUE: string = "worldmap/overlays/glow_blue.png";
    static readonly CELL_OVERLAY_GLOW_GREEN: string = "worldmap/overlays/glow_green.png";
    static readonly CELL_OVERLAY_GLOW_YELLOW: string = "worldmap/overlays/glow_yellow.png";
    static readonly HUD_BOOKMARK_THUMBNAIL_RESOURCE: string = "worldmap/hud/bookmark_thumbnail_resource.png";
    static readonly HUD_BOOKMARK_THUMBNAIL_STRONGHOLD: string = "worldmap/hud/bookmark_thumbnail_stronghold.png";
    static readonly HUD_BUTTON_FULL_SCREEN: string = "worldmap/hud/options/button_full_screen.png";
    static readonly HUD_BUTTON_ZOOM_IN: string = "worldmap/hud/options/button_zoom_in.png";
    static readonly HUD_BUTTON_ZOOM_OUT: string = "worldmap/hud/options/button_zoom_out.png";
    static readonly HUD_BUTTONS_BAR_BACKGROUND: string = "worldmap/hud/buttons_background.png";
    static readonly HUD_COORDINATES_BACKGROUND: string = "worldmap/hud/coordinates_background.png";
    static readonly MOUSEOVER_BACKGROUND: string = "worldmap/rollover/background.png";
    static readonly MOUSEOVER_BUTTON_BACKGROUND: string = "worldmap/rollover/button_background.png";
    static readonly MOUSEOVER_BUTTON_ENTER: string = "worldmap/rollover/button_enter.png";
    static readonly MOUSEOVER_BUTTON_ENTER_ROLLOVER: string = "worldmap/rollover/button_enter_rollover.png";
    static readonly MOUSEOVER_BUTTON_SCOUT_ATTACK: string = "worldmap/rollover/button_scout_attack.png";
    static readonly MOUSEOVER_BUTTON_SCOUT_ATTACK_ROLLOVER: string = "worldmap/rollover/button_scout_attack_rollover.png";
    static readonly MOUSEOVER_BUTTON_BOOKMARK_ADD: string = "worldmap/rollover/button_bookmark_add.png";
    static readonly MOUSEOVER_BUTTON_BOOKMARK_ADD_ROLLOVER: string = "worldmap/rollover/button_bookmark_add_rollover.png";
    static readonly MOUSEOVER_BUTTON_BOOKMARK_REMOVE: string = "worldmap/rollover/button_bookmark_remove.png";
    static readonly MOUSEOVER_BUTTON_BOOKMARK_REMOVE_ROLLOVER: string = "worldmap/rollover/button_bookmark_remove_rollover.png";
    static readonly MOUSEOVER_BUTTON_SEND_MESSAGE: string = "worldmap/rollover/button_message.png";
    static readonly MOUSEOVER_BUTTON_SEND_MESSAGE_ROLLOVER: string = "worldmap/rollover/button_message_rollover.png";
    static readonly MOUSEOVER_BUTTON_INVITE_TO_ALLIANCE: string = "worldmap/rollover/button_alliance.png";
    static readonly MOUSEOVER_BUTTON_INVITE_TO_ALLIANCE_ROLLOVER: string = "worldmap/rollover/button_alliance_rollover.png";
    static readonly MOUSEOVER_BUTTON_REQUEST_TRUCE: string = "worldmap/rollover/button_truce.png";
    static readonly MOUSEOVER_BUTTON_REQUEST_TRUCE_ROLLOVER: string = "worldmap/rollover/button_truce_rollover.png";
    static readonly MOUSEOVER_ICON_TRUCE: string = "worldmap/rollover/icon_truce.png";

    private static readonly DAMAGE_BAR: string = "worldmap/cell_health_bar.png";
    private static readonly DAMAGE_BAR_WIDTH: number = 41;
    private static readonly DAMAGE_BAR_TOTAL_HEIGHT: number = 68;
    private static readonly DAMAGE_BAR_SEGMENT_HEIGHT: number = 4;
    private static readonly DAMAGE_BAR_NUM_SEGMENTS: number = MapRoom3AssetCache.DAMAGE_BAR_TOTAL_HEIGHT / MapRoom3AssetCache.DAMAGE_BAR_SEGMENT_HEIGHT;

    static readonly STRONGHOLD_BUFF_EFFECT_TOTAL_FRAMES: number = 40;
    static readonly STRONGHOLD_BUFF_EFFECT_OFFSET_Y: number = -20;

    private static readonly IMAGES_TO_LOAD: Array<string> = [
        MapRoom3AssetCache.CELL_ICON_DAMAGE_PROTECTION, MapRoom3AssetCache.CELL_ICON_PLAYER_BASE,
        MapRoom3AssetCache.CELL_ICON_RESOURCE_CELL, MapRoom3AssetCache.CELL_ICON_STRONGHOLD,
        MapRoom3AssetCache.CELL_ICON_STRONGHOLD_BUFF_EFFECT_NEUTRAL, MapRoom3AssetCache.CELL_ICON_STRONGHOLD_BUFF_EFFECT_ENEMY,
        MapRoom3AssetCache.CELL_ICON_STRONGHOLD_BUFF_EFFECT_PLAYER, MapRoom3AssetCache.CELL_ICON_STRONGHOLD_BUFF_EFFECT_MIXED,
        MapRoom3AssetCache.CELL_ICON_WILD_MONSTER_BASE, MapRoom3AssetCache.CELL_ICON_HELLRAISER_EVENT_BASE,
        MapRoom3AssetCache.CELL_ICON_HELLRAISER_EVENT_BASE_TILE, MapRoom3AssetCache.CELL_ICON_FORTIFICATION,
        MapRoom3AssetCache.CELL_ICON_FORTIFICATION_EAST, MapRoom3AssetCache.CELL_ICON_FORTIFICATION_WEST,
        MapRoom3AssetCache.CELL_ICON_FORTIFICATION_NORTH_EAST, MapRoom3AssetCache.CELL_ICON_FORTIFICATION_NORTH_WEST,
        MapRoom3AssetCache.CELL_ICON_FORTIFICATION_SOUTH_EAST, MapRoom3AssetCache.CELL_ICON_FORTIFICATION_SOUTH_WEST,
        MapRoom3AssetCache.CELL_ICON_FORTIFICATION_LIGHT_BLUE, MapRoom3AssetCache.CELL_ICON_FORTIFICATION_LIGHT_GREEN,
        MapRoom3AssetCache.CELL_ICON_FORTIFICATION_LIGHT_RED, MapRoom3AssetCache.CELL_ICON_FORTIFICATION_LIGHT_YELLOW,
        MapRoom3AssetCache.CELL_ICON_FULLY_FORTIFIED_BACK, MapRoom3AssetCache.CELL_ICON_FULLY_FORTIFIED_FRONT,
        MapRoom3AssetCache.CELL_OVERLAY_GLOW_RED, MapRoom3AssetCache.CELL_OVERLAY_GLOW_BLUE,
        MapRoom3AssetCache.CELL_OVERLAY_GLOW_GREEN, MapRoom3AssetCache.CELL_OVERLAY_GLOW_YELLOW,
        MapRoom3AssetCache.HUD_BOOKMARK_THUMBNAIL_RESOURCE, MapRoom3AssetCache.HUD_BOOKMARK_THUMBNAIL_STRONGHOLD,
        MapRoom3AssetCache.HUD_BUTTON_FULL_SCREEN, MapRoom3AssetCache.HUD_BUTTON_ZOOM_IN,
        MapRoom3AssetCache.HUD_BUTTON_ZOOM_OUT, MapRoom3AssetCache.HUD_BUTTONS_BAR_BACKGROUND,
        MapRoom3AssetCache.HUD_COORDINATES_BACKGROUND, MapRoom3AssetCache.MOUSEOVER_BACKGROUND,
        MapRoom3AssetCache.MOUSEOVER_BUTTON_BACKGROUND, MapRoom3AssetCache.MOUSEOVER_BUTTON_ENTER,
        MapRoom3AssetCache.MOUSEOVER_BUTTON_ENTER_ROLLOVER, MapRoom3AssetCache.MOUSEOVER_BUTTON_SCOUT_ATTACK,
        MapRoom3AssetCache.MOUSEOVER_BUTTON_SCOUT_ATTACK_ROLLOVER, MapRoom3AssetCache.MOUSEOVER_BUTTON_BOOKMARK_ADD,
        MapRoom3AssetCache.MOUSEOVER_BUTTON_BOOKMARK_ADD_ROLLOVER, MapRoom3AssetCache.MOUSEOVER_BUTTON_BOOKMARK_REMOVE,
        MapRoom3AssetCache.MOUSEOVER_BUTTON_BOOKMARK_REMOVE_ROLLOVER, MapRoom3AssetCache.MOUSEOVER_BUTTON_SEND_MESSAGE,
        MapRoom3AssetCache.MOUSEOVER_BUTTON_SEND_MESSAGE_ROLLOVER, MapRoom3AssetCache.MOUSEOVER_BUTTON_INVITE_TO_ALLIANCE,
        MapRoom3AssetCache.MOUSEOVER_BUTTON_INVITE_TO_ALLIANCE_ROLLOVER, MapRoom3AssetCache.MOUSEOVER_BUTTON_REQUEST_TRUCE,
        MapRoom3AssetCache.MOUSEOVER_BUTTON_REQUEST_TRUCE_ROLLOVER, MapRoom3AssetCache.MOUSEOVER_ICON_TRUCE,
        MapRoom3AssetCache.DAMAGE_BAR
    ];

    private m_LoadedAssets: Map<string, BitmapData> | null = null;
    private m_DamageBarSegments: Array<BitmapData> = [];
    private m_StrongholdBuffEffectNeutralSpriteData: SpriteData | null = null;
    private m_StrongholdBuffEffectEnemySpriteData: SpriteData | null = null;
    private m_StrongholdBuffEffectPlayerSpriteData: SpriteData | null = null;
    private m_StrongholdBuffEffectMixedSpriteData: SpriteData | null = null;
    private m_AreAssetsLoaded: boolean = false;

    constructor(lock: SingletonLock) {
    }

    public static get instance(): MapRoom3AssetCache {
        MapRoom3AssetCache.s_Instance = MapRoom3AssetCache.s_Instance || new MapRoom3AssetCache(new SingletonLock());
        return MapRoom3AssetCache.s_Instance;
    }

    public get areAssetsLoaded(): boolean {
        return this.m_AreAssetsLoaded;
    }

    public Load(): void {
        if (this.m_LoadedAssets !== null) {
            return;
        }
        this.m_LoadedAssets = new Map<string, BitmapData>();
        ImageCache.GetImageGroupWithCallBack("map_room_3_assets", MapRoom3AssetCache.IMAGES_TO_LOAD, this.OnAssetsLoaded.bind(this));
    }

    private OnAssetsLoaded(assets: Array<any>, groupName: string): void {
        const len = assets.length;
        for (let i = 0; i < len; i++) {
            const key = String(assets[i][0]);
            const bmd = assets[i][1] as BitmapData;
            this.m_LoadedAssets!.set(key, bmd);
        }
        this.CacheDamageBarSegments();
        this.m_AreAssetsLoaded = true;
    }

    private CacheDamageBarSegments(): void {
        const barBmd = this.GetAsset(MapRoom3AssetCache.DAMAGE_BAR);
        if (barBmd === null) {
            return;
        }
        this.m_DamageBarSegments = new Array<BitmapData>(MapRoom3AssetCache.DAMAGE_BAR_NUM_SEGMENTS);
        const rect = new Rectangle(0, 0, MapRoom3AssetCache.DAMAGE_BAR_WIDTH, MapRoom3AssetCache.DAMAGE_BAR_SEGMENT_HEIGHT);
        const pt = new Point();
        for (let i = 0; i < MapRoom3AssetCache.DAMAGE_BAR_NUM_SEGMENTS; i++) {
            const seg = new BitmapData(MapRoom3AssetCache.DAMAGE_BAR_WIDTH, MapRoom3AssetCache.DAMAGE_BAR_SEGMENT_HEIGHT, false);
            seg.copyPixels(barBmd, rect, pt);
            rect.y += MapRoom3AssetCache.DAMAGE_BAR_SEGMENT_HEIGHT;
            this.m_DamageBarSegments[i] = seg;
        }
    }

    GetAsset(key: string): BitmapData | null {
        return this.m_LoadedAssets!.get(key) ?? null;
    }

    GetStrongholdBuffEffectNeutral(): SpriteData | null {
        if (this.m_StrongholdBuffEffectNeutralSpriteData === null) {
            this.m_StrongholdBuffEffectNeutralSpriteData = this.CreateStrongholdBuffEffect(MapRoom3AssetCache.CELL_ICON_STRONGHOLD_BUFF_EFFECT_NEUTRAL);
        }
        return this.m_StrongholdBuffEffectNeutralSpriteData;
    }

    GetStrongholdBuffEffectEnemy(): SpriteData | null {
        if (this.m_StrongholdBuffEffectEnemySpriteData === null) {
            this.m_StrongholdBuffEffectEnemySpriteData = this.CreateStrongholdBuffEffect(MapRoom3AssetCache.CELL_ICON_STRONGHOLD_BUFF_EFFECT_ENEMY);
        }
        return this.m_StrongholdBuffEffectEnemySpriteData;
    }

    GetStrongholdBuffEffectPlayer(): SpriteData | null {
        if (this.m_StrongholdBuffEffectPlayerSpriteData === null) {
            this.m_StrongholdBuffEffectPlayerSpriteData = this.CreateStrongholdBuffEffect(MapRoom3AssetCache.CELL_ICON_STRONGHOLD_BUFF_EFFECT_PLAYER);
        }
        return this.m_StrongholdBuffEffectPlayerSpriteData;
    }

    GetStrongholdBuffEffectMixed(): SpriteData | null {
        if (this.m_StrongholdBuffEffectMixedSpriteData === null) {
            this.m_StrongholdBuffEffectMixedSpriteData = this.CreateStrongholdBuffEffect(MapRoom3AssetCache.CELL_ICON_STRONGHOLD_BUFF_EFFECT_MIXED);
        }
        return this.m_StrongholdBuffEffectMixedSpriteData;
    }

    CreateStrongholdBuffEffect(assetKey: string): SpriteData | null {
        const bmd = this.GetAsset(assetKey);
        if (!bmd) return null;
        const frameWidth = bmd.width / MapRoom3AssetCache.STRONGHOLD_BUFF_EFFECT_TOTAL_FRAMES;
        const frameHeight = bmd.height;
        const offsetX = SpriteData.FUBAR_X;
        const offsetY = SpriteData.FUBAR_Y;
        const spriteData = new SpriteData(assetKey, frameWidth, frameHeight, offsetX, offsetY);
        spriteData.image = bmd;
        return spriteData;
    }

    public GetDamageBarSegmentAsset(percent: number): BitmapData | null {
        if (this.m_DamageBarSegments === null || this.m_DamageBarSegments.length === 0) {
            return null;
        }
        percent = Math.min(Math.max(0, percent), 0.99);
        const index = Math.min(Math.floor(MapRoom3AssetCache.DAMAGE_BAR_NUM_SEGMENTS * percent), this.m_DamageBarSegments.length - 1);
        return this.m_DamageBarSegments[index];
    }
}
