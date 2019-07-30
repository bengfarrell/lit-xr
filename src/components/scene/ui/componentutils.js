export default {
    get MapDirective() {
        return (dict, key) =>
            (part) => {
                part.setValue(key);
                dict[key] = part.committer.element;
            };
    },

    registerComponent(tag, clazz, options) {
        let changeCallbackFnName = 'propertyChangedCallback';
        if (options && options.changeCallbackFnName) {
            changeCallbackFnName = options.changeCallbackFnName;
        }

        const decorators = [];
        const props = clazz.observedAttributes;
        if (props) {
            for (let c = 0; c < props.length; c++) {
                decorators.push({ name: props[c], accessors: {
                        set: function (val) {
                            const old = this.getAttribute(props[c]);
                            if (val === false) {
                                this.removeAttribute(props[c]);
                            } else {
                                this.setAttribute(props[c], val);
                            }
                            if (this[changeCallbackFnName]) {
                                this[changeCallbackFnName](props[c], old, val);
                            }
                        },

                        get: function () {
                            return this.getAttribute(props[c]);
                        }
                    }});
            }

            decorators.push( {
                name: 'attributeChangedCallback',
                fn: function(name, oldval, newval) {
                    if (this[changeCallbackFnName]) {
                        this[changeCallbackFnName](name, oldval, newval);
                    }
                }
            });
        }

        const processDecorator = function(d) {
            if (d.fn) {
                clazz.prototype[d.name] = d.fn;
            } else if (d.accessors) {
                Object.defineProperty(clazz.prototype, d.name, d.accessors);
            } else {
                d(clazz, options).forEach( d => processDecorator(d));
            }
        };

        decorators.forEach(d => {
            processDecorator(d);
        });

        if (!customElements.get(tag)) {
            customElements.define(tag, clazz);
        }
    }

}
