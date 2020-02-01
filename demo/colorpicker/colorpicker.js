import {html, LitXR} from "../../lit-xr.js";
import Slider from '../slider/slider.js';
import Color from './color.js';
import CoordPicker from '../coordpicker/coordpicker.js';

/**
 * design is heavily borrowed/stolen from https://cssgradient.io/
 */
export default class ColorPicker extends LitXR {
    static get DEFAULT_HEX() { return '#77aabb'; }
    static get DEFAULT_ALPHA() { return 100; }

    static get properties() {
        return {
            alpha: { type: Number, reflect: true },
            hex: { type: String, reflect: true },
        };
    }

    attributeChangedCallback(name, old, value) {
        const ce = new CustomEvent('change', { detail: { hex: this.hex, alpha: this.alpha, rgb: Color.hexToRGB(this.hex) }, composed: true, bubbles: true });
        this.dispatchEvent(ce);
        super.attributeChangedCallback(name, old, value);
    }

    render() {
        const rgb = Color.HSVtoRGB(this._hsv);
        const hsv = this._hsv;
        const hex = Color.RGBtoHex(rgb);
        this.hex = hex;
        return html`<style>
                litxr-color-picker {
                    width: 100%;
                    display: inline-block;
                }

                litxr-color-picker .container {
                    padding: 10px;
                }

                litxr-color-picker .text-inputs {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                }

                litxr-color-picker .row {
                    display: flex;
                }

                litxr-color-picker .slider-container {
                    flex: 1;
                    padding-right: 10px;
                }

                litxr-color-picker .hue-slider, 
                litxr-color-picker .transparency-slider {
                    width: 100%;
                    height: 40px;
                    margin-bottom: 5px;
                    border-radius: 6px;
                }

                litxr-color-picker .saturation-brightness {
                    width: 90px;
                    height: 90px;
                    border-radius: 6px;
                }

                litxr-color-picker .hue-slider {
                    background: linear-gradient(to right, red 0%, #ff0 17%, lime 33%, cyan 50%, blue 66%, #f0f 83%, red 100%);
                }

                litxr-color-picker .transparency-slider {
                    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),linear-gradient(-45deg, #ccc 25%, transparent 25%),linear-gradient(45deg, transparent 75%, #ccc 75%),linear-gradient(-45deg, transparent 75%, #ccc 75%);
                    background-size: 16px 16px;
                    background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
                }
                
                litxr-color-picker .form-input {
                    margin-right: 5px;
                }
                
                litxr-color-picker .form-input .input-field-label {
                    border-top-left-radius: 6px;
                    border-top-right-radius: 6px;
                    background-color: #4a4a4a;
                    padding: 5px;
                    display: block;
                    color: white;
                    font-family: sans-serif;
                    font-size: 1em;
                }
                
                litxr-color-picker .form-input .input-field-label.top {
                    display: block;
                }
                
                litxr-color-picker .form-input input {
                    border-style: solid;
                    border-width: 1px;
                    border-color: #dadada;
                    padding: 5px;
                    font-size: 1.5em;
                }
            </style>
            
            <div class="container">
                <div class="row">
                    <div class="slider-container">
                        <litxr-slider class="hue-slider" value="${hsv.h*100}"></litxr-slider>
                        <litxr-slider class="transparency-slider" value="${this.alpha}" backgroundgradient="#00000000:0%,${Color.RGBtoHex(Color.HSVtoRGB(hsv.h, 1, 1))}:100%"></litxr-slider>
                    </div>

                    <litxr-coord-picker x="50" y="50" class="saturation-brightness" backgroundcolor="${Color.RGBtoHex(Color.HSVtoRGB(hsv.h, 1, 1))}"></litxr-coord-picker>
                </div>

                <div class="row">
                    <div class="text-inputs">
                        <div class="form-input">
                          <label class="input-field-label top" for="textInputR">Red</label>
                          <input class="textInputR rgb" type="number" value="${rgb.r}" max="255" size="4" min="0">
                        </div>

                        <div class="form-input">
                          <label class="input-field-label top" for="textInputG">Green</label>
                          <input class="textInputG rgb" type="number" value="${rgb.g}" max="255" size="4" min="0">
                        </div>

                        <div class="form-input">
                          <label class="input-field-label top" for="textInputB">Blue</label>
                          <input class="textInputB rgb" type="number" value="${rgb.b}" max="255" size="4" min="0">
                        </div>

                        <div class="form-input">
                          <label class="input-field-label top" for="textInputA">Alpha</label>
                          <input class="textInputA" type="number" value="${parseInt(this.alpha)}" max="100" min="0" size="4">
                        </div>

                        <div class="form-input">
                          <label class="input-field-label top" for="textInputHex">Hex</label>
                          <input class="textInputHex" type="text" value="${hex}" width="50px" size="8">
                        </div>
                    </div>
                </div>
            </div>`;
    }

    constructor() {
        super();

        this.addEventListener('input', e => {
            if (e.target.classList.contains('transparency-slider')) {
                this.alpha = e.detail;
                this.requestUpdate();
                e.stopPropagation();
            } else if (e.target.classList.contains('saturation-brightness') || e.target.classList.contains('hue-slider')) {
                const hueEl = this.querySelector('.hue-slider');
                const sbEl = this.querySelector('.saturation-brightness');
                this._hsv = { h: hueEl.value/100, s: sbEl.x/100, v: (100 - sbEl.y)/100 };
                this.requestUpdate();
                e.stopPropagation();
            }
        });

        this.addEventListener('change', e => {
            if (e.target.classList.contains('textInputHex')) {
                this._hsv = Color.RGBtoHSV(Color.hexToRGB(this.hex));
                this.requestUpdate();
                e.stopPropagation();
            } else if (e.target.classList.contains('rgb')) {
                const rgb = {
                    r: this.querySelector('.textInputR').value,
                    g: this.querySelector('.textInputG').value,
                    b: this.querySelector('.textInputB').value,
                };
                this._hsv = Color.RGBtoHSV(rgb);
                this.requestUpdate();
                e.stopPropagation();
            }
        });

        this.alpha = ColorPicker.DEFAULT_ALPHA;
        this.hex = ColorPicker.DEFAULT_HEX;
        this._hsv = Color.RGBtoHSV(Color.hexToRGB(this.hex));
    }
}

if (!customElements.get('litxr-color-picker')) {
    customElements.define('litxr-color-picker', ColorPicker);
}
