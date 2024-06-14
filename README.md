# Procedual grass modeling and rending using quadratic bezier curves

## [Live Demo](https://ruby-steep-kilometer.glitch.me/) 🔴

![](https://github.com/ChrisHow9/WebGLProcedualGrass/blob/main/grass.gif)

## How to run locally 

## How to Run Locally 

1. Install dependencies:
   ```bash
   npm install
   npx vite

## Goals of project - 

The main goal of this project is to provide a non-trivial implementation of grass generation and rendering using quadratic Bezier curves. The solution is designed to be time-efficient in terms of implementation, focusing on quick development over extensive performance optimizations. The project aims to be accessible online for anyone who wants to view it, taking into account performance considerations and platform compatibility.

## Research - 

webgpu not compatbible with safrai,
webgl is a potential option but is somewhat barebones and math libaries may be a little undercooked
three js offers built in libaries for webgl with some tradeoff in having less felxiability

WebGPU (experimental), SVG and CSS3D

## Core Deliverable 

- [x] Represenation of grass using bezier curves 

- [x] Insance rendering for field 

- [x] Grass should retian length 

- [x] Wind patterns using noise



 ## Extensions -

- [ ] level of detail

- [ ] culling 

- [x] shading

- [x] anti alising

- [x] debug ui

- [ ] clumping

- [x] varing each blades properties

- [ ] grass blade thicken depedning on view space

## Evaulation - 
show fps 
was the project a success

## Further exploration - 

- whilst I have found splines used for creating and rendering I have not found the use bezier curves used for short fur rending - at least I have not seen it from a roudamenatry search 

- use Seiler’s Interpolation!!
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
