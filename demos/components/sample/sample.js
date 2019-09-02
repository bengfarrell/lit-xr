import Template from './template.js';
import XrElementRenderRoot from '../../../src/xr-element-render-root.js';
import {XRElement} from '../../../src/xr-element.js';
import Slider from "../slider.js";

export default class SampleComponent extends XRElement {

    onInit() {
        this.dom = {};
        this.data = { counter: 0 };
    }

    onClick(e) {
        this.data.counter ++;
        this.render();
    }

    html() { return Template.html(this, this.data); }
}

if (!customElements.get('sample-component')) {
    customElements.define('sample-component', SampleComponent);
}
