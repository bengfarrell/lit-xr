import {render, html} from '../../../web_modules/lit-html.js';
import Template from './template.js';
import Utils from '../scene/ui/componentutils.js';
import RenderableComponent from "../scene/ui/renderablecomponent.js";

export default class NestedSample extends RenderableComponent {
    onInit() {
        this.dom = {};
        this.data = {};
        this.data.counter = 0;
    }

    onClick(e) {
        this.data.counter ++;
        this.render();
    }

    html() { return Template.html(this, this.data); }
}

Utils.registerComponent( 'nested-sample', NestedSample );
