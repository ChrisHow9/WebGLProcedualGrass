void main() {

    vec3 bladePosition = (0,0,0);
    vec3 bladeDirection = (0,1,0);
    float bladeHeight = 0;
    float grassLeaning = 0.3f;


    vec3 p0 = bladePosition;
    vec3 p1 = p0 + vec3{0, 0, bladeHeight};
    vec3 p2 = p1 + bladeDiction * bladeHeight * grassLeaning;
 
    vec3 pos = position;
    pos.x += 0.1 * pos.y;
    

    


    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    
}