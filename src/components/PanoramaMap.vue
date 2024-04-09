<template>
    <div ref="threeJsContainer" style="width: 100%; height: 100vh;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const threeJsContainer = ref<HTMLDivElement | null>(null);
let gui:dat.GUI;

onMounted(() => {

    const container = threeJsContainer.value;
    if (!container) return;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0c69d);
    var cameraPosition = [20, -5, 20];

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    
    const guiParams = {
        modelTransX: 0,
        modelTransY: 0,
        modelTransZ: 0,
        modelScaleX: 1,
        modelScaleY: 1,
        modelScaleZ: 1,

         // 相机属性
        cameraPosX: camera.position.x,
        cameraPosY: camera.position.y,
        cameraPosZ: camera.position.z,
        cameraRotX: camera.rotation.x,
        cameraRotY: camera.rotation.y,
        cameraRotZ: camera.rotation.z,
    };
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 光的颜色，强度
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1); // 设置光源的位置
    scene.add(directionalLight);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // 定义一个变量来存储当前选中的物体
    let selectedObject: THREE.Mesh | null = null;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    const cameraControls = new OrbitControls(camera, renderer.domElement);

    // 配置OrbitControls的参数
    cameraControls.enableZoom = true; // 允许用户缩放
    cameraControls.enableRotate = true; // 允许用户旋转
    cameraControls.enablePan = true; // 允许用户平移
    cameraControls.rotateSpeed = 0.3; // 设置旋转速度
    cameraControls.zoomSpeed = 1.0; // 设置缩放速度
    cameraControls.panSpeed = 2.0; // 设置平移速度
    container.appendChild(renderer.domElement);

    let model:THREE.Object3D;

    // 加载GLTF模型
    const loader = new GLTFLoader();
    loader.load(
        '/models/petweb_group.gltf',
        (gltf) => {
            model = gltf.scene;
            console.log(model);
            scene.add(model);
            model.scale.set(guiParams.modelScaleX, guiParams.modelScaleY, guiParams.modelScaleZ);
            model.position.set(guiParams.modelTransX, guiParams.modelTransY, guiParams.modelTransZ);
        },
        undefined,
        (error) => {
            console.error(error);
        }
    );


    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix(); // 更新相机的投影矩阵

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // window.addEventListener('click', onMouseClick, false);

    // function onMouseClick(event: MouseEvent): void {
    //     event.preventDefault();

    //     // 将鼠标点击位置归一化到 [-1, 1] 范围内
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //     // 检测点击的物体并高亮
    //     checkIntersection();
    // }

    // function checkIntersection(): void {
    //     raycaster.setFromCamera(mouse, camera);
    //     const intersects = raycaster.intersectObjects(scene.children, true);

    //     if (intersects.length > 0) {
    //         const targetObject = intersects[0].object as THREE.Mesh;

    //         // 如果有新的物体被选中，取消之前选中物体的高亮（如果有）
    //         if (selectedObject && selectedObject !== targetObject) {
    //             (selectedObject.material as THREE.MeshBasicMaterial).color.set(0xffffff); // 假设原始颜色为白色
    //         }

    //         // 高亮选中的物体
    //         (targetObject.material as THREE.MeshBasicMaterial).color.set(0xffff00); // 设置为红色
    //         selectedObject = targetObject; // 更新当前选中的物体
    //     } else if (selectedObject) {
    //         // 如果没有物体被选中，且之前有物体被选中，则取消高亮
    //         (selectedObject.material as THREE.MeshBasicMaterial).color.set(0xffffff); // 假设原始颜色为白色
    //         selectedObject = null; // 清除选中的物体
    //     }
    // }



    function createGUI() {
        gui = new dat.GUI();
        
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
  
    }
    createGUI();
    // 渲染循环
    const animate = () => {
        requestAnimationFrame(animate);
          // 更新控制器
        cameraControls.update(); 

        renderer.render(scene, camera);
    };

    animate();
});

onUnmounted(()=>{
    gui.destroy();
});
</script>

<style scoped>
</style>