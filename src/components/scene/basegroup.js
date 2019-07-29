import EventListener from './eventlistener.js';

export default class BaseGroup extends EventListener {
    constructor(params) {
        super();
        this._config = params;
        this._children = [];
        this.isGroup = true;
    }

    init() {
        this.onCreate(this.config);
    }

    /**
     * get name of group
     */
    get name() {
        return this.constructor.name;
    }

    /**
     * get app config
     * @returns {*}
     */
    get appConfig() {
        return this.application.appConfig;
    }

    /**
     * get config
     * @returns {*}
     */
    get config() {
        return this._config;
    }

    initializeGroup(scene, name) {
        if (!name) {
            name = this.constructor.name + '-group';
        }
        this._group = new BABYLON.Mesh(name, scene);
    }

    onParented(scene, parent, canvas) {
        this.scene = scene;
        this._canvas = canvas;
        this.onCreate(scene);
    }

    /**
     * overridable methods
     * leave empty to be a simple abstraction we don't have to call super on
     * @param scene
     */
    onRender(scene, time) {};
    onCreate(params) {};

    /**
     * add object to parent
     * @param object
     */
    add(objects) {
        let asArray = true;
        if (objects.length === undefined) {
            objects = [objects];
            asArray = false;
        }
        for (let c = 0; c < objects.length; c++) {
            if (objects[c].isGroup) {
                if (!objects[c].group) {
                    objects[c].initializeGroup(this.scene);
                }
                objects[c].parent = this;
                objects[c].group.parent = this._group;
            } else {
                objects[c].parent = this._group;
            }
            this._children.push(objects[c]);
            if (objects[c].onParented) {
                objects[c].onParented(this._scene, this._group, this._canvas);
            }
        }

        if (asArray) {
            return objects;
        } else {
            return objects[0];
        }
    }

    remove(objects) {
        let asArray = true;
        if (objects.length === undefined) {
            objects = [objects];
            asArray = false;
        }

        this._children = this.children.filter(val => !objects.includes(val));
        for (let c = 0; c < objects.length; c++) {
            this.scene.removeMesh(objects[c]);
        }

        if (asArray) {
            return objects;
        } else {
            return objects[0];
        }
    }

    removeAll() {
        for (let c = 0; c < this._children.length; c++) {
            this._children[c].dispose();
        }
        this._children = [];
    }

    find(name) {
        for (let c = 0; c < this._children.length; c++) {
            if (this._children[c].name === name) {
                return this._children[c];
            }
        }
        return null;
    }

    get application() {
        let parent = this.parent;
        while (parent) {
            if (parent.isApplication) {
                return parent;
            }
            parent = parent.parent;
        }
    }

    /**
     * get parent group object
     * @returns {THREE.Object3D}
     */
    get group() {
        return this._group;
    }

    get canvas() {
        return this._canvas;
    }

    /**
     * get engine
     */
    get engine() {
        return this._scene._engine;
    }

    /**
     * get babylon scene
     */
    get scene() {
        return this._scene;
    }

    /**
     * set scene and rewire render loop for scene
     * @param val
     */
    set scene(val) {
        if (this.scene) {
            //console.log(this.engine, this.name);
        }
        if (this._scene && this._scene._engine) {
            this._scene._engine.stopRenderLoop();
        }
        this._scene = val;
        this._scene._engine.runRenderLoop( () => this.tick() );
    }

    /**
     * get children of this group
     * @returns {Array}
     */
    get children() {
        return this._children;
    }

    /**
     * render loop
     */
    tick() {
        //console.log('tick', this.name)
        this.onRender(this.scene._engine.getDeltaTime());
    }
}
