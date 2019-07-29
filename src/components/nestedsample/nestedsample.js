import {render, html} from '../../../web_modules/lit-html.js';
import ComponentBase2D from '../scene/ui/componentbase2d.js';
import Template from './template.js';

export default class NestedSample extends ComponentBase2D {
    static get Tag() { return 'nested-sample'; }

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

ComponentBase2D.registerComponent( NestedSample );
