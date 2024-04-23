// Anchor.ts
import * as THREE from 'three';
export interface AnchorData {
    anchorId: number;    // 对应 Java 中的 Integer
    roomId: number;      // 对应 Java 中的 Integer
    anchorX: number;     // 对应 Java 中的 Float
    anchorY: number;     // 对应 Java 中的 Float
    anchorZ: number;     // 对应 Java 中的 Float
    anchorDesc: string;  // 对应 Java 中的 String
    imageUrl: string;    // 对应 Java 中的 String
    videoUrl: string;    // 对应 Java 中的 String
};

export class Anchor {
    private mesh: THREE.Mesh;
    public anchorData: AnchorData;

    constructor(anchorData: any, scene: THREE.Scene) {
        this.anchorData = anchorData;
        this.mesh = this.createMesh();
        scene.add(this.mesh);
        this.mesh.userData = { anchor: this }; // Attach onClick to userData
    }

    private createMesh(): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(this.anchorData.anchorX, this.anchorData.anchorY, this.anchorData.anchorZ);

        return sphere;
    }
}

