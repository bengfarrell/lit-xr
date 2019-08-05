import {render} from '../../../web_modules/lit-html.js';
import {html, interactables} from '../scene/ui/pointerevents.js';
import Template from './template.js';
import Utils from '../scene/ui/componentutils.js';
import ComponentBase2D from "../scene/ui/componentbase2d.js";
import RenderableComponent from "../scene/ui/renderablecomponent.js";

export default class SampleComponent extends RenderableComponent {

    onInit() {
        this.dom = {};
        this.data = { counter: 0 };
    }

    onClick(e) {
        this.data.counter ++;
        this.render();
    }

    onMessage(name, o) {
        this.data.message = o.x + ',' + o.y;
        this.render();
    }

    html() { return Template.html(this, this.data); }
}

Utils.registerComponent( 'sample-component', SampleComponent );
