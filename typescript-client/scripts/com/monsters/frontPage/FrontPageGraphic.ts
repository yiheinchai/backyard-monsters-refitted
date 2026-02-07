import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";
import Video from "openfl/media/Video";
import NetStream from "openfl/net/NetStream";

import { ImageCache } from "../display/ImageCache";
import { VideoUtils } from "../utils/VideoUtils";
import { Category } from "./categories/Category";
import { FrontPageEvent } from "./events/FrontPageEvent";
import { Message } from "./messages/Message";

import { popup_frontpage_CLIP } from "../../../popup_frontpage_CLIP";
import { frontpage_featuredItem_CLIP } from "../../../frontpage_featuredItem_CLIP";
import { CarouselCategoryButton2 } from "../../../CarouselCategoryButton2";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../KEYS").KEYS; }


declare class TweenLite {
    static to(target: any, duration: number, vars: any): void;
    static killTweensOf(target: any): void;
}

/**
 * Carousel category - internal class for category buttons.
 */
class CarouselCategory extends Sprite {
    private static readonly _DOES_DISPLAY_LABEL: boolean = false;
    private static readonly _TWEEN_SCALE_NORMAL: number = 0.5;
    private static readonly _TWEEN_SCALE_ON: number = 0.75;
    private static readonly _TWEEN_SCALE_EXTRA: number = 0.8;

    public category: Category;
    public button: CarouselCategoryButton2;
    private _isActive: boolean = false;

    constructor(category: Category, isActive: boolean = false) {
        super();
        this.button = new CarouselCategoryButton2();
        this.button.buttonMode = true;
        this.addChild(this.button);
        this.category = category;
        this.isActive = isActive;
        this.button.tLabel.htmlText = category.name;
        this.button.tLabel.visible = CarouselCategory._DOES_DISPLAY_LABEL;
        
        this.addEventListener(MouseEvent.ROLL_OUT, this.onRollOut.bind(this), false, 0, true);
        this.addEventListener(MouseEvent.ROLL_OVER, this.onRollOver.bind(this), false, 0, true);
        this.button.mcBar.gotoAndStop(1);
        
        TweenLite.to(this.button.mcBar, 0, {
            scaleX: CarouselCategory._TWEEN_SCALE_NORMAL,
            scaleY: CarouselCategory._TWEEN_SCALE_NORMAL,
            ease: "Expo.easeOut"
        });
        this.toggleAnimations();
    }

    private onRollOut(e: MouseEvent): void {
        if (!this._isActive) {
            this.onDeactivate();
        }
    }

    private onRollOver(e: MouseEvent): void {
        TweenLite.to(this.button.mcBar, 0.75, {
            scaleX: CarouselCategory._TWEEN_SCALE_ON,
            scaleY: CarouselCategory._TWEEN_SCALE_ON,
            ease: "Elastic.easeOut",
            delay: 0
        });
    }

    private onActivate(e: MouseEvent | null = null): void {
        TweenLite.killTweensOf(this.button.mcBar);
        TweenLite.to(this.button.mcBar, 0.25, {
            scaleX: CarouselCategory._TWEEN_SCALE_EXTRA,
            scaleY: CarouselCategory._TWEEN_SCALE_EXTRA,
            ease: "Elastic.easeOut"
        });
        TweenLite.to(this.button.mcBar, 0.15, {
            scaleX: CarouselCategory._TWEEN_SCALE_ON,
            scaleY: CarouselCategory._TWEEN_SCALE_ON,
            ease: "Expo.easeOut",
            delay: 0.25
        });
        this.button.mcBar.gotoAndStop(1);
    }

    private onDeactivate(e: MouseEvent | null = null): void {
        TweenLite.killTweensOf(this.button.mcBar);
        TweenLite.to(this.button.mcBar, 0.2, {
            scaleX: CarouselCategory._TWEEN_SCALE_NORMAL,
            scaleY: CarouselCategory._TWEEN_SCALE_NORMAL,
            ease: "Expo.easeOut"
        });
        this.button.mcBar.gotoAndStop(2);
    }

    private toggleAnimations(): void {
        if (this._isActive) {
            this.onActivate();
        } else {
            this.onDeactivate();
        }
    }

    public set isActive(value: boolean) {
        if (this._isActive !== value) {
            this._isActive = value;
            this.toggleAnimations();
        }
    }
}

/**
 * Front page graphic - UI component for front page popup.
 */
export class FrontPageGraphic extends popup_frontpage_CLIP {
    public static readonly MEDIA_WIDTH: number = 620;
    public static readonly MEDIA_HEIGHT: number = 340;

    private _activeMessage: Message | null = null;
    private _media: DisplayObject | null = null;
    private _videoStream: NetStream | null = null;
    private _carousel: Sprite | null = null;
    private _container: frontpage_featuredItem_CLIP | null = null;

