import Event from 'openfl/events/Event';
import EventDispatcher from 'openfl/events/EventDispatcher';
import IOErrorEvent from 'openfl/events/IOErrorEvent';
import SecurityErrorEvent from 'openfl/events/SecurityErrorEvent';
import URLLoader from 'openfl/net/URLLoader';
import URLRequest from 'openfl/net/URLRequest';
import { GLOBAL } from './GLOBAL';

/**
 * KEYS - Localization and text management
 * Loads and processes language files using OpenFL
 * Converted from ActionScript to TypeScript
 */
export class KEYS {
    public static _setup: boolean = false;
    public static _storageURL: string = "";
    public static languageFileJson: any;
    public static supportedLanguagesJson: any;
    private static dispatcher: EventDispatcher = new EventDispatcher();
    public static LANGUAGE_FILE_LOADED: string = "languageFileLoaded";

    public constructor() {
    }

    public static Setup(language: string = "english"): void {
        KEYS._setup = true;
        var languageFile: URLLoader = new URLLoader();
        languageFile.load(new URLRequest(KEYS._storageURL + language + ".json"));
        languageFile.addEventListener(Event.COMPLETE, KEYS.handleLangFileSucc);
        languageFile.addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent): void => {
        });
    }

    public static GetSupportedLanguages(): void {
        var languages: URLLoader = new URLLoader();
        languages.load(new URLRequest(GLOBAL._apiURL + "supportedLangs"));
        languages.addEventListener(Event.COMPLETE, KEYS.handleSupportedLangsSucc);
        languages.addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent): void => { });
        languages.addEventListener(SecurityErrorEvent.SECURITY_ERROR, (event: SecurityErrorEvent): void => { });
    }

    private static handleLangFileSucc(data: Event): void {
        var rawData: string = String((data.target as URLLoader).data);
        KEYS.languageFileJson = JSON.parse(rawData);
        GLOBAL.textContentLoaded = true;
        GLOBAL.eventDispatcher.dispatchEvent(new Event(KEYS.LANGUAGE_FILE_LOADED));
    }

    private static handleSupportedLangsSucc(data: Event): void {
        var rawData: string = String((data.target as URLLoader).data);
        KEYS.supportedLanguagesJson = JSON.parse(rawData);
        GLOBAL.supportedLangsLoaded = true;
    }

    // Processes the JSON language file from the server
    // Replaces #placeholders# within JSON with dynamic values
    public static Get(jsonKeyPath: string, placeholders: any = null): string {
        if (KEYS.languageFileJson == null) {
            return jsonKeyPath;
        }
        var jsonValue: any = KEYS.languageFileJson;
        if (jsonValue.hasOwnProperty(jsonKeyPath)) {
            var value: any = jsonValue[jsonKeyPath];
            if (typeof value === 'string') {
                var jsonString: string = value as string;
                if (placeholders != null && jsonString != null) {
                    jsonString = KEYS.replacePlaceholders(jsonString, placeholders);
                }
                return jsonString;
            }
            return String(value);
        }
        return jsonKeyPath;
    }

    private static replacePlaceholders(input: string, placeholders: any): string {
        for (var key in placeholders) {
            if (placeholders.hasOwnProperty(key)) {
                var placeholder: string = "#" + key + "#";
                input = input.split(placeholder).join(placeholders[key]);
            }
        }
        return input;
    }
}
