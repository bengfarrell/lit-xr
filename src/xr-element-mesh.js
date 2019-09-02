import Babylon from '../web_modules/babylonjs.js';
import XrElementRenderRoot from './xr-element-render-root.js';

export default class XrElementMesh {
    constructor(name, component, meshscale, scene, offscreenContainer) {
        const renderingEl = document.createElement('xr-render-base');
        offscreenContainer.appendChild(renderingEl);
        renderingEl.setAttribute('root-component', component);
        this.element = renderingEl;

        this.size = {
            width: renderingEl.size.width,
            height: renderingEl.size.height,
            scale: meshscale
        };

        this.mesh = Babylon.MeshBuilder.CreatePlane(name, {
            width: this.size.width  * meshscale,
            height: this.size.height  * meshscale
        }, scene);

        this.texture = new Babylon.DynamicTexture("dynamic texture", {width: this.size.width, height: this.size.height}, scene);
        this.textureContext = this.texture.getContext();
        this.material = new Babylon.StandardMaterial("Mat", scene);
        this.material.diffuseTexture = this.texture;
        this.material.specularColor = new Babylon.Color3(0, 0, 0);
        this.material.emissiveColor = new Babylon.Color3(128, 128, 128);
        this.mesh.material = this.material;

        this.element.bufferCallback = data => this.onBufferCallback(data);
        this.element.renderBuffer(this.size.width, this.size.height);

    }

    sendMessage(name, o) {
        this.element.sendMessage(name, o);
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
