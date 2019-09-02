import {svg, html, render, directive, interactables} from './xr-element.js';

export default class XRRenderBase extends HTMLElement {
    static get observedAttributes() { return ['root-component'] }

    static get HOVER_CLASS() { return 'hover'; }

    static isPointInsideBounds(pt, bounds) {
        if (pt.x < bounds.left) { return false; }
        if (pt.x > bounds.right) { return false; }
        if (pt.y < bounds.top) { return false; }
        if (pt.y > bounds.bottom) { return false; }
        return true;
    }

    static findRenderRoot(el) {
        let parent = el;
        while (parent) {
            if (parent.hasAttribute('is-render-root')) {
                return parent;
            } else {
                parent = parent.parentElement;
            }
        }
        return null;
    }

    attributeChangedCallback(name, oldval, newval) {
        render(this.template(), this.shadowRoot);
        this.dom.buffer = this.shadowRoot.querySelector('canvas');
        this.dom.svg = document.createElement(this.getAttribute('root-component'));
        this.size = this.dom.svg.preferredSize;
        this.dom.svg.style.width = this.dom.svg.preferredSize.width + 'px';
        this.dom.svg.style.height = this.dom.svg.preferredSize.height + 'px';
        this.style.width = this.dom.svg.preferredSize.width + 'px';
        this.style.height = this.dom.svg.preferredSize.height + 'px';
        this.dom.svg.style.display = 'inline-block';
        this.dom.svg.setAttribute('is-render-root', true);
        this.shadowRoot.appendChild(this.dom.svg);
        this.dom.svg.renderWrapper = this;

        this.render();
    }

    constructor() {
        super();
        this._hovered = [];
        this.dom = {};
        this.size = {
            width: 100,
            height: 100
        };

        this.attachShadow({mode: 'open'});
    }

    set bufferCallback(cb) {
        this._cb = cb;
    }

    sendMessage(name, o) {
        this.dom.svg.sendMessage(name, o);
    }

    handlePointerEvent(eventtype, x, y) {
        let change = false;
        const bounds = this.getBoundingClientRect();

        const normalizedXY = {
            x: bounds.width * x,
            y: bounds.height * y,
            absX: bounds.left + bounds.width * x,
            absY: bounds.top + bounds.height * y
        };

        const lastHovered = this._hovered.slice();
        if (eventtype === 'pointermove') {
            this._hovered = [];
        }

        interactables.elementsForRoot(this).forEach( el => {
            const elBounds = el.getBoundingClientRect();
            if (XRRenderBase.isPointInsideBounds( {x: normalizedXY.absX, y: normalizedXY.absY}, elBounds) ) {
                let mouseeventtype;
                switch (eventtype) {
                    case 'pointerdown': mouseeventtype = 'mousedown'; break;
                    case 'pointerup': mouseeventtype = 'mouseup'; break;
                    case 'pointermove': mouseeventtype = 'mousemove'; break;
                    case 'pointertap': mouseeventtype = 'click'; break;
                }
                const e = new MouseEvent(mouseeventtype, {
                    bubbles: true,
                    cancelable: true,
                    clientX: normalizedXY.x,
                    clientY: normalizedXY.y
                });
                el.dispatchEvent (e);

                if (eventtype === 'pointermove') {
                    this._hovered.push(el);
                    el.classList.toggle( XRRenderBase.HOVER_CLASS, true);
                    change = true;
                }
            }
        });

        if (eventtype === 'pointermove') {
            // clean up all the elements that aren't hovered over
            for (let c = 0; c < lastHovered.length; c++) {
                if (this._hovered.indexOf(lastHovered[c]) === -1) {
                    lastHovered[c].classList.toggle(XRRenderBase.HOVER_CLASS, false);
                    change = true;
                }
            }
        }

        if (change) { this.render(); }
    }

    renderBuffer() {
        if (!this.dom.svg.asSVG()) { return; }
        const xml = new XMLSerializer().serializeToString(this.dom.svg.asSVG()).replace(/#/g, '%23');
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
        interactables.sort();
        this.renderBuffer();
    }

    template() {
        return html`<style>
                :host {
                    display: inline-block;
                }

                canvas {
                    display: none;
                }

                :host([showcanvas]) canvas {
                    display: inline-block;
                }
            </style>

            <canvas></canvas>`;
    }
}

if (!customElements.get('xr-render-base')) {
    customElements.define('xr-render-base', XRRenderBase);
}
