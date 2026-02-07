import Event from 'openfl/events/Event';
import HTTPStatusEvent from 'openfl/events/HTTPStatusEvent';
import IOErrorEvent from 'openfl/events/IOErrorEvent';
import SecurityErrorEvent from 'openfl/events/SecurityErrorEvent';
import URLLoader from 'openfl/net/URLLoader';
import URLRequest from 'openfl/net/URLRequest';
import URLRequestHeader from 'openfl/net/URLRequestHeader';
import URLRequestMethod from 'openfl/net/URLRequestMethod';
import URLVariables from 'openfl/net/URLVariables';
import { JSON } from './JSON';

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


export class URLLoaderApi {
    public static _data: string = "";

    private _status: number;
    private _url: string;
    private _req: URLLoader;
    private _onComplete: Function;
    private _onError: Function;
    private _baseUrl: string;

    constructor() {
    }

    /**
     * This function was created by the Refitted team to send data to the server in JSON format.
     * It provides a more expressive, structured way for parsing and handling data on the server.
     */
    public invokeApiRequest(url: string, data: any, method: string = "POST", onComplete: Function = null): void {
        try {
            const request = new URLRequest(url);
            const loader = new URLLoader();
            let errMessage = "";

            request.method = method;
            request.contentType = "application/json";
            request.requestHeaders.push(new URLRequestHeader("Authorization", "Bearer " + getLOGIN().token));

            if (data == null || data == undefined) data = {};
            if (method != URLRequestMethod.GET) request.data = JSON.encode(data);

            // Send the request
            loader.load(request);

            // On success, decode JSON and invoke callback
            loader.addEventListener(Event.COMPLETE, (e: Event): void => {
                const response = JSON.decode(loader.data);
                if (onComplete != null) onComplete(response);
            });

            loader.addEventListener(IOErrorEvent.IO_ERROR, (event: IOErrorEvent): void => {
                errMessage = "IOError error event occurred while making the request";
                getGLOBAL().ErrorMessage(errMessage, getGLOBAL().ERROR_ORANGE_BOX_ONLY);
            });

        } catch (error) {
            const errMessage = "Error occurred while making the request: " + error.message;
            getGLOBAL().ErrorMessage(errMessage, getGLOBAL().ERROR_ORANGE_BOX_ONLY);
        }
    }

    /**
     * This is the original networking function that was used to load data from the server by Kixeye,
     * with some additions such as Bearer tokens in the header for authentication added by the Refitted team.
     */
    public load(baseUrl: string, keyValuePairs: any[] = null, onComplete: Function = null, onFail: Function = null): void {
        this._onComplete = onComplete;
        this._onError = onFail;
        this._baseUrl = baseUrl;
        this._url = baseUrl;
        const urlBuilder = new URLRequest(baseUrl);
        const urlVariables = new URLVariables();
        const token = getLOGIN().token;

        if (keyValuePairs != null && keyValuePairs.length > 0) {
            for (let currentIndex = 0; currentIndex < keyValuePairs.length; currentIndex++) {
                const currentPair = keyValuePairs[currentIndex];
                urlVariables[currentPair[0]] = currentPair[1];
                URLLoaderApi._data += keyValuePairs[currentIndex][0] + "=" + keyValuePairs[currentIndex][1] + "&";
            }
        }
        if (token) {
            const authHeader = new URLRequestHeader("Authorization", "Bearer " + token);
            urlBuilder.requestHeaders.push(authHeader);
        }
        urlBuilder.data = urlVariables;
        urlBuilder.method = URLRequestMethod.POST;
        this._req = new URLLoader(urlBuilder);
        this._req.addEventListener(Event.COMPLETE, this.fireComplete.bind(this));
        this._req.addEventListener(IOErrorEvent.IO_ERROR, this.loadError.bind(this));
        this._req.addEventListener(HTTPStatusEvent.HTTP_STATUS, this.setStatus.bind(this));
        this._req.addEventListener(SecurityErrorEvent.SECURITY_ERROR, (event: SecurityErrorEvent) => {
            getGLOBAL().initError = "Failed to connect to the server.";
            getGLOBAL().eventDispatcher.dispatchEvent(new Event("initError"));
            return;
        });
    }

    private setStatus(param1: HTTPStatusEvent): void {
        this._status = param1.status;
        switch (this._status) {
            case 404:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Not Found");
                break;
            case 401:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Unauthorized");
                break;
            case 403:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Forbidden");
                break;
            case 405:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Method Not Allowed");
                break;
            case 406:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Not Acceptable");
                break;
            case 407:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Proxy Authentication Required");
                break;
            case 408:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Request Timeout");
                break;
            case 500:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Internal Server Error");
                break;
            case 501:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Not Implemented");
                break;
            case 502:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Bad Gateway");
                break;
            case 503:
                getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Service Unavailable");
                break;
            default:
                if (this._status > 400) {
                    getLOGGER().Log("err", "URLLoaderApi HTTP status " + this._status + " Other status");
                }
        }
    }

    private loadError(param1: IOErrorEvent): void {
        getLOGGER().Log("err", "URLLoader Load Error " + this._url);
        let errorObj: any = null;
        if (this._req && this._req.data) {
            try {
                errorObj = JSON.decode(this._req.data);
            } catch (e) {
            }
        }
        if (errorObj && this._onComplete != null) {
            this._onComplete(errorObj);
        } else if (this._onError != null) {
            this._onError(param1);
        }
    }

    public Clear(): void {
        this._req.removeEventListener(Event.COMPLETE, this.fireComplete.bind(this));
        this._req.removeEventListener(IOErrorEvent.IO_ERROR, this.loadError.bind(this));
        this._req.removeEventListener(HTTPStatusEvent.HTTP_STATUS, this.setStatus.bind(this));
        this._req = null;
    }

    private fireComplete(param1: Event): void {
        if (this._onComplete === null) {
            return;
        }
        const decodedReqData = JSON.decode(this._req.data);
        if (this._onComplete) {
            if (decodedReqData) {
                this._onComplete(decodedReqData);
            } else {
                console.log("no jdata?!" + decodedReqData);
            }
        }
    }
}
