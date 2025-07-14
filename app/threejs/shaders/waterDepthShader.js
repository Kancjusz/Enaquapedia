export const vertex = `
    varying vec2 vUv;

    void main() {
        vUv = uv;

        vec3 newPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`

export const fragment = `
    varying vec2 vUv;

    void main() {

        vec3 tint = vec3(0., 0., 0.);
        vec4 color = vec4(tint,1.-vUv.y);

        gl_FragColor = color;  
    }
`