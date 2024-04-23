// 在你的主场景或控制器脚本中
import * as THREE from 'three';
import { Anchor } from './anchor';

class SceneController {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private container: HTMLDivElement;
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private mouse: THREE.Vector2 = new THREE.Vector2();

    private mode: string;
    private handleClickAnchor : (anchor:Anchor) => void;
    private handleClickEmpty : (anchor:Anchor)=> void;


    constructor(scene:THREE.Scene, 
        camera:THREE.Camera, 
        container:HTMLDivElement, 
        mode:string,
        handleClickAnchor: (anchor:Anchor)=>void,
        handleClickEmpty: (anchor:Anchor)=> void){
        this.scene = scene;
        this.camera = camera;
        this.container = container;
        this.mode = mode;
        this.handleClickAnchor = handleClickAnchor;
        this.handleClickEmpty = handleClickEmpty;

        // Add event listener for clicks
        window.addEventListener('click', this.onMouseClick);
    }

    public onMouseClick = (event: MouseEvent): void => {
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
            const intersect = intersects[0];
            const anchor = intersect.object.userData.anchor;
            if (anchor && anchor instanceof Anchor) {
                this.handleClickAnchor(anchor);
            } else {
                if(this.mode == 'admin') {
                    this.handleClickEmpty(this.addAnchor(this.mouse.x, this.mouse.y));
                }
            } 
        } else {
            // 创建一个新的anchor 
            if(this.mode == 'admin') {
                this.handleClickEmpty(this.addAnchor(this.mouse.x, this.mouse.y));
            }
        }
    }

    private addAnchor = (x:number, y:number) =>{
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 100);  // z=1平面
        const pos = new THREE.Vector3();  // 用于存储交点的向量
        this.raycaster.ray.intersectPlane(plane, pos);
        const anchorData = {
            anchorId: -1,
            roomId: -1,
            anchorX: pos.x,
            anchorY: pos.y,
            anchorZ: pos.z,
            anchorDesc: "",
            imageUrl:'',
            videoUrl:'' 
        }
        
        const anchor =  new Anchor(anchorData, this.scene);
        return anchor;
    }
    
}


export { SceneController };