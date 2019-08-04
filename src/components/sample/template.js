import {svg} from '../scene/ui/pointerevents.js';
import {directive} from "../../../web_modules/lit-html.js";
import Utils from '../scene/ui/componentutils.js';
import Slider from '../scene/ui/components/slider.js';

const Map = directive(Utils.MapDirective);

export default {
    html(scope, data) {
        const width = scope.preferredSize.width;
        const height = scope.preferredSize.height;
        return svg`<svg viewBox="0 0 ${width} ${height}">
                    ${this.css()}
                    <rect x="0" y="0" width="100%" height="100%" fill="green"></rect>
                    <rect x="0" y="0" width="5" height="5" fill="blue"></rect>
                    <rect x="0" y="${height-5}" width="5" height="5" fill="blue"></rect>
                    <rect x="${width-5}" y="0" width="5" height="5" fill="blue"></rect>
                    <rect x="${width-5}" y="${height-5}" width="5" height="5" fill="blue"></rect>
                
                    <rect x="${width*.05}" y="${height*.05}" width="${width*.9}" height="${height*.9}" stroke="black" fill="white"></rect>
                    <rect x="${width*.1}" y="${height*.1}" width="${width*.8}" height="${height*.8}" stroke="black" fill="white"></rect>
                    <rect x="${width*.15}" y="${height*.15}" width="${width*.7}" height="${height*.7}" stroke="black" fill="white"></rect>
    
                    <foreignObject x="20" y="20" width="100%" height="100%">
                        <div>
                            Counter ${data.counter}
                        </div>
                        <button @click=${e => scope.onClick(e)}>Click me</button>
                    </foreignObject>
                </svg>`;
    },

    css() {
        return svg`<style>
               sample-component {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
                
                div {
                    color: black;
                    font: 44px serif;
                    overflow: auto;
                    border-style: dashed;
                    border-width: 3px;
                    border-color: black;
                    display: inline-block;
                }

                button {
                    font: 44px serif;
                    background-color: aqua;
                }
                
                button.hover, button:hover {
                    background-color: yellow;
                }
            </style>`;
    }
}
