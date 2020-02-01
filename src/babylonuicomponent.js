import LitXRSurface from './lit-xr-surface.js';

export default class BabylonUIComponent {
    createDefaultMesh(name) {
        return this._babylon.MeshBuilder.CreatePlane(name, {
            width: this.size.width  * this.size.scale,
            height: this.size.height  * this.size.scale
        }, this._scene);
    }

    constructor(component, scene, opts) {
        this._scene = scene;
        this._babylon = opts.babylon ? opts.babylon : BABYLON;
        this._container = opts.container ? opts.container : document.body;
        this.size = {
            scale: opts.scale ? opts.scale : 0.1
        };

        const renderingEl = document.createElement('litxr-surface');
        this._container.appendChild(renderingEl);
        renderingEl.setAttribute('root-component', component);
        this.element = renderingEl;
        this.size.width = renderingEl.size.width;
        this.size.height = renderingEl.size.height;
        this.mesh = opts.mesh ? opts.mesh : this.createDefaultMesh(opts.name ? opts.name : component);

        this.texture = new this._babylon.DynamicTexture("dynamic texture", {width: this.size.width, height: this.size.height}, scene);
        this.textureContext = this.texture.getContext();
        this.material = new this._babylon.StandardMaterial("Mat", scene);
        this.material.diffuseTexture = this.texture;
        this.material.specularColor = new this._babylon.Color3(0, 0, 0);
        this.material.emissiveColor = new this._babylon.Color3(128, 128, 128);
        this.mesh.material = this.material;

        this.element.bufferCallback = data => this.onBufferCallback(data);
        this.element.renderTexture(this.size.width, this.size.height);

        scene.onPointerObservable.add((pointerInfo) => {
            const pick = scene.pick(pointerInfo.event.clientX, pointerInfo.event.clientY);
            if (pick.hit) {
                if (pick.pickedMesh === this.mesh) {
                    this.handlePointerEvent(pointerInfo.type, pick.pickedPoint, this.mesh);
                }
            }
        });
    }

    sendMessage(name, o) {
        this.element.sendMessage(name, o);
    }

    handlePointerEvent(eventtype, point, mesh) {
        const PointerEventTypes = this._babylon.PointerEventTypes;
        let eventtypes;
        switch (eventtype) {
            case PointerEventTypes.POINTERDOWN:
                eventtypes = { mouse: 'mousedown', pointer: 'pointerdown'};
                break;
            case PointerEventTypes.POINTERUP:
                eventtypes = { mouse: 'mouseup', pointer: 'pointerup'};
                break;
            case PointerEventTypes.POINTERMOVE:
                eventtypes = { mouse: 'mousemove', pointer: 'pointermove', updateHoverStatus: true};
                break;
            case PointerEventTypes.POINTERWHEEL:
                return;
            case PointerEventTypes.POINTERPICK:
                return;
            case PointerEventTypes.POINTERTAP:
                eventtypes = { mouse: 'click'};
                break;
            case PointerEventTypes.POINTERDOUBLETAP:
                eventtypes = { mouse: 'dblclick'};
                break;
        }

        // normalize XY to 0-1 range
        const width = this.size.width * this.size.scale;
        const height = this.size.height * this.size.scale;
        const x = (point.x - mesh.position.x + width/2) / width;
        const y = 1 - (point.y - mesh.position.y + height/2) / height;
        this.element.handlePointerEvent(eventtypes, x, y);
    }

    onBufferCallback(data) {
        this.textureContext.drawImage(data, 0, 0, this.size.width, this.size.height);
        this.texture.update();
    }
}
