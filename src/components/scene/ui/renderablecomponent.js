import {render} from "../../../../web_modules/lit-html.js";
import {svg, html} from "./pointerevents.js";
import ComponentBase2D from "./componentbase2d.js";

export default class RenderableComponent extends HTMLElement {
    static get preferredSize() {
        return {width: 500, height: 500};
    }

    get backgroundColor() {
        return '#ffffff';
    }

    get preferredSize() {
        return this.constructor.preferredSize;
    }

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

    onInit() {
    }

    render() {
        render(html`${this.svgwrapper()}`, this);
        this.renderRoot.render();
    }

    sendMessage(name, o) {
        this.onMessage(name, o);
    }

    onMessage(name, o) {}

    asSVG() {
        return this.querySelector('svg');
    }

    html() {
        return html``;
    }

    svgwrapper() {
        const width = this.preferredSize.width;
        const height = this.preferredSize.height;
        if (this.hasAttribute('is-render-root')) {
            return svg`<svg viewBox="0 0 ${width} ${height}">
                        <foreignObject class="host" width="100%" height="100%" style="background: ${this.backgroundColor};">
                            ${this.html()}
                        </foreignObject>
                   </svg>`;
        } else {
            return this.html();
        }
    }
}
