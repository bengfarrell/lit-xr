import Babylon from '../../../../web_modules/babylonjs.js';

export default class BabylonUIComponent {
    constructor(name, component, meshscale, scene, offscreenContainer) {
        //this.element = document.createElement('rendered-component');
        //offscreenContainer.appendChild(this.element);

        const template = document.createElement('template');
        template.innerHTML = `<rendered-component><sample-component></sample-component></rendered-component>`;
        offscreenContainer.appendChild(template.content);
        this.element = offscreenContainer.children[0];

        this.size = {
            width: this.element.size.width * meshscale,
            height: this.element.size.height * meshscale
        };

        this.mesh = BABYLON.MeshBuilder.CreatePlane(name, {
            width: this.size.width,
            height: this.size.height
        }, scene);

        this.texture = new BABYLON.DynamicTexture("dynamic texture", {width: this.element.size.width * 2, height: this.element.size.height * 2}, scene);
        this.textureContext = this.texture.getContext();
        this.material = new BABYLON.StandardMaterial("Mat", scene);
        this.material.diffuseTexture = this.texture;
        this.material.specularColor = new BABYLON.Color3(0, 0, 0);
        this.material.emissiveColor = new BABYLON.Color3(128, 128, 128);
        this.mesh.material = this.material;

        this.element.bufferCallback = data => this.onBufferCallback(data);
        this.element.renderBuffer();

    }

    handlePointerEvent(eventtype, point, debug) {
        // normalize to 0-1 range
        const x = (point.x + this.size.width/2) / this.size.width;
        const y = 1 - (point.y + this.size.height/2) / this.size.height;
        this.element.handlePointerEvent(eventtype, x, y, debug);
    }

    onBufferCallback(data) {
        this.textureContext.drawImage(data, 0, 0, this.element.size.width * 2, this.element.size.height * 2);
        this.texture.update();
    }
}
