import {render, html} from 'lit-html';
import Template from './template.js';
import Utils from '../../src/componentutils.js';
import RenderableComponent from "../../src/renderablecomponent.js";

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
