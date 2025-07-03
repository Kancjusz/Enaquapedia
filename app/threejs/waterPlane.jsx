'use client';

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {vertex, fragment} from "./shaders/causticsShader"
import { useRef } from "react";

export default function WaterPlane({sceneHeight})
{
    const plane = useRef();
    const voronoiTexture = useTexture('/voronoiTexture.png');
    const {viewport} = useThree();

    const uniforms = useRef({
        uTime: {value: 0},
        uTexture: {value: voronoiTexture},
        uSceneHeight: {value: sceneHeight}
    });

    useFrame(({clock})=>{
        plane.current.material.uniforms.uTime.value = clock.getElapsedTime() * 2;
    });

    return(
        <mesh scale={[viewport.width/4,(sceneHeight + viewport.height/2) * 2,1]} ref={plane} position={[0,sceneHeight/2,15]}>
            <planeGeometry/>
            <shaderMaterial
                transparent="true"
                vertexShader={vertex}
                fragmentShader={fragment}
                uniforms={uniforms.current}
                depthWrite={false}
                depthTest={true}
            />
        </mesh>
    )
}