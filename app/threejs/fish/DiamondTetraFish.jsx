import { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

export default function DiamondTetraFish(props) {
  const { scene, materials, animations } = useGLTF('/models/diamond_tetra.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const material = materials['Material.001'];
  material.depthWrite = true;
  material.depthTest = true;
  material.transparent= true;
  const modelAnimations = useAnimations(animations, props.ref)

  useEffect(() => {
    const clip = modelAnimations.actions[modelAnimations.names[0]];
    clip.timeScale = 3;
    clip.play();
  }, [])

  return (
    <group {...props} dispose={null}>
      <primitive object={clone} rotation-y={Math.PI/2}/>
    </group>
  )
}

useGLTF.preload('/models/diamond_tetra.glb')