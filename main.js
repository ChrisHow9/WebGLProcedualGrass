import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0x87CEEB);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


/*

TODO:
Fps camera?
tips of grass 
shading of grass 
normals for grass - see gdc talk
grass length retain 
debgug values ui



*/


const vertexShader = /* glsl */ `
uniform float time;
attribute vec3 instancePosition;
varying float vY; // Varying variable to pass Y position to fragment shader

vec3 Lerp(vec3 a, vec3 b, float t) {
    return a + t * (b - a);
}

void main() {
    vec3 pos = position;
    
    vec3 bladePosition = vec3(0, 0, 0);
    vec3 bladeDirection = vec3(0, 0, 0);
    vec3 bladeHeight = vec3(0, 1, 0);
    float grassLeaning = -1.0f;

    vec3 p0 = vec3(0, 0, 0);
    vec3 p1 = vec3(0, 1, 0);
    vec3 p2 = vec3(-0.4, 1, sin(time * 2.5));

    float t = clamp(pos.y, 0.0, 1.0);

    vec3 a = Lerp(p0, p1, t);
    vec3 b = Lerp(p1, p2, t);
    vec3 c = Lerp(a, b, t);

    pos += c;
    pos += instancePosition;

    vY = pos.y; // Pass Y position to fragment shader

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
varying float vY; // Receiving the Y position from vertex shader

void main() {
    float greenIntensity = 0.4 + 0.6 * vY; // Gradient from darker (0.4) to brighter (1.0)
    float redIntensity = 0.0 + 0.3 * vY; 
    gl_FragColor = vec4(redIntensity, greenIntensity, 0.0, 1.0); // Green color with gradient
}
`;



const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        time: { value: 0.0 }
    }
});

const grassGeometry = new THREE.PlaneGeometry(0.05,1, 1,20);

const grassCount = 20000;
const positions = [];
for (let i = 0; i < grassCount; i++) {
    positions.push(Math.random() * 50 - 25);  // x position
    positions.push(0.5);  // y position
    positions.push(Math.random() * 50 - 20);  // z position
}

const instancedGeometry = new THREE.InstancedBufferGeometry().copy(grassGeometry);
instancedGeometry.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(new Float32Array(positions), 3));
const instancedMesh = new THREE.InstancedMesh(instancedGeometry, material, grassCount);
scene.add(instancedMesh);


//onsole.log(geometry.position.x)/*
/*
const plane = new THREE.Mesh(geometry, material);
plane.position.y = 0.5;
scene.add(plane);  

const dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0]), 3));
const dotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xff0000 });
const dot = new THREE.Points(dotGeometry, dotMaterial);
scene.add(dot);*/

const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 }); // Forest green
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);



camera.position.z = 6;
camera.position.y = 1.9;
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    //plane.rotation.y += 0.05;
   
   // uniforms.u_time.value += 0.05;
   // uniforms.time.value = clock.elapsedTime();
    material.uniforms.time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

animate();
