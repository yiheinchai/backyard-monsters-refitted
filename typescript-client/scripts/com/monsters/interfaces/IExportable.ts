/**
 * Interface for objects that can import/export data.
 */
export interface IExportable {
    importData(data: any): void;
    exportData(): any;
}
