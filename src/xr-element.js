import {render as LitRender, directive as LitDirective} from "../web_modules/lit-html.js";
import XrElementRenderRoot from './xr-element-render-root.js';

import {
    AttributeCommitter,
    BooleanAttributePart,
    EventPart, NodePart,
    DefaultTemplateProcessor,
    PropertyCommitter, SVGTemplateResult, TemplateResult
} from '../web_modules/lit-html.js';

/**
 * Creates Parts when a template is instantiated.
 */
class ModifiedTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }

        if (prefix === '@') {
            interactables.add(element);
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart(options);
    }
}
const modifiedTemplateProcessor = new ModifiedTemplateProcessor();

export class Interactables {
    constructor() {
        this._unsorted = [];
        this._sorted = new WeakMap();
    }

    add(el) {
        this._unsorted.push(el);
    }

    elementsForRoot(rootEl) {
        if (this._sorted.has(rootEl)) {
            return this._sorted.get(rootEl);
        }
        return [];
    }

    sort() {
        for (let c = 0; c < this._unsorted.length; c++) {
            const el = this._unsorted[c];
            let parent = el.parentElement;

            // can't depend on renderRoot existing due to timing issues when the component is first starting up
            const rootEl = el.renderRoot !== undefined ? el.renderRoot : XrElementRenderRoot.findRenderRoot(el);
            if (this._sorted.has(rootEl.renderWrapper)) {
                this._sorted.get(rootEl.renderWrapper).push(el);
            } else {
                this._sorted.set( rootEl.renderWrapper, [el]);
            }
        }
        this._unsorted = [];
    }


}

export const html = (strings, ...values) => new TemplateResult(strings, values, 'html', modifiedTemplateProcessor);
export const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg', modifiedTemplateProcessor);
export const interactables = new Interactables();
export const render = LitRender;
export const directive = LitDirective;

const images = {};
export const ImageDirective = (key, scope) =>
    (part) => {
        if (images[key]) {
            part.setValue(images[key]);
            return;
        }

        const request = new XMLHttpRequest();
        request.open('GET', key, true);
        request.responseType = 'blob';
        request.onload = () => {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.onload = e => {
                images[key] = e.target.result;
                part.committer.element.setAttribute('src', images[key]);
                scope.render();
            };
        };
        request.send();
        part.setValue(key);
    };

export class XRElement extends HTMLElement {
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
            this._cachedRoot = XrElementRenderRoot.findRenderRoot(this);
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
