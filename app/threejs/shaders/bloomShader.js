export const bloomVertex = `
    uniform vec3 cameraPos;
    varying vec2 vUv;
    varying float distance;

    void main() {
        vUv = uv;

        vec3 newPosition = position;
        vec4 tempWorldPos = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        vec3 tempCalc = pow(tempWorldPos.xyz - cameraPos,vec3(2.));
        distance = sqrt(tempCalc.x + tempCalc.y + tempCalc.z);
        gl_Position = tempWorldPos; 
    }
`

export const bloomFragment = `
    varying vec2 vUv;
    varying float distance;
    uniform float uTexWidth;
    uniform float uTexHeight;
    uniform sampler2D uTextureA;

    vec3 sampleTex(vec2 uv)
    {
        return texture2D(uTextureA, uv).xyz;
    }

    vec3 sampleBox (vec2 uv, float delta) {
        vec2 texelSize = vec2(1./uTexWidth,1./uTexHeight);
        vec4 o = texelSize.xyxy * vec2(-delta, delta).xxyy;
        vec3 s =
            sampleTex(uv + o.xy) + sampleTex(uv + o.zy) +
            sampleTex(uv + o.xw) + sampleTex(uv + o.zw) + 
            sampleTex(uv + o.xy/2.) + sampleTex(uv + o.zy/2.) +
            sampleTex(uv + o.xw/2.) + sampleTex(uv + o.zw/2.);
        return s / 8.;
    }

    void main() {
        vec3 col = sampleBox(vUv,pow(distance,3.)/10.);

        gl_FragColor = vec4(col ,1.);  
    }
`