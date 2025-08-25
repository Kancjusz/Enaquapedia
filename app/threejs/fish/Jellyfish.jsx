import { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Group, LoopOnce, LoopRepeat, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

export default function Jellyfish(props) {
  const { scene, materials, animations } = useGLTF('/models/jellyfish.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const jellyfishRef = useRef(new Group());
  const didEffect = useRef(false);
  const idle = useRef(true);

  const distance = useRef(0);
  const time = useRef(0);
  const goalDistance = 5;

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

    if(index == 1)
      setTimeout(()=>{
        distance.current = jellyfishRef.current.position.y + goalDistance;
        idle.current = false;
      },9000)
    else idle.current = true;

    const oppositeIndex = Math.abs(index-1)
    const rand = Math.random() * oppositeIndex + 1;

    modelAnimations.actions[modelAnimations.names[index]].reset().fadeIn(2).play();

    setTimeout(()=>{
      setIndex(oppositeIndex);
    },15000 * rand)

    return () => modelAnimations.actions[modelAnimations.names[index]].fadeOut(2);

  }, [index])

  useFrame(({clock})=>{
    let delta = clock.getDelta();
    if(idle.current){
      let offsetX = Math.sin(clock.elapsedTime / 5) * delta * 0.5;
      let offsetY = (Math.sin(clock.elapsedTime / 7)-1) * delta * 0.45;
      let rotationY = Math.sin(clock.elapsedTime / 50) * delta * 0.5;

      jellyfishRef.current.translateX(offsetX);
      jellyfishRef.current.translateY(offsetY);

      jellyfishRef.current.rotateY(rotationY);

      time.current = clock.elapsedTime;
    }else{
      let timeFactor = (1-(clock.elapsedTime - time.current)/6);

      console.log(clock.elapsedTime - time.current);

      let distanceFactor = Math.min(Math.abs(distance.current - jellyfishRef.current.position.y) / goalDistance,1);

      jellyfishRef.current.translateY(delta * 8 * distanceFactor * timeFactor);
    }
  },[])

  return (
    <group {...props} dispose={null} ref={jellyfishRef}>
      <primitive object={clone} rotation-y={Math.PI}/>
    </group>
  )
}

useGLTF.preload('/models/jellyfish.glb')