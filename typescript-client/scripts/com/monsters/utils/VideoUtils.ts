import Video from "openfl/media/Video";
import NetConnection from "openfl/net/NetConnection";
import NetStream from "openfl/net/NetStream";
import AsyncErrorEvent from "openfl/events/AsyncErrorEvent";
import NetStatusEvent from "openfl/events/NetStatusEvent";
import SecurityErrorEvent from "openfl/events/SecurityErrorEvent";

/**
 * Utility functions for video streaming and playback.
 */
export class VideoUtils {
    private static stream: NetStream | null = null;
    private static _videoURL: string = "";

    constructor() {}

    /**
     * Creates and returns a NetStream for video playback.
     */
    public static getVideoStream(video: Video, url: string | null = null): NetStream {
        const connection = new NetConnection();
        connection.addEventListener(NetStatusEvent.NET_STATUS, VideoUtils.netStatusHandler);
        connection.addEventListener(SecurityErrorEvent.SECURITY_ERROR, VideoUtils.securityErrorHandler);
        connection.connect(null);
        
        VideoUtils.stream = new NetStream(connection);
        VideoUtils.stream.addEventListener(NetStatusEvent.NET_STATUS, VideoUtils.netStatusHandler);
        VideoUtils.stream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, VideoUtils.asyncErrorHandler);
        (VideoUtils.stream as any).client = { onMetaData: VideoUtils.onMetaData };
        VideoUtils.stream.bufferTime = 0;
        
        if (url) {
            VideoUtils.stream.play(url);
            VideoUtils._videoURL = url;
        }
        
        video.attachNetStream(VideoUtils.stream);
        return VideoUtils.stream;
    }

    private static onMetaData(data: any): void {
        // Empty as in original
    }

    /**
     * Sets up looping for a NetStream.
     */
    public static loopStream(stream: NetStream): void {
        stream.addEventListener(NetStatusEvent.NET_STATUS, VideoUtils.loopNetStream);
    }

    private static netStatusHandler(event: NetStatusEvent): void {
        switch ((event as any).info.code) {
            case "NetStream.Play.StreamNotFound":
                // Handle stream not found
                break;
        }
    }

    private static securityErrorHandler(event: SecurityErrorEvent): void {
        // Empty as in original
    }

    private static asyncErrorHandler(event: AsyncErrorEvent): void {
        // Empty as in original
    }

    private static loopNetStream(event: NetStatusEvent): void {
        const info = (event as any).info;
        const target = event.target as NetStream;
        
        if (info.code === "NetStream.Play.Stop") {
            target.pause();
            (target as any).seek(0);
            target.resume();
        }
        
        if (info.code === "NetStream.Buffer.Empty") {
            if (VideoUtils.stream) {
                VideoUtils.stream.play(VideoUtils._videoURL);
            }
        }
    }
}
