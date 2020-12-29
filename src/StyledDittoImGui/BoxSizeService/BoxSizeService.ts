export interface BoxSizeAPI {
    defaultPadding: number;
    defaultBorder: number;
    padding: number;
    border: number;
    readonly totalSpacing: number;
    readonly parentPadding: number;
    readonly parentBorder: number;
    readonly parentTotalSpacing: number;
}

export interface BoxSizeService extends BoxSizeAPI {
    onBeginLayer(): void;
    onEndLayer(): void;
    onBeginElement(): void;
    onEndElement(): void;
    onPostRender(): void;
}
