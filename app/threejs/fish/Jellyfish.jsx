import { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

export default function Jellyfish(props) {
  const { scene, materials, animations } = useGLTF('/models/jellyfish.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const jellyfishRef = useRef(new Group());
  const didEffect = useRef(false);

  const distance = useRef(0);
  const time = useRef(0);
  const goalDistance = 5;

  const index = useRef(0);

  const material = materials['Material.001'];
  material.depthWrite = true;
  material.depthTest = true;
  material.transparent= true;
  const modelAnimations = useAnimations(animations,clone);

  const playAnimation = (index) => {
    console.log(index);
    const oppositeIndex = Math.abs(index-1)
    const rand = Math.random() * oppositeIndex;

    const clip = modelAnimations.actions[modelAnimations.names[index]];
    clip.setDuration(7);
    clip.startAt(3 * rand);
    clip.reset().fadeIn(2).play();
  }

  useEffect(()=>{
    if(!didEffect.current) {
      didEffect.current = true;
      return;
    }

    playAnimation(0);
    const clip1 = modelAnimations.actions[modelAnimations.names[0]];

    const eventFunc = () => {
      const oppositeIndex = Math.abs(index.current-1);
      modelAnimations.actions[modelAnimations.names[index.current]].fadeOut(1.5 * oppositeIndex + 0.5);
      index.current = oppositeIndex;
      playAnimation(oppositeIndex)
    }

    clip1.getMixer().addEventListener("loop",eventFunc);

    return () => {
      clip1.getMixer().removeEventListener("loop",eventFunc);
      console.log("cos");
    }

  },[])

  useFrame(({clock})=>{
    let delta = clock.getDelta();
    const clipTime = modelAnimations.actions[modelAnimations.names[1]].time;

    let rotationY = Math.sin(clock.elapsedTime / 50) * delta * 0.5;
    jellyfishRef.current.rotateY(rotationY);

    if(index.current == 1 && clipTime >= 2.3){
      let timeFactor = (1-(clipTime-2.3)/4);

      let distanceFactor = Math.min(Math.abs(distance.current - jellyfishRef.current.position.y) / goalDistance,1);

      const offsetY = delta * 8 * distanceFactor * timeFactor;

      jellyfishRef.current.translateY(offsetY);
    }else{
      let offsetX = Math.sin(clock.elapsedTime / 5) * delta * 0.5;
      let offsetY = (Math.sin(clock.elapsedTime / 7)-1.3) * delta * 0.45;

      jellyfishRef.current.translateX(offsetX);
      jellyfishRef.current.translateY(offsetY);


      distance.current = jellyfishRef.current.position.y + goalDistance;
      time.current = clock.elapsedTime;

    }
  },[])

  return (
    <group {...props} dispose={null} ref={jellyfishRef}>
      <primitive object={clone} rotation-y={Math.PI}/>
    </group>
  )
}

useGLTF.preload('/models/jellyfish.glb')