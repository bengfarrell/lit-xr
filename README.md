LitXR
=====

An extension on Polymer's LitElement to render Web Components as an interactive texture in Babylon.js for use in VR/AR
This project is not associated with Polymer or Google, other than the fact that it is built on top of their libraries.

This project is also unstable and more of a proof of concept until more components are built to properly test.

LitXR is also based on a hack. Currently there is no way to snapshot a DOM element, so all components are serialized to SVG and set to an <img> source

Some gotchas when creating LitXR components:

- No Shadow DOM allowed. LitXR forces you to use the light DOM. SVG's cannot be serialized through the shadow bounds
- Images must be encoded to Base64. For this reason, you must either provide Base64 images, or use the "Image" directive provided by LitXR
- The ":hover" pseduo-selector is not supported when in a 3D context. Instead, use a simple ".hover" selector to style
- CSS must be part of the "render" method alongside the HTML template literal. LitElement's "get styles" will not work here
- Elements do not receive mouse/pointer events by default. LitXR maintains a list of "interactable" elements which can be added on to by using "this.interactables.add(myelement)",
or alternately, they are added automatically when assigning lit-html's @event functions to specific ones.
- Override static getters "preferredSize" and "backgroundColor" to control 3D panel size and panel color

TODO:
- Figure out how to bundle finished app when using <babylon-scene> and dynamic imports for app and stage
