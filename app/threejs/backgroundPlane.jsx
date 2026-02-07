import { useFrame } from "@react-three/fiber"
import { useRef } from "react";

export default function BackgroundPlane({scrollPercent})
{
    const plane = useRef();

    const planeUniforms = {
        uScroll: {value: scrollPercent.current}
    };

    useFrame(()=>{
        plane.current.uniforms.uScroll.value = scrollPercent.current
    });

    return(
        <mesh scale={500} position={[0,0,-20]}>
            <planeGeometry/>
            <shaderMaterial ref={plane} uniforms={planeUniforms}
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
                    uniform float uScroll;

                    void main() {

                        float scroll = (uScroll + 1.)/2.;

                        float darken = ceil(0.9 - scroll);

                        gl_FragColor = vec4(0.047 * darken, 0.368 * darken, 0.49 * darken, 1.);
                    }
                "
            />
        </mesh>
    )
}