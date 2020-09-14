/**
 * @jest-environment jsdom
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import { ContextImpl, Context } from '../Context';
import { createCanvasContext } from '../DrawBuffer';

let boilerplateHtml: string;
let instance: Context;
let browser: puppeteer.Browser;
let page: puppeteer.Page;

beforeAll(async () => {
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
});

