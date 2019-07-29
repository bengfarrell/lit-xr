import Template from './template.js';
import App from './app.js';

export default class Scene extends HTMLElement {

    connectedCallback() {
        this.innerHTML = Template.html({name: this.getAttribute('name')});
        this.dom = { canvas: this.querySelector('canvas') };

        this._3dScene = new App(this.dom.canvas, {
            camera: {type: 'arcrotate', options: {useMouseControls: true, position: {x: 0, y: 0, z: -5}}},
            lights: 'default'
        });

        this.addEventListener('pointermove', e => {
            this._3dScene.mouseEvent('mousemove', e.offsetX, e.offsetY);
        });

        this.addEventListener('pointerdown', e => {
            this._3dScene.mouseEvent('mousedown', e.offsetX, e.offsetY);
        });

        this.addEventListener('pointerup', e => {
            this._3dScene.mouseEvent('mouseup', e.offsetX, e.offsetY);
        });
    }
}

if (!customElements.get('babylon-scene')) {
    customElements.define('babylon-scene', Scene);
}
