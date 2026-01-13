/**
 * MetadataUtils - Utility functions for metadata caching.
 * NOTE: This is a simplified TypeScript version. Flash describeType is not available.
 */
export class MetadataUtils {
    private static _cache: Map<string, any> = new Map();
    public static CLEAR_CACHE_INTERVAL: number = 60000;
    private static _timerId: any = null;

    constructor() {}

    public static getFromString(name: string): any {
        // Not available in TypeScript
        console.warn("MetadataUtils.getFromString: Not available in TypeScript");
        return null;
    }

    public static clearCache(): void {
        MetadataUtils._cache.clear();
        if (MetadataUtils._timerId !== null) {
            clearTimeout(MetadataUtils._timerId);
            MetadataUtils._timerId = null;
        }
    }

    private static _timerHandler(): void {
        MetadataUtils.clearCache();
    }

    public static getFromObject(obj: any): any {
        // Flash describeType not available in TypeScript
        // Return a simple representation
        const className = obj?.name || obj?.constructor?.name || "";
        
        if (MetadataUtils._cache.has(className)) {
            return MetadataUtils._cache.get(className);
        }

        // Create basic metadata structure
        const metadata: any = {
            name: className,
            factory: {
                implementsInterface: [],
                extendsClass: []
            },
            accessor: [],
            method: [],
            variable: [],
            constant: []
        };

        MetadataUtils._cache.set(className, metadata);

        // Start cache clear timer
        if (MetadataUtils._timerId === null) {
            MetadataUtils._timerId = setTimeout(MetadataUtils._timerHandler, MetadataUtils.CLEAR_CACHE_INTERVAL);
        }

        return metadata;
    }
}
