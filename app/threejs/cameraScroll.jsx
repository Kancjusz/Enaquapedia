'use client'

import { useFrame} from "@react-three/fiber"
import * as THREE from "three";

export default function ScrollCamera({sceneHeight, showFog,scrollPercent})
{
    const endYPosition = -(sceneHeight/2);

    useFrame((state)=>{
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight;
        var winHeight = window.innerHeight;
        var scrollPercent2 = (scrollTop) / (docHeight - winHeight) * 2 - 1;

        scrollPercent.current = scrollPercent2;
        if(scrollPercent2 > 0.8){
            showFog.current.far = 20;
            showFog.current.color = new THREE.Color("#111111");
        } 
        else{
            showFog.current.far = 28;
            showFog.current.color = new THREE.Color("#53a0bd");
        } 

        state.camera.position.set(0,endYPosition * scrollPercent2, 20);
    });

    return;
}