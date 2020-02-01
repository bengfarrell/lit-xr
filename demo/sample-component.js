import {html, LitXR, Image} from "../lit-xr.js";
import ColorPicker from "./colorpicker/colorpicker.js";

export default class SampleComponent extends LitXR {
    static get CHANGE_PRIMITIVE() { return 'onChangePrimitive'; }
    static get preferredSize() {
        return {width: 700, height: 300};
    }

    render() {
        return html`<style>
               .host {
                    display: flex;
                    width: calc(100% - 50px);
                    height: calc(100% - 50px);
                    padding: 25px;
                }
                
                .primitives {
                    display: flex;
                    justify-content: center;
                    flex: 1;
                }
                
                .primitive-btn {
                    background-color: #EAEAEA;
                    padding: 15px;
                    margin-right: 10px;
                    margin-left: 10px;
                    border-radius: 10px;
                }
                
                .primitive-btn.hover,
                .primitive-btn:hover{
                    background-color: #AFAFAF;
                }
                
                img {
                    width: 50px;
                    height: 50px;
                }
             </style>
             <div class="primitives">
                <div @click=${ e => this.selectPrimitive('cube')} class="primitive-btn"><img src="${Image('./images/cube.png', this)}" /></div>
                <div @click=${ e => this.selectPrimitive('cylinder')} class="primitive-btn"><img src="${Image('./images/cylinder.png', this)}" /></div>
                <div @click=${ e => this.selectPrimitive('sphere')} class="primitive-btn"><img src="${Image('./images/sphere.png', this)}" /></div>
             </div>
             <litxr-color-picker></litxr-color-picker>`;
    }

    selectPrimitive(type) {
        const ce = new CustomEvent(SampleComponent.CHANGE_PRIMITIVE, { detail: type, bubbles: true, composed: true});
        this.dispatchEvent(ce);
    }
}

customElements.define('sample-component', SampleComponent);
