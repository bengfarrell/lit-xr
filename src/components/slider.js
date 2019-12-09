import {directive} from 'lit-html';
import LitXR from '../lit-xr.js';
import {svg, html, interactables} from "../pointerevents.js";

export default class Slider extends LitXR {
    static get preferredSize() { return { width: 500, height: 50 }; }

    constructor() {
        super();
        this.data = {};
        this.dom = {};
        this.data.thumbX = 0;
        this.data.thumbWidth = 20;

        interactables.add(this);
        this.addEventListener('mouseup', e => this.onPointerEvent(e));
        this.addEventListener('mousemove', e => {this.onPointerEvent(e)});
        this.addEventListener('click', e => {this.onPointerEvent(e)});
    }

    onPointerEvent(e) {
        switch (e.type) {
            case 'mouseup':
                this.data.thumbClicked = false;
                break;

            case 'mousedown':
                this.data.thumbClicked = true;
                break;

            case 'mousemove':
                if (this.data.thumbClicked) {
                    this.data.thumbX = e.clientX - this.data.thumbWidth/2 - this.offsetLeft;
                }
                break;

            case 'click':
                this.data.thumbX = e.clientX - this.data.thumbWidth/2 - this.offsetLeft;
                break;
        }
        this.requestUpdate();
    }

    render() {
        return html`<style>
                        litxr-slider .track {
                            width: calc(100% - 20px);
                            height: calc(100% - 20px);
                            margin: 10px;
                            border-radius: 5px;
                            background-color: black;
                        }
                        
                        litxr-slider .thumb {
                            border-color: black;
                            border-style: solid;
                            border-width: 1px;
                            border-radius: 5px;
                            height: calc(100% - 10px);
                            background-color: white;
                            position: absolute;
                            top: 5px;
                        }
                        
                        litxr-slider {
                            display: inline-block;
                            position: relative;
                        }
                    </style>
                    <div class="track"></div>
                    <div class="thumb" @mousedown=${e => this.onPointerEvent(e)}
                          @click=${e => this.onPointerEvent(e)}  
                          style="left: ${this.data.thumbX}px; width: ${this.data.thumbWidth}px;">            
                    </div>`;
    }
}

if (!customElements.get('litxr-slider')) {
    customElements.define('litxr-slider', Slider);
}
