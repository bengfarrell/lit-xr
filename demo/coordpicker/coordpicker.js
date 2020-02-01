import {html, LitXR} from "../../lit-xr.js";

export default class CoordPicker extends LitXR {
    static get properties() {
        return {
            backgroundcolor: { type: String },
            x: { type: Number, reflect: true },
            y: { type: Number, reflect: true }
        };
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'backgroundcolor') {
            this.style.backgroundColor = newVal;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }

    render() {
        const thumbPos = this.calculateThumbPosition();
        return html`<style>
                        litxr-coord-picker {
                            display: inline-block;
                            position: relative;
                            border-radius: 6px;
                        }
                    
                        litxr-coord-picker .bg-overlay-a {
                            width: 100%;
                            height: 100%;
                            border-radius: 6px;
                            position: absolute;
                            background: linear-gradient(to right, #fff 0%, rgba(255,255,255,0) 100%);
                        }
                    
                        litxr-coord-picker .bg-overlay-b {
                            width: 100%;
                            height: 100%;
                            border-radius: 6px;
                            position: absolute;
                            background: linear-gradient(to bottom, transparent 0%, #000 100%);
                        }
                    
                        litxr-coord-picker .thumb {
                            width: 5px;
                            height: 5px;
                            position: absolute;
                            border-style: solid;
                            border-width: 3px;
                            border-color: white;
                            border-radius: 6px;
                            pointer-events: none;
                            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                        }
                    </style>
                    <div class="bg-overlay-a"></div>
                    <div class="bg-overlay-b"></div>
                    <div class="thumb" style="left: ${thumbPos.x}px; top: ${thumbPos.y}px" ></div>`;
    }

    calculateThumbPosition() {
        const thumb = this.querySelector('.thumb');
        if (!thumb) { return {x: 0, y: 0}; }

        return {
            x: this.x / 100 * this.offsetWidth - thumb.offsetWidth / 2,
            y: this.y / 100 * this.offsetHeight - thumb.offsetWidth / 2
        };
    }

    constructor() {
        super();
        document.addEventListener('mousemove', e => this.eventHandler(e));
        document.addEventListener('mouseup', e => this.eventHandler(e));
        this.addEventListener('mousedown', e => this.eventHandler(e));
        this.interactables.add(this);
    }

    eventHandler(e) {
        const bounds = this.getBoundingClientRect();
        const coords = {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top
        };

        switch (e.type) {
            case 'mousedown':
                this.isDragging = true;
                this.updateXY(coords.x, coords.y);
                break;

            case 'mouseup':
                this.isDragging = false;
                break;

            case 'mousemove':
                if (this.isDragging) {
                    this.updateXY(coords.x, coords.y);
                }
                break;
        }
    }

    updateXY(x, y) {
        const thumb = this.querySelector('.thumb');
        let hPos = x - thumb.offsetWidth/2;
        let vPos = y - thumb.offsetHeight/2;
        if (hPos > this.offsetWidth) {
            hPos = this.offsetWidth;
        }
        if (hPos < 0) {
            hPos = 0;
        }
        if (vPos > this.offsetHeight) {
            vPos = this.offsetHeight;
        }
        if (vPos < 0) {
            vPos = 0;
        }
        this.x = (hPos / this.offsetWidth) * 100;
        this.y = (vPos / this.offsetHeight) * 100;
        const ce = new CustomEvent('input', { detail: { x: this.x, y: this.y }, bubbles: true, composed: true });
        this.dispatchEvent(ce);
    }

}

if (!customElements.get('litxr-coord-picker')) {
    customElements.define('litxr-coord-picker', CoordPicker);
}
