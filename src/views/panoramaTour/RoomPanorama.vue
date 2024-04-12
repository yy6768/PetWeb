<template>
    <div ref="panoramaContainer" class="panorama-container"></div>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const panoramaContainer = ref<HTMLDivElement | null>(null);
const route = useRoute();

onMounted(() => {
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let textureLoader: THREE.TextureLoader;
    const container = panoramaContainer.value;

    const init = () => {
        if (!container) return;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000);
        camera.position.z = 0.1;

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        textureLoader = new THREE.TextureLoader();

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;

        window.addEventListener('resize', onWindowResize, false);
        const roomName = decodeURIComponent(route.params.roomName.valueOf() as string);
        loadPanoramaImage(roomName);
    };

    const loadPanoramaImage = (roomName:string) => {
        textureLoader.load(`/images/${roomName}.jpg`, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        });
    };

    const onWindowResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    init();
    animate();

onUnmounted(() => {
    
    window.removeEventListener('resize', onWindowResize);
    if(container) 
        container.removeChild(renderer.domElement); // 清理DOM
});

watch(() => route.params.roomName, (newRoomName) => {
        loadPanoramaImage(newRoomName as string);
});});
</script>

<style>
.panorama-container {
width: 100%;  /* 调整宽高 */
height: 600px;
overflow: hidden;
}
</style>
