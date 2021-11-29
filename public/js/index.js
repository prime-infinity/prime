import * as THREE from "/node_modules/three/build/three.module.js";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls.js";
import gsap from "/node_modules/gsap/index.js"

//global declaration
let scene;
let camera;
let renderer;
let controls;
let stats
let container = document.getElementById('container');
scene = new THREE.Scene();
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1e7;

//camera
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//camera.position.set(0, 0, 4)
camera.position.set(-200, 0, 8)
scene.add(camera);

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.update();


// stars
const r = 6371, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry()];

const vertices1 = [];
const vertices2 = [];

const vertex = new THREE.Vector3();

for ( let i = 0; i < 250; i ++ ) {

    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar( r );

    vertices1.push( vertex.x, vertex.y, vertex.z );

}

for ( let i = 0; i < 250; i ++ ) {

    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    vertex.multiplyScalar( r );

    vertices2.push( vertex.x, vertex.y, vertex.z );

}

starsGeometry[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
starsGeometry[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

const starsMaterials = [
    new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0xffffff, size: 1, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0xffffff, size: 2, sizeAttenuation: false } ),
    new THREE.PointsMaterial( { color: 0xffffff, size: 1, sizeAttenuation: false } )
];

for ( let i = 10; i < 30; i ++ ) {

    const stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

    stars.rotation.x = Math.random() * 6;
    stars.rotation.y = Math.random() * 6;
    stars.rotation.z = Math.random() * 6;
    stars.scale.setScalar( i * 10 );

    stars.matrixAutoUpdate = false;
    stars.updateMatrix();

    scene.add( stars );

}

//sun object
const color = new THREE.Color("#FDB813");
const geometry = new THREE.IcosahedronGeometry(10, 15);
const material = new THREE.MeshBasicMaterial({ color: color });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(-50, 20, -60);
scene.add(sphere);

//earth geometry
const earthgeometry = new THREE.SphereGeometry(0.98, 32, 32);

//earth material
const earthMaterial = new THREE.MeshPhongMaterial({
  /*map: new THREE.TextureLoader().load("texture/earthmap1.jpg"),
    bumpMap: new THREE.TextureLoader().load("texture/bump.jpg"),
    bumpScale: 0.3,*/
});

//earthMesh
const earthMesh = new THREE.Mesh(earthgeometry, earthMaterial);
earthMesh.receiveShadow = true;
earthMesh.castShadow = true;
earthMesh.layers.set(0);
scene.add(earthMesh);

//cloud geometry
const cloudgeometry = new THREE.SphereGeometry(1, 32, 32);

//cloud material
const cloudMaterial = new THREE.MeshPhongMaterial({
    /*map: new THREE.TextureLoader().load("texture/earthCloud.png"),
    transparent: true,*/
});

//cloudMesh
const cloud = new THREE.Mesh(cloudgeometry, cloudMaterial);
earthMesh.layers.set(0);
scene.add(cloud);

//moon geometry
const moongeometry = new THREE.SphereGeometry(0.1, 32, 32);

//moon material
const moonMaterial = new THREE.MeshPhongMaterial({
   /* map: new THREE.TextureLoader().load("texture/moonmap4k.jpg"),
    bumpMap: new THREE.TextureLoader().load("texture/moonbump4k.jpg"),
    bumpScale: 0.02,*/
});

//moonMesh
const moonMesh = new THREE.Mesh(moongeometry, moonMaterial);
moonMesh.receiveShadow = true;
moonMesh.castShadow = true;
moonMesh.position.x = 2;
scene.add(moonMesh);

var moonPivot = new THREE.Object3D();
earthMesh.add(moonPivot);
moonPivot.add(moonMesh);


//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientlight);

//point Light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.castShadow = true;
pointLight.shadow.bias = 0.00001;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.position.set(-50, 20, -60);
scene.add(pointLight);

//resize listner
window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
);

//animation loop
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //camera.rotation.y += 0.001; 
    moonPivot.rotation.y -= 0.005;
    moonPivot.rotation.x = 0.5;
    controls.update();
};
  
animate();

//start with all automation
document.getElementById('beginButton').addEventListener('click',()=>{

    /*gsap.to(camera.position, {
        duration:3,
         x:2,
         y:4,
         ease: "Expo.easeOut",
    })*/ //earth's position

    /*camera.lookAt(earthMesh.position)
    console.log(earthMesh.position)
    console.log(camera.position)*/

    const camrot = {'x':camera.rotation.x,'y':camera.rotation.y,'z':camera.rotation.z}
    camera.lookAt(earthMesh.position)
    const targetOrient = camera.quaternion.clone().normalize();

    camera.rotation.x = camrot.x;
    camera.rotation.y = camrot.y;
    camera.rotation.z = camrot.z;

    const aabb = new THREE.Box3().setFromObject(earthMesh)
    const center = aabb.getCenter(new THREE.Vector3());
    const size = aabb.getSize(new THREE.Vector3)

    controls.enable = false;
    const startOrient = camera.quaternion.clone();
    const quaternion = camera.quaternion
    const newCamera = camera
    const newControls = controls

    gsap.to({},{
        duration:2,
        onUpdate:function(){
          quaternion.copy(startOrient).slerp(targetOrient,this.progress());
        },
        onComplete:function(){
          onCc();
        }
    })

    var onCc = function(){
            
        gsap.to(newCamera.position,{
            duration:2,
            x:center.x,
            y:center.y,
            z:center.z+4*size.z,
            onUpdate:function(){
                newCamera.lookAt(center)
            },
            onComplete:function(){
                newControls.enable = true;
                newControls.target.set(center.x,center.y,center.z)
            }
        })

    }

})
