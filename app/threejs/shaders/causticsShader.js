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
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uTopOffset;

    void main() {
        vec2 godray = vec2(1.)-vUv - vec2(0.5,uTopOffset);

        float uvDirection = max(atan(-godray.x,godray.y),0.);
        float uvDirection2 = max(atan(godray.x*2.,godray.y)+0.5,0.);
        float direction = (uvDirection + uvDirection2)/2.;

        float slowedTime = uTime * 0.04;

        float c = texture2D(uTexture, vec2(direction, slowedTime - floor(slowedTime))).x;
        float c1 = texture2D(uTexture, vec2(0.1 + (slowedTime * 1.5 - floor(slowedTime * 1.5)),direction)).x;

        float alpha = min(c,c1)*2.;

        float fade = smoothstep(0.4,1.,abs(vUv.y));
        float fade2 = smoothstep(0.9,1.,abs(vUv.y));

        vec4 color = vec4(vec3(alpha),alpha * fade*0.5);
        //color = vec4(clamp(color.xyz * fade,0.,1.),min((1.-fade2) * 0.5 + color.w,1.));

        vec4 tint = vec4(0.78, 0.98, 1.,1.);

        gl_FragColor = color;  
    }
`