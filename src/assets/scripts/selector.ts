import * as THREE from 'three';
import * as dat from 'dat.gui';


interface SelectorParams {
    name:String;
    info:String;
}

class Selector {
    private container: HTMLDivElement;
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private mouse: THREE.Vector2 = new THREE.Vector2();
    private highlightedEdges: Array<THREE.LineSegments> = new Array<THREE.LineSegments>();
    private selectObject: THREE.Object3D = new THREE.Object3D();
    private gui:dat.GUI;

    private guiData = {
        name: '未选中',
        info: '无'
    }

    constructor(container: HTMLDivElement, scene: THREE.Scene, camera: THREE.Camera, gui:dat.GUI) {
        this.container = container;
        this.scene = scene;
        this.camera = camera;
        this.gui = gui;
        const subgui = this.gui.addFolder("当前科室");
        subgui.add(this.guiData, "name").listen().name("选中科室");
        subgui.add(this.guiData, "info").listen().name("科室信息");
        subgui.open();
        // 绑定事件
        window.addEventListener('click', this.onMouseClick);
    }


    private onMouseClick = (event: MouseEvent): void => {
        const rect = this.container.getBoundingClientRect();

        // 计算容器内的鼠标位置
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    

        const viewPortWidth = this.container.clientWidth;
        const viewPortHeight = this.container.clientHeight;


        // 将鼠标点击位置转换为标准化设备坐标 (NDC)
        this.mouse.x = (mouseX / viewPortWidth) * 2 - 1;
        this.mouse.y = -(mouseY / viewPortHeight) * 2 + 1;

        // 更新raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // 检查射线与场景中物体的交叉点
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            // 找到被点击的最近的对象
            const firstIntersectedObject = intersects[0].object;
        
            // 使用findParentGroup函数找到这个对象所属的组
            const group = firstIntersectedObject.parent;
        
            if (group !== null) {
                // 在这里处理选中的组，例如高亮显示
                this.onSelect(group);
            }
        }
    };

    private onSelect(objects: THREE.Object3D): void {
        console.log('Selected object:', objects);

        // 如果之前有高亮的对象，先清除之前的高亮效果
        if (this.highlightedEdges.length != 0) {
            for (let edges of this.highlightedEdges) {
                this.scene.remove(edges);
            }
            this.highlightedEdges.splice(0, this.highlightedEdges.length);
        }
        if (this.selectObject.uuid == objects.uuid) {
            this.guiData.name = "未选中";
            this.guiData.info = "无";
            return;
        }
        this.selectObject = objects;
        
        for (let object of objects.children) {
            // 仅当选中的对象是Mesh时处理
            if (object instanceof THREE.Mesh) {
                // 创建表示选中对象轮廓的EdgesGeometry
                const edges = new THREE.EdgesGeometry(object.geometry);
                // 创建LineBasicMaterial，将颜色设置为黄色
                const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
                // 创建线框以表示边缘
                const edgeLines = new THREE.LineSegments(edges, material);

                // 保存这个线框以便之后可以移除
                this.highlightedEdges.push(edgeLines);

                // 将线框添加到场景中
                this.scene.add(edgeLines);
            }
       }
       this.guiData.name = objects.name;
       this.guiData.info = "这是" + objects.name;
    }

    // 在需要的时候，可以调用此方法移除事件监听器
    public dispose(): void {
        window.removeEventListener('click', this.onMouseClick);
    }
}

export { Selector };
