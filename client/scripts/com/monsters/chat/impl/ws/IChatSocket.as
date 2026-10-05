package com.monsters.chat.impl.ws {
    import flash.events.IEventDispatcher;

    /**
     * The part of a WebSocket that WSChatSystem uses. Implementations dispatch
     * com.worlize.websocket.WebSocketEvent and WebSocketErrorEvent.
     */
    public interface IChatSocket extends IEventDispatcher {

        function connect():void;

        function sendUTF(data:String):void;

        function close(waitForServer:Boolean = true):void;
    }
}
