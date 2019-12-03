import {render} from 'lit-html';
import {html, interactables} from '../../src/pointerevents.js';
import Template from './template.js';
import Utils from '../../src/componentutils.js';
import LitXr from "../../src/lit-xr.js";
import RenderableComponent from "../../src/renderablecomponent.js";

export default class SampleComponent extends RenderableComponent {

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

Utils.registerComponent( 'sample-component', SampleComponent );
