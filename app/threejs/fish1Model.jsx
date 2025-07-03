import React, { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

export default function Fish1Model(props) {
  const { scene, materials, animations } = useGLTF('/models/fish1Model.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const material = materials['Default OBJ'];
  material.depthWrite = true;
  material.depthTest = true;
  const modelAnimations = useAnimations(animations, props.ref)

  useEffect(() => {
    modelAnimations.actions[modelAnimations.names[0]].play();
  }, [])

  return (
    <group {...props} dispose={null}>
      <primitive object={clone} />
    </group>
  )
}

useGLTF.preload('/models/fish1Model.glb')