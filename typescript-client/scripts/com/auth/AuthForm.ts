import { Sprite } from "openfl/display/Sprite";
import { Bitmap } from "openfl/display/Bitmap";
import { Loader } from "openfl/display/Loader";
import { TextField } from "openfl/text/TextField";
import { TextFormat } from "openfl/text/TextFormat";
import { TextFormatAlign } from "openfl/text/TextFormatAlign";
import { TextFieldType } from "openfl/text/TextFieldType";
import { TextFieldAutoSize } from "openfl/text/TextFieldAutoSize";
import { AntiAliasType } from "openfl/text/AntiAliasType";
import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";
import { FocusEvent } from "openfl/events/FocusEvent";
import { IOErrorEvent } from "openfl/events/IOErrorEvent";
import { SecurityErrorEvent } from "openfl/events/SecurityErrorEvent";
import { TimerEvent } from "openfl/events/TimerEvent";
import { URLRequest } from "openfl/net/URLRequest";
import { LoaderContext } from "openfl/system/LoaderContext";
import { Mouse } from "openfl/ui/Mouse";
import { MouseCursor } from "openfl/ui/MouseCursor";
import { Timer } from "openfl/utils/Timer";
import { DropShadowFilter } from "openfl/filters/DropShadowFilter";

import { GLOBAL } from "../../GLOBAL";
import { KEYS } from "../../KEYS";
import { LOGIN } from "../../LOGIN";
import { URLLoaderApi } from "../../URLLoaderApi";

/**
 * AuthForm - Authentication form UI for login/registration.
 * Handles user login, registration, language selection, and form validation.
 */
export class AuthForm extends Sprite {
    private isRegisterForm: boolean = false;
    private formContainer: Sprite | null = null;
    private borderContainer: Sprite | null = null;
    private loadingContainer: Sprite | null = null;
    private navContainer: Sprite | null = null;
    private selectField: Sprite | null = null;
    private dropdownMenu: Sprite | null = null;
    private usernameInput: TextField | null = null;
    private emailInput: TextField | null = null;
    private passwordInput: TextField | null = null;
    private usernameValue: string = "";
    private emailValue: string = "";
    private passwordValue: string = "";
    private emailErrorText: TextField | null = null;
    private passwordErrorText: TextField | null = null;
    private errMessage: TextField | null = null;
    private submitButton: Sprite | null = null;
    private hasAccountText: TextField | null = null;
    private defaultText: TextField | null = null;
    private hasAccountFormat: TextFormat | null = null;
    private button: Sprite | null = null;
    private buttonText: TextField | null = null;
    private image: Bitmap | null = null;
    private loader: Loader | null = null;
    private startY: number = 0;
    private verticalSpacingBetweenBlocks: number = 0;
    private BLACK: number = 0x000000;
    private WHITE: number = 0xFFFFFF;
    private RED: number = 0xFF0000;
    private BACKGROUND: number = 0x1D232A;
    private LIGHT_GRAY: number = 0xC9C9C9;
    private PRIMARY: number = 0x004DE5;
    private SECONDARY: number = 0x00CDB8;
    private checkContentLoadedTimer: Timer | null = null;
    private languages: Array<string> = [];

    constructor() {
        super();
        this.addEventListener(Event.ADDED_TO_STAGE, this.formAddedToStageHandler.bind(this));
        GLOBAL.eventDispatcher.addEventListener("initError", ((event: Event) => { this.errMessage!.text = GLOBAL.initError; if (this.loadingContainer && this.loadingContainer.parent) this.Loading(); }).bind(this));
        this.checkContentLoadedTimer = new Timer(1000);
        this.checkContentLoadedTimer.addEventListener(TimerEvent.TIMER, this.checkContentLoaded.bind(this));
        this.checkContentLoadedTimer.start();
    }

    private checkContentLoaded(event: TimerEvent): void {
        if (GLOBAL.textContentLoaded && GLOBAL.supportedLangsLoaded) {
            this.checkContentLoadedTimer!.stop();
            this.checkContentLoadedTimer!.removeEventListener(TimerEvent.TIMER, this.checkContentLoaded.bind(this));
            this.removeChild(this.loadingContainer!);
            this.handleContentLoaded();
        } else {
            if (!this.loadingContainer!.parent) this.Loading();
        }
    }

