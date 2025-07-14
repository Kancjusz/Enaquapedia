import { Points } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import {vertex,fragment} from "./shaders/waterParticlesShader"


export default function WaterParticles({sceneHeight})
{
    const {viewport} = useThree();
    const particleCount = 3000;
    let basePositions = new Float32Array(3 * particleCount);

    for(let i = 0; i < particleCount * 3; i+=3)
    {
        basePositions[i] = (Math.random()-0.5) * viewport.width;
        basePositions[i+1] = (Math.random()-0.5) * (sceneHeight + viewport.height/2);
        basePositions[i+2] = Math.random() * 15.0;
    }

    const points = useRef();

    const uniforms = useRef({
        uTime: {value: 0},
        uSceneHeight: {value: sceneHeight}
    });

    useFrame(({clock})=>{
        points.current.material.uniforms.uTime.value = clock.getElapsedTime() * 2;
    });

    return(
        <mesh>
            <Points ref={points} positions={basePositions}>
                <shaderMaterial 
                    uniforms={uniforms.current}
                    vertexShader={vertex} 
                    fragmentShader={fragment} 
                    transparent={true} 
                    side={2}
                    sizeAttenuation={false}
                    depthTest={true}
                    depthWrite={false}
                    toneMapped={false}/>    
            </Points>
        </mesh>
    )
}