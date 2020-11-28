export class StateComponentKey<T extends {}> {
    private readonly symbol: Symbol;
    private readonly name: string;
    private readonly defaultInitStateJson: string;

    constructor(
        name: string,
        defaultInitState: T,
    ) {
        this.name = name;
        this.defaultInitStateJson = JSON.stringify(defaultInitState);
        this.symbol = Symbol.for(name);
    }

    public getSymbol(): Symbol {
        return this.symbol;
    }

    public getName(): string {
        return this.name;
    }

    public cloneDefaultInitState(): T {
        return JSON.parse(this.defaultInitStateJson);
    }
}
