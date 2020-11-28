import { StateServiceImpl } from '../StateServiceImpl';
import { StateService } from '../StateService';
import { StateComponentKey } from '../StateComponentKey';
import { createDummyElement } from '../../../test/helpers';
import { UiElement } from '../../../types';
import { PERSISTENT } from '../../../flags';

let instance: StateService;

beforeEach(() => {
    instance = new StateServiceImpl();
});

describe('getStateComponent', () => {
    interface DummyState { foo: string };
    let keyName: string;
    let defaultState: DummyState;
    let key: StateComponentKey<DummyState>;

    beforeEach(() => {
        keyName = 'bar';
        defaultState = { foo: 'hi there' };
        key = new StateComponentKey(keyName, defaultState);
    });

    describe('given no element is active', () => {
        test('should error', () => {
            expect(() => {
                instance.getStateComponent(key);
            }).toThrow();
        });
    });

    describe('given no duplicate key name has been registered', () => {
        describe('and an element is active', () => {
            let element: UiElement;

            beforeEach(() => {
                element = createDummyElement();
                instance.onBeginElement(element);
            });

            test('should not error', () => {
                expect(() => {
                    instance.getStateComponent(key);
                }).not.toThrow();
            });

            describe('and element was not previously active', () => {
                describe('and no init value was passed', () => {
                    test("returned state should match StateComponentKey's default", () => {
                        const state = instance.getStateComponent(key);
                        expect(JSON.stringify(state))
                            .toBe(JSON.stringify(defaultState));
                    });
                });

                describe('and an init value was passed', () => {
                    test("returned state should match init value", () => {
                        const initValue = { foo: 'a different value' };
                        const state = instance.getStateComponent(key, initValue);
                        expect(JSON.stringify(state))
                            .toBe(JSON.stringify(initValue));
                    });
                });
            });

            describe('and element was previously active', () => {
                let prevState: DummyState;

                describe('and state was not changed', () => {
                    beforeEach(() => {
                        const state = instance.getStateComponent(key);

                        prevState = JSON.parse(JSON.stringify(state));

                        instance.onEndElement();
                        instance.onBeginElement(element);
                    });

                    test('returned state should match previous state', () => {
                        const state = instance.getStateComponent(key);

                        expect(JSON.stringify(state))
                            .toBe(JSON.stringify(prevState));
                    });
                });

                describe('and state was changed', () => {
                    beforeEach(() => {
                        const state = instance.getStateComponent(key);
                        state.foo = 'this is an updated value';
                        prevState = JSON.parse(JSON.stringify(state));

                        instance.onEndElement();
                        instance.onBeginElement(element);
                    });

                    test('returned state should match updated state', () => {
                        const state = instance.getStateComponent(key);

                        expect(JSON.stringify(state))
                            .toBe(JSON.stringify(prevState));
                    });
                });
            });

            describe('and a different element was previously active', () => {
                let secondElement: UiElement;

                beforeEach(() => {
                    instance.onEndElement();
                    secondElement = createDummyElement({ key: 'foo/bar' });
                    instance.onBeginElement(secondElement);
                });

                test("modifying one element's state should not affect the other", () => {
                    const updatedValue = 'a totally different value';

                    let secondElementState = instance.getStateComponent(key);
                    secondElementState.foo = updatedValue;

                    instance.onEndElement();
                    instance.onBeginElement(element);

                    let firstElementState = instance.getStateComponent(key);
                    expect(firstElementState).not.toEqual(updatedValue);
                });
            });
        });
    });

    describe('given duplicate key name has been registered', () => {
        let identicallyNamedKey: StateComponentKey<{ baz: number }>;

        beforeEach(() => {
            identicallyNamedKey = new StateComponentKey(
                keyName,
                { baz: 123 },
            );

            instance.onBeginElement(createDummyElement());
            instance.getStateComponent(identicallyNamedKey);
            instance.onEndElement();
        });

        describe('and an element is active', () => {
            let element: UiElement;

            beforeEach(() => {
                element = createDummyElement();
                instance.onBeginElement(element);
            });

            test('should error', () => {
                expect(() => {
                    instance.getStateComponent(key);
                }).toThrow();
            });
        });
    });

    describe('given key has been used before', () => {
        beforeEach(() => {
            instance.onBeginElement(createDummyElement());
            instance.getStateComponent(key);
            instance.onEndElement();
        });

        describe('and an element is active', () => {
            let element: UiElement;

            beforeEach(() => {
                element = createDummyElement();
                instance.onBeginElement(element);
            });

            test('should not error', () => {
                expect(() => {
                    instance.getStateComponent(key);
                }).not.toThrow();
            });
        });
    });
});

describe('onPostRender', () => {
    interface DummyState { foo: string };
    let element: UiElement;
    let keyName: string;
    let defaultState: DummyState;
    let key: StateComponentKey<DummyState>;

    beforeEach(() => {
        keyName = 'foo';
        defaultState = { foo: 'init' };
        key = new StateComponentKey(keyName, defaultState);
    });

    describe('given an element was transient', () => {
        beforeEach(() => {
            element = createDummyElement({ flags: 0 });
            instance.onBeginElement(element);
            const prevState = instance.getStateComponent(key);
            prevState.foo = 'updatedValue';
        });

        describe('and the element is skipped for a frame', () => {
            beforeEach(() => {
                instance.onEndElement();
                instance.onPostRender(60);
                instance.onPostRender(60);
                instance.onBeginElement(element);
            });

            test('then state should revert to default', () => {
                const state = instance.getStateComponent(key);
                expect(JSON.stringify(state))
                    .toBe(JSON.stringify(defaultState));
            });
        });
    });

    describe('given an element was persistent', () => {
        let prevState: DummyState;

        beforeEach(() => {
            element = createDummyElement({ flags: PERSISTENT });
            instance.onBeginElement(element);
            prevState = instance.getStateComponent(key);
            prevState.foo = 'updatedValue';
        });

        describe('and the element is skipped for a frame', () => {
            beforeEach(() => {
                instance.onEndElement();
                instance.onPostRender(60);
                instance.onPostRender(60);
                instance.onBeginElement(element);
            });

            test('then state should be persisted', () => {
                const state = instance.getStateComponent(key);
                expect(JSON.stringify(state))
                    .toBe(JSON.stringify(prevState));
            });
        });
    });
});

