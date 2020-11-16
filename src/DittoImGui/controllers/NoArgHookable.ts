export interface NoArgHookable {
    onBeginLayer(): void;
    onEndLayer(): void;
    onBeginElement(): void;
    onEndElement(): void;
    onPreRender(): void;
    onPostRender(): void;
}
