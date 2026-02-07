import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react";

export default function CausticsPlane({sceneHeight,scale,seed,opacity,depth})
{
    const plane = useRef();
    const voronoiTexture = useTexture('/voronoiTexture.png');

    const planeUniforms = {
        uTime: {value: 0},
        uTexture: {value: voronoiTexture},
        uSeed: {value: seed},
        uOpacity: {value: opacity},
        uTopOffset: {value:0.3},
    };

    useFrame(({clock})=>{
        plane.current.uniforms.uTime.value = clock.getElapsedTime();
    });

    return(
        <mesh scale={scale} position={[0,sceneHeight/2,depth]} layers={[0]}>
            <planeGeometry/>
            <shaderMaterial ref={plane} uniforms={planeUniforms} transparent={true} depthWrite={true}
                    depthTest={true}
                vertexShader="
                    varying vec2 vUv;

                    void main() {
                        vUv = uv;
                
                        vec3 newPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                    }
                "
                fragmentShader="
                    varying vec2 vUv;
                    uniform sampler2D uTexture;
                    uniform float uTime;
                    uniform float uTopOffset;
                    uniform float uOpacity;
                    uniform float uSeed;

                    void main() {
                        vec2 godray = vec2(1.)-vUv - vec2(0.5,uTopOffset);

                        float uvDirection = max(atan(-godray.x,godray.y),0.);
                        float uvDirection2 = max(atan(godray.x*2.,godray.y)+0.5,0.);
                        float direction = (uvDirection + uvDirection2)/2.;

                        float slowedTime = uTime * 0.04;

                        float c = texture2D(uTexture, vec2(direction, slowedTime - floor(slowedTime + 1./uSeed))).x;
                        float c1 = texture2D(uTexture, vec2(0.1 + (slowedTime * 1.5 - floor(slowedTime * 1.5+ 1./uSeed)),direction)).x;

                        float alpha = min(c,c1)*2.;

                        float fade = smoothstep(0.,1.,abs(vUv.y));
                        float fade2 = smoothstep(0.9,1.,abs(vUv.y));

                        vec4 color = vec4(vec3(alpha),alpha * pow(fade,1./10.) * uOpacity);

                        vec4 tint = vec4(0.78, 0.98, 1.,1.);

                        gl_FragColor = tint * color;  
                    }
                "
            />
        </mesh>
    )
}