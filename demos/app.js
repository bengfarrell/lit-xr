import BaseApplication from '../node_modules/babylon-scene/src/baseapplication.js';
import XrElementMesh from '../src/xr-element-mesh.js';
import XrElementRenderRoot from '../src/xr-element-render-root.js'
import Sample from './components/sample/sample.js';
import Pointer from '../node_modules/babylon-scene/src/addons/pointer.js';

export default class extends BaseApplication {
    onReady() {
        const Babylon = this.stage.babylon;
        Pointer.add(this);
        this.component = new XrElementMesh('test', 'sample-component', .01, this.scene, document.getElementById('offscreen-container') );
    }

    onMeshPointer(pick, pointerInfo) {
        if (pick.pickedMesh === this.component.mesh) {
            const Babylon = this.stage.babylon;
            let type;
            switch (pointerInfo.type) {
                case Babylon.PointerEventTypes.POINTERDOWN:
                    type = 'pointerdown';
                    break;
                case Babylon.PointerEventTypes.POINTERUP:
                    type = 'pointerup';
                    break;
                case Babylon.PointerEventTypes.POINTERMOVE:
                    type = 'pointermove';
                    break;
                case Babylon.PointerEventTypes.POINTERWHEEL:
                    type = 'pointerwheel';
                    break;
                case Babylon.PointerEventTypes.POINTERPICK:
                    type = 'pointerpick';
                    break;
                case Babylon.PointerEventTypes.POINTERTAP:
                    type = 'pointertap';
                    break;
                case Babylon.PointerEventTypes.POINTERDOUBLETAP:
                    type = 'pointerdoubletap';
                    break;
            }

            this.component.handlePointerEvent(type, pick.pickedPoint);
        }
    }
}
