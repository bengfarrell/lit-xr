import {
    AttributeCommitter,
    BooleanAttributePart,
    EventPart, NodePart,
    DefaultTemplateProcessor,
    PropertyCommitter, SVGTemplateResult, TemplateResult
} from "../../../../web_modules/lit-html.js";

import ComponentBase2D from './componentbase2d.js';

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
            const rootEl = el.renderRoot !== undefined ? el.renderRoot : ComponentBase2D.findRenderRoot(el);
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
