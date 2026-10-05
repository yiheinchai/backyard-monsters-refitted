package com.monsters.chat.impl.ws {
    import com.worlize.websocket.WebSocketErrorEvent;
    import com.worlize.websocket.WebSocketEvent;
    import com.worlize.websocket.WebSocketMessage;
    import flash.events.EventDispatcher;
    import flash.external.ExternalInterface;

    /**
     * A WebSocket opened by the page hosting the browser build, through ExternalInterface.
     *
     * Ruffle cannot open the raw TCP socket that com.worlize.websocket.WebSocket is built on, so
     * the browser build hands the connection to the browser's own WebSocket instead. The page
     * defines bymrSocket.open/send/close and reports back through the bymrSocketEvent callback.
     */
    public class BrowserWebSocket extends EventDispatcher implements IChatSocket {

        private static var _sockets:Object = {};

        private static var _nextId:int = 1;

        private static var _callbackAdded:Boolean = false;

        private var _id:int;

        private var _host:String;

        private var _port:int;

        private var _opened:Boolean = false;

        /**
         * @param host The chat server host.
         * @param port The chat server port.
         */
        public function BrowserWebSocket(host:String, port:int) {
            super();
            _id = _nextId++;
            _host = host;
            _port = port;
        }

        public function connect():void {
            if (!ExternalInterface.available) {
                dispatchEvent(new WebSocketErrorEvent(WebSocketErrorEvent.CONNECTION_FAIL, false, false, "ExternalInterface unavailable"));
                return;
            }
            if (!_callbackAdded) {
                ExternalInterface.addCallback("bymrSocketEvent", onSocketEvent);
                _callbackAdded = true;
            }
            _sockets[_id] = this;
            ExternalInterface.call("bymrSocket.open", _id, _host, _port);
        }

        public function sendUTF(data:String):void {
            ExternalInterface.call("bymrSocket.send", _id, data);
        }

        public function close(waitForServer:Boolean = true):void {
            delete _sockets[_id];
            ExternalInterface.call("bymrSocket.close", _id);
        }

        /**
         * Receives every socket event from the page and forwards it to the socket it belongs to.
         *
         * @param id The socket id passed to bymrSocket.open.
         * @param type One of open, message, error or close.
         * @param data The message text for message events, otherwise a reason (may be empty).
         */
        private static function onSocketEvent(id:int, type:String, data:String):void {
            var socket:BrowserWebSocket = _sockets[id] as BrowserWebSocket;
            if (socket) {
                socket.handleEvent(type, data);
            }
        }

        private function handleEvent(type:String, data:String):void {
            var event:WebSocketEvent;
            switch (type) {
                case "open":
                    _opened = true;
                    dispatchEvent(new WebSocketEvent(WebSocketEvent.OPEN));
                    break;
                case "message":
                    event = new WebSocketEvent(WebSocketEvent.MESSAGE);
                    event.message = new WebSocketMessage();
                    event.message.type = WebSocketMessage.TYPE_UTF8;
                    event.message.utf8Data = data;
                    dispatchEvent(event);
                    break;
                case "error":
                    dispatchEvent(new WebSocketErrorEvent(_opened ? WebSocketErrorEvent.ABNORMAL_CLOSE : WebSocketErrorEvent.CONNECTION_FAIL, false, false, data));
                    break;
                case "close":
                    delete _sockets[_id];
                    dispatchEvent(new WebSocketEvent(WebSocketEvent.CLOSED));
                    break;
            }
        }
    }
}
