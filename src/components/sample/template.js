import {svg, directive} from '../../../web_modules/lit-html.js';
import ComponentBase2D from "../scene/ui/componentbase2d.js";

const Map = directive(ComponentBase2D.MapDirective);
export default {
    html(scope, data) {
        return svg`<rect x="0" y="0" width="${scope.size.width}" height="${scope.size.height}" fill="green"></rect>
                <rect x="0" y="0" width="5" height="5" fill="blue"></rect>
                <rect x="0" y="${scope.size.height-5}" width="5" height="5" fill="blue"></rect>
                <rect x="${scope.size.width-5}" y="0" width="5" height="5" fill="blue"></rect>
                <rect x="${scope.size.width-5}" y="${scope.size.height-5}" width="5" height="5" fill="blue"></rect>
            
                <rect x="${scope.size.width*.05}" y="${scope.size.height*.05}" width="${scope.size.width*.9}" height="${scope.size.height*.9}" stroke="black" fill="white"></rect>
                <rect x="${scope.size.width*.1}" y="${scope.size.height*.1}" width="${scope.size.width*.8}" height="${scope.size.height*.8}" stroke="black" fill="white"></rect>
                <rect x="${scope.size.width*.15}" y="${scope.size.height*.15}" width="${scope.size.width*.7}" height="${scope.size.height*.7}" stroke="black" fill="white"></rect>

                <foreignObject x="20" y="20" width="100%" height="100%">
                    <div>
                        Counter ${data.counter}
                    </div>
                    <button map=${Map(scope.interactives, 'button')} @click=${e => scope.onClick(e)}>Click me</button>
                </foreignObject>`;
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
                
                button.hover {
                    background-color: yellow;
                }
            </style>`;
    }
}
