export interface IChildrenContext {
    setShouldDraw(draw: boolean): void;
    shouldDraw(): boolean;
}

export class ChildrenContext implements IChildrenContext {

    private _shouldDrawStack: boolean[] = [];
    private _element: number = -1;

    pushElement(): void {
        // Copy shouldDraw setting from parent element;
        this._shouldDrawStack.push(
            this._element >= 0
                ? this._shouldDrawStack[this._element]
                : true
        );
        this._element++;
    }

    popElement(): void {
        this._shouldDrawStack.pop();
        this._element--;
    }

    shouldDraw(): boolean {
        return this._shouldDrawStack[this._element];
    }

    setShouldDraw(draw: boolean): void {
        if (this._element < 0) {
            return;
        }

        // If parent is hiding children, don't allow user to setShouldDraw
        if (this._shouldDrawStack[this._element - 1] === false) {
            return;
        }

        this._shouldDrawStack[this._element] = draw;
    }

}
