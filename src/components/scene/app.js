import BaseApplication from './baseapplication.js';
import BabylonUIComponent from './ui/babylonuicomponent.js';
import Sample from '../sample/sample.js';
import NestedSample from '../nestedsample/nestedsample.js';
import Slider from './ui/components/slider.js';

export default class App extends BaseApplication {
    constructor(el, cfg) {
        super(el, cfg);
        this.component = new BabylonUIComponent('test', 'sample-component', .01, this.scene, document.getElementById('offscreen-container') );
       // this.component.mesh.translate(BABYLON.Axis.Y, 3, BABYLON.Space.WORLD);
        //this.scene.debugLayer.show();

    }

    onCreate(scene) {}
    onRender(deltatime) {}
    onMouseEvent(eventtype, mesh, point) {
        if (mesh === this.component.mesh) {
            this.component.handlePointerEvent(eventtype, point, true);
        }
    }

    sendMessage(name, o) {
        this.component.sendMessage(name, o);
    }
}
