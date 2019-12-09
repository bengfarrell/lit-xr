import BabylonUIComponentDefinition from './src/babylonuicomponent.js';
import LitXRComponentClass from "./src/lit-xr.js";
import LitXRSurfaceComponentClass from "./src/lit-xr-surface.js";
import {html as litxrhtml, svg as litxrsvg, interactables as litxrinteractables} from "./src/pointerevents.js";
import LitXRImageDirective from "./src/directives/image.js";
import {directive as litxrdirective} from "lit-html";

export const directive = litxrdirective;
export const LitXR = LitXRComponentClass;
export const LitXRSurface = LitXRSurfaceComponentClass;
export const html = litxrhtml;
export const svg = litxrsvg;
export const interactables = litxrinteractables;
export const ImageDirective = LitXRImageDirective;
export const Image = directive(LitXRImageDirective());
export const BabylonUIComponent = BabylonUIComponentDefinition;

