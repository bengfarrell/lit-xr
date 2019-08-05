import {html} from '../scene/ui/pointerevents.js';
import {directive} from "../../../web_modules/lit-html.js";
import Utils from '../scene/ui/componentutils.js';
import Slider from '../scene/ui/components/slider.js';

const Map = directive(Utils.MapDirective);

export default {
    html(scope, data) {
        const width = scope.preferredSize.width;
        const height = scope.preferredSize.height;
        return html`${this.css()}
                    <div class="container">
                        Counter ${data.counter} ${data.message}
                    </div>
                    <xr-slider></xr-slider>
                    <button @click=${e => scope.onClick(e)}>Click me</button>`;
    },

    css() {
        return html`<style>
               .host {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    padding: 25px;
                }
                
                .container {
                    color: black;
                    font: 44px serif;
                    overflow: auto;
                    border-style: dashed;
                    border-width: 3px;
                    border-color: black;
                    display: inline-block;
                }
                
                .host xr-slider {
                    width: 300px;
                    height: 50px;
                    background-color: yellow;
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
