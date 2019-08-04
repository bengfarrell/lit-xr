import {directive, render} from '../../../../../web_modules/lit-html.js';
import ComponentBase2D from '../componentbase2d.js';
import Utils from '../componentutils.js';
import {svg, html, interactables} from "../pointerevents.js";
import Template from "../../../sample/template.js";
import RenderableComponent from "../renderablecomponent.js";

const Map = directive(Utils.MapDirective);

export default class Slider extends RenderableComponent {
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
                    this.data.thumbX = e.clientX - this.data.thumbWidth/2;
                }
                break;

            case 'click':
                this.data.thumbX = e.clientX - this.data.thumbWidth/2;
                break;
        }
        this.render();
    }

    css() {
        return svg`<style>
                #track {
                    width: calc(100% - 20px);
                    height: calc(100% - 20px);
                    x: 10px;
                    y: 10px;
                    rx: 5px;
                    fill: #0000ff;
                }
                
                #thumb {
                    rx: 5px; 
                    stroke: black; 
                    fill: white;
                    height: calc(100% - 10px);
                    y: 5px;
                }
                
                xr-slider {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
            </style>`;
    }

    html() { return svg`<svg width="${this.preferredSize.width}" height="${this.preferredSize.height}">
                        ${this.css()}
                        <rect id="track"></rect>
                        <rect id="thumb" @mousedown=${e => this.onPointerEvent(e)}
                              @click=${e => this.onPointerEvent(e)}  
                              x="${this.data.thumbX}" 
                              width="${this.data.thumbWidth}">            
                        </rect></svg>`;
    }
}

Utils.registerComponent( 'xr-slider', Slider );
