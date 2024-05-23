import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0x87CEEB);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



//var camControls = new THREE.FirstPersonControls(camera);

/*

TODO:
tips of grass 
wind!!!
shading of grass 
normals for grass - see gdc talk
grass length retain 
debgug values ui
grass geo generator



*/


const vertexShader = /* glsl */ `
uniform float time;
attribute vec3 instancePosition;
varying float vY; // Varying variable to pass Y position to fragment shader
varying vec3 bladeNormal;
varying vec3 vPosition;

vec3 Lerp(vec3 a, vec3 b, float t) {
    return a + t * (b - a);
}

vec3 bezierDerivative(vec3 p0, vec3 p1, vec3 p2, float t)
{
    return 2. * (1. - t) * (p1 - p0) + 2. * t * (p2 - p1);
}
// taken from https://www.shadertoy.com/view/4djSRW
float hash(vec2 p)
{
    // Two typical hashes...
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    
    // This one is better, but it still stretches out quite quickly...
    // But it's really quite bad on my Mac(!)
    //return fract(sin(dot(p, vec2(1.0,113.0)))*43758.5453123);

}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
  
    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }
  
  
void main() {
    vec3 pos = position;

  

    mat3 roty = rotation3dY(hash(instancePosition.xz));
   
    pos = pos * roty;
    vec3 bladePosition = vec3(0, 0, 0);
     vec3 bladeDirection = normalize(vec3(1,2,0));
    
    vec3 bladeHeight = vec3(0, 1, 0);
    float grassLeaning = 4.0f;

    vec3 p0 = vec3(0, 0, 0);
    vec3 p1 = bladeHeight;
    vec3 p2 = grassLeaning * bladeDirection + bladeHeight;

    float t = clamp(pos.y, 0.0, 1.0);

    vec3 a = Lerp(p0, p1, t);
    vec3 b = Lerp(p1, p2, t);
    vec3 c = Lerp(a, b, t);

    pos += c;
    pos += instancePosition;
    pos -= sin(hash(instancePosition.xz));
  

    vY = pos.y; // Pass Y position to fragment shader

    vec3 upDirection = vec3(0, 1, 0); // Assume y-axis is up
    //vec3 sideVec = normalize(cross(bladeDirection, tangent));

    vec3 tangent = bezierDerivative(p0, p1, p2, t);
    vec3 sideVec = normalize(cross(bladeDirection, tangent));
    

    //vec3 sideVec = normalize(vec3(bladeDirection.z, 0, -bladeDirection.x));
    vec3 normal = normalize(cross(tangent, sideVec));

    
    bladeNormal = normal;
    vPosition = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
varying float vY; // Receiving the Y position from vertex shader
varying vec3 bladeNormal; // Receiving the normal from vertex shader
varying vec3 vPosition;

void main() {
    // Light properties
    vec3 lightPosition = vec3(10.0,-1000.0, 0.0); // Example light position
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    
    // Material properties
    vec3 ambientColor = vec3(0.1, 0.4, 0.1);
    vec3 diffuseColor = vec3(0.2, 0.9, 0.2);


    // Normalize interpolated normal
    vec3 N = normalize(bladeNormal);

    // Calculate light direction
    vec3 lightDir = normalize(lightPosition - vPosition);

    // Calculate view direction (from fragment to camera)
  
    // Calculate reflection direction
    vec3 reflectDir = reflect(-lightDir, N);

    // Calculate ambient component
    vec3 ambient = ambientColor * lightColor;

    // Calculate diffuse component
    float diff = max(dot(N, lightDir), 0.0);
    vec3 diffuse = diffuseColor * lightColor * diff;

 
    

    // Combine ambient, diffuse, and specular components
    vec3 result = ambient + diffuse;

    gl_FragColor = vec4(result, 1.0);
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

const grassGeometry = new THREE.PlaneGeometry(0.2,1, 1,10);

const grassCount = 1000000;
const positions = [];
for (let i = 0; i < grassCount; i++) {
    positions.push(Math.random() * 500 - 250);  // x position
    positions.push(0.5);  // y position
    positions.push(Math.random() * 500 - 250);  // z position
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

const groundGeometry = new THREE.PlaneGeometry(500, 500);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 }); // Forest green
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);



camera.position.z = 6;
camera.position.y = 3;

let controls;

controls = new OrbitControls( camera, renderer.domElement );

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
   
    //plane.rotation.y += 0.05;
   
   // uniforms.u_time.value += 0.05;
   // uniforms.time.value = clock.elapsedTime();
    material.uniforms.time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

animate();
