import { Vector2, Vector3 } from 'three';
import { useFrame, useThree } from "@react-three/fiber";
import Jellyfish from './Jellyfish';
import { useEffect, useMemo, useRef } from 'react';

export default function Smack({position, scale, depth, size, count=5, sceneHeight})
{
    const {camera} = useThree();

    const tabHasFocus = useRef(true);

    const docHeight = document.documentElement.scrollHeight;

    const calculatePosInBounds = (cameraDepth,index) => {
        const width = Math.tan((camera.fov/360) * Math.PI)*Math.abs(cameraDepth) * 2;
        const height = width * (docHeight/window.innerWidth);

        const boundaries = {x:width*2*size.x, y:(sceneHeight + height)*size.y};
        const side = index % 2;

        return {
            pos: new Vector3(
                position[0] + boundaries.x * (Math.random() - 1 * side),
                position[1] + boundaries.y * (Math.random() * 2 - 1),
                camera.position.z - cameraDepth
            ),
            bounds: boundaries
        }
    }

    let posAndBounds;
    const depthDivider = 2 * depth / count;
    const jellyfishTransforms = useMemo(()=>{
        return new Array(count).fill().map((_,i)=>({
            pos: (posAndBounds = calculatePosInBounds(
                camera.position.z - (position[2] + depth * (Math.random() * depthDivider - depth + depthDivider * i)), i
            )).pos,
            offsetIdle: new Vector2(0,0),
            rotationOffset: {value:0},
            rand: {value:Math.random()},
            s: scale * (Math.random()+0.5),
            bounds: posAndBounds.bounds,
            tabHasFocus: {value:true}
        }));
    },[posAndBounds,count,scale,camera,depthDivider,depth])

    useEffect(()=>{

        const handleFocus = () => {
            tabHasFocus.current = true;
        };

        const handleBlur = () => {
            tabHasFocus.current = false;
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        }
    },[])

    useFrame(({clock},delta)=>{
        if(!tabHasFocus.current && clock.running) {
            clock.stop();
            return;
        }

        if(!clock.running) 
        {
            let time = clock.oldTime;
            clock.start();
            clock.elapsedTime = time;
        }


        jellyfishTransforms.forEach((e)=>{

            let offsetX = Math.sin((clock.elapsedTime + 123456789 * e.rand.value) / 5) * delta * 0.5;
            let offsetY = (Math.sin((clock.elapsedTime + 123456789 * e.rand.value) / 7)-1.3) * delta * 0.45 * (e.rand.value*2 + (1/e.rand.value/100));

            e.offsetIdle.setX(offsetX);
            e.offsetIdle.setY(offsetY);

            e.rotationOffset.value = Math.sin((clock.elapsedTime + 123456789 * e.rand.value) / 50) * delta * 0.5 * e.rand.value;
        })
    });

    return(
        <group>
            {jellyfishTransforms.map((e,i)=>{
                return <Jellyfish 
                    key={i} position={e.pos} scale={[e.s,e.s,e.s]} 
                    offsetIdle={e.offsetIdle}
                    rotationOffset={e.rotationOffset} rand={e.rand}
                    bounds={e.bounds} basePos={position}
                />
            })}
        </group>
    );
}