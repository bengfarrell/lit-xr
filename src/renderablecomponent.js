import {render} from "lit-html";
import {svg, html} from "./pointerevents.js";
import LitXr from "./lit-xr.js";

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
            this._cachedRoot = LitXr.findRenderRoot(this);
        }
        return this._cachedRoot;
    }

    set renderWrapper(val) {
        this._renderWrapper = val;
        this.render();
    }

    get renderWrapper() {
        return this._renderWrapper;
    }

    connectedCallback() {
        this.onInit();
        this.render();
    }

    onInit() {}

    render() {
        if (this.svgwrapper) {
            render(html`${this.svgwrapper()}`, this);
        }

        if (this.renderRoot.renderWrapper) {
            this.renderRoot.renderWrapper.render();
        }
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
            return svg`<svg width=${width} height="${height}" viewBox="0 0 ${width} ${height}">
                        <foreignObject width="100%" height="100%">
                            <div class="host" width="100%" height="100%" style="display: inline-block; background-color: ${this.backgroundColor};">${this.html()}</div>
                        </foreignObject>
                   </svg>`;
        } else {
            return this.html();
        }
    }
}
