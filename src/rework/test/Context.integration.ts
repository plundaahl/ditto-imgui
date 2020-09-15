/**
 * @jest-environment jsdom
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import { spawnSync } from 'child_process';
import { ContextImpl, Context } from '../Context';
import { createCanvasContext } from '../DrawBuffer';

let boilerplateHtml: string;
let instance: Context;
let browser: puppeteer.Browser;
let page: puppeteer.Page;

beforeAll(async () => {
    spawnSync(`ls`, { stdio: 'ignore' }); 

    boilerplateHtml = fs.readFileSync(`${__dirname}/CanvasTestPage.html`, 'utf8');
    browser = await puppeteer.launch();
});

beforeEach(async () => {
    // Prepare Page
    page = await browser.newPage();
    await page.setContent(boilerplateHtml, { waitUntil: 'load' });
});

afterAll(async () => {
    await browser.close();
});

describe('test suite sanity check', () => {
    test('we can focus on #canvas', async () => {
        await page.focus('#canvas');
    });

    test('we can get a context instance on the page', async () => {
        await page.addScriptTag({ path: `${__dirname}/integration/dist/context.js` });
        const result = page.waitForFunction(async () => {
            return (window as any).context;
        });
        expect(result).toBeTruthy();
    });
});

describe('render tests', () => {

});

const testElement = {
    begin: (
        context: Context,
        dimensions: { x: number, y: number, w: number, h: number },
        color: string,
    ) => {
        const { x, y, w, h } = dimensions;

        context.beginElement();

        context.bounds.x = x;
        context.bounds.y = y;
        context.bounds.w = w;
        context.bounds.h = h;

        context.draw.setFillStyle(color);
        context.draw.fillRect(x, y, w, h);
    },

    end: (context: Context) => {
        context.endElement();
    }
}

