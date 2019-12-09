import {LitElement} from "lit-element";
import {interactables} from "./pointerevents.js";

export default class LitXR extends LitElement {
    /**
     * disable Shadow DOM
     * (sadly, SVG rendering is blocked by the Shadow DOM)
     * @return {LitXR}
     */
    createRenderRoot() { return this; }

    /**
     * suggested size for component to help size and create the mesh
     * @return {{width: number, height: number}}
     */
    static get preferredSize() {
        return {width: 500, height: 500};
    }

    /**
     * suggested background color for render surface
     * @return {string}
     */
    static get backgroundColor() {
        return '#ffffff';
    }

    /**
     * instance getter for imported interactables
     * @return {interactables}
     */
    get interactables() {
        return interactables;
    }

    /**
     * instance getter for static background color
     * @return {string}
     */
    get backgroundColor() {
        return this.constructor.backgroundColor;
    }

    /**
     * instance getter for static size
     * @return {{width: number, height: number}}
     */
    get preferredSize() {
        return this.constructor.preferredSize;
    }

    /**
     * recursively find the LitXRSurface component that contains the passed element
     * @param {HTMLElement} el
     * @return {LitXRSurface}
     */
    static findSurface(el) {
        let parent = el.parentElement;
        while (parent) {
            if (parent.surface) {
                return parent.surface;
            } else {
                parent = parent.parentElement;
            }
        }
    }

    /**
     * set LitXRSurface component that holds the UI component
     * @param {LitXRSurface} val
     */
    set surface(val) {
        this._surface = val;
    }

    /**
     * find LitXRSurface component that holds the UI component
     * @return {LitXRSurface}
     */
    get surface() {
        if (!this._surface) {
            this._surface = LitXR.findSurface(this);
            if (!this._surface) { return; } // potential timing issue, defer rendering until next time
            this._surface.renderTexture();
        }
        return this._surface;
    }

    /**
     * override LitElement's requestUpdate to call
     * @param name
     * @param oldValue
     */
    requestUpdate(name, oldValue) {
        super.requestUpdate(name, oldValue);
        if (this.surface) { this.surface.renderTexture(); }
    }
}
