import {svg, html, render, directive} from "../../../../web_modules/lit-html.js";

export default class ComponentBase2D extends HTMLElement {
    static get HOVER_CLASS() { return 'hover'; }

    static isPointInsideBounds(pt, bounds) {
        if (pt.x < bounds.left) { return false; }
        if (pt.x > bounds.right) { return false; }
        if (pt.y < bounds.top) { return false; }
        if (pt.y > bounds.bottom) { return false; }
        return true;
    }

    static get MapDirective() {
        return (dict, key) =>
            (part) => {
                part.setValue(key);
                dict[key] = part.committer.element;
            };
    }

    static registerComponent(clazz, options) {
        if (!clazz.Tag) {
            throw new Error(`This component definition, ${clazz.name}, does not have a static Tag getter specified to indicate the element's usage in HTML`)
            return;
        }
        let changeCallbackFnName = 'propertyChangedCallback';
        if (options && options.changeCallbackFnName) {
            changeCallbackFnName = options.changeCallbackFnName;
        }

        const decorators = [];
        const props = clazz.observedAttributes;
        if (props) {
            for (let c = 0; c < props.length; c++) {
                decorators.push({ name: props[c], accessors: {
                        set: function (val) {
                            const old = this.getAttribute(props[c]);
                            if (val === false) {
                                this.removeAttribute(props[c]);
                            } else {
                                this.setAttribute(props[c], val);
                            }
                            if (this[changeCallbackFnName]) {
                                this[changeCallbackFnName](props[c], old, val);
                            }
                        },

                        get: function () {
                            return this.getAttribute(props[c]);
                        }
                    }});
            }

            decorators.push( {
                name: 'attributeChangedCallback',
                fn: function(name, oldval, newval) {
                    if (this[changeCallbackFnName]) {
                        this[changeCallbackFnName](name, oldval, newval);
                    }
                }
            });
        }

        const processDecorator = function(d) {
            if (d.fn) {
                clazz.prototype[d.name] = d.fn;
            } else if (d.accessors) {
                Object.defineProperty(clazz.prototype, d.name, d.accessors);
            } else {
                d(clazz, options).forEach( d => processDecorator(d));
            }
        };

        decorators.forEach(d => {
            processDecorator(d);
        });

        if (!customElements.get(clazz.Tag)) {
            customElements.define(clazz.Tag, clazz);
        }
    }

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
        const xml = new XMLSerializer().serializeToString(this.dom.svg).replace(/#/g, '%23');
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

    handlePointerEvent(eventtype, x, y, debug) {
        let change = false;
        const bounds = this.getBoundingClientRect();

        const normalizedXY = {
            x: bounds.width * x,
            y: bounds.height * y,
            absX: bounds.left + bounds.width * x,
            absY: bounds.top + bounds.height * y
        };
        if (debug) {
            this.rootdata.debug.clickfeedback.x = normalizedXY.x + 5;
            this.rootdata.debug.clickfeedback.y = normalizedXY.y + 5;
            change = true;
        }

        const lastHovered = this._hovered.slice();
        if (eventtype === 'mousemove') {
            this._hovered = [];
        }

        Object.keys(this.interactives).forEach( el => {
            const elBounds = this.interactives[el].getBoundingClientRect();
            if (ComponentBase2D.isPointInsideBounds( {x: normalizedXY.absX, y: normalizedXY.absY}, elBounds) ) {
                const e = new MouseEvent(eventtype, {
                        bubbles: true,
                        cancelable: true,
                        clientX: normalizedXY.x,
                        clientY: normalizedXY.y
                });
                this.interactives[el].dispatchEvent (e);

                if (eventtype === 'mousedown') {
                    this._lastMouseDown = { el: this.interactives[el], time: Date.now()};
                } else if (eventtype === 'mouseup') {
                    if (this._lastMouseDown && this._lastMouseDown.el === this.interactives[el]) {
                        const elapsedTime = Date.now() - this._lastMouseDown.time;
                        if (elapsedTime < 500) {
                            const e = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                clientX: normalizedXY.x,
                                clientY: normalizedXY.y
                            });
                            this.interactives[el].dispatchEvent(e);
                        }
                    }
                    this._lastMouseDown = null;
                } else if (eventtype === 'mousemove') {
                    this._hovered.push(this.interactives[el]);
                    this.interactives[el].classList.toggle( ComponentBase2D.HOVER_CLASS, true);
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

    render() {
        render(html`${this.template()}`, this.shadowRoot);
        this.renderBuffer();
    }

    template() {
        return html`<style>
                :host {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }

                canvas {
                    display: none;
                }

                :host([showcanvas]) canvas {
                    display: inline-block;
                }
            </style>
            <canvas map=${Map(this.dom, 'buffer')}></canvas>
            <svg map=${Map(this.dom, 'svg')} viewBox="0 0 ${this.size.width} ${this.size.height}">
                ${this.css()}
                ${this.background()}
                ${this.html()}
                <circle cx="${this.rootdata.debug.clickfeedback.x}" cy="${this.rootdata.debug.clickfeedback.y}" r="5" fill="red" opacity="${this.rootdata.debug.clickfeedback.opacity}"></circle>
            </svg>`;
    }

    html() { return svg``; }
    css() { return svg``; }
}

const Map = directive(ComponentBase2D.MapDirective);
