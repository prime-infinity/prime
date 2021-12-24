import * as THREE from "/node_modules/three/build/three.module.js";

export default class Planet {

    constructor(radius, positionX/*, textureFile*/) {
        this.radius = radius;
        this.positionX = positionX;
        //this.textureFile = textureFile;
      }

      getMesh(){
        const geometry = new THREE.SphereGeometry(this.radius);
        //const texture = new THREE.TextureLoader().load(textureFile);
        const material = new THREE.MeshBasicMaterial(/*{ map: texture }*/);
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x += this.positionX;

        return this.mesh
    }
}
