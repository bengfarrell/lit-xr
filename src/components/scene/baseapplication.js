import BaseConfig from './baseconfig.js';
import BaseGroup from './basegroup.js';
import EventListener from './eventlistener.js';
import Babylon from '../../../web_modules/babylonjs.js';

export default class BaseApplication extends EventListener {
    constructor(el, cfg) {
        super();
        this.appConfig = BaseConfig.apply(cfg);
        this.element = el;

        this.engine = new Babylon.Engine(this.element, this.appConfig.engine.antialias, this.appConfig.engine.options);
        this.engine.enableOfflineSupport = false;
        this.initScene().then( (s) => {
                this.scene = s;
                this.engine.runRenderLoop(() => {
                this.tick();
            });
        });
    }

    async initScene() {
        const scene = new Babylon.Scene(this.engine);
        //this.scene.useRightHandedSystem = this.appConfig.scene.useRightHandedSystem;

        this.isApplication = true;
        this.cameras = [];
        this.lights = [];

        if (this.appConfig.camera) {
            this.addCamera(this.appConfig.camera.type, this.appConfig.camera.options);
        }

        if (this.appConfig.lights) {
            this.addLights(this.appConfig.lights);
        }

        this.root = new BaseGroup();
        this.root.parent = this;
        this.root.initializeGroup(scene, 'application-root');
        this.root.onParented(scene, this, this.element);

        this.elementSize = { width: this.element.offsetWidth, height: this.element.offsetHeight };

        // Default Environment
       const environment = scene.createDefaultEnvironment({ enableGroundShadow: true, groundYBias: 1 });
       environment.setMainColor(Babylon.Color3.FromHexString("#74b9ff"));

        // Check XR support
        const xrHelper = await scene.createDefaultXRExperienceAsync({floorMeshes: [environment.ground]});
        xrHelper.baseExperience.onStateChangedObservable.add((state)=>{
            if(state === Babylon.WebXRState.IN_XR){
                // When entering webXR, position the user's feet at 0,0,-1
                xrHelper.baseExperience.setPositionOfCameraUsingContainer(new Babylon.Vector3(0,xrHelper.baseExperience.camera.position.y,-1))
            }
        });

        xrHelper.input.onControllerAddedObservable.add((controller)=>{
            this.controller = controller;
        });

        scene.onPointerObservable.add((pointerInfo) => {
            if (!this.controller) {
                switch (pointerInfo.type) {
                    case Babylon.PointerEventTypes.POINTERDOWN:
                        this.mouseEvent('mousedown', this.scene.pointerX, this.scene.pointerY);
                        break;
                    case Babylon.PointerEventTypes.POINTERUP:
                        this.mouseEvent('mouseup', this.scene.pointerX, this.scene.pointerY);
                        break;
                    case Babylon.PointerEventTypes.POINTERMOVE:
                        this.mouseEvent('mousemove', this.scene.pointerX, this.scene.pointerY );
                        break;
                }
            }
        });

        window.addEventListener('resize', () => this.onResize());
        return scene;
    }

    get canvas() { return this.element; }
    get name() { return 'root'; }

    /**
     * convenience method to add a typical camera
     */
    addCamera(type, options) {
        if (!type) {
            type = 'freecamera';
        }

        if (!options.position) {
            options.position = new Babylon.Vector3(0, 0, 0);
        } else {
            options.position = new Babylon.Vector3(options.position.x, options.position.y, options.position.z);
        }

        let camera;
        switch (type) {
            case 'default':
            case 'freecamera':
                camera = new Babylon.FreeCamera('camera', options.position, this.scene);
                break;

            case 'arcrotate':
                camera = new Babylon.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, Babylon.Vector3.Zero(), this.scene);
                camera.wheelPrecision = 1000;
                camera.setPosition(options.position);
                camera.attachControl(this.element, true);
                break;

            default:
                console.error('Camera not added, ', type, ' is not found');
        }

        if (options.useMouseControls) {
            camera.attachControl(this.element, true);
        }
        this.cameras.push(camera);
    }

    /**
     * convenience method to add a typical light
     */
    addLights() {
        let light = new Babylon.HemisphericLight("light1", new Babylon.Vector3(0, 1, -1), this.scene);
        light.intensity = 0.7;
    }

    get config() {
        return this.appConfig;
    }

    /**
     * render engine tick
     */
    tick() {
        if (!this.initialized) {
            this.onCreate(this.scene);
            this.initialized = true;
        }

        if (this.initialized /*&& this.cameras.length > 0*/) {
            if (this.elementSize.width !== this.element.offsetWidth || this.elementSize.height !== this.element.offsetHeight) {
                this.onResize();
            }

            if (this.controller) {
                const ray = new Babylon.Ray(this.controller.pointer.absolutePosition, this.controller.pointer.forward, 1000);
                const pick = this.scene.pickWithRay(ray);
                if (pick.hit) {
                    this.onMouseEvent('mousemove', pick.pickedMesh, pick.pickedPoint);

                    if(this.controller.inputSource.gamepad.buttons[0].pressed){
                        if (!this.triggerDown){
                            this.onMouseEvent('mousedown', pick.pickedMesh, pick.pickedPoint);
                            this.triggerDown = true;
                        }
                    } else {
                        if (this.triggerDown) {
                            this.onMouseEvent('mouseup', pick.pickedMesh, pick.pickedPoint);
                        }
                        this.triggerDown = false;
                    }
                }

            }
            this.scene.render();
            this.onRender(this.engine.getDeltaTime());
        }
    }

    /**
     * replace all scenes starting with application and spidering through children, restarting all render loops
     * @param scene
     * @param children
     */
    replaceAllScenes(scene, children) {
        if (!children) {
            this.engine.stopRenderLoop();

            this.scene = scene;
            this.root.scene = scene;
            children = this.root.children;
            this.engine.runRenderLoop( () => this.tick() );
        }
        for (let c = 0; c < children.length; c++) {
            if (children[c].isGroup) {
                children[c].scene = scene;
            }

            if (children[c].children && children[c].children.length > 0) {
                this.replaceAllScenes(scene, children[c].children);
            }
        }
    }

    add(objects) { return this.root.add(objects); }
    remove(objects) { return this.root.remove(objects); }
    removeAll(objects) { this.root.removeAll(objects); }
    find(name) { return this.root.find(name); }

    mouseEvent(eventtype, x, y) {
        const pick = this.scene.pick(x, y);
        if (pick.hit) {
            this.onMouseEvent(eventtype, pick.pickedMesh, pick.pickedPoint);
        }
    }

    sendMessage(name, o) {}

    onResize() { this.engine.resize(); }

    onCreate(sceneEl) {}
    onRender(time) {}
    onMouseEvent(eventtype, mesh, point) {}
    onMessage(name, o) {}
}
