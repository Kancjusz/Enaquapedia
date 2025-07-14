'use client';

import { useThree } from "@react-three/fiber";
import {vertex, fragment} from "./shaders/waterDepthShader"
import { useRef } from "react";

export default function WaterDepthPlane({sceneHeight})
{
    const {viewport} = useThree();

    const heightRatio = sceneHeight / viewport.height;

    return(
        <mesh scale={[viewport.width,viewport.height*heightRatio+sceneHeight,1]} position={[0,0,19.5]} layers={[2]}>
            <planeGeometry/>
            <shaderMaterial
                transparent={true}
                vertexShader={vertex}
                fragmentShader={fragment}
                depthWrite={true}
                depthTest={true}
            />
        </mesh>
    )
}