<template>
    <div ref="threeJsContainer" style="width: 100%; height: 85vh;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { createGUI } from '@/assets/scripts/gui';
import { Selector } from '@/assets/scripts/selector';

const threeJsContainer = ref<HTMLDivElement | null>(null);
let gui:dat.GUI;
let selector:Selector;

onMounted(() => {

    const container = threeJsContainer.value;
    if (!container) return;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0c69d);
    var initCameraPos = [20, 0, 20];

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(initCameraPos[0], initCameraPos[1], initCameraPos[2]);
    
    const guiParams = {
        modelTransX: 5,
        modelTransY: 5,
        modelTransZ: 5,
        modelScaleX: 1.0,
        modelScaleY: 1.0,
        modelScaleZ: 1.0,

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

    let model:THREE.Object3D = new THREE.Object3D;

    // 加载GLTF模型
    const loader = new GLTFLoader();
    loader.load(
        '/models/petweb_group.gltf',
        (gltf) => {
            model = scene;
            scene.add(gltf.scene);
            model.scale.set(guiParams.modelScaleX, guiParams.modelScaleY, guiParams.modelScaleZ);
            model.position.set(guiParams.modelTransX, guiParams.modelTransY, guiParams.modelTransZ);
            // 创建GUI
            gui = createGUI(guiParams, model, camera);
            // 初始化选择器
            selector = new Selector(container, scene, camera, gui);
        },
        undefined,  
        (error) => {
            console.error(error);
        }
    );


    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        if (!container) return;
        const clientWidth = container.clientWidth;
        const clientHeight = container.clientHeight;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix(); // 更新相机的投影矩阵

        renderer.setSize(clientWidth, clientHeight);
    }


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