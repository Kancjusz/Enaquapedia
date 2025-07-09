import React, { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

export default function NeonTetraFish(props) {
  const { scene, materials, animations } = useGLTF('/models/neon_tetra.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const material = materials['Material.001'];
  material.depthWrite = true;
  material.depthTest = true;
  //const modelAnimations = useAnimations(animations, props.ref)

  useEffect(() => {
    //modelAnimations.actions[modelAnimations.names[0]].play();
  }, [])

  return (
    <group {...props} dispose={null}>
      <primitive object={clone} rotation-y={Math.PI}/>
    </group>
  )
}

useGLTF.preload('/models/neon_tetra.glb')