import { DittoContext } from '../../src/DittoImGui';

const LINEHEIGHT_SCALE = 1.4;
const CURSOR = '█';
const oneHundredMs = (() => {
    let str: string = '';
    for (let i = 0; i < 100; i++) {
        str += 'M';
    }
    return str;
})();

const allWhiteSpace = (() => {
    let str: string = '';
    for (let i = 0; i < 200; i++) {
        str += ' ';
    }
    return str;
})();

const allBg = (() => {
    let str: string = '';
    for (let i = 0; i < 200; i++) {
        str += '█';
    }
    return str;
})();

interface TextModelData {
    text: string;
    style: string;
    x: number;
    y: number;
    w: number;
    xPadding: number;
    yPadding: number;
    multiLine: boolean;
    wordWrap: boolean;
    cursorPos: number;
    cursorFgStyle: string;
    cursorBgStyle: string;
    selectPos: number;
    selectFgStyle: string;
    selectBgStyle: string;
}

class TextPainterBuilder {
    constructor(
        private readonly sharedData: TextModelData,
        private readonly onBuild: (data: TextModelData) => TextPainter,
    ) {}

    withMultiline(): TextPainterBuilder {
        this.sharedData.multiLine = true;
        return this;
    }

    withWordWrap(width: number): TextPainterBuilder {
        this.sharedData.wordWrap = true;
        this.sharedData.w = width;
        return this;
    }

    withPadding(padding: number): TextPainterBuilder;
    withPadding(xPadding: number, yPadding: number): TextPainterBuilder;
    withPadding(xPadding: number, yPadding?: number): TextPainterBuilder {
        this.sharedData.xPadding = xPadding;
        this.sharedData.yPadding = yPadding !== undefined ? yPadding : xPadding;
        return this;
    }

    withCursor(
        cursorPos: number,
        cursorFgStyle: string,
        cursorBgStyle: string,
    ): TextPainterBuilder {
        this.sharedData.cursorPos = cursorPos;
        this.sharedData.cursorFgStyle = cursorFgStyle;
        this.sharedData.cursorBgStyle = cursorBgStyle;
        return this;
    }

    withSelection(
        selectPos: number,
        selectFgStyle: string,
        selectBgStyle: string,
    ): TextPainterBuilder {
        this.sharedData.selectPos = selectPos;
        this.sharedData.selectFgStyle = selectFgStyle;
        this.sharedData.selectBgStyle = selectBgStyle;
        return this;
    }

    build(): TextPainter {
        this.sharedData.x += this.sharedData.xPadding;
        this.sharedData.y += this.sharedData.yPadding;
        this.sharedData.w -= this.sharedData.xPadding * 2;
        return this.onBuild(this.sharedData);
    }
}

export class TextPainter {
    private text: string;
    private style: string;
    private x: number;
    private y: number;
    private w: number;
    private multiLine: boolean;
    private wordWrap: boolean;
    private cursorPos: number;
    private cursorFgStyle: string;
    private cursorBgStyle: string;
    private selectPos: number;
    private selectFgStyle: string;
    private selectBgStyle: string;
    private height: number;
    private readonly sharedData: TextModelData;
    private readonly modelBuilder: TextPainterBuilder;
    private lines: string[] = [];
    private lineHeight: number;
    private charWidth: number;
    private descent: number;

    constructor(private context: DittoContext) {
        this.onBuild = this.onBuild.bind(this);
        this.sharedData = {
            text: '',
            style: '',
            x: 0,
            y: 0,
            w: -1,
            xPadding: 0,
            yPadding: 0,
            multiLine: false,
            wordWrap: false,
            cursorPos: -1,
            cursorFgStyle: '',
            cursorBgStyle: '',
            selectPos: -1,
            selectFgStyle: '',
            selectBgStyle: '',
        };

        this.modelBuilder = new TextPainterBuilder(this.sharedData, this.onBuild);
    }

    startBuilder(text: string, x: number, y: number, style: string): TextPainterBuilder {
        const { sharedData } = this;
        sharedData.text = text;
        sharedData.x = x;
        sharedData.y = y;
        sharedData.style = style;
        return this.modelBuilder;
    }

    private onBuild(data: TextModelData): TextPainter {
        this.text = data.text;
        this.style = data.style;
        this.x = data.x;
        this.y = data.y;
        this.w = data.w;
        this.multiLine = data.multiLine;
        this.wordWrap = data.wordWrap;
        this.cursorPos = data.cursorPos;
        this.cursorFgStyle = data.cursorFgStyle;
        this.cursorBgStyle = data.cursorBgStyle;
        this.selectPos = data.selectPos;
        this.selectFgStyle = data.selectFgStyle;
        this.selectBgStyle = data.selectBgStyle;

        data.text = '';
        data.style = '';
        data.x = 0;
        data.y = 0;
        data.w = -1;
        data.multiLine = false;
        data.wordWrap = false;
        data.cursorPos = -1;
        data.cursorFgStyle = '';
        data.cursorBgStyle = '';
        data.selectPos = -1;
        data.selectFgStyle = '';
        data.selectBgStyle = '';

        this.buildModel();

        return this;
    }

    private buildModel(): void {
        const gui = this.context;
        const { text, multiLine, wordWrap, w } = this;

        let lines = this.multiLine
            ? text.split('\n')
            : [text];

        const metrics = gui.draw.measureText('M');
        const WIDTH_SCALING = metrics.width / (gui.draw.measureText(oneHundredMs).width * 0.01);

        if (multiLine && wordWrap) {
            const wrappedLines: string[] = [];
            const maxLineLength = Math.max(Math.floor((w / metrics.width) * WIDTH_SCALING), 1);

            for (const line of lines) {
                let remain = line;
                while (remain.length > 0) {
                    const remainingLength = remain.length;
                    const lastSpaceIndex = remain.lastIndexOf(' ', maxLineLength) + 1;

                    const splitPos = remainingLength < maxLineLength
                        ? remainingLength
                        : lastSpaceIndex > 0 ? lastSpaceIndex : maxLineLength;

                    wrappedLines.push(remain.substr(0, splitPos));
                    remain = remain.substr(splitPos);
                }
            }

            lines = wrappedLines;
        }

        this.lineHeight = metrics.height * LINEHEIGHT_SCALE;
        this.charWidth = metrics.width / WIDTH_SCALING;
        this.lines = lines;
        this.height = this.lineHeight * lines.length;
        this.descent = metrics.descent;
    }

    getHeight(): number {
        return this.height;
    }

    getCharIndexAtPoint(x: number, y: number): number {
        const { lines } = this;

        const lineNo = Math.floor((y - this.y) / this.lineHeight);
        const charOffset = Math.floor((x - this.x) / this.charWidth);

        if (lineNo < 0
            || lineNo >= lines.length
            || charOffset < 0
        ) {
            return -1;
        }

        let char = Math.min(charOffset, lines[lineNo].length);
        for (let i = 0; i < lineNo; i++) {
            char += lines[i].length;
        }

        return char;
    }

    getXPosOfCharacter(charPos: number): number {
        let charIdx = charPos;

        for (const line of this.lines) {
            if (line.length < charIdx) {
                charIdx -= line.length;
            }
        }

        return (charIdx * this.charWidth) + this.x;
    }

    paint() {
        const gui = this.context;
        const {
            lines,
            x,
            y,
            cursorPos,
            selectPos,
            style,
            lineHeight,
            selectBgStyle,
            selectFgStyle,
            descent,
        } = this;

        let cursorX = cursorPos;

        let selMin = -1;
        let selMax = -1;

        if (selectPos >= 0 && cursorPos >= 0) {
            selMin = Math.min(cursorPos, selectPos);
            selMax = Math.max(cursorPos, selectPos);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineY = y + (lineHeight * i) + descent;
            const lineLength = line.length;

            gui.draw.setFillStyle(style);
            gui.draw.drawText(line, x, lineY);

            if (selMin <= lineLength && 0 <= selMax) {
                const start = Math.max(0, selMin);
                const end = Math.min(lineLength, selMax);

                const prefix = allWhiteSpace.substr(0, start);
                const selBg = prefix + allBg.substr(0, end - start);
                const selText = prefix + line.substr(start, end - start);

                gui.draw.setFillStyle(selectBgStyle);
                gui.draw.drawText(selBg, x, lineY);

                gui.draw.setFillStyle(selectFgStyle);
                gui.draw.drawText(selText, x, lineY);
            }
            selMin -= lineLength;
            selMax -= lineLength;

            if (0 <= cursorX && cursorX <= lineLength) {
                const prefix = allWhiteSpace.substr(0, cursorX);
                const cursorBg = prefix + CURSOR;
                gui.draw.setFillStyle(this.cursorBgStyle);
                gui.draw.drawText(cursorBg, x, lineY);

                const cursorFg = prefix + line.substr(cursorX, 1);
                gui.draw.setFillStyle(this.cursorFgStyle);
                gui.draw.drawText(cursorFg, x, lineY);
            }
            cursorX -= lineLength;
        }
    }
}

