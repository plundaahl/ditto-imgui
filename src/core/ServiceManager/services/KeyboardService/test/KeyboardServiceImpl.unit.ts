import { KeyboardService } from '../KeyboardService';
import { KeyboardServiceImpl } from '../KeyboardServiceImpl';
import { KeyEntry } from '../KeyEntry';
import { ObjectPool } from '../../../../lib/ObjectPool';
import { KeyboardEventSource } from '../KeyboardEventSource';
import { createKeyboardEntryObjectPool } from '../createKeyboardEntryObjectPool';

let keyEntryPool: ObjectPool<KeyEntry>;
let eventSource: KeyboardEventSource;
let instance: KeyboardService;
let setKeyDown: (key: string, code: string) => void;
let setKeyUp: (key: string, code: string) => void;
let setKeyPressed: (key: string, code: string) => void;

function addEventListener(
    eventType: string,
    callback: (event: KeyboardEvent) => void,
) {
    if (eventType === 'keydown') {
        setKeyDown = (key, code) => {
            callback(new KeyboardEvent('keydown', { key, code }));
        }
    } else if (eventType === 'keyup') {
        setKeyUp = (key, code) => {
            callback(new KeyboardEvent('keyup', { key, code }));
        }
    } else if (eventType === 'keypress') {
        setKeyPressed = (key, code) => {
            callback(new KeyboardEvent('keypress', { key, code }));
        }
    }
}

beforeEach(() => {
    keyEntryPool = createKeyboardEntryObjectPool();
    eventSource = { addEventListener };
    instance = new KeyboardServiceImpl(keyEntryPool, eventSource);
});

const key = 'f';
const code = 'KeyF';

describe('isKeyDown', () => {
    describe('Given key is not down', () => {
        test('Should return false', () => {
            expect(instance.isKeyDown(key)).toBe(false);
        });
    });

    describe('Given key is down', () => {
        beforeEach(() => setKeyDown(key, code));

        test('Should return true', () => {
            expect(instance.isKeyDown(key)).toBe(true);
        });

        describe('And several frames have passed', () => {
            beforeEach(() => {
                instance.onPreRender();
                instance.onPreRender();
                instance.onPreRender();
            });

            describe('And key has not been set to up', () => {
                test('Should return true', () => {
                    expect(instance.isKeyDown(key)).toBe(true);
                });
            });

            describe('And key has been set to up', () => {
                beforeEach(() => setKeyUp(key, code));

                test('Should return false', () => {
                    expect(instance.isKeyDown(key)).toBe(false);
                });
            });
        });
    });
});

describe('isKeyUp', () => {
    describe('Given key was down', () => {
        beforeEach(() => setKeyDown(key, code));

        test('Should return false', () => {
            expect(instance.isKeyUp(key)).toBe(false);
        });

        describe('And key is set to up', () => {
            beforeEach(() => setKeyUp(key, code));

            test('Should return true', () => {
                expect(instance.isKeyUp(key)).toBe(true);
            });
        });
    });

    describe('Given key is up', () => {
        test('Should return true', () => {
            expect(instance.isKeyUp(key)).toBe(true);
        });
    });
});

describe('isCodeDown', () => {
    describe('Given key is not down', () => {
        test('Should return false', () => {
            expect(instance.isCodeDown(code)).toBe(false);
        });
    });

    describe('Given key is down', () => {
        beforeEach(() => setKeyDown(key, code));

        test('Should return true', () => {
            expect(instance.isCodeDown(code)).toBe(true);
        });

        describe('And several frames have passed', () => {
            beforeEach(() => {
                instance.onPreRender();
                instance.onPreRender();
                instance.onPreRender();
            });

            describe('And key has not been set to up', () => {
                test('Should return true', () => {
                    expect(instance.isCodeDown(code)).toBe(true);
                });
            });

            describe('And key has been set to up', () => {
                beforeEach(() => setKeyUp(key, code));

                test('Should return false', () => {
                    expect(instance.isCodeDown(code)).toBe(false);
                });
            });
        });
    });
});

describe('isCodeUp', () => {
    describe('Given code was down', () => {
        beforeEach(() => setKeyDown(key, code));

        test('Should return false', () => {
            expect(instance.isCodeUp(code)).toBe(false);
        });

        describe('And code is set to up', () => {
            beforeEach(() => setKeyUp(key, code));

            test('Should return true', () => {
                expect(instance.isCodeUp(code)).toBe(true);
            });
        });
    });

    describe('Given code is up', () => {
        test('Should return true', () => {
            expect(instance.isCodeUp(code)).toBe(true);
        });
    });
});

describe('isKeyEntered', () => {
    describe('Given code was not entered', () => {
        test('Should return false', () => {
            expect(instance.isKeyEntered(key)).toBe(false);
        });
    });

    describe('Given code was entered', () => {
        beforeEach(() => setKeyPressed(key, code));

        test('Should return true', () => {
            expect(instance.isKeyEntered(key)).toBe(true);
        });

        describe('Given onPreRender was run', () => {
            beforeEach(() => instance.onPreRender());

            test('Should return false', () => {
                expect(instance.isKeyEntered(key)).toBe(false);
            });
        });
    });
});

describe('isCodeEntered', () => {
    describe('Given code was not entered', () => {
        test('Should return false', () => {
            expect(instance.isCodeEntered(code)).toBe(false);
        });
    });

    describe('Given code was entered', () => {
        beforeEach(() => setKeyPressed(key, code));

        test('Should return true', () => {
            expect(instance.isCodeEntered(code)).toBe(true);
        });

        describe('Given onPreRender was run', () => {
            beforeEach(() => instance.onPreRender());

            test('Should return false', () => {
                expect(instance.isCodeEntered(code)).toBe(false);
            });
        });
    });
});

describe('onPreRender', () => {
    describe('key up handling', () => {
        describe('given keyUp was set', () => {
            beforeEach(() => setKeyUp(key, code));

            test('should unset that key', () => {
                instance.onPreRender();
                expect(instance.isKeyUp(key)).toBe(true);
            });

            test('should unset that code', () => {
                instance.onPreRender();
                expect(instance.isCodeUp(code)).toBe(true);
            });
        });
    });
});

