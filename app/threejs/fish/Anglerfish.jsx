import { useEffect, useMemo } from 'react'
import { useGLTF, useAnimations, Box } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';

export default function Anglerfish(props) {
  const { scene, materials, animations } = useGLTF('/models/anglerfish.glb')

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
      <primitive object={clone} />
      <pointLight position={[0,0,3]} intensity={100} decay={1.7}/>
    </group>
  )
}

useGLTF.preload('/models/anglerfish.glb')