import * as THREE from "/node_modules/three/build/three.module.js";
/*import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls";
import Stats from "/node_modules/three/examples/js/libs/stats.min.js"*/

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
camera.position.set(0, 0, 4)
scene.add(camera);

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

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

/*controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.update();

stats = new Stats()
container.appendChild( stats.dom );*/

//test
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


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
    //stats.begin();
    renderer.render(scene, camera);
    //stats.end();
    camera.rotation.y += 0.001; 
    //cube.rotation.y += 1
};
  
animate();