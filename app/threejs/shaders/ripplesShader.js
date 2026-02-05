export const rippleVertex = `
    varying vec2 vUv;

    void main() {
        vUv = uv;

        vec3 newPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`

export const rippleFragment = `

    uniform sampler2D uTextureA;
    uniform vec2 resolution;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uFrame;

    varying vec2 vUv;

    const float delta = 1.3;

    void main() {
        if (uFrame == 0.) {gl_FragColor = vec4(0.); return;}
        
        vec4 data = texture2D(uTextureA,vUv);
        float pressure = data.x;
        float pVel = data.y;
        vec2 texelSize = 1. / resolution;

        float p_right = texture2D(uTextureA, vUv + vec2(texelSize.x, 0)).x;
        float p_left = texture2D(uTextureA, vUv + vec2(-texelSize.x, 0)).x;
        float p_up = texture2D(uTextureA, vUv + vec2(0, texelSize.y)).x;
        float p_down = texture2D(uTextureA, vUv + vec2(0, -texelSize.y)).x;
        
        if (vUv.x <= texelSize.x) p_left = p_right;
        if (vUv.x >= 1. - texelSize.x) p_right = p_left;
        if (vUv.y <= texelSize.y) p_down = p_up;
        if (vUv.y >= 1. - texelSize.y) p_up = p_down;

        // Apply horizontal wave function
        pVel += delta * (-2.0 * pressure + p_right + p_left) / 10.0;
        pVel += delta * (-2.0 * pressure + p_up + p_down) / 10.0;
        
        // Change pressure by pressure velocity
        pressure += delta * pVel * 2.;
        
        // "Spring" motion.
        pVel -= 0.005 * delta * pressure;
        
        // Velocity damping
        pVel *= 1.0 - 0.02 * delta;
        
        // Pressure damping to prevent it from building up forever.
        pressure *= 0.999;
        
        vec2 mouseUv = uMouse / resolution;
        
        if (uMouse.x > 0.0) {
            float dist = distance(vUv, uMouse);
            if (dist <= 0.02) {
                pressure += 2.0 * (1. - dist / 0.02);
            }
        }

        gl_FragColor = vec4(pressure, pVel, (p_right - p_left) / 2., (p_up -  p_down) / 2.);
    }
`

export const renderVertex = `
    varying vec2 vUv;

    void main() {
        vUv = uv;

        vec3 newPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`

export const renderFragment = `
    varying vec2 vUv;
    uniform sampler2D uTextureA;
    uniform sampler2D uTextureB;
    uniform vec2 uMouse;

    vec4 specularTint = vec4(0.88, 1., 0.9,1.);

    void main() {
        

        vec4 data = texture2D(uTextureA, vUv);
        
        vec2 distortion = 0.3 * data.zw;
        vec4 color = texture2D(uTextureB,vUv + distortion);
        
        vec3 normal = normalize(vec3(-data.z *2., 0.5, -data.w * 2.));
        vec3 lightDir = normalize(vec3((uMouse.x-0.5)*-6.,8.,3.));
        float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * (uMouse.y+1.)*0.5;

        gl_FragColor = min(color + specularTint * specular,1.);  
    }
`