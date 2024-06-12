# Procedual Grass modeling and rending using quadratic bezier curves

## [Live Demo](https://ruby-steep-kilometer.glitch.me/) 🔴

## How to run locally 

npm install 

npx vite

## Goals of project - 

provide non triivial implenattion of grass generationa and rendering 

This is a demo so solution should be time effecient to implement ie do not spend 4 hour improving performance by 5%

Should be online and available to whowever may want to access it (should be taken into considertion for performanc and which platforms it can run on)

## Research - 

webgpu not compatbible with safrai,
webgl is a potential option but is somewhat barebones and math libaries may be a little undercooked
three js offers built in libaries for webgl with some tradeoff in having less felxiability

WebGPU (experimental), SVG and CSS3D

## Core Deliverable 

- Represenation of grass using bezier curves 

- Insance rendering for field 

- grass should retian length 

- wind patterns using noise


- use Seiler’s Interpolation!!


 ## Extensions -

- level of detail

- culling 

- shading

- anti alising

- debug ui

- clumping

- varing each blades properties

- grass blade thicken depedning on view space

## Further exploration - 

- whilst I have found splines used for creating and rendering I have not found the use bezier curves used for short fur rending - at least I have not seen it from a roudamenatry search 


- Frustum culling


## sources -

https://stemkoski.github.io/Three.js/#shader-simple

https://www.youtube.com/watch?v=2h5NX9tIdno
- check last sections about making pretty

https://www.youtube.com/watch?v=bp7REZBV4P4


https://www.youtube.com/watch?v=Ibe1JBF5i5Y


https://gpuopen.com/learn/mesh_shaders/mesh_shaders-procedural_grass_rendering/

https://dl.acm.org/doi/abs/10.1145/2856400.2876008

https://www.researchgate.net/figure/Representation-of-grass-model-a-A-grass-shape-is-determined-by-a-cubic-Bezier-curve-b_fig7_302916177
