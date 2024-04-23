import * as THREE from 'three';
import axios from 'axios';
import * as dat from 'dat.gui';



class Selector {
    private container: HTMLDivElement;
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private mouse: THREE.Vector2 = new THREE.Vector2();
    private highlightedEdges: Array<THREE.LineSegments> = new Array<THREE.LineSegments>();
    private selectObject: THREE.Object3D = new THREE.Object3D();
    private gui:dat.GUI;
    private mode:string;

    private clickTimeout:number | null = null;
    private doubleClickDelay:number = 300;

    private guiData = {
        room_id:'',
        name: '',
        room_number:"",
        desc: ''
    }

    constructor(container: HTMLDivElement, scene: THREE.Scene, camera: THREE.Camera, gui:dat.GUI, mode:string) {
        this.container = container;
        this.scene = scene;
        this.camera = camera;
        this.gui = gui;
        this.mode = mode;
        const subgui = this.gui.addFolder("当前科室");
        subgui.add(this.guiData, "name").listen().name("选中科室");
        subgui.add(this.guiData, "room_number").listen().name("科室门牌号");
        subgui.add(this.guiData, "desc").listen().name("科室信息");
        subgui.open();
        // 绑定事件
        window.addEventListener('click', this.onMouseClick);
        window.addEventListener('dblclick', this.onMouseDoubleClick);  // 添加双击事件监听
    }

    private onMouseDoubleClick = (event: MouseEvent): void => {
        if (this.selectObject && this.selectObject.name) {
            // 构造跳转URL
            const roomName = encodeURIComponent(this.selectObject.name);
            if (this.guiData.room_id == "") {
                console.error("RoomId is null");
            }
            // 跳转到全景图页面
            if (this.mode == 'view'){
                window.location.href = `http://localhost:5173/roomtour/${this.guiData.room_id}/${roomName}`;
            } else {
                window.location.href = `http://localhost:5173/manage-roomtour/${this.guiData.room_id}/${roomName}`;
            }
        }
    };


    private onMouseClick = (event: MouseEvent): void => {
        if (this.clickTimeout !== null) {
            clearTimeout(this.clickTimeout);
        }

        this.clickTimeout = window.setTimeout(() => {
            // 单击事件的处理逻辑
            this.handleClickEvent(event);
        }, this.doubleClickDelay);
        
    };

    private handleClickEvent = (event:MouseEvent): void => {
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
    
        this.resetGUI();
        // 如果之前有高亮的对象，先清除之前的高亮效果
        this.highlightedEdges.forEach(edges => this.scene.remove(edges));
        this.highlightedEdges = [];
    
        // 如果选中的是同一个对象，重置GUI并返回
        if (this.selectObject && this.selectObject.uuid === objects.uuid) {
            this.resetGUI();
            return;
        }
    
        this.selectObject = objects;
        
        objects.children.forEach(object => {
            if (object instanceof THREE.Mesh) {
                const edges = new THREE.EdgesGeometry(object.geometry);
                const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
                const edgeLines = new THREE.LineSegments(edges, material);
    
                this.highlightedEdges.push(edgeLines);
                this.scene.add(edgeLines);
            }
        });
        this.guiData.name = objects.name;
        const params = new URLSearchParams({ room_name: this.guiData.name }).toString();
        const token = sessionStorage.getItem('token');
        
        axios.get(`/api/room/get?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.data && response.data.error_message === 'success') {
                this.guiData.room_id = response.data.room_id;
                this.guiData.desc = response.data.description;
                this.guiData.room_number = response.data.room_num;
            } else {
                console.error('Select failed:', response.data.error_message);
            }
        }).catch(error => {
            console.error('Error fetching room data:', error);
        });
    }
    
    private resetGUI(): void {
        this.guiData.room_id = "";
        this.guiData.name = "";
        this.guiData.room_number = "";
        this.guiData.desc = "";
    }
    

    // 在需要的时候，可以调用此方法移除事件监听器
    public dispose(): void {
        window.removeEventListener('click', this.onMouseClick);
        window.removeEventListener('dblclick', this.onMouseDoubleClick);
    }
}

export { Selector };
