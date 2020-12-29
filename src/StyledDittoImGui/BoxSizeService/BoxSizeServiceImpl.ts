import { BoxSizeService } from './BoxSizeService';

export class BoxSizeServiceImpl implements BoxSizeService {
    private readonly paddingStack: number[] = [];
    private readonly borderStack: number[] = [];

    public defaultPadding: number = 0;
    public defaultBorder: number = 0;

    constructor() {
        this.onBeginLayer = this.onBeginLayer.bind(this);
        this.onEndLayer = this.onEndLayer.bind(this);
        this.onBeginElement = this.onBeginElement.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.onPostRender = this.onPostRender.bind(this);
    }

    get padding(): number {
        const { paddingStack } = this;
        if (!paddingStack.length) {
            throw new Error('No element active');
        }
        return paddingStack[paddingStack.length - 1];
    };

    set padding(val: number) {
        const { paddingStack } = this;
        if (!paddingStack.length) {
            throw new Error('No element active');
        }
        paddingStack[paddingStack.length - 1] = val;
    };

    get border(): number {
        const { borderStack } = this;
        if (!borderStack.length) {
            throw new Error('No element active');
        }
        return borderStack[borderStack.length - 1];
    };

    set border(val: number) {
        const { borderStack } = this;
        if (!borderStack.length) {
            throw new Error('No element active');
        }
        borderStack[borderStack.length - 1] = val;
    };

    get totalSpacing(): number {
        const { borderStack } = this;
        if (!borderStack.length) {
            throw new Error('No element active');
        }
        const idx = borderStack.length - 1;
        return borderStack[idx] + this.paddingStack[idx];
    }

    get parentPadding(): number {
        const { paddingStack } = this;
        if (!paddingStack.length) {
            throw new Error('No element active');
        } else if (paddingStack.length === 1) {
            return 0;
        }
        const idx = paddingStack.length - 2;
        return paddingStack[idx];
    }

    get parentTotalSpacing(): number {
        const { borderStack } = this;
        if (!borderStack.length) {
            throw new Error('No element active');
        } else if (borderStack.length === 1) {
            return 0;
        }
        const idx = borderStack.length - 2;
        return borderStack[idx] + this.paddingStack[idx];
    }

    onBeginLayer(): void {
        this.paddingStack.push(this.defaultPadding);
        this.borderStack.push(this.defaultBorder);
    }

    onEndLayer(): void {
        this.paddingStack.pop();
        this.borderStack.pop();
    }

    onBeginElement(): void {
        this.paddingStack.push(this.defaultPadding);
        this.borderStack.push(this.defaultBorder);
    }

    onEndElement(): void {
        this.paddingStack.pop();
        this.borderStack.pop();
    }

    onPostRender(): void {
        this.defaultPadding = 0;
        this.defaultBorder = 0;
    }
}
