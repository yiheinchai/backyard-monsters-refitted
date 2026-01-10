import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";
import TextField from "openfl/text/TextField";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";
import TextFieldType from "openfl/text/TextFieldType";
import TextFormat from "openfl/text/TextFormat";

/**
 * Abstract chat box - base class for chat UI components.
 */
export class AbstractChatBox extends MovieClip {
    protected _displayAssets: MovieClip;
    protected _chats: Array<string>;
    protected _borderColor: number = 0;
    protected _thumbColor: number = 0;
    protected _inputColor: number = 0;
    protected _defaultColor: number = 3355443;
    protected _outputColor: number = 0;
    protected _fontName: string = "_sans";
    protected _fontSize: number = 9;
    protected _inputHeight: number;
    protected _defaultTxtBG: number = 14596743;
    protected _highlightTxtBG: number = 15918030;
    protected fmt: TextFormat;
    protected fmt_input: TextFormat;
    protected fmt_userIndent: TextFormat;

    constructor(displayAssets: MovieClip) {
        super();
        this._chats = [];
        this._inputHeight = this._fontSize + 5;
        this.fmt = new TextFormat(this._fontName, this._fontSize, this._defaultColor);
        this.fmt_input = new TextFormat(this._fontName, this._fontSize, this._inputColor);
        this.fmt_userIndent = new TextFormat(this._fontName, this._fontSize, this._defaultColor);
        this._displayAssets = displayAssets;
        this.addChild(this._displayAssets);
    }

    public init(): void {
        // Base implementation - override in subclass
    }

    protected createInput(inputWidth: number): TextField {
        const textField: TextField = new TextField();
        textField.defaultTextFormat = this.fmt_input;
        textField.background = true;
        textField.width = inputWidth;
        textField.height = this._inputHeight;
        textField.autoSize = TextFieldAutoSize.NONE;
        textField.multiline = false;
        textField.wordWrap = false;
        textField.selectable = true;
        textField.mouseEnabled = true;
        textField.type = TextFieldType.INPUT;
        textField.text = "";
        return textField;
    }

    public push(message: string, param2: string | null = null, param3: string | null = null, param4: string | null = null, keepAll: boolean = false): void {
        this._chats.push(message);
        let fullText: string = "";
        if (!keepAll) {
            while (this._chats.length > 40) {
                this._chats.shift();
            }
        }
        for (const chat of this._chats) {
            fullText += chat + "<br>";
        }
        this.background._output.htmlText = fullText;
        this.background._output.autoSize = TextFieldAutoSize.LEFT;
    }

    public get inputText(): string {
        if (this.input !== null) {
            return this.input.text;
        }
        return "";
    }

    public clearInputText(): void {
        if (this.input !== null) {
            this.input.text = "";
        }
    }

    protected onHideOver(event: MouseEvent): void {
        // Override in subclass
    }

    protected onHideOut(event: MouseEvent): void {
        // Override in subclass
    }

    public update(): void {
        // Override in subclass
    }

    public clearChat(): void {
        this._chats = [];
    }

    public get background(): MovieClip {
        return null!;
    }

    public get input(): TextField {
        return null!;
    }

    public get output(): TextField {
        return null!;
    }
}