    public formAddedToStageHandler(event: Event): void {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.formAddedToStageHandler.bind(this));
        try { if (this.stage) (this.stage as any).color = this.BACKGROUND; }
        catch (e) { this.graphics.beginFill(this.BACKGROUND); this.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight); this.graphics.endFill(); }
        if (!GLOBAL.textContentLoaded && !GLOBAL.supportedLangsLoaded) this.Loading();
        else { this.removeChild(this.loadingContainer!); this.handleContentLoaded(); }
    }

    private handleContentLoaded(): void {
        this.navContainer = new Sprite();
        this.formContainer = new Sprite();
        this.usernameInput = new TextField();
        this.emailInput = new TextField();
        this.passwordInput = new TextField();
        this.emailErrorText = new TextField();
        this.buttonText = new TextField();
        this.passwordErrorText = new TextField();
        this.hasAccountText = new TextField();

        const formWidth = 450;
        const formHeight = 600;
        this.languages = KEYS.supportedLanguagesJson;
        const selectInput = this.createSelectInput();
        this.addChild(selectInput);
        selectInput.x = 20;
        selectInput.y = 10;
        this.HeaderTitle();
        this.addChild(this.navContainer);
        this.formContainer.graphics.drawRect(0, 0, formWidth, formHeight);
        this.formContainer.x = 155;
        this.formContainer.y = 45;
        this.addChild(this.formContainer);
        this.startY = 345;
        this.loader = new Loader();
        this.loader.load(new URLRequest(GLOBAL.cdnUrl + "assets/popups/C5-LAB-150.png"));
        this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onImageLoaded.bind(this));
        this.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, (e: IOErrorEvent) => { });
        this.usernameInput = this.createBlock(0, 0, "Username");
        this.emailInput = this.createBlock(350, 35, "Email");
        this.passwordInput = this.createBlock(350, 35, "Password", true);
        this.CreateBorder(this.emailInput);
        this.CreateBorder(this.passwordInput);
        this.submitButton = this.createButton();
        this.submitButton.x = (this.formContainer.width - this.submitButton.width) / 2;
        this.submitButton.y = this.startY + 28;
        this.formContainer.addChild(this.submitButton);
        this.submitButton.addEventListener(MouseEvent.CLICK, this.submitButtonClickHandler.bind(this));
        this.FormNavigate();
    }

    private Loading(): void {
        if (this.loadingContainer && this.loadingContainer.parent) this.loadingContainer.parent.removeChild(this.loadingContainer);
        this.loadingContainer = new Sprite();
        this.addChild(this.loadingContainer);
        const contentWidth = 400;
        const loadingTitle = new TextField();
        const titleFormat = new TextFormat();
        titleFormat.font = "Groboldov";
        titleFormat.size = 32;
        titleFormat.color = this.WHITE;
        titleFormat.align = TextFormatAlign.CENTER;
        loadingTitle.defaultTextFormat = titleFormat;
        loadingTitle.text = GLOBAL.versionMismatch ? "New Update Available!" : "Connecting to the server";
        loadingTitle.width = contentWidth;
        loadingTitle.height = 38;
        loadingTitle.x = 0;
        loadingTitle.selectable = false;
        loadingTitle.embedFonts = true;
        loadingTitle.antiAliasType = AntiAliasType.ADVANCED;
        loadingTitle.autoSize = TextFieldAutoSize.NONE;

        let loadingDesc: TextField | null = null;
        if (!GLOBAL.versionMismatch) {
            loadingDesc = new TextField();
            const descFormat = new TextFormat();
            descFormat.font = "Verdana";
            descFormat.size = 14;
            descFormat.color = this.LIGHT_GRAY;
            descFormat.align = TextFormatAlign.CENTER;
            loadingDesc.defaultTextFormat = descFormat;
            loadingDesc.htmlText = "<font color='#ffffff'>Taking a while? Check our </font><font color='#00CDB8'><u>#server-status</u></font><font color='#ffffff'> on Discord.</font>";
            loadingDesc.width = contentWidth;
            loadingDesc.height = 28;
            loadingDesc.x = 0;
            loadingDesc.y = 50;
            loadingDesc.selectable = false;
            loadingDesc.embedFonts = true;
            loadingDesc.antiAliasType = AntiAliasType.ADVANCED;
            loadingDesc.autoSize = TextFieldAutoSize.NONE;
            this.mousePointerCursor(loadingDesc);
            loadingDesc.addEventListener(MouseEvent.CLICK, AuthForm.DiscordLink);
            this.loadingContainer.addChild(loadingDesc);
        }

        this.errMessage = new TextField();
        const errFormat = new TextFormat();
        errFormat.font = "Verdana";
        errFormat.size = 16;
        errFormat.color = this.RED;
        errFormat.align = TextFormatAlign.CENTER;
        errFormat.leading = 5;
        this.errMessage.defaultTextFormat = errFormat;
        this.errMessage.htmlText = GLOBAL.initError;
        this.errMessage.width = contentWidth;
        this.errMessage.x = 0;
        this.errMessage.wordWrap = true;
        this.errMessage.multiline = true;
        this.errMessage.embedFonts = true;
        this.errMessage.antiAliasType = AntiAliasType.ADVANCED;
        this.errMessage.autoSize = TextFieldAutoSize.LEFT;

        if (GLOBAL.versionMismatch) {
            loadingTitle.y = 140;
            this.errMessage.y = 190;
            const updateImageLoader = new Loader();
            updateImageLoader.load(new URLRequest(GLOBAL.serverUrl + "assets/popups/fantastic.png"));
            updateImageLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, ((e: Event) => { const img = updateImageLoader.content as Bitmap; img.x = (contentWidth - img.width) / 2; img.y = 0; this.loadingContainer!.addChildAt(img, 0); }).bind(this));
        } else { loadingTitle.y = 0; this.errMessage.y = 90; }
        this.loadingContainer.addChild(loadingTitle);
        this.loadingContainer.addChild(this.errMessage);
        this.loadingContainer.x = 200;
        this.loadingContainer.y = 200;
    }

    public static DiscordLink(event: Event | null = null): void { GLOBAL.gotoURL("https://discord.gg/bymrefitted"); }

    private HeaderTitle(): void {
        const navWidth = 800;
        const navHeight = 50;
        this.navContainer!.graphics.drawRect(0, 0, navWidth, navHeight);
        this.navContainer!.x = -20;
        this.navContainer!.y = 50;
        const textContainer = new Sprite();
        this.navContainer!.addChild(textContainer);
        const titlePrefix = this.createRichText(KEYS.Get("auth_header_prefix"), this.WHITE);
        textContainer.addChild(titlePrefix);
        const titleSuffix = this.createRichText(KEYS.Get("auth_header_suffix"), this.SECONDARY);
        textContainer.addChild(titleSuffix);
        titleSuffix.x = titlePrefix.x + titlePrefix.width;
        textContainer.x = (navWidth - textContainer.width) / 2;
        textContainer.y = (navHeight - textContainer.height) / 2 + 30;
    }

    private createRichText(text: string, color: number): TextField {
        const textField = new TextField();
        const textFormat = new TextFormat();
        textFormat.font = "Groboldov";
        textFormat.size = 32;
        textFormat.color = color;
        textField.embedFonts = true;
        textField.antiAliasType = AntiAliasType.NORMAL;
        textField.autoSize = TextFieldAutoSize.LEFT;
        textField.defaultTextFormat = textFormat;
        textField.text = text;
        return textField;
    }

    private onImageLoaded(event: Event): void {
        this.image = this.loader!.content as Bitmap;
        this.image.x = 150;
        this.image.y = 150;
        this.image.scaleX = 1;
        this.image.scaleY = 1;
        this.formContainer!.addChild(this.image);
    }

    private createBlock(width: number, height: number, placeholder: string = "", isPassword: boolean = false): TextField {
        const input = this.createInputField(width, height, placeholder, isPassword);
        this.formContainer!.addChild(input);
        input.x = (this.formContainer!.width - input.width) / 2;
        input.y = this.startY;
        input.addEventListener(Event.CHANGE, ((event: Event) => { if (placeholder === "Email") this.emailValue = input.text; else if (placeholder === "Password") this.passwordValue = input.text; else if (placeholder === "Username") this.usernameValue = input.text; }).bind(this));
        this.startY += input.height + 20;
        return input;
    }

    private createInputField(width: number, height: number, placeholder: string = "", isPassword: boolean = false): TextField {
        const input = new TextField();
        input.background = true;
        input.backgroundColor = this.BACKGROUND;
        input.type = TextFieldType.INPUT;
        input.width = width;
        input.height = height;
        const inputTextFormat = new TextFormat();
        inputTextFormat.font = "Verdana";
        inputTextFormat.size = 14;
        inputTextFormat.color = this.WHITE;
        input.embedFonts = true;
        input.antiAliasType = AntiAliasType.NORMAL;
        input.defaultTextFormat = inputTextFormat;
        const placeholderTextFormat = new TextFormat();
        placeholderTextFormat.font = "Verdana";
        placeholderTextFormat.size = 14;
        placeholderTextFormat.color = this.WHITE;
        input.text = placeholder;
        input.setTextFormat(placeholderTextFormat);
        if (isPassword) input.displayAsPassword = true;
        if (placeholder) {
            input.text = placeholder;
            input.addEventListener(FocusEvent.FOCUS_IN, ((event: FocusEvent) => { if (input.text === placeholder) { input.text = ""; input.setTextFormat(inputTextFormat); } }).bind(this));
            input.addEventListener(FocusEvent.FOCUS_OUT, ((event: FocusEvent) => { if (input.text === "") { input.text = placeholder; input.setTextFormat(placeholderTextFormat); } }).bind(this));
        }
        return input;
    }

    private createSelectInput(defaultOption: string = "English"): Sprite {
        this.selectField = new Sprite();
        const selectWidth = 80;
        const selectHeight = 30;
        this.selectField.graphics.lineStyle(1, this.WHITE);
        this.selectField.graphics.drawRect(0, 0, selectWidth, selectHeight);
        this.defaultText = new TextField();
        const defaultTextStyle = new TextFormat();
        defaultTextStyle.font = "Groboldov";
        defaultTextStyle.size = 13;
        this.defaultText.textColor = this.WHITE;
        this.defaultText.embedFonts = true;
        this.defaultText.defaultTextFormat = defaultTextStyle;
        this.defaultText.text = defaultOption.toLocaleUpperCase();
        this.defaultText.x = (selectWidth - this.defaultText.textWidth) / 2;
        this.defaultText.y = (selectHeight - this.defaultText.textHeight) / 2;
        this.mousePointerCursor(this.defaultText);
        this.selectField.addChild(this.defaultText);
        this.dropdownMenu = new Sprite();
        this.dropdownMenu.visible = false;
        this.selectField.addChild(this.dropdownMenu);
        for (let index = 0; index < this.languages.length; index++) {
            const langSelectText = new TextField();
            const langSelectTextStyle = new TextFormat();
            langSelectTextStyle.font = "Groboldov";
            langSelectTextStyle.size = 13;
            langSelectText.embedFonts = true;
            langSelectText.textColor = this.WHITE;
            langSelectText.defaultTextFormat = langSelectTextStyle;
            langSelectText.text = this.languages[index].toLocaleUpperCase();
            langSelectText.y = index * 30;
            langSelectText.width = 200;
            langSelectText.selectable = false;
            langSelectText.antiAliasType = AntiAliasType.NORMAL;
            langSelectText.addEventListener(MouseEvent.CLICK, this.langSelectClickHandler.bind(this));
            this.mousePointerCursor(langSelectText);
            this.dropdownMenu.addChild(langSelectText);
        }
        this.selectField.addEventListener(MouseEvent.CLICK, ((event: MouseEvent) => { this.dropdownMenu!.visible = !this.dropdownMenu!.visible; }).bind(this));
        this.dropdownMenu.y = 50;
        return this.selectField;
    }

    private langSelectClickHandler(event: MouseEvent): void {
        const selectedLanguage = (event.currentTarget as TextField).text;
        this.defaultText!.text = selectedLanguage;
        this.defaultText!.width = 200;
        this.dropdownMenu!.visible = true;
        const textWidth = this.defaultText!.textWidth;
        const newSelectWidth = textWidth + 23;
        this.selectField!.graphics.clear();
        this.selectField!.graphics.lineStyle(1, this.WHITE);
        this.selectField!.graphics.drawRect(0, 0, newSelectWidth, 30);
        for (const language of this.languages) { if (selectedLanguage.toLocaleLowerCase() === language.toLocaleLowerCase()) { KEYS.Setup(language.toLowerCase()); return; } }
        KEYS.Setup("english");
    }

    private CreateBorder(input: TextField): Sprite {
        this.borderContainer = new Sprite();
        this.borderContainer.graphics.lineStyle(1, this.WHITE);
        this.borderContainer.graphics.moveTo(0, 2);
        this.borderContainer.graphics.lineTo(input.width, 2);
        this.borderContainer.x = input.x;
        this.borderContainer.y = input.y + input.height;
        this.formContainer!.addChild(this.borderContainer);
        return this.borderContainer;
    }

    private createButton(): Sprite {
        const formRadius = 16;
        this.button = new Sprite();
        this.updateButtonColor();
        this.button.buttonMode = true;
        this.button.useHandCursor = true;
        this.button.mouseChildren = false;
        this.buttonText = new TextField();
        this.buttonText.textColor = this.WHITE;
        this.buttonText.width = this.button.width;
        this.buttonText.height = this.button.height;
        this.buttonText.selectable = false;
        this.buttonText.mouseEnabled = false;
        const textFormat = new TextFormat();
        textFormat.font = "Groboldov";
        textFormat.size = 16;
        textFormat.align = TextFormatAlign.CENTER;
        this.buttonText.embedFonts = true;
        this.buttonText.defaultTextFormat = textFormat;
        this.updateButtonText();
        this.buttonText.autoSize = TextFieldAutoSize.CENTER;
        this.buttonText.x = (this.button.width - this.buttonText.width) / 2;
        this.buttonText.y = (this.button.height - this.buttonText.height) / 2;
        this.mousePointerCursor(this.button);
        this.button.addChild(this.buttonText);
        return this.button;
    }

    private FormNavigate(): void {
        const linkContainer = new Sprite();
        linkContainer.buttonMode = true;
        linkContainer.useHandCursor = true;
        linkContainer.mouseChildren = false;
        this.hasAccountText = new TextField();
        this.hasAccountText.autoSize = TextFieldAutoSize.LEFT;
        this.hasAccountText.x = linkContainer.width / 2;
        this.hasAccountFormat = new TextFormat();
        this.hasAccountFormat.size = 16;
        this.updateLinkColour();
        this.updateLinkText();
        this.hasAccountText.y = 0;
        linkContainer.addChild(this.hasAccountText);
        linkContainer.x = (this.formContainer!.width - linkContainer.width) / 2;
        linkContainer.y = this.submitButton!.y + this.submitButton!.height + 15;
        this.mousePointerCursor(linkContainer);
        this.formContainer!.addChild(linkContainer);
        linkContainer.addEventListener(MouseEvent.CLICK, ((event: Event) => { this.isRegisterForm = !this.isRegisterForm; this.updateState(); }).bind(this));
    }

    private updateFormFields(): void { if (this.isRegisterForm) { this.usernameInput!.width = 350; this.usernameInput!.height = 35; this.usernameInput!.x = 50; this.usernameInput!.y = this.emailInput!.y - this.usernameInput!.height - 20; this.CreateBorder(this.usernameInput!); } }
    private updateLinkText(): void { this.hasAccountText!.embedFonts = true; this.hasAccountText!.antiAliasType = AntiAliasType.NORMAL; this.hasAccountText!.text = this.isRegisterForm ? KEYS.Get("auth_login_link") : KEYS.Get("auth_register_link"); }
    private updateLinkColour(): void { this.hasAccountFormat!.color = this.isRegisterForm ? this.SECONDARY : this.PRIMARY; this.hasAccountFormat!.font = "Verdana"; this.hasAccountText!.defaultTextFormat = this.hasAccountFormat!; this.hasAccountText!.setTextFormat(this.hasAccountFormat!); }
    private updateButtonText(): void { this.button!.graphics.beginFill(this.isRegisterForm ? this.PRIMARY : this.SECONDARY); this.buttonText!.text = this.isRegisterForm ? KEYS.Get("auth_register_btn").toUpperCase() : KEYS.Get("auth_login_btn").toUpperCase(); }
    private updateButtonColor(): void { this.button!.graphics.beginFill(this.isRegisterForm ? this.SECONDARY : this.PRIMARY); this.button!.graphics.drawRoundRect(0, 0, 350, 50, 12); this.button!.graphics.endFill(); }

    private mousePointerCursor(element: any): void {
        element.addEventListener(MouseEvent.ROLL_OVER, (e: MouseEvent) => { Mouse.cursor = MouseCursor.BUTTON; });
        element.addEventListener(MouseEvent.ROLL_OUT, (e: MouseEvent) => { Mouse.cursor = MouseCursor.AUTO; });
    }

    private submitButtonClickHandler(event: MouseEvent): void {
        this.clearErrorMessages();
        const isUsernameValid = this.isValidUsername(this.usernameValue);
        const isEmailValid = this.isValidEmail(this.emailValue);
        const isPasswordValid = this.isValidPassword(this.passwordValue);
        if (isEmailValid && isPasswordValid) {
            if (this.isRegisterForm) {
                if (isUsernameValid) {
                    const newUser: Array<any> = [["username", this.usernameValue], ["email", this.emailValue], ["password", this.passwordValue], ["last_name", ""], ["pic_square", ""]];
                    new URLLoaderApi().load(GLOBAL._apiURL + "player/register", newUser, this.registerNewUser.bind(this), (event: IOErrorEvent) => { GLOBAL.Message("An error occurred during registration on the server."); });
                } else { GLOBAL.Message("<b>Usernames must be:</b><br><br>• At least 2 characters long.<br>• No longer than 12 characters.<br>• Can only include numbers and letters."); }
            } else { new URLLoaderApi().load(GLOBAL._apiURL + "bm/getnewmap", null, this.postAuthDetails.bind(this), (event: IOErrorEvent) => { GLOBAL.Message("We cannot connect you to the server at this time. Please try again later or check our server status."); }); }
        } else {
            if (!isEmailValid) this.showErrorMessage(this.emailInput!, "Please enter a valid email address");
            if (!isPasswordValid) this.showErrorMessage(this.passwordInput!, "Password must be at least 8 characters long, contain at least 1 uppercase\nletter, and 1 special character");
            if (!isUsernameValid && this.isRegisterForm) GLOBAL.Message("<b>Usernames must be:</b><br><br>• At least 2 characters long.<br>• No longer than 12 characters.<br>• Can only include numbers and letters.");
        }
    }

    private postAuthDetails(serverData: any): void { LOGIN.OnGetNewMap(serverData, [["email", this.emailValue], ["password", this.passwordValue]]); }
    private registerNewUser(serverData: any): void { if (serverData.hasOwnProperty("error")) { GLOBAL.Message(serverData.error); return; } GLOBAL.Message("You have successfully registered an account. Please login to continue."); this.isRegisterForm = false; this.updateState(); }
    private isValidUsername(username: string): boolean { const pattern = /^[a-zA-Z0-9_]+$/; return username.length >= 2 && username.length <= 12 && pattern.test(username); }
    private isValidEmail(email: string): boolean { const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; return emailPattern.test(email); }
    private isValidPassword(password: string): boolean { const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])(?=.{8,})/; return passwordRegex.test(password); }
    private clearErrorMessages(): void { this.emailErrorText!.text = ""; this.passwordErrorText!.text = ""; }

    private showErrorMessage(inputField: TextField, errorMessage: string): void {
        const errorText = new TextField();
        errorText.htmlText = errorMessage;
        errorText.textColor = this.RED;
        errorText.x = inputField.x;
        errorText.y = inputField.y + inputField.height + 5;
        errorText.width = inputField.width + 100;
        errorText.height = 40;
        this.formContainer!.addChild(errorText);
        if (inputField === this.emailInput) this.emailErrorText = errorText;
        else if (inputField === this.passwordInput) this.passwordErrorText = errorText;
    }

    public updateState(): void { this.updateFormFields(); this.updateButtonText(); this.updateButtonColor(); this.updateLinkText(); this.updateLinkColour(); }

    public disposeUI(): void {
        this.submitButton!.removeEventListener(MouseEvent.CLICK, this.submitButtonClickHandler.bind(this));
        this.formContainer!.removeChild(this.submitButton!);
        this.formContainer!.removeChild(this.emailInput!);
        this.formContainer!.removeChild(this.passwordInput!);
        this.removeChild(this.formContainer!);
        if (this.image) { this.image.bitmapData.dispose(); this.formContainer!.removeChild(this.image); }
        this.loader!.unload();
        this.loader!.contentLoaderInfo.removeEventListener(Event.COMPLETE, this.onImageLoaded.bind(this));
        this.submitButton = null;
        this.emailInput = null;
        this.passwordInput = null;
        this.image = null;
        this.loader = null;
        if (this.formContainer!.parent) this.formContainer!.parent.removeChild(this.formContainer!);
    }
}
