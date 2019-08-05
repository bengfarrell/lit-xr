import {svg, html, render, directive} from "../../../../web_modules/lit-html.js";
import {interactables} from './pointerevents.js';
import SampleComponent from "../../sample/sample.js";
import Utils from './componentutils.js';

export default class ComponentBase2D extends HTMLElement {
    static get HOVER_CLASS() { return 'hover'; }

    static isPointInsideBounds(pt, bounds) {
        if (pt.x < bounds.left) { return false; }
        if (pt.x > bounds.right) { return false; }
        if (pt.y < bounds.top) { return false; }
        if (pt.y > bounds.bottom) { return false; }
        return true;
    }

    static findRenderRoot(el) {
        let parent = el.parentElement;
        while (parent) {
            if (parent.constructor === ComponentBase2D) {
                return parent;
            } else {
                parent = parent.parentElement;
            }
        }
        return null;
    }

    constructor() {
        super();
        this._hovered = [];
        this.dom = {};
        this.data = {
            size: {
                width: 100,
                height: 100
            }
        };

        this.attachShadow({mode: 'open'});
        this.render();
    }

    get size() {
        return this.data.size;
    }

    set size(val) {
        this.data.size = val;
        this.render();
    }

    set bufferCallback(cb) {
        this._cb = cb;
    }

    sendMessage(name, o) {
        this.dom.svg.assignedNodes()[0].sendMessage(name, o);
    }

    handlePointerEvent(eventtype, x, y, debug) {
        let change = false;
        const bounds = this.getBoundingClientRect();

        const normalizedXY = {
            x: bounds.width * x,
            y: bounds.height * y,
            absX: bounds.left + bounds.width * x,
            absY: bounds.top + bounds.height * y
        };

        const lastHovered = this._hovered.slice();
        if (eventtype === 'mousemove') {
            this._hovered = [];
        }

        interactables.elementsForRoot(this).forEach( el => {
            const elBounds = el.getBoundingClientRect();
            if (ComponentBase2D.isPointInsideBounds( {x: normalizedXY.absX, y: normalizedXY.absY}, elBounds) ) {
                const e = new MouseEvent(eventtype, {
                    bubbles: true,
                    cancelable: true,
                    clientX: normalizedXY.x,
                    clientY: normalizedXY.y
                });
                el.dispatchEvent (e);

                if (eventtype === 'mousedown') {
                    this._lastMouseDown = { el: el, time: Date.now()};
                } else if (eventtype === 'mouseup') {
                    if (this._lastMouseDown && this._lastMouseDown.el === el) {
                        const elapsedTime = Date.now() - this._lastMouseDown.time;
                        if (elapsedTime < 500) {
                            const e = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                clientX: normalizedXY.x,
                                clientY: normalizedXY.y
                            });
                            el.dispatchEvent(e);
                        }
                    }
                    this._lastMouseDown = null;
                } else if (eventtype === 'mousemove') {
                    this._hovered.push(el);
                    el.classList.toggle( ComponentBase2D.HOVER_CLASS, true);
                    change = true;
                }
            }
        });

        if (eventtype === 'mousemove') {
            // clean up all the elements that aren't hovered over
            for (let c = 0; c < lastHovered.length; c++) {
                if (this._hovered.indexOf(lastHovered[c]) === -1) {
                    lastHovered[c].classList.toggle(ComponentBase2D.HOVER_CLASS, false);
                    change = true;
                }
            }
        }

        if (change) { this.render(); }
    }

    renderBuffer() {
        if (this.dom.svg.assignedNodes().length === 0) { return; }
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
        render(this.template(), this.shadowRoot);
        interactables.sort();
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
                <svg viewBox="0 0 ${this.size.width} ${this.size.height}"></svg>
            </slot>`;
    }
}

const Map = directive(Utils.MapDirective);
Utils.registerComponent( 'component-base-2d', ComponentBase2D );
