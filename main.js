import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0x87CEEB);
//const renderer = new THREE.WebGLRenderer();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



//var camControls = new THREE.FirstPersonControls(camera);

/*

TODO:
tips of grass 
wind!!! - wind is not blowing in perlin noise direction
retain length
grass length retain 
grass geo generator?? level of detail
bend normal vector


*/


const vertexShader = /* glsl */ `
uniform float time;
uniform float windSpeed;
attribute vec3 instancePosition;
varying float vY; // Varying variable to pass Y position to fragment shader
varying vec3 bladeNormal;
varying vec3 vPosition;
varying float leanIntesity;

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


mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
  
    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }
  
float easeOut(float x, float power) {
    return 1.0 - pow(1.0 - x, power);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
//HERE!!!!! - find vector the points between p0 and p2 for facing dicrection
//the flip it for orthongal direction vector!!
void main() {
    vec3 pos = position;

  
    //wind is not blowing in perlin noise direction
    mat3 roty = rotation3dY(hash(instancePosition.xz)*20.);
   
    pos = pos * roty;
    vec3 bladePosition = vec3(0, 0, 0);
    //wind is not blowing in perlin noise direction
    leanIntesity = noise(instancePosition.xz*0.02 + time *windSpeed ) +0.2;
    vec3 bladeDirection = normalize(vec3(leanIntesity *2.,0,-1));
    
    vec3 bladeHeight = vec3(0, 1, 0);
    
    float grassLeaning = 4.;


    vec3 p0 = vec3(0, 0, 0);
    vec3 p1 = bladeHeight ;
    vec3 p2 = grassLeaning * bladeDirection + bladeHeight;

    float t = clamp(pos.y, 0.0, 1.0);

    vec3 a = Lerp(p0, p1, t);
    vec3 b = Lerp(p1, p2, t);
    vec3 c = Lerp(a, b, t);

    pos += c;
    pos += instancePosition;
    pos.y -= sin(hash(instancePosition.xz)); //randomise height by sinking into terrain
  

    vY = pos.y; // Pass Y position to fragment shader

    vec3 upDirection = vec3(0, 1, 0); // Assume y-axis is up
    //vec3 sideVec = normalize(cross(bladeDirection, tangent));

    vec3 tangent = bezierDerivative(p0, p1, p2, t);
    //vec3 sideVec = normalize(cross(p1-p2, tangent));
    vec3 newDirection = p1 - p2; //might be opposite 
    vec3 sideVec = normalize(vec3(newDirection.z,newDirection.y,-newDirection.x));
    

    //vec3 sideVec = normalize(vec3(bladeDirection.z, 0, -bladeDirection.x));
    vec3 normal = normalize(cross(sideVec, tangent));

    
    bladeNormal = normal;
    bladeNormal = roty * normal;
    vPosition = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShaders = {
    phong: /* glsl */ `
        varying float vY; // Receiving the Y position from vertex shader
        varying vec3 bladeNormal; // Receiving the normal from vertex shader
        varying vec3 vPosition;
        varying float leanIntesity;

        uniform vec3 lightPosition; // Light position
        uniform vec3 viewPosition; // Viewer position

        void main() {
            // Phong shading components
            vec3 ambientColor = vec3(0.1, 0.3, 0.1); // Ambient color (dark green)
            vec3 diffuseColor = vec3(0.2, 0.8, 0.2); // Diffuse color (green)
            vec3 specularColor = vec3(1.0, 1.0, 1.0); // Specular color (white)
            float shininess = 32.0; // Shininess factor for specular highlight

            // Normalize the normal vector
            vec3 N = normalize(bladeNormal);

            // Calculate the light direction
            vec3 L = normalize(lightPosition - vPosition);

            // Calculate the view direction
            vec3 V = normalize(viewPosition - vPosition);

            // Calculate the reflection direction
            vec3 R = reflect(-L, N);

            // Ambient component
            vec3 ambient = ambientColor;

            // Diffuse component
            float diff = max(dot(N, L), 0.0);
            vec3 diffuse = diff * diffuseColor;

            // Specular component
            float spec = pow(max(dot(R, V), 0.0), shininess);
            vec3 specular = spec * specularColor;

            // Combine the components
            vec3 color =  diffuse + ambient;

            gl_FragColor = vec4(color, 1.0);
        }
    `,
    perlin: /* glsl */ `
    varying float vY; // Receiving the Y position from vertex shader
    varying vec3 bladeNormal; // Receiving the normal from vertex shader
    varying vec3 vPosition;
    varying float leanIntesity;

    uniform vec3 lightPosition; // Light position
    uniform vec3 viewPosition; // Viewer position

    void main() {
        // Basic shading components
        vec3 color = vec3(0.2, 0.8, 0.2); // Basic green color
        gl_FragColor = vec4(leanIntesity,leanIntesity,leanIntesity, 1.0);
    }
    `,
    normal: /* glsl */ `
    varying float vY; // Receiving the Y position from vertex shader
    varying vec3 bladeNormal; // Receiving the normal from vertex shader
    varying vec3 vPosition;
    varying float leanIntesity;

    uniform vec3 lightPosition; // Light position
    uniform vec3 viewPosition; // Viewer position

    void main() {
        // Basic shading components
        vec3 color = vec3(0.2, 0.8, 0.2); // Basic green color
        gl_FragColor = vec4(abs(bladeNormal), 1.0);
    }
    `,

    basic: /* glsl */ `
        varying float vY; // Receiving the Y position from vertex shader
        varying vec3 bladeNormal; // Receiving the normal from vertex shader
        varying vec3 vPosition;
        varying float leanIntesity;

        uniform vec3 lightPosition; // Light position
        uniform vec3 viewPosition; // Viewer position

        void main() {
            // Basic shading components
            vec3 color = vec3(0.2, 0.8, 0.2); // Basic green color
            gl_FragColor = vec4(color, 1.0);
        }
    `
};

function updateShader() {
    material.fragmentShader = fragmentShaders[options.shader];
    material.needsUpdate = true;
}

const lightPos = new THREE.Vector3(1, 100, 100);


const options = {
    shader: 'phong',
    windSpeed: 2.

};
// Initialize dat.GUI
const gui = new dat.GUI();
gui.add(lightPos, 'x', -200, 200).name('Light X');
gui.add(lightPos, 'y', -200, 200).name('Light Y');
gui.add(lightPos, 'z', -200, 200).name('Light Z');
gui.add(options, 'windSpeed', 0, 5).name('Wind Speed');
gui.add(options, 'shader', Object.keys(fragmentShaders)).name('Shader').onChange(updateShader);

const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShaders[options.shader],
    side: THREE.DoubleSide,
    uniforms: {
        time: { value: 0.0 },
        cameraPosition: { value: camera.position },
        lightPosition: { value: lightPos },
        windSpeed: { value: options.windSpeed }
    }
});

const grassGeometry = new THREE.PlaneGeometry(0.17,1, 1,8);

const grassCount = 500000;
const positions = [];
for (let i = 0; i < grassCount; i++) {
    positions.push(Math.random() * 200 - 100);  // x position
    positions.push(0.5);  // y position
    positions.push(Math.random() * 200 - 100);  // z position
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

    //const lightPos = new THREE.Vector3(1,500, 100);
    material.uniforms.lightPosition.value = lightPos;

 
    material.uniforms.windSpeed.value = options.windSpeed;

    material.uniforms.time.value = clock.getElapsedTime();
    material.uniforms.cameraPosition.value.copy(camera.position); // Update camera position uniform
    renderer.render(scene, camera);
}

animate();