import type { Camera, Object3D, Object3DEventMap } from "three";

import * as dat from 'dat.gui';

interface GUIParams {
    modelTransX: number;
    modelTransY: number;
    modelTransZ: number;
    modelScaleX: number;
    modelScaleY: number;
    modelScaleZ: number;
    cameraPosX: number;
    cameraPosY: number;
    cameraPosZ: number;
    cameraRotX: number;
    cameraRotY: number;
    cameraRotZ: number;

};



function createGUI( 
    guiParams:GUIParams, 
    model:Object3D<Object3DEventMap>, 
    camera:Camera): dat.GUI {
    let gui = new dat.GUI();
    
    const panelModel = gui.addFolder('模型属性');
    const panelModelTrans = panelModel.addFolder('位置');
    const panelModelScale = panelModel.addFolder('缩放');
    
    
    panelModelTrans.add(guiParams, 'modelTransX').name('X').onChange(value => {
        if (model) model.position.x = value;
    });
    panelModelTrans.add(guiParams, 'modelTransY').name('Y').onChange(value => {
        if (model) model.position.y = value;
    });
    panelModelTrans.add(guiParams, 'modelTransZ').name('Z').onChange(value => {
        if (model) model.position.z = value;
    });
    panelModelScale.add(guiParams, 'modelScaleX', 0, 1).name('X').onChange(value => {
        if (model) model.scale.x = value;
    });
    panelModelScale.add(guiParams, 'modelScaleY', 0, 1).name('Y').onChange(value => {
        if (model) model.scale.y = value;
    });
    panelModelScale.add(guiParams, 'modelScaleZ', 0, 1).name('Z').onChange(value => {
        if (model) model.scale.z = value;
    });


    panelModel.open();
    panelModelTrans.open();
    panelModelScale.open();

    const panelCamera = gui.addFolder("相机属性");
    const panelCameraPos = panelCamera.addFolder('相机位置');
    panelCameraPos.add(guiParams, 'cameraPosX').name('位置 X').onChange(value => {
        camera.position.x = value;
    });
    panelCameraPos.add(guiParams, 'cameraPosY').name('位置 Y').onChange(value => {
        camera.position.y = value;
    });
    panelCameraPos.add(guiParams, 'cameraPosZ').name('位置 Z').onChange(value => {
        camera.position.z = value;
    });
    
    panelCamera.open();
    panelCameraPos.open();

    
    // 动态调整GUI位置
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '20vh'; // 根据需要调整
    gui.domElement.style.right = '0px'; // 根据需要，你也可以调整左侧位置
    return gui;
}

// function updateSelectedInformation(gui:dat.GUI, selectParams:GUISelectParams)  {
//     if (selectParams.name == "") return;
//     const panelSelected = gui.addFolder("科室");
    

// }

export { createGUI };