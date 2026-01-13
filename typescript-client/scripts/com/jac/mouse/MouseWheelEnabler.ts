import InteractiveObject from "openfl/display/InteractiveObject";
import Stage from "openfl/display/Stage";
import MouseEvent from "openfl/events/MouseEvent";
import ExternalInterface from "openfl/external/ExternalInterface";
import getTimer from "openfl/utils/getTimer";

import { BrowserInfo } from "./BrowserInfo";

/**
 * MouseWheelEnabler_JavaScript - Contains JavaScript code for mouse wheel support.
 */
export class MouseWheelEnabler_JavaScript {
    public static readonly CODE: string = `
        (function() {
            // create unique namespace
            if(typeof mws == "undefined" || !mws) {
                mws = {};
            }
            
            var userAgent = navigator.userAgent.toLowerCase();
            mws.agent = userAgent;
            mws.platform = {
                win:/win/.test(userAgent),
                mac:/mac/.test(userAgent),
                other:!/win/.test(userAgent) && !/mac/.test(userAgent)
            };
            
            mws.vars = {};
            
            mws.browser = {
                version: (userAgent.match(/.+(?:rv|it|ra|ie)[/: ]([\\d.]+)/) || [])[1],
                safari: /webkit/.test(userAgent) && !/chrome/.test(userAgent),
                opera: /opera/.test(userAgent),
                msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
                mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
                chrome: /chrome/.test(userAgent)
            };
            
            mws.findSwf = function(id) {
                var objects = document.getElementsByTagName("object");
                for(var i = 0; i < objects.length; i++) {
                    if(typeof objects[i][id] != "undefined") {
                        return objects[i];
                    }
                }
                
                var embeds = document.getElementsByTagName("embed");
                for(var j = 0; j < embeds.length; j++) {
                    if(typeof embeds[j][id] != "undefined") {
                        return embeds[j];
                    }
                }
                return null;
            }
            
            mws.usingWmode = function(swf) {
                if(typeof swf.getAttribute == "undefined") {
                    return false;
                }
                var wmode = swf.getAttribute("wmode");
                if(typeof wmode == "undefined") {
                    return false;
                }
                return true;
            }
            
            mws.log = function(message) {
                if(typeof console != "undefined") {
                    console.log(message);
                }
            }
            
            mws.shouldAddHandler = function(swf) {
                if(!swf) {
                    return false;
                }
                return true;
            }
            
            mws.getBrowserInfo = function() {
                return mws.browser;
            }
            
            mws.getAgentInfo = function() {
                return mws.agent;
            }
            
            mws.getPlatformInfo = function() {
                return mws.platform;
            }
            
            mws.addScrollListeners = function() {
                if(typeof window.addEventListener != 'undefined') {
                    window.addEventListener('DOMMouseScroll', _mousewheel, false);
                }
                window.onmousewheel = document.onmousewheel = _mousewheel;
            }
            
            mws.removeScrollListeners = function() {
                if(typeof window.removeEventListener != 'undefined') {
                    window.removeEventListener('DOMMouseScroll', _mousewheel, false);
                }
                window.onmousewheel = document.onmousewheel = null;
            }
            
            mws.InitMouseWheelSupport = function(id) {
                var swf = mws.findSwf(id);
                var shouldAdd = mws.shouldAddHandler(swf);
                
                if(shouldAdd) {
                    _mousewheel = function(event) {
                        if (!event) event = window.event;
                        
                        var rawDelta = 0;
                        var divisor = 1;
                        var scaledDelta = 0;
                        
                        if(event.wheelDelta) {
                            rawDelta = event.wheelDelta;
                            
                            if(mws.browser.opera) {
                                divisor = 12;
                            } else if(mws.browser.safari && mws.browser.version.split(".")[0] >= 528) {
                                divisor = 12;
                            } else {
                                divisor = 120;
                            }
                        } else if(event.detail) {
                            rawDelta = -event.detail;
                        } else {
                            rawDelta = 0;
                            scaledDelta = 0;
                        }
                        
                        if(Math.abs(rawDelta) >= divisor) {
                            scaledDelta = rawDelta/divisor;
                        } else {
                            scaledDelta = rawDelta;
                        }
                        
                        swf.externalMouseEvent(rawDelta, scaledDelta);
                        
                        if(event.preventDefault) {
                            event.preventDefault();
                        } else {
                            return false;
                        }
                        
                        return true;
                    }
                    
                    swf.onmouseover = mws.addScrollListeners;
                    swf.onmouseout = mws.removeScrollListeners;
                }
            }
        })
    `;

