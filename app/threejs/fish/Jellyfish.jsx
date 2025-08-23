import { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { LoopOnce, LoopRepeat } from 'three';

export default function Jellyfish(props) {
  const { scene, materials, animations } = useGLTF('/models/jellyfish.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const didEffect = useRef(false);

  const [index,setIndex] = useState(0);

  const material = materials['Material.001'];
  material.depthWrite = true;
  material.depthTest = true;
  material.transparent= true;
  const modelAnimations = useAnimations(animations,clone);

  useEffect(() => {
    if(!didEffect.current) {
      didEffect.current = true;
      return;
    }
    
    const rand = Math.random() + 1;

    modelAnimations.actions[modelAnimations.names[index]].reset().fadeIn(2).play();

    setTimeout(()=>{
      setIndex(Math.abs(index-1));
    },10000 * rand)

    return () => modelAnimations.actions[modelAnimations.names[index]].fadeOut(2);

  }, [index])

  return (
    <group {...props} dispose={null}>
      <primitive object={clone} rotation-y={Math.PI}/>
    </group>
  )
}

useGLTF.preload('/models/jellyfish.glb')