import { KeyboardService } from '../KeyboardService';
import { KeyboardServiceImpl } from '../KeyboardServiceImpl';
import { KeyboardEventSource } from '../KeyboardEventSource';

let eventSource: KeyboardEventSource;
let instance: KeyboardService;
let setKeyDown: (key: string, code: string) => void;
let setKeyUp: (key: string, code: string) => void;

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
    }}

beforeEach(() => {
    eventSource = { addEventListener };
    instance = new KeyboardServiceImpl(eventSource, {
        holdDelayInit: 250,
        holdDelayRepeat: 30,
    });
});

const char = 'f';
const key = 'KeyF'; 
const frameTimeInMs = 35;

describe('isCharDown', () => {
    describe('Given char is not down', () => {
        test('Should return false', () => {
            expect(instance.isCharDown(char)).toBe(false);
        });
    });

    describe('Given char is down', () => {
        beforeEach(() => setKeyDown(char, key));

        test('Should return true', () => {
            expect(instance.isCharDown(char)).toBe(true);
        });

        describe('And several frames have passed', () => {
            beforeEach(() => {
                instance.onPreRender(frameTimeInMs);
                instance.onPreRender(frameTimeInMs);
                instance.onPreRender(frameTimeInMs);
            });

            describe('And key has not been set to up', () => {
                test('Should return true', () => {
                    expect(instance.isCharDown(char)).toBe(true);
                });
            });

            describe('And key has been set to up', () => {
                beforeEach(() => setKeyUp(char, key));

                test('Should return false', () => {
                    expect(instance.isCharDown(char)).toBe(false);
                });
            });
        });
    });
});

describe('isCharUp', () => {
    describe('Given key was down', () => {
        beforeEach(() => setKeyDown(char, key));

        test('Should return false', () => {
            expect(instance.isCharUp(char)).toBe(false);
        });

        describe('And key is set to up', () => {
            beforeEach(() => setKeyUp(char, key));

            test('Should return true', () => {
                expect(instance.isCharUp(char)).toBe(true);
            });
        });
    });

    describe('Given key is up', () => {
        test('Should return true', () => {
            expect(instance.isCharUp(char)).toBe(true);
        });
    });
});

describe('isKeyDown', () => {
    describe('Given key is not down', () => {
        test('Should return false', () => {
            expect(instance.isKeyDown(key)).toBe(false);
        });
    });

    describe('Given key is down', () => {
        beforeEach(() => setKeyDown(char, key));

        test('Should return true', () => {
            expect(instance.isKeyDown(key)).toBe(true);
        });

        describe('And several frames have passed', () => {
            beforeEach(() => {
                instance.onPreRender(frameTimeInMs );
                instance.onPreRender(frameTimeInMs );
                instance.onPreRender(frameTimeInMs );
            });

            describe('And key has not been set to up', () => {
                test('Should return true', () => {
                    expect(instance.isKeyDown(key)).toBe(true);
                });
            });

            describe('And key has been set to up', () => {
                beforeEach(() => setKeyUp(char, key));

                test('Should return false', () => {
                    expect(instance.isKeyDown(key)).toBe(false);
                });
            });
        });
    });
});

describe('isKeyUp', () => {
    describe('Given code was down', () => {
        beforeEach(() => setKeyDown(char, key));

        test('Should return false', () => {
            expect(instance.isKeyUp(key)).toBe(false);
        });

        describe('And code is set to up', () => {
            beforeEach(() => setKeyUp(char, key));

            test('Should return true', () => {
                expect(instance.isKeyUp(key)).toBe(true);
            });
        });
    });

    describe('Given code is up', () => {
        test('Should return true', () => {
            expect(instance.isKeyUp(key)).toBe(true);
        });
    });
});

describe('isCharPressed', () => {
    describe('Given key was not entered', () => {
        test('Should return false', () => {
            expect(instance.isCharPressed(char)).toBe(false);
        });
    });

    describe('Given key was entered', () => {
        beforeEach(() => setKeyDown(char, key));

        test('Should return true', () => {
            expect(instance.isCharPressed(char)).toBe(true);
        });

        describe('Given onPreRender was run', () => {
            beforeEach(() => instance.onPreRender(frameTimeInMs ));

            test('Should return false', () => {
                expect(instance.isCharPressed(char)).toBe(false);
            });
        });
    });
});

describe('isKeyPressed', () => {
    describe('Given code was not entered', () => {
        test('Should return false', () => {
            expect(instance.isKeyPressed(key)).toBe(false);
        });
    });

    describe('Given code was entered', () => {
        beforeEach(() => setKeyDown(char, key));

        test('Should return true', () => {
            expect(instance.isKeyPressed(key)).toBe(true);
        });

        describe('Given onPreRender was run', () => {
            beforeEach(() => instance.onPreRender(frameTimeInMs));

            test('Should return false', () => {
                expect(instance.isKeyPressed(key)).toBe(false);
            });
        });
    });
});

describe('getBufferedText', () => {
    describe('given several keypress events have been generated', () => {
        beforeEach(() => {
            setKeyDown('F', 'KeyF');
            setKeyDown('o', 'KeyO');
            setKeyDown('o', 'KeyO');
        });

        describe('and onPreRender has not been called', () => {
            test('should return keypress events entered', () => {
                expect(instance.getBufferedText()).toBe('');
            });
        });

        describe('and onPreRender has been called', () => {
            beforeEach(() => { instance.onPreRender(frameTimeInMs); });
            test('should not return entered text', () => {
                expect(instance.getBufferedText()).toBe('Foo');
            });
        });
    });
});

describe('onPreRender', () => {
    describe('key up handling', () => {
        describe('given keyUp was set', () => {
            beforeEach(() => setKeyUp(char, key));

            test('should unset that key', () => {
                instance.onPreRender(frameTimeInMs);
                expect(instance.isCharUp(char)).toBe(true);
            });

            test('should unset that code', () => {
                instance.onPreRender(frameTimeInMs);
                expect(instance.isKeyUp(key)).toBe(true);
            });
        });
    });
});

