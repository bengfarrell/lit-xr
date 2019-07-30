import {render, html, directive} from '../../../web_modules/lit-html.js';
import ComponentBase2D from '../scene/ui/renderedcomponent2d.js';
import Template from './template.js';
import Utils from '../scene/ui/componentutils.js';

const Map = directive(Utils.MapDirective);

export default class SampleComponent extends HTMLElement {
    connectedCallback() {
        this.onInit();
        this.render();
    }

    onInit() {
        this.interactives = {};
        this.dom = {};
        this.data = { counter: 0 }
    }

    render() {
        render(html`${Template.html(this, this.data)}`, this);
    }

    asSVG() {
        return this.querySelector('svg');
    }

    onClick(e) {
        this.data.counter ++;
        this.render();
    }
}

Utils.registerComponent( 'sample-component', SampleComponent );
