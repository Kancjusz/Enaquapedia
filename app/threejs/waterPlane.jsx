'use client';

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {vertex, fragment} from "./shaders/causticsShader"
import { useRef } from "react";

export default function WaterPlane({sceneHeight})
{
    const plane = useRef();
    const plane2 = useRef();

    const voronoiTexture = useTexture('/voronoiTexture.png');
    const {viewport} = useThree();

    const uniforms = useRef({
        uTime: {value: 0},
        uTopOffset: {value:0.3},
        uTexture: {value: voronoiTexture},
        uSceneHeight: {value: sceneHeight}
    });

    const uniforms2 = useRef({
        uTime: {value: 0},
        uTopOffset: {value:0.47},
        uTexture: {value: voronoiTexture},
        uSceneHeight: {value: sceneHeight}
    });

    useFrame(({clock})=>{
        plane.current.material.uniforms.uTime.value = clock.getElapsedTime() * 2+1;
        plane2.current.material.uniforms.uTime.value = clock.getElapsedTime() * 2;
    });

    return(
        <group>
            <mesh ref={plane} scale={[viewport.width,viewport.height,1]} position={[0,sceneHeight/2,15]} layers={[0]}>
                <planeGeometry/>
                <shaderMaterial
                    transparent={true}
                    vertexShader={vertex}
                    fragmentShader={fragment}
                    uniforms={uniforms.current}
                    depthWrite={true}
                    depthTest={true}
                />
            </mesh>
            <mesh ref={plane2} scale={[viewport.width,viewport.height,1]} position={[0,sceneHeight/2,19.4]} layers={[2]}>
                <planeGeometry/>
                <shaderMaterial
                    transparent={true}
                    vertexShader={vertex}
                    fragmentShader={fragment}
                    uniforms={uniforms2.current}
                    depthWrite={true}
                    depthTest={true}
                />
            </mesh>
        </group>

    )
}