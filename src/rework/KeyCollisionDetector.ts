interface KeyNode { [key: string]: KeyNode }

export class KeyCollisionDetector {

    private keyTree: KeyNode = {};
    private keyStack: KeyNode[] = [];

    constructor() {
        this.keyStack.push(this.keyTree);
    }

    get curNode(): KeyNode {
        return this.keyStack[this.keyStack.length - 1];
    }

    beginKey(key: string) {
        const { curNode } = this;

        if (curNode[key]) {
            throw new Error(`Attempting to add duplicate key ${key}. Each node in the element tree can only have one instance of the same key.`);
        }

        curNode[key] = {};
        this.keyStack.push(curNode[key]);
    }

    endKey() {
        this.clearNode(this.curNode);
        this.keyStack.pop();
    }

    reset() {
        if (this.keyStack.length !== 1) {
            throw new Error(`Attempting to reset, but there are still ${this.keyStack.length} keys on the stack. Please make sure your beginKey() and endKey() calls are balanced.`);
        }

        this.clearNode(this.curNode);
    }

    private clearNode(node: KeyNode) {
        for (let key in node) {
            delete node[key];
        }
    }
}