    constructor() { }
}

/**
 * MouseWheelEnabler - Enables mouse wheel support for Flash in browsers.
 */
export class MouseWheelEnabler {
    private static initialised: boolean = false;
    private static currentItem: InteractiveObject | null = null;
    private static browserMouseEvent: MouseEvent | null = null;
    private static lastEventTime: number = 0;
    public static useRawValues: boolean = false;
    public static eventTimeout: number = 50;

    constructor() { }

    public static init(stage: Stage, useRawValues: boolean = false): void {
        if (!MouseWheelEnabler.initialised) {
            MouseWheelEnabler.initialised = true;
            console.log("init mousewheel");
            MouseWheelEnabler.registerListenerForMouseMove(stage);
            MouseWheelEnabler.registerJS();
        }
        MouseWheelEnabler.useRawValues = useRawValues;
    }

    private static registerListenerForMouseMove(stage: Stage): void {
        stage.addEventListener(MouseEvent.MOUSE_MOVE, (event: MouseEvent) => {
            MouseWheelEnabler.currentItem = event.target as InteractiveObject;
            MouseWheelEnabler.browserMouseEvent = event;
        });
    }

    private static registerJS(): void {
        if (ExternalInterface.available) {
            const id = "mws_" + Math.floor(Math.random() * 1000000);
            ExternalInterface.addCallback(id, () => { });
            ExternalInterface.call(MouseWheelEnabler_JavaScript.CODE);
            ExternalInterface.call("mws.InitMouseWheelSupport", id);
            ExternalInterface.addCallback("externalMouseEvent", MouseWheelEnabler.handleExternalMouseEvent);
        }
    }

    private static handleExternalMouseEvent(rawDelta: number, scaledDelta: number): void {
        const currentTime = getTimer();
        if (currentTime >= MouseWheelEnabler.eventTimeout + MouseWheelEnabler.lastEventTime) {
            const delta = MouseWheelEnabler.useRawValues ? rawDelta : scaledDelta;
            if (Boolean(MouseWheelEnabler.currentItem) && Boolean(MouseWheelEnabler.browserMouseEvent)) {
                MouseWheelEnabler.currentItem!.dispatchEvent(new MouseEvent(
                    MouseEvent.MOUSE_WHEEL, true, false,
                    MouseWheelEnabler.browserMouseEvent!.localX, MouseWheelEnabler.browserMouseEvent!.localY,
                    MouseWheelEnabler.browserMouseEvent!.relatedObject,
                    MouseWheelEnabler.browserMouseEvent!.ctrlKey, MouseWheelEnabler.browserMouseEvent!.altKey,
                    MouseWheelEnabler.browserMouseEvent!.shiftKey, MouseWheelEnabler.browserMouseEvent!.buttonDown,
                    Math.floor(delta)
                ));
            }
            MouseWheelEnabler.lastEventTime = currentTime;
        }
    }

    public static getBrowserInfo(): BrowserInfo | null {
        if (ExternalInterface.available) {
            const browser = ExternalInterface.call("mws.getBrowserInfo");
            const platform = ExternalInterface.call("mws.getPlatformInfo");
            const agent = ExternalInterface.call("mws.getAgentInfo");
            return new BrowserInfo(browser, platform, agent);
        }
        return null;
    }
}
