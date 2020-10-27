import { Hookable } from '../Hookable';
import { HookRunner } from '../HookRunner';
import { HookRunnerImpl } from '../HookRunnerImpl';
import { UiElement, Layer } from '../../types';
import {
    createDummyElement,
    createDummyLayer,
} from '../../test/helpers';

let hookableA: Hookable;
let hookableB: Hookable;
let hookableC: Hookable;
let instance: HookRunner;

beforeEach(() => {
    hookableA = {};
    hookableB = {};
    hookableC = {};
    instance = new HookRunnerImpl();
});

describe.each([
    ['runOnBeginElementHook', 'onBeginElement', [ createDummyElement() ]],
    ['runOnEndElementHook', 'onEndElement', undefined],
    ['runOnBeginLayerHook', 'onBeginLayer', [ createDummyLayer() ]],
    ['runOnEndLayerHook', 'onEndLayer', undefined],
    ['runOnPreRenderHook', 'onPreRender', undefined],
    ['runOnPostRenderHook', 'onPostRender', undefined],
])('%s', (
    runMethod: keyof HookRunner,
    hook: keyof Hookable,
    args: [ UiElement ] | [ Layer ] | undefined,
) => {
    describe(`Given hookables have been registered with method ${hook}`, () => {
        beforeEach(() => {
            hookableA[hook] = jest.fn();
            hookableC[hook] = jest.fn();

            instance.registerHookable(hookableA);
            instance.registerHookable(hookableB);
            instance.registerHookable(hookableC);
        });

        describe(`When ${runMethod} is called`, () => {
            beforeEach(() => {
                if (args) {
                    (instance[runMethod] as any)(...args);
                } else {
                    (instance[runMethod] as any)();
                }
            });

            test(`Hookables with method ${hook} should have that hook called`, () => {
                expect(hookableA[hook]).toHaveBeenCalled();
            });

            if (args) {
                test(`Hookables with method ${hook} should have args passed to hook`, () => {
                    expect(hookableA[hook]).toHaveBeenCalledWith(...args);
                });
            }
        });
    });
});
