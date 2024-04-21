// Anchor.ts
import * as THREE from 'three';
import { AnchorPanel } from './anchorPanel';

export class Anchor {
    private mesh: THREE.Mesh;
    private anchorData: any;

    constructor(anchorData: any, scene: THREE.Scene) {
        this.anchorData = anchorData;
        this.mesh = this.createMesh();
        scene.add(this.mesh);
        this.mesh.userData = { anchor: this };
    }

    private createMesh(): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(this.anchorData.anchorX, this.anchorData.anchorY, this.anchorData.anchorZ);
        sphere.addEventListener = this.onClick.bind(this)   ;
        return sphere;
    }

    private onClick(): void {
        const panel = new AnchorPanel(this.anchorData);
        panel.show();
    }
}
