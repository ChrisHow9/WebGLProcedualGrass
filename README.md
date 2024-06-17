# Procedual grass modeling and rending using quadratic bezier curves

## [Live Demo](https://ruby-steep-kilometer.glitch.me/) 🔴

![](https://github.com/ChrisHow9/WebGLProcedualGrass/blob/main/grass.gif)


## How to Run Locally 

Requires npm package manganer and vite build tools

   npm install
   npx vite

## Goals of project - 

The main goal of this project is to provide a non-trivial implementation of grass generation and rendering using quadratic Bezier curves. The solution is designed to be time-efficient in terms of implementation, focusing on quick development over extensive performance optimizations. The project aims to be accessible online for anyone who wants to view it, taking into account performance considerations and platform compatibility.

## Research and Implenetation - 

My initial curioisty rose from watch this gdc talk with the implenataion of grass in ghost of tschumia, from here I looked in further devloper blogs and technical papers to go into more detail and how to translate this into a browser native application.

Muitple web based graphics apis were considered for the project, WebGpu is one of the newest and most advanst apis with support for compute shaders which could acclerate the initial generation of grass blades, however is still relevtively early in devlopment and is not supported on some major browsers such as safarai. The alternative I used instead was the libaray three.js which provides a modern interface for webgl and provides out of the box maths libaries.

The model of a grass blade will be defined as straight vertically alianed model, the horiztiobal value of its vertices will be then offset in the vertex shader by how it is evaulated agaisnt a bezier curve. The bezier curve will be have three control points p0, represents the base of the blade, p1 its height, and p2 how far the grass curve should bend. P0 and p1 will remain static whilst p2 will be modified over time to create the effect of movement and wind effecting the grass blade. The dervitave of the bezier curver is used to calulate the normal  and is passed to the fragment shader for lighting calculations.

To create the effect of wind mutiple passes of Perlin noise are used at differnet sclaes to and then scrolled across the blades of grass using a time variable passed to the shader.Perlin noise is also used to to create the effect of clouds by darkening each grass blade based from its postion. To render many grass blades used in the scene, instanced rendereing is used to render all the grass in a single call. This however comes with the downside of losing frustum culling, implenting frustum culling is possible for instanced rendering is possible but out of scope for this project.



## Core Deliverable 

- [x] Represenation of grass using bezier curves 

- [x] Insance rendering for field 

- [x] Grass should retain length 

- [x] Wind patterns using noise



 ## Extensions -

- [ ] level of detail

- [ ] frustum culling 

- [x] shading

- [x] anti alising

- [x] debug ui

- [ ] clumping

- [x] varing each blades properties

- [ ] grass blade thicken depedning on view space


## Further exploration - 

- whilst I have found splines used for creating and rendering I have not found the use bezier curves used for short fur rending - at least I have not seen it from a roudamenatry search 

- Use Seiler’s Interpolation for evaualting a bezier curve, this a new method that can calaulte a bezier curver is few linear interolpations than da casteljus algorthmn

- Impelnteing Frustum culling to further improve perfomance


## Sources -

https://stemkoski.github.io/Three.js/#shader-simple

https://www.youtube.com/watch?v=2h5NX9tIdno
- check last sections about making pretty

https://www.youtube.com/watch?v=bp7REZBV4P4


https://www.youtube.com/watch?v=Ibe1JBF5i5Y


https://gpuopen.com/learn/mesh_shaders/mesh_shaders-procedural_grass_rendering/

https://dl.acm.org/doi/abs/10.1145/2856400.2876008

https://www.researchgate.net/figure/Representation-of-grass-model-a-A-grass-shape-is-determined-by-a-cubic-Bezier-curve-b_fig7_302916177
