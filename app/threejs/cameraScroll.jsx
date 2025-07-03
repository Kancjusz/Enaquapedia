'use client'

import { useFrame} from "@react-three/fiber"

export default function ScrollCamera({sceneHeight})
{
    const endYPosition = -(sceneHeight/2);

    useFrame((state)=>{
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight;
        var winHeight = window.innerHeight;
        var scrollPercent = (scrollTop) / (docHeight - winHeight) * 2 - 1;

        state.camera.position.set(0,endYPosition * scrollPercent, 20);
    });

    return;
}