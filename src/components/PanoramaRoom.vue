<template>
    <div ref="panoramaContainer" class="panorama-container" style="width: 100%; height: 85vh;"></div>
    <anchor-panel :anchor="currentData"  :visible="panelVisible" 
        @update:visible="value => panelVisible = value" />
    <update-anchor-panel :anchor="currentData" :modelValue="updatePanelVisible" 
        @update:modelValue="handleUpdateVisibility"/>
</template>
  
<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import axios from 'axios';
import AnchorPanel from '@/components/AnchorPanel.vue';
import UpdateAnchorPanel from '@/components/UpdateAnchorPanel.vue';
import type { AnchorData } from '@/assets/scripts/anchor';
import { Anchor} from '@/assets/scripts/anchor';

import { SceneController } from '@/assets/scripts/roomSceneController';
const props = defineProps<{
    mode:'admin' | 'view'
}>();


const panoramaContainer = ref<HTMLDivElement | null>(null);
const route = useRoute();


let currentData = reactive({
    anchorId: -1,
    roomId: -1,
    anchorX:  0.0,
    anchorY:  0.0,
    anchorZ: 0.0,
    anchorDesc: '',
    imageUrl: '',
    videoUrl: ''
});
let anchors : Array<Anchor> | null = null;
const panelVisible = ref(false);
const updatePanelVisible = ref(false);
let scene: THREE.Scene;
let controller: SceneController;
onMounted(() => {
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let textureLoader: THREE.TextureLoader;
    const container = panoramaContainer.value;
    let roomId: number;

    const init = () => {
        if (!container) return;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(100, container.clientWidth / container.clientHeight);
        camera.position.z = 0.1;

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 光的颜色，强度
        scene.add(ambientLight);
        textureLoader = new THREE.TextureLoader();

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.rotateSpeed = 0.3; // 设置旋转速度
        controls.zoomSpeed = 1.0; // 设置缩放速度

        window.addEventListener('resize', onWindowResize, false);

        controller = new SceneController(scene, camera, container, props.mode, handleClickAnchor, handleClickEmpty);

        roomId = Number(route.params.roomId as string);
        const roomName = decodeURIComponent(route.params.roomName.valueOf() as string);

        loadPanoramaImage(roomName);
        loadAndCreateAnchors(roomId);

    };

    const handleClickAnchor = (anchor:Anchor) =>{
        if(updatePanelVisible.value || panelVisible.value) return;
        if(props.mode == "admin") {
            currentData = anchor.anchorData;
            updatePanelVisible.value = true;
        } else {
            currentData = anchor.anchorData;
            panelVisible.value = true;
        }
    };

    const handleClickEmpty = (anchor:Anchor) => {
        if(updatePanelVisible.value || panelVisible.value) return;
        if (props.mode == 'admin') {
            anchor.anchorData.roomId = roomId;
            currentData = anchor.anchorData;
            console.log(currentData);
            updatePanelVisible.value = true;
        } 
    };

    const loadPanoramaImage = (roomName:string) => {
        textureLoader.load(`/roomtour/${roomName}.jpg`, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        });
    };

    const loadAnchors = async (roomId) => {
        try {
            const params = new URLSearchParams({ room_id: roomId }).toString();
            const token = sessionStorage.getItem('token');
        
            axios.get(`/api/anchor/get?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.data && response.data.error_message === 'success') {
                    console.log(response.data.anchors);
                    return response.data.anchors;
                } else {
                    console.error('Load failed:', response.data.error_message);
                    return [];
                }
            }).catch(error => {
                console.error('Error fetching room data:', error);
                return [];
            });
        } catch (error) {
            console.error('Error fetching anchors:', error);
            return [];
        }
    };

    

    const loadAndCreateAnchors = async (roomId) => {
        const anchorDatas = await loadAnchors(roomId);
        if (anchorDatas != null) {
            for (let anchorData of anchorDatas) {
                  anchors.push(new Anchor(anchorData, scene));
            }
        }
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

function handleUpdateVisibility(value) {
    updatePanelVisible.value = value;
    if(value == false) {
        window.addEventListener("click", controller.onMouseClick);
    } else {
        window.removeEventListener("click", controller.onMouseClick);
    }
}
</script>

<style>
.panorama-container {
width: 100%;  /* 调整宽高 */
height: 600px;
overflow: hidden;
}
</style>
