import {html, LitXR} from "../../lit-xr.js";

export default class Slider extends LitXR {
    static get THUMB_WIDTH() { return 10; }
    static get THUMB_BORDER() { return 3; }
    static get properties() {
        return {
            backgroundcolor: { type: String },
            backgroundgradient: { type: String },
            value: { type: Number, reflect: true }
        };
    }

    render() {
        const thumb = this.querySelector('.thumb');
        const thumbWidth = thumb ? thumb.offsetWidth : 0;
        if (thumbWidth === 0 || this.offsetWidth === 0) {
            requestAnimationFrame( () => {
                this.requestUpdate();
            });
        }

        return html`<style>
                        litxr-slider {
                            display: inline-block;
                            position: relative;
                            border-radius: 6px;
                        }
                    
                        litxr-slider .bg-overlay {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            border-radius: 6px;
                        }
                    
                        litxr-slider .thumb {
                            margin-top: -1px;
                            width: 10px;
                            height: calc(100% - 5px);
                            position: absolute;
                            border-style: solid;
                            border-width: 3px;
                            border-color: white;
                            border-radius: 6px;
                            pointer-events: none;
                            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                        }
                    </style>

                    <div class="bg-overlay" style="${this.generateBackground()}"></div>
                    <div class="thumb" style="left: ${this.value/100 * this.offsetWidth - thumbWidth/2}px"></div>`;
    }

    generateBackground() {
        if (this.backgroundcolor) {
            return 'background-color: ' + this.backgroundcolor;
        } else if (this.backgroundgradient) {
            const stops = this.backgroundgradient.split(',');
            let grad = '';
            stops.forEach( (stop, indx) => {
                stop.split(':');
                grad += stop.split(':')[0] + ' ' + stop.split(':')[1] + ', ';
            });
            grad = grad.substr(0, grad.length-2);
            return `background: linear-gradient(to right, ${grad})`;
        }
    }

    constructor() {
        super();
        document.addEventListener('mousemove', e => this.eventHandler(e));
        document.addEventListener('mouseup', e => this.eventHandler(e));

        this.addEventListener('mousedown', e => this.eventHandler(e));
        this.interactables.add(this);
    }

    updateX(x) {
        let hPos = x - this.querySelector('.thumb').offsetWidth/2;
        if (hPos > this.offsetWidth) {
            hPos = this.offsetWidth;
        }
        if (hPos < 0) {
            hPos = 0;
        }
        this.value = (hPos / this.offsetWidth) * 100;
        const ce = new CustomEvent('input', { detail: this.value, bubbles: true, composed: true });
        this.dispatchEvent(ce);
    }

    eventHandler(e) {
        const bounds = this.getBoundingClientRect();
        const x = e.clientX - bounds.left;

        switch (e.type) {
            case 'mousedown':
                this.isdragging = true;
                this.updateX(x);
                break;

            case 'mouseup':
                this.isdragging = false;
                break;

            case 'mousemove':
                if (this.isdragging) {
                    this.updateX(x);
                }
                break;
        }
    }
}

if (!customElements.get('litxr-slider')) {
    customElements.define('litxr-slider', Slider);
}
