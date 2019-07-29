export default {
    default: {
        scene: {
           useRightHandedSystem: false,
        },
        engine: {
            antialias: true,
            options: {}
        },
        camera: {
            type: 'freecamera',
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        inspector: 'i'
    },

    apply(cfg, node) {
        if (!node) {
            node = this.default;
        }
        for (let c in node) {
            if (!cfg[c]) {
                cfg[c] = node[c];
            } else {
                if (typeof cfg[c] === 'object') {
                    cfg[c] = this.apply(cfg[c], node[c]);
                }
            }
        }

        return cfg;
    }
}
