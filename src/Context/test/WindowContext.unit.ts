import { WindowContext } from '../WindowContext';

describe('onPostRender', () => {
});

describe('#getOrderedWindowRenderDetails', () => {
    test('Contains all windows that were pushed this frame', () => {
        const context = new WindowContext();

        const win1 = 'Window1';
        const win2 = 'Window2';
        const win3 = 'Window3';
        const win4 = 'Window4';

        // Frame 1
        {
            context.beginWindow(win1);
            context.endWindow();
            context.beginWindow(win2);
            context.endWindow();

            const result = context.getOrderedWindowRenderDetails();

            expect(result.find(e => e.key === win1)).not.toBe(undefined);
            expect(result.find(e => e.key === win2)).not.toBe(undefined);
        }

        // Frame 2
        {
            context.beginWindow(win1);
            context.endWindow();
            context.beginWindow(win3);
            context.endWindow();

            const result = context.getOrderedWindowRenderDetails();

            expect(result.find(e => e.key === win1)).not.toBe(undefined);
            expect(result.find(e => e.key === win3)).not.toBe(undefined);
        }

        // Frame 2
        {
            context.beginWindow(win4);
            context.beginWindow(win3);
            context.endWindow();
            context.beginWindow(win2);
            context.endWindow();
            context.endWindow();

            const result = context.getOrderedWindowRenderDetails();

            expect(result.find(e => e.key === win3)).not.toBe(undefined);
            expect(result.find(e => e.key === win4)).not.toBe(undefined);
            expect(result.find(e => e.key === win2)).not.toBe(undefined);
        }
    });

    test('Does NOT contain any windows that were NOT pushed this frame', () => {
        const context = new WindowContext();

        const win1 = 'Window1';
        const win2 = 'Window2';
        const win3 = 'Window3';
        const win4 = 'Window4';

        // Frame 1
        {
            context.beginWindow(win1);
            context.endWindow();
            context.beginWindow(win2);
            context.endWindow();

            context.onPreRender();
            const result = context.getOrderedWindowRenderDetails();
            context.onPostRender();

            expect(result.find(e => e.key === win3)).toBe(undefined);
            expect(result.find(e => e.key === win4)).toBe(undefined);
        }

        // Frame 2
        {
            context.beginWindow(win1);
            context.endWindow();
            context.beginWindow(win3);
            context.endWindow();

            context.onPreRender();
            const result = context.getOrderedWindowRenderDetails();
            context.onPostRender();

            expect(result.find(e => e.key === win2)).toBe(undefined);
            expect(result.find(e => e.key === win4)).toBe(undefined);
        }

        // Frame 2
        {
            context.beginWindow(win4);
            context.beginWindow(win3);
            context.endWindow();
            context.beginWindow(win2);
            context.endWindow();
            context.endWindow();

            context.onPreRender();
            const result = context.getOrderedWindowRenderDetails();
            context.onPostRender();

            expect(result.find(e => e.key === win1)).toBe(undefined);
        }
    });

    test('Windows that had #bringToFront called appear at end, in order of most recent #bringToFront call', () => {
        const context = new WindowContext();

        const win1 = "win1";
        const win2 = "win2";
        const win3 = "win3";
        const win4 = "win4";

        // Setup frame
        context.beginWindow(win1);
        context.endWindow();

        context.beginWindow(win2);
        context.endWindow();

        context.beginWindow(win3);
        context.endWindow();

        context.beginWindow(win4);
        context.endWindow();

        context.onPreRender();

        // Test frame
        context.beginWindow(win1);
        context.endWindow();

        context.beginWindow(win3);
        context.bringToFront();
        context.endWindow();


        context.beginWindow(win2);
        context.bringToFront();
        context.endWindow();


        context.beginWindow(win4);
        context.endWindow();


        context.onPreRender();
        const result = context.getOrderedWindowRenderDetails();

        expect(result.length).toBe(4);
        expect(result[2].key).toBe(win3);
        expect(result[3].key).toBe(win2);
    });
});

describe('Mouse hover', () => {

    /**
     * x is mouse
     *
     *      1    6   11
     *    1 +--------+
     *    2 |A   x   |
     *      |   +-------+ 3
     *      |   |B      |
     *    5 +---|       |
     *          +-------+ 6
     *          5       14
     */
    test.skip('Test 1', () => {
        const context = new WindowContext();

        const win1 = 'win1';
        const windowState1 = {
            x: 1,
            y: 1,
            w: 11 - 1,
            h: 5 - 1,
            isOpen: true,
        };

        const win2 = 'win2';
        const windowState2 = {
            x: 5,
            y: 3,
            w: 14 - 5,
            h: 6 - 3,
            isOpen: true,
        };

        context.beginWindow(win1);
        context.endWindow();
        context.beginWindow(win2);
        context.endWindow();
        context.setMouseCoordinates(6, 2);
        context.onPreRender();

        context.beginWindow(win1);
        // expect(context.wasWindowHoveredLastFrame()).toBe(true);
        context.endWindow();
        context.beginWindow(win2);
        // expect(context.wasWindowHoveredLastFrame()).toBe(false);
        context.endWindow();
    });


    test.skip('Should return false for closed windows', () => {
        const context = new WindowContext();

        const win1 = 'win1';
        const windowState1 = {
            x: 1,
            y: 1,
            w: 11 - 1,
            h: 5 - 1,
            isOpen: true,
        };

        const win2 = 'win2';
        const windowState2 = {
            ...windowState1,
            isOpen: false,
        };

        context.beginWindow(win1);
        context.endWindow();
        context.beginWindow(win2);
        context.endWindow();
        context.setMouseCoordinates(5, 5);
        context.onPreRender();

        context.beginWindow(win1);
        // expect(context.wasWindowHoveredLastFrame()).toBe(true);
        context.endWindow();
        context.beginWindow(win2);
        // expect(context.wasWindowHoveredLastFrame()).toBe(false);
        context.endWindow();
    });
});
