import Event from 'openfl/events/Event';
import IOErrorEvent from 'openfl/events/IOErrorEvent';
import SecurityErrorEvent from 'openfl/events/SecurityErrorEvent';

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getURLLoaderApi(): any { return require("./URLLoaderApi").URLLoaderApi; }


/**
 * KEYS - Localization Key System
 * Handles loading and accessing translated strings
 */
export class KEYS {
    public static _setup: boolean = false;
    public static _storageURL: string = "";
    public static languageFileJson: Record<string, any> | null = null;
    public static supportedLanguagesJson: Record<string, any> | null = null;
    public static LANGUAGE_FILE_LOADED: string = "languageFileLoaded";

    constructor() {}

    public static async Setup(language: string = "english"): Promise<void> {
        KEYS._setup = true;
        try {
            const response = await fetch(KEYS._storageURL + language + ".json");
            const data = await response.json();
            KEYS.handleLangFileSucc(data);
        } catch (error) {
            console.error("Failed to load language file:", error);
        }
    }

    public static async GetSupportedLanguages(): Promise<void> {
        try {
            const response = await fetch(getGLOBAL()._apiURL + "supportedLangs");
            const data = await response.json();
            KEYS.handleSupportedLangsSucc(data);
        } catch (error) {
            console.error("Failed to load supported languages:", error);
        }
    }

    private static handleLangFileSucc(data: any): void {
        KEYS.languageFileJson = data;
        getGLOBAL().textContentLoaded = true;
        getGLOBAL().eventDispatcher.dispatchEvent(new Event(KEYS.LANGUAGE_FILE_LOADED));
    }

    private static handleSupportedLangsSucc(data: any): void {
        KEYS.supportedLanguagesJson = data;
        getGLOBAL().supportedLangsLoaded = true;
    }

    public static Get(jsonKeyPath: string, placeholders: Record<string, any> | null = null): string {
        if (KEYS.languageFileJson === null) {
            return jsonKeyPath;
        }
        const jsonValue = KEYS.languageFileJson;
        if (jsonValue.hasOwnProperty(jsonKeyPath)) {
            const value = jsonValue[jsonKeyPath];
            if (typeof value === "string") {
                let jsonString: string = value;
                if (placeholders !== null && jsonString !== null) {
                    jsonString = KEYS.replacePlaceholders(jsonString, placeholders);
                }
                return jsonString;
            }
            return String(value);
        }
        return jsonKeyPath;
    }

    private static replacePlaceholders(input: string, placeholders: Record<string, any>): string {
        for (const key in placeholders) {
            if (placeholders.hasOwnProperty(key)) {
                const placeholder: string = "#" + key + "#";
                input = input.split(placeholder).join(placeholders[key]);
            }
        }
        return input;
    }
}
