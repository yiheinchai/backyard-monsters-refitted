/**
 * ArrayUtil - Utility class for array operations.
 */
export class ArrayUtil {
    private constructor() {
        throw new Error("This class contains static methods only! Do not instaniate it");
    }

    public static removeElement(arr: Array<any>, element: any): void {
        const index = arr.indexOf(element);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    public static copy(arr: Array<any>): Array<any> {
        const result: Array<any> = [];
        for (let i = 0; i < arr.length; i++) {
            result[i] = arr[i];
        }
        return result;
    }

    public static objToArray(obj: any): Array<any> {
        const result: Array<any> = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(obj[key]);
            }
        }
        return result;
    }
}
