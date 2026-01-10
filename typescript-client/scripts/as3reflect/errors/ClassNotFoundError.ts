/**
 * ClassNotFoundError - Error thrown when a class is not found.
 */
export class ClassNotFoundError extends Error {
    constructor(message: string = "") {
        super(message);
        this.name = "ClassNotFoundError";
    }
}
