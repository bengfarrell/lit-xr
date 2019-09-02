import XRRenderBase from '../../src/xr-render-base.js';
import {XRElement, svg, html, interactables, render} from '../../src/xr-element.js';

export default class Slider extends XRElement {
    static get preferredSize() { return { width: 500, height: 50 }; }

    onInit() {
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
        this.render();
    }

    css() {
        return svg`<style>
                xr-slider .track {
                    width: calc(100% - 20px);
                    height: calc(100% - 20px);
                    margin: 10px;
                    border-radius: 5px;
                    background-color: black;
                }
                
                xr-slider .thumb {
                    border-color: black;
                    border-style: solid;
                    border-width: 1px;
                    border-radius: 5px;
                    height: calc(100% - 10px);
                    background-color: white;
                    position: absolute;
                    top: 5px;
                }
                
                xr-slider {
                    display: inline-block;
                    position: relative;
                }
            </style>`;
    }

    html() { return html`${this.css()}
                        <div class="track"></div>
                        <div class="thumb" @mousedown=${e => this.onPointerEvent(e)}
                              @click=${e => this.onPointerEvent(e)}  
                              style="left: ${this.data.thumbX}px; width: ${this.data.thumbWidth}px;">            
                        </div>`;
    }
}

if (!customElements.get('xr-slider')) {
    customElements.define('xr-slider', Slider);
}
