import {BaseApplication} from 'babylon-scene';
import BabylonUIComponent from '../src/babylonuicomponent.js';
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

    onReady() {
        this.component = new BabylonUIComponent('sample-component',
            this.stage.scene, {
                babylon: App.Babylon,
                container: document.getElementById('offscreen')
            });
        this.component.mesh.position.z = 50;
    }

    onRender(deltatime) {}
    sendMessage(name, o) {
        this.component.sendMessage(name, o);
    }
}
