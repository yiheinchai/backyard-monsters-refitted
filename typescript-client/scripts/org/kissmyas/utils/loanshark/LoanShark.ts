import Event from "openfl/events/Event";
import EventDispatcher from "openfl/events/EventDispatcher";

/**
 * LoanShark - Object pooling utility for performance optimization.
 */
export class LoanShark {
    public static readonly EVENT_CLEANED: string = "cleaned";
    public static readonly EVENT_FLUSHED: string = "flushed";
    public static readonly EVENT_DISPOSED: string = "disposed";
    public static readonly ERROR_RECYCLE_UNUSED: number = 1;
    public static readonly ERROR_NULL_CHECK_IN: number = 2;
    public static readonly ERROR_CHECK_IN_TYPE: number = 3;
    public static readonly ERROR_MULTI_CHECK_IN: number = 4;

    private _ObjectClass: any;
    private _size: number = 0;
    private _bufferSize: number = 0;
    private _pool: Array<any>;
    private _objectsInUse: Array<any>;
    private _maxBuffer: number;
    private _initObject: any;
    private _resetMethod: string;
    private _disposeMethod: string;
    private _dispatcher: EventDispatcher;
    private _idealArrayInitialSize: number = 500;
    private _strictMode: boolean;

    constructor(
        objectClass: any,
        strictMode: boolean = false,
        initialSize: number = 0,
        maxBuffer: number = 0,
        initObject: any = null,
        resetMethod: string = "",
        disposeMethod: string = ""
    ) {
        this._dispatcher = new EventDispatcher();
        this._ObjectClass = objectClass;
        this._strictMode = strictMode;
        if (initialSize > this._idealArrayInitialSize) {
            this._idealArrayInitialSize = initialSize;
        }
        this._pool = new Array(this._idealArrayInitialSize);
        this._objectsInUse = [];
        this._maxBuffer = maxBuffer;
        this._initObject = initObject;
        this._resetMethod = resetMethod;
        this._disposeMethod = disposeMethod;

        for (let i = 0; i < initialSize; i++) {
            this.createAndAddObject();
        }
    }

    public borrowObject(): any {
        let obj: any;
        if (this._bufferSize === 0) {
            obj = this.createObject();
        } else {
            obj = this._pool[--this._bufferSize];
        }
        if (this._strictMode) {
            this._objectsInUse.push(obj);
        }
        return obj;
    }

    public returnObject(obj: any): void {
        const isCorrectType = obj instanceof this._ObjectClass;
        let alreadyCheckedIn = false;
        if (this._strictMode) {
            const idx = this._objectsInUse.indexOf(obj);
            if (idx === -1) {
                alreadyCheckedIn = true;
            } else {
                this._objectsInUse.splice(idx, 1);
            }
        }
        if (obj && isCorrectType && this.used > 0 && !alreadyCheckedIn) {
            this.addToPool(obj, true);
        } else if (this._strictMode) {
            if (!this.used) {
                throw new Error("You cannot return an object to a pool with no checked-out items.");
            }
            if (obj === null) {
                throw new Error("You cannot return a null object reference to the pool.");
            }
            if (!isCorrectType) {
                throw new Error("You cannot return an object of the wrong type.");
            }
            if (alreadyCheckedIn) {
                throw new Error("You cannot return an object to the pool when it's already checked-in.");
            }
        }
        if (this._maxBuffer && this._bufferSize > this._maxBuffer) {
            this.clean();
        }
    }

    public get size(): number {
        return this._size;
    }

    public get unused(): number {
        return this._bufferSize;
    }

    public get used(): number {
        return this._size - this._bufferSize;
    }

    public get ObjectClass(): any {
        return this._ObjectClass;
    }

    public clean(): void {
        const count = this._bufferSize;
        if (count > 0) {
            const toDispose = Math.min(this._size, count);
            this.disposeObjects();
            this.createList();
            this._bufferSize = 0;
            this._size -= toDispose;
        }
        this.dispatch(LoanShark.EVENT_CLEANED);
    }

    public flush(force: boolean = false, dispose: boolean = false): void {
        if (this.used > 0 && !force) {
            return;
        }
        if (dispose) {
            this.disposeObjects();
        }
        this._size = this._bufferSize = 0;
        this.createList();
        this.dispatch(LoanShark.EVENT_FLUSHED);
    }

    public dispose(): void {
        this.flush(true, true);
        this._ObjectClass = null;
        this._initObject = null;
        this._pool = [];
        this._objectsInUse = [];
        this._resetMethod = "";
        this._disposeMethod = "";
        this.dispatch(LoanShark.EVENT_DISPOSED);
    }

    public addEventListener(type: string, listener: Function, useCapture: boolean = false, priority: number = 0, useWeakReference: boolean = false): void {
        this._dispatcher.addEventListener(type, listener as any, useCapture, priority, useWeakReference);
    }

    public removeEventListener(type: string, listener: Function, useCapture: boolean = false): void {
        this._dispatcher.removeEventListener(type, listener as any, useCapture);
    }

    private createList(): void {
        this._pool = new Array(this._idealArrayInitialSize);
        this._objectsInUse = [];
    }

    private disposeObjects(): void {
        if (this._disposeMethod === "") {
            return;
        }
        for (let i = 0; i < this._bufferSize; i++) {
            const obj = this._pool[i];
            if (obj && typeof obj[this._disposeMethod] === "function") {
                obj[this._disposeMethod]();
            }
        }
    }

    private createAndAddObject(): void {
        this.addToPool(this.createObject());
    }

    private addToPool(obj: any, reset: boolean = false): void {
        if (reset && this._resetMethod !== "" && typeof obj[this._resetMethod] === "function") {
            obj[this._resetMethod]();
        }
        this._pool[this._bufferSize++] = obj;
    }

    private createObject(): any {
        this._size++;
        return this._initObject === null ? new this._ObjectClass() : new this._ObjectClass(this._initObject);
    }

    private dispatch(type: string): void {
        this._dispatcher.dispatchEvent(new Event(type));
    }
}
