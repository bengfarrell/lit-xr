import {render} from "../../../../web_modules/lit-html.js";
import {svg, html} from "./pointerevents.js";
import ComponentBase2D from "./componentbase2d.js";

export default class RenderableComponent extends HTMLElement {
    static get preferredSize() { return { width: 500, height: 500 }; }
    get preferredSize() { return this.constructor.preferredSize; }

    get renderRoot() {
        if (!this._cachedRoot) {
            this._cachedRoot = ComponentBase2D.findRenderRoot(this);
        }
        return this._cachedRoot;
    }

    connectedCallback() {
        this.onInit();
        this.render();
    }

    onInit() {}

    render() {
        render(html`${this.html()}`, this);
        this.renderRoot.render();
    }

    asSVG() {
        return this.querySelector('svg');
    }

    html() { return svg``; }
}
