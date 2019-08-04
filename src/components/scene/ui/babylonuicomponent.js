import Babylon from '../../../../web_modules/babylonjs.js';
import ComponentBase2D from './componentbase2d.js';

export default class BabylonUIComponent {
    constructor(name, component, meshscale, scene, offscreenContainer) {
        const comp = document.createElement(component);
        comp.setAttribute('is-render-root', true);
        const renderingEl = document.createElement('component-base-2d');
        renderingEl.appendChild(comp);
        offscreenContainer.appendChild(renderingEl);
        this.element = renderingEl;

        this.size = {
            width: comp.preferredSize.width,
            height: comp.preferredSize.height,
            scale: meshscale
        };

        renderingEl.size = this.size;

        this.mesh = BABYLON.MeshBuilder.CreatePlane(name, {
            width: this.size.width  * meshscale,
            height: this.size.height  * meshscale
        }, scene);

        this.texture = new BABYLON.DynamicTexture("dynamic texture", {width: this.size.width, height: this.size.height}, scene);
        this.textureContext = this.texture.getContext();
        this.material = new BABYLON.StandardMaterial("Mat", scene);
        this.material.diffuseTexture = this.texture;
        this.material.specularColor = new BABYLON.Color3(0, 0, 0);
        this.material.emissiveColor = new BABYLON.Color3(128, 128, 128);
        this.mesh.material = this.material;

        this.element.bufferCallback = data => this.onBufferCallback(data);
        this.element.renderBuffer(this.size.width, this.size.height);

    }

    handlePointerEvent(eventtype, point, debug) {
        // normalize to 0-1 range
        const width = this.size.width * this.size.scale;
        const height = this.size.height * this.size.scale;
        const x = (point.x + width/2) / width;
        const y = 1 - (point.y + height/2) / height;
        this.element.handlePointerEvent(eventtype, x, y, debug);
    }

    onBufferCallback(data) {
        this.textureContext.drawImage(data, 0, 0, this.size.width, this.size.height);
        this.texture.update();
    }
}
