import {DefaultStage} from "../node_modules/babylon-scene/babylonscene.js";

// Fallback to WebVR until WebXR is more stable
DefaultStage.setupWebXR = async function(stage) {
    const scene = stage.scene;
    const Babylon = stage.babylon;
    const vrHelper = scene.createDefaultVRExperience();
    vrHelper.fallbackToWebVR = true;
    return vrHelper;
};

export default DefaultStage;
