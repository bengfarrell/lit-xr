import {render, html} from '../../../web_modules/lit-html.js';
import ComponentBase2D from '../scene/ui/renderedcomponent2d.js';
import Template from './template.js';
import Utils from '../scene/ui/componentutils.js';

export default class NestedSample extends ComponentBase2D {
    onInit() {
        this.data.counter = 0;
    }

    onClick(e) {
        this.data.counter ++;
        this.render();
    }

    html() { return Template.html(this, this.data); }
    css() { return Template.css(); }
}

Utils.registerComponent( 'nested-sample', NestedSample );