    constructor(message: Message | null = null) {
        super();
        
        this.bNext.visible = false;
        this.bPrev.visible = false;
        (this.bNext as any).tLabel.htmlText = getKEYS().Get("btn_next");
        (this.bPrev as any).tLabel.htmlText = getKEYS().Get("btn_prev");
        this.bNext.mouseChildren = false;
        this.bPrev.mouseChildren = false;
        this.bNext.buttonMode = true;
        this.bPrev.buttonMode = true;
        
        this.bNext.addEventListener(MouseEvent.CLICK, this.clickedNext.bind(this));
        this.bPrev.addEventListener(MouseEvent.CLICK, this.clickedPrevious.bind(this));
        this.addEventListener(MouseEvent.ROLL_OVER, this.rollOver.bind(this));
        this.addEventListener(MouseEvent.ROLL_OUT, this.rollOut.bind(this));
        
        if (message) {
            this.showMessage(message);
        }
    }

    private rollOver(e: MouseEvent): void {
        this.tweenNavigationButtonAlphaTo(1);
    }

    private rollOut(e: MouseEvent): void {
        this.tweenNavigationButtonAlphaTo(0);
    }

    private tweenNavigationButtonAlphaTo(alpha: number): void {
        TweenLite.to(this.bNext, 0.25, { alpha: alpha });
        TweenLite.to(this.bPrev, 0.25, { alpha: alpha });
    }

    private clickedNext(e: MouseEvent): void {
        this.dispatchEvent(new FrontPageEvent(FrontPageEvent.NEXT));
    }

    private clickedPrevious(e: MouseEvent): void {
        this.dispatchEvent(new FrontPageEvent(FrontPageEvent.PREVIOUS));
    }

    public destroy(): void {
        this.bNext.removeEventListener(MouseEvent.CLICK, this.clickedNext.bind(this));
        this.bPrev.removeEventListener(MouseEvent.CLICK, this.clickedPrevious.bind(this));
        this.removeEventListener(MouseEvent.ROLL_OVER, this.rollOver.bind(this));
        this.removeEventListener(MouseEvent.ROLL_OUT, this.rollOut.bind(this));
    }

    public updateCategories(activeCategory: Category, categories: Array<Category>): void {
        if (this._carousel) {
            this.mcCarousel.removeChild(this._carousel);
        }
        
        this._carousel = new Sprite();
        let xPos = 0;
        let firstButtonHalfWidth = 0;
        
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            const button = new CarouselCategory(category, category === activeCategory);
            button.addEventListener(MouseEvent.CLICK, this.clickedCategory.bind(this), false, 0, true);
            button.x = xPos;
            this._carousel.addChild(button);
            xPos += button.width;
            
            if (i + 1 < categories.length) {
                xPos += 5;
            }
            
            if (firstButtonHalfWidth === 0) {
                firstButtonHalfWidth = button.width / 2;
            }
        }
        
        this._carousel.x = -(this._carousel.width * 0.5) + firstButtonHalfWidth;
        this.mcCarousel.addChild(this._carousel);
    }

    protected clickedCategory(e: MouseEvent): void {
        const button = e.currentTarget as CarouselCategory;
        this.dispatchEvent(new FrontPageEvent(FrontPageEvent.CHANGE_CATEGORY, button.category));
    }

    public showMessage(message: Message): void {
        this._container = this.createMessageContainer();
        this._container.tTitle.htmlText = message.title;
        this._container.tBody.htmlText = message.body;
        
        if (this._media) {
            this.clearMedia();
        }
        
        if (message.videoURL) {
            this.loadVideo(message.videoURL);
        } else if (message.imageURL) {
            ImageCache.GetImageWithCallBack(message.imageURL, this.loadedImage.bind(this));
        }
        
        message.setupButton(this._container.bAction);
    }

    private createMessageContainer(): frontpage_featuredItem_CLIP {
        if (this._container) {
            TweenLite.to(this._container, 0.5, {
                alpha: 0,
                onComplete: this.removeOldContainer.bind(this),
                onCompleteParams: [this._container]
            });
        }
        
        this._container = new frontpage_featuredItem_CLIP();
        this.mcContainer.addChildAt(this._container, 0);
        return this._container;
    }

    private removeOldContainer(container: frontpage_featuredItem_CLIP): void {
        this.mcContainer.removeChild(container);
    }

    private loadVideo(videoURL: string): void {
        this._media = new Video(FrontPageGraphic.MEDIA_WIDTH, FrontPageGraphic.MEDIA_HEIGHT);
        this._videoStream = VideoUtils.getVideoStream(this._media as Video, videoURL);
        VideoUtils.loopStream(this._videoStream);
        if (this._container) {
            this._container.mcImage.addChild(this._media);
        }
    }

    private clearMedia(): void {
        if (this._videoStream) {
            this._videoStream.close();
        }
    }

    private loadedImage(path: string, data: BitmapData): void {
        this._media = new Bitmap(data);
        if (this._container) {
            this._container.mcImage.addChild(this._media);
        }
    }
}
