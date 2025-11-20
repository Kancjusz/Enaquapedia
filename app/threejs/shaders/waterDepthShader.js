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
        //float opacity = 1.-clamp(0.,1.,log(2.*vUv.y+0.5));
        float opacity = clamp(0.,0.8,pow(vUv.y*1.5-1.5,4.));
        vec4 color = vec4(tint,opacity);

        gl_FragColor = color;  
    }
`