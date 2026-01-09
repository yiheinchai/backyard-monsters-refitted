/**
 * BrowserInfo - Browser information utility class.
 */
export class BrowserInfo {
    public static readonly WIN_PLATFORM: string = "win";
    public static readonly MAC_PLATFORM: string = "mac";
    public static readonly SAFARI_AGENT: string = "safari";
    public static readonly OPERA_AGENT: string = "opera";
    public static readonly IE_AGENT: string = "msie";
    public static readonly MOZILLA_AGENT: string = "mozilla";
    public static readonly CHROME_AGENT: string = "chrome";

    private _platform: string = "undefined";
    private _browser: string = "undefined";
    private _version: string = "undefined";

    constructor(browserObj: any, platformObj: any, userAgent: string) {
        if (!browserObj || !platformObj || !userAgent) {
            return;
        }
        this._version = browserObj.version;
        for (const key in browserObj) {
            if (key !== "version") {
                if (browserObj[key] === true) {
                    this._browser = key;
                    break;
                }
            }
        }
        for (const key in platformObj) {
            if (platformObj[key] === true) {
                this._platform = key;
            }
        }
    }

    public get platform(): string {
        return this._platform;
    }

    public get browser(): string {
        return this._browser;
    }

    public get version(): string {
        return this._version;
    }
}
