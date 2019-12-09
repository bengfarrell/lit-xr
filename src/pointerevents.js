import {
    AttributeCommitter,
    BooleanAttributePart,
    EventPart, NodePart,
    DefaultTemplateProcessor,
    PropertyCommitter, SVGTemplateResult, TemplateResult
} from "lit-html";

import LitXR from "./lit-xr.js";

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
            // LitXR change: Add element to interactables manager
            // This assumes anything that LitElement intercepts prefixed with @ should be interactive
            // Exceptions could be @change events or similar, but it should be fairly low cost to manage these extra
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

/**
 * class to manage a list of interactable elements (can take hover, click, etc)
 * as elements cannot take pointer/mouse events in 3D context, as well as interacted with
 * via WebXR controllers, they need to be tracked and managed to directly pass interaction events
 */
export class Interactables {
    constructor() {
        this._unsorted = [];
        this._sorted = new WeakMap();
    }

    /**
     * add element to interactables list
     * @param {HTMLElement} el
     */
    add(el) {
        this._unsorted.push(el);
        this.sort();
    }

    /**
     * get elements associated with LitXRSurface
     * @param {LitXRSurface} sfc
     * @return {*[]|any}
     */
    elementsForSurface(sfc) {
        if (this._sorted.has(sfc)) {
            return this._sorted.get(sfc);
        }
        return [];
    }

    /**
     * take any unprocessed elements that were added and bucket them into
     * weakmaps with their surface as the key
     */
    sort() {
        for (let c = 0; c < this._unsorted.length; c++) {
            const el = this._unsorted[c];

            // element may not even be a LitXR Web Component, it could be
            // a normal div, button, etc - therefore recursion may be needed to find its surface
            const surface = el.surface ? el.surface : LitXR.findSurface(el);

            // can't depend on surface existing due to timing issues when the component is first starting up, so defer processing
            if (!surface) { return; } // TODO: don't return, manage the unsorted list better

            if (this._sorted.has(surface)) {
                this._sorted.get(surface).push(el);
            } else {
                this._sorted.set( surface, [el]);
            }
        }
        this._unsorted = [];
    }
}

export const html = (strings, ...values) => new TemplateResult(strings, values, 'html', modifiedTemplateProcessor);
export const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg', modifiedTemplateProcessor);
export const interactables = new Interactables();
