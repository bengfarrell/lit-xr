import {html, LitXR, Image} from "../lit-xr.js";

export default class SampleComponent extends LitXR {
    static get properties() {
        return {
            counter: { type: Number },
            message: { type: String },
        };
    }

    constructor() {
        super();
        this.counter = 0;
    }

    onClick(e) {
        this.counter ++;
        this.requestUpdate();
    }

    render() {
        return html`<style>
               .host {
                    display: inline-block;
                    width: calc(100% - 50px);
                    height: calc(100% - 50px);
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
                
                .host litxr-slider {
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
            </style>
            <div class="container">
                Counter ${this.counter} ${this.message}
            </div>
            <litxr-slider></litxr-slider>
            <img width="75" height="75" src=${Image("./images/donut.jpg", this)} />
            <button @click=${e => this.onClick(e)}>Click me</button>`;
    }
}

customElements.define('sample-component', SampleComponent);
