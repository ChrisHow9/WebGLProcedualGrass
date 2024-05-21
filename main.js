import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const vertexShader = /*glsl*/`
uniform float time;


void main() {

    vec3 pos = position;
    vec3 bladePosition = vec3(0,0,0);
    vec3 bladeDirection = vec3(0,0,1);
    vec3 bladeHeight = vec3(0,1,0);
    float grassLeaning = 0.1f;


    vec3 p0 = bladePosition;
    vec3 p1 = p0 +  bladeHeight;
    vec3 p2 = p1 + bladeDirection * bladeHeight * grassLeaning;

    float a = p0.y *(1.0-pos.y) + p1.y * pos.y;
    float b = p1.y *(1.0-pos.y) + p2.y * pos.y;
    float c = a * (1.0-pos.y) + b;

    pos.x += c;
    

    


    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    
}
`;

const fragmentShader = `
void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Green color
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

const geometry = new THREE.PlaneGeometry(0.1,1, 10,10);
const plane = new THREE.Mesh(geometry, material);

scene.add(plane);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    plane.rotation.y += 0.05;

    renderer.render(scene, camera);
}

animate();
