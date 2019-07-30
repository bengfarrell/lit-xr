import {svg, html, render, directive} from "../../../../web_modules/lit-html.js";
import SampleComponent from "../../sample/sample.js";
import ComponentBase2d from './componentbase2d.js';
import Utils from './componentutils.js';

export default class RenderedComponent extends ComponentBase2d {

    constructor() {
        super();
        this._hovered = [];
        this.dom = {};
        this.interactives = {};

        this.rootdata = {
            size: {
                width: 512,
                height: 512
            },
            backgroundColor: '#ffffff',
            background: () => svg`<rect width="${this.size.width}" height="${this.size.height}" fill="${this.rootdata.backgroundColor}"></rect>`,
            local:  {},
            debug: {
                clickfeedback: { x: 0, y: 0, opacity: .25 }
            }
        };

        this.attachShadow({mode: 'open'});
        this.onInit();
        this.render();
    }

    get background() {
        return this.rootdata.background;
    }

    set background(fn) {
        this.rootdata.background = fn;
    }

    // override to populate data before render
    onInit() {}

    get size() {
        return this.rootdata.size;
    }

    set size(val) {
        this.rootdata.size = val;
    }

    get data() {
        return this.rootdata.local;
    }

    set data(val) {
        this.rootdata.local = val;
    }

    set bufferCallback(cb) {
        this._cb = cb;
    }

    set capturePointerEvents(on) {
        if (on) {
            this.interactives.__element = this;
        } else {
            if (this.interactives.__element) {
                delete this.interactives.__element;
            }
        }
    }

    renderBuffer() {
        if (!this.dom.svg.assignedNodes()[0].asSVG) { return; }

        const xml = new XMLSerializer().serializeToString(this.dom.svg.assignedNodes()[0].asSVG()).replace(/#/g, '%23');
        const img = new Image();
        this.dom.buffer.width = this.size.width;
        this.dom.buffer.height = this.size.height;
        img.onload = () => {
            if (!this._ctx) {
                this._ctx = this.dom.buffer.getContext('2d');
                this._ctx.width = this.size.width;
                this._ctx.height = this.size.height;
            }
            this._ctx.drawImage(img, 0, 0, this.size.width, this.size.height, 0, 0, this.size.width, this.size.height);
            if (this._cb) {
                this._cb(this.dom.buffer);
            }
        };
        img.src = "data:image/svg+xml," + xml;
    }

    render() {
        render(html`${this.template()}`, this.shadowRoot);
        this.renderBuffer();
    }

    template() {
        return html`<style>
                :host {
                    display: inline-block;
                    width: ${this.size.width}px;
                    height: ${this.size.height}px;
                }

                canvas {
                    display: none;
                }

                :host([showcanvas]) canvas {
                    display: inline-block;
                }
            </style>

            <canvas map=${Map(this.dom, 'buffer')}></canvas>
            <slot map=${Map(this.dom, 'svg')}>
                <svg viewBox="0 0 ${this.size.width} ${this.size.height}">
                    <circle cx="${this.rootdata.debug.clickfeedback.x}" cy="${this.rootdata.debug.clickfeedback.y}" r="5" fill="red" opacity="${this.rootdata.debug.clickfeedback.opacity}"></circle>
                </svg>
            </slot>`;
    }
}

const Map = directive(Utils.MapDirective);
Utils.registerComponent( 'rendered-component', RenderedComponent );
