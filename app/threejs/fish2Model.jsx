import React, { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

export default function Fish2Model(props) {
  const { scene, materials, animations } = useGLTF('/models/fish2Model.glb')

  const material = materials['Material.002'];
  material.depthWrite = true;
  material.depthTest = true;

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const modelAnimations = useAnimations(animations, props.ref)

  useEffect(() => {
    modelAnimations.actions[modelAnimations.names[1]].play();
  }, [])
  return (
    <group {...props} dispose={null}>
      <primitive object={clone} rotation-y={Math.PI/2}/>
    </group>
  )
}

useGLTF.preload('/models/fish2Model.glb')