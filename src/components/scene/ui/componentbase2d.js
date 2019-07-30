import {svg, html, render, directive} from "../../../../web_modules/lit-html.js";
import Utils from './componentutils.js';

export default class ComponentBase2D extends HTMLElement {
    static get HOVER_CLASS() { return 'hover'; }

    static isPointInsideBounds(pt, bounds) {
        if (pt.x < bounds.left) { return false; }
        if (pt.x > bounds.right) { return false; }
        if (pt.y < bounds.top) { return false; }
        if (pt.y > bounds.bottom) { return false; }
        return true;
    }

    // override to populate data before render
    onInit() {}

    handlePointerEvent(eventtype, x, y, debug) {
        let change = false;
        const bounds = this.getBoundingClientRect();

        const normalizedXY = {
            x: bounds.width * x,
            y: bounds.height * y,
            absX: bounds.left + bounds.width * x,
            absY: bounds.top + bounds.height * y
        };
        if (debug) {
            this.rootdata.debug.clickfeedback.x = normalizedXY.x + 5;
            this.rootdata.debug.clickfeedback.y = normalizedXY.y + 5;
            change = true;
        }

        const lastHovered = this._hovered.slice();
        if (eventtype === 'mousemove') {
            this._hovered = [];
        }

        Object.keys(this.interactives).forEach( el => {
            const elBounds = this.interactives[el].getBoundingClientRect();
            if (ComponentBase2D.isPointInsideBounds( {x: normalizedXY.absX, y: normalizedXY.absY}, elBounds) ) {
                const e = new MouseEvent(eventtype, {
                        bubbles: true,
                        cancelable: true,
                        clientX: normalizedXY.x,
                        clientY: normalizedXY.y
                });
                this.interactives[el].dispatchEvent (e);

                if (eventtype === 'mousedown') {
                    this._lastMouseDown = { el: this.interactives[el], time: Date.now()};
                } else if (eventtype === 'mouseup') {
                    if (this._lastMouseDown && this._lastMouseDown.el === this.interactives[el]) {
                        const elapsedTime = Date.now() - this._lastMouseDown.time;
                        if (elapsedTime < 500) {
                            const e = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                clientX: normalizedXY.x,
                                clientY: normalizedXY.y
                            });
                            this.interactives[el].dispatchEvent(e);
                        }
                    }
                    this._lastMouseDown = null;
                } else if (eventtype === 'mousemove') {
                    this._hovered.push(this.interactives[el]);
                    this.interactives[el].classList.toggle( ComponentBase2D.HOVER_CLASS, true);
                    change = true;
                }
            }

            if (el.handlePointerEvent) {
                el.handlePointerEvent(eventtype, x, y, debug)
            }
        });

        if (eventtype === 'mousemove') {
            // clean up all the elements that aren't hovered over
            for (let c = 0; c < lastHovered.length; c++) {
                if (this._hovered.indexOf(lastHovered[c]) === -1) {
                    lastHovered[c].classList.toggle(ComponentBase2D.HOVER_CLASS, false);
                    change = true;
                }
            }
        }

        if (change) { this.render(); }
    }

    render() {
        render(html`${this.template()}`, this.shadowRoot);
    }
}

const Map = directive(Utils.MapDirective);
