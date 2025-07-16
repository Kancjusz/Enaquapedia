import { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

export default function IndianSalfinTang(props) {
  const { scene, materials, animations } = useGLTF('/models/indian_salfin_tang.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const material = materials['Material.001'];
  material.depthWrite = true;
  material.depthTest = true;
  material.transparent= true;
  const modelAnimations = useAnimations(animations, props.ref)

  useEffect(() => {
    modelAnimations.actions[modelAnimations.names[0]].play();
  }, [])

  return (
    <group {...props} dispose={null}>
      <primitive object={clone} rotation-y={Math.PI}/>
    </group>
  )
}

useGLTF.preload('/models/indian_salfin_tang.glb')