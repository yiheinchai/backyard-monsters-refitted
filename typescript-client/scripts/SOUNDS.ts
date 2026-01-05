import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Sound from 'openfl/media/Sound';
import SoundChannel from 'openfl/media/SoundChannel';
import SoundMixer from 'openfl/media/SoundMixer';
import SoundTransform from 'openfl/media/SoundTransform';
import URLRequest from 'openfl/net/URLRequest';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
// import { UI2 } from './UI2'; 

/**
 * SOUNDS - Sound manager
 * Handles sound effects and music
 * Converted from ActionScript to TypeScript
 */
export class SOUNDS {
    public static _muted: number = 0;
    public static _mutedMusic: number = 0;
    public static _soundAssets: any[] = [];
    public static _setup: boolean = false;
    private static _currentMusic: string | null = null;
    private static _queuedMusic: string | null = "musicbuild";
    private static _musicVolume: number = 0.7;
    private static _musicPan: number = 0;
    private static _musicTime: number = 0;
    public static _concurrent: any = {};
    public static _musicChannel: SoundChannel | null = null; 

    // Sound directories
    public static attacksounds: string = "attacksounds/";
    public static othersounds: string = "othersounds/";
    public static uisounds: string = "uisounds/";
    public static infernosounds: string = "infernosounds/";
    public static mainmusic: string = "music/";
    public static infernomusic: string = "infernomusic/";

    public static _sounds: any = {
        "click1": null, // new sound_click1(), placeholder
        "laser": "attacksounds/sound_laser.mp3",
        "wmbstart": "othersounds/sound_monsterbaiterloop.mp3",
        "wmbhorn": "othersounds/sound_monsterbaiterhorn.mp3",
        "purchasepopup": "uisounds/sound_purchasepop.mp3", // fixed string interpolation in static init
        "musicattack": "music/Music_Attack.mp3",
        "musicbuild": "music/Music_Building.mp3",
        "musicpanic": "music/Music_UnderAttack.mp3",
    };

    public static music_volumes: any = {
        "musicattack": 0.7,
        "musicbuild": 0.6,
        "musicpanic": 0.7,
        "musicibuild": 0.6,
        "musicipanic": 0.7,
        "musiciattack": 0.7
    };

    constructor() {
    }

    public static Setup(): void {
        var key: string;
        if (!SOUNDS._setup) {
            SOUNDS._setup = true;
            if (SOUNDS._mutedMusic == 0) {
                SOUNDS._musicVolume = 0.7;
            } else {
                SOUNDS._musicVolume = 0;
            }
            if (GLOBAL.StatGet("mute") == 1) {
                SOUNDS.MuteUnmute(true);
            }
            if (GLOBAL.StatGet("mutemusic") == 1) {
                SOUNDS.MuteUnmute(true, "music");
            }
            try {
                for (key in SOUNDS._sounds) {
                    if (key == "click1")
                        continue;
                    // SOUNDS._sounds[key] = new Sound(new URLRequest(GLOBAL._soundPathURL + SOUNDS._sounds[key]));
                    // Using GLOBAL._storageURL for now or stub? 
                    // GLOBAL.as uses _soundPathURL. I need to add that to GLOBAL.ts stub.
                }
            } catch (e: any) {
                GLOBAL.Message("There was a problem setting up audio " + e.message);
            }
        }
    }

    public static Toggle(param1: MouseEvent | null = null): void {
        try {
            if (SOUNDS._muted == 0) {
                SOUNDS.MuteUnmute(true);
            } else {
                SOUNDS.MuteUnmute(false);
            }
            if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
                GLOBAL.StatSet("mute", SOUNDS._muted);
            }
        } catch (e) {
            GLOBAL.Message("There was a problem turning sounds on ");
        }
    }

    public static ToggleMusic(param1: MouseEvent | null = null): void {
        try {
            if (SOUNDS._mutedMusic == 0) {
                SOUNDS.MuteUnmute(true, "music");
            } else {
                SOUNDS.MuteUnmute(false, "music");
            }
            if (GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
                GLOBAL.StatSet("mutemusic", SOUNDS._mutedMusic);
            }
        } catch (e) {
            GLOBAL.Message("There was a problem turning the music on ");
        }
    }

    public static MuteUnmute(param1: boolean = true, param2: string = "snd"): void {
        if (param2 == "snd") {
            if (param1) {
                SOUNDS._muted = 1;
            } else {
                SOUNDS._muted = 0;
            }
        } else if (param2 == "music") {
            if (param1) {
                SOUNDS._musicVolume = 0;
                SOUNDS._mutedMusic = 1;
            } else {
                SOUNDS._musicVolume = 0.7;
                SOUNDS._mutedMusic = 0;
            }
            // update channel logic...
        }
    }
}
