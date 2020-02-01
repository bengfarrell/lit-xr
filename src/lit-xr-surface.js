export default class LitXRSurface extends HTMLElement {
    static get observedAttributes() { return ['root-component'] }

    static get HOVER_CLASS() { return 'hover'; }

    static isPointInsideBounds(pt, bounds) {
        if (pt.x < bounds.left) { return false; }
        if (pt.x > bounds.right) { return false; }
        if (pt.y < bounds.top) { return false; }
        if (pt.y > bounds.bottom) { return false; }
        return true;
    }

    attributeChangedCallback(name, oldval, newval) {
        const width = 500, height = 500;
        this.mountedComponentDefinition = customElements.get(this.getAttribute('root-component'));
        this.size = this.mountedComponentDefinition.preferredSize;
        this.backgroundColor = this.mountedComponentDefinition.backgroundColor;
        this.shadowRoot.innerHTML = this.template;

        this.dom.buffer = this.shadowRoot.querySelector('canvas');
        this.dom.svg = this.shadowRoot.querySelector('svg');
        this.dom.mountedComponentHost = this.dom.svg.querySelector('.host');
        this.dom.mountedComponent = this.dom.mountedComponentHost.firstChild;
        this.dom.mountedComponent.surface = this;
        this.renderTexture();
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

    handlePointerEvent(eventtype, x, y, debug) {
        let change = false;
        const bounds = this.getBoundingClientRect(true);

        const normalizedXY = {
            x: bounds.width * x,
            y: bounds.height * y,
            absX: bounds.left + bounds.width * x,
            absY: bounds.top + bounds.height * y
        };

        const lastHovered = this._hovered.slice();
        if (eventtype.updateHoverStatus) { this._hovered = []; }

        // Route all events through document for situations where we're listening for document.addEventListener('click') or similar
        if (eventtype.mouse) {
            const e = new MouseEvent(eventtype.mouse, {
                bubbles: true,
                cancelable: true,
                clientX: normalizedXY.x,
                clientY: normalizedXY.y
            });
            document.dispatchEvent(e);
        }

        if (eventtype.pointer) {
            const e = new PointerEvent(eventtype.pointer, {
                bubbles: true,
                cancelable: true,
                clientX: normalizedXY.x,
                clientY: normalizedXY.y
            });
            document.dispatchEvent(e);
        }

        this.dom.mountedComponent.interactables.elementsForSurface(this).forEach( el => {
            const elBounds = el.getBoundingClientRect(true);
            if (LitXRSurface.isPointInsideBounds( {x: normalizedXY.absX, y: normalizedXY.absY}, elBounds) ) {

                if (eventtype.mouse) {
                    const e = new MouseEvent(eventtype.mouse, {
                        bubbles: true,
                        cancelable: true,
                        clientX: normalizedXY.x,
                        clientY: normalizedXY.y
                    });
                    el.dispatchEvent(e);
                }

                if (eventtype.pointer) {
                    const e = new PointerEvent(eventtype.pointer, {
                        bubbles: true,
                        cancelable: true,
                        clientX: normalizedXY.x,
                        clientY: normalizedXY.y
                    });
                    el.dispatchEvent(e);
                }

                if (eventtype.updateHoverStatus) {
                    this._hovered.push(el);
                    el.classList.toggle( LitXRSurface.HOVER_CLASS, true);
                    change = true;
                }
            }
        });

        if (eventtype.updateHoverStatus) {
            // clean up all the elements that aren't hovered over
            for (let c = 0; c < lastHovered.length; c++) {
                if (this._hovered.indexOf(lastHovered[c]) === -1) {
                    lastHovered[c].classList.toggle(LitXRSurface.HOVER_CLASS, false);
                    change = true;
                }
            }
        }

        if (change) { this.renderTexture(); }
    }

    renderTexture() {
        this.dom.mountedComponent.interactables.sort();
        requestAnimationFrame( () => {
            if (!this.dom.svg) { return; }
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
        });
    }

    get template() {
        return `<style>
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

            <canvas></canvas>
            <svg is-render-root width=${this.size.width} height="${this.size.height}" viewBox="0 0 ${this.size.width} ${this.size.height}">
                <foreignObject width="100%" height="100%">
                    <div class="host" 
                        width="100%" height="100%" 
                        style="display: inline-block; 
                        background-color: ${this.backgroundColor};"><${this.getAttribute('root-component')}/></div>
                </foreignObject>
            </svg>`;
    }
}

if (!customElements.get('litxr-surface')) {
    customElements.define('litxr-surface', LitXRSurface);
}
