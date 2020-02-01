import {BaseApplication, AddOns} from 'babylon-scene';
import {BabylonUIComponent} from '../lit-xr.js';
import SampleComponent from "../demo/sample-component.js";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/UniversalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { PointerEventTypes} from "@babylonjs/core";

export default class App extends BaseApplication {
    static get Babylon() {
        return {
            Engine: Engine,
            Scene: Scene,
            UniversalCamera: UniversalCamera,
            Vector3: Vector3,
            Color3: Color3,
            MeshBuilder: MeshBuilder,
            HemisphericLight: HemisphericLight,
            StandardMaterial: StandardMaterial,
            DynamicTexture: DynamicTexture,
            PointerEventTypes: PointerEventTypes
        };
    }

    onRender(deltaTime) {
        if (!this.xrcontrollers) { return; }
        for (let c = 0; c < this.xrcontrollers.length; c++) {
            const ray = this.xrcontrollers[c].getForwardRay(99999);
            const pick = this.stage.scene.pickWithRay(ray);
            if (pick.pickedMesh === this.component.mesh) {
                this.component.handlePointerEvent(PointerEventTypes.POINTERMOVE, pick.pickedPoint, this.component.mesh);
            }
        }
    }

    onReady() {
        AddOns.xrcontrollers.add(this);
        this.component = new BabylonUIComponent('sample-component',
            this.stage.scene, {
                babylon: App.Babylon,
                container: document.getElementById('offscreen')
            });
        this.component.mesh.position.z = 50;
        this.component.mesh.position.x = 25;

        this.changePrimitive('cube');

        this.component.element.addEventListener('change', e => {
            this.material = new StandardMaterial("color", this.stage.scene);
            const color = new Color3(e.detail.rgb.r/255, e.detail.rgb.g/255, e.detail.rgb.b/255);
            this.material.diffuseColor = color;
            this.material.specularColor = color;
            this.material.emissiveColor = color;
            this.material.ambientColor = color;
            this.material.alpha = e.detail.alpha /100;
            this.primitive.material = this.material;
        });

        this.component.element.addEventListener(SampleComponent.CHANGE_PRIMITIVE, e => {
            this.changePrimitive(e.detail);
        });
    }

    onControllerEvent(eventtype, button, controller, pick) {
        if (pick.pickedMesh === this.component.mesh) {
            const event = button.pressed ? PointerEventTypes.POINTERDOWN : PointerEventTypes.POINTERUP;
            if (event === PointerEventTypes.POINTERDOWN) {
                this.lastPointerDown = Date.now();
            }
            if (event === PointerEventTypes.POINTERUP && Date.now() - this.lastPointerDown < 250) {
                this.component.handlePointerEvent(PointerEventTypes.POINTERTAP, pick.pickedPoint, this.component.mesh);
            }
            this.component.handlePointerEvent(event, pick.pickedPoint, this.component.mesh);
        }
    }

    changePrimitive(type) {
        if (this.primitive) { this.primitive.dispose(); }

        switch (type) {
            case 'sphere':
                this.primitive = MeshBuilder.CreateSphere('sphere', {
                    diameter: 5
                }, this.stage.scene);
                break;

            case 'cylinder':
                this.primitive = MeshBuilder.CreateCylinder('cylinder', {
                    height: 5,
                    diameter: 5
                }, this.stage.scene);
                break;

            case 'cube':
                this.primitive = MeshBuilder.CreateBox('box', {
                    width: 5,
                    height: 5,
                    depth: 5
                }, this.stage.scene);
                break;
        }
        this.primitive.material = this.material;
        this.primitive.position.x = -5;
    }

    sendMessage(name, o) {
        this.component.sendMessage(name, o);
    }
}
