<template>
    <div ref="parent"></div>
</template>

<script lang="ts">
import * as THREE from "three";
import { ref,onMounted } from 'vue';

let scene: THREE.Scene;
let mesh: THREE.Mesh;
export default {
    name:'PanoramaMap',
    data() {
        return {
            camera: null as THREE.PerspectiveCamera | null,
            renderer: null as THREE.WebGLRenderer | null,
            ambientLight: null as THREE.AmbientLight | null,
            // mesh: null as THREE.Mesh | null,   
            parent: HTMLElement | null, 
        }
    },
    mounted() {
        this.scene = new THREE.Scene();
        this.setCamera();
        this.setRenderer();
        this.setCube();
        this.animate();
    },
    methods :{
        setCamera(): void {
            // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
            this.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );
            this.camera.position.z = 5;
            this.camera.lookAt(0,0,0);
        },

        // 设置渲染器
        setRenderer(): void {
            this.renderer = new THREE.WebGLRenderer();
            // 设置画布的大小
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            //这里 其实就是canvas 画布  renderer.domElement
            this.$refs.parent.appendChild(this.renderer.domElement);
        },

        // 设置环境光
        setLight(): void {
            if (this.scene) {
                this.ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
                this.scene.add(this.ambientLight);
            }
        },

        // 创建网格模型
        setCube(): void {
            if (this.scene) {
                const geometry = new THREE.BoxGeometry(); //创建一个立方体几何对象Geometry
                const material = new THREE.MeshBasicMaterial({ color: 0xff3200 }); //材质对象Material
                this.mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
                this.scene.add(this.mesh); //网格模型添加到场景中
            }
        },

        // 渲染
        render(): void {
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        },

        // 动画
        animate(): void {
            if (this.mesh) {
                requestAnimationFrame(this.animate.bind(this));
                this.mesh.rotation.x += 0.01;
                this.mesh.rotation.y += 0.01;
                this.render();
            }
        }
    }
}
</script>

<style scoped>
</style>