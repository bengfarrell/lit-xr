import BaseApplication from './baseapplication.js';
import Babylon from '../../../web_modules/babylonjs.js';
import BabylonUIComponent from './ui/babylonuicomponent.js';
import Sample from '../sample/sample.js';
import NestedSample from '../nestedsample/nestedsample.js';
import Slider from './ui/components/slider.js';

export default class App extends BaseApplication {
    constructor(el, cfg) {
        super(el, cfg);
        this.component = new BabylonUIComponent('test', 'sample-component', .01, this.scene, document.getElementById('offscreen-container') );
        //this.scene.debugLayer.show();

    }

    onCreate(scene) {}
    onRender(deltatime) {}
    onMouseEvent(eventtype, mesh, point) {
        if (mesh === this.component.mesh) {
            this.component.handlePointerEvent(eventtype, point, true);
        }
    }
}
