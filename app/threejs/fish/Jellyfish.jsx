import { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

export default function Jellyfish(props) {

  const jellyfishRef = useRef(new Group());
  const didEffect = useRef(false);

  const distance = useRef(0);
  const goalDistance = 5;

  const index = useRef(0);

  const modelAnimations = useRef();

  const baseOffset = 0.03;

  const playAnimation = (index) => {
    const oppositeIndex = Math.abs(index-1)
    const rand = props.rand.value * oppositeIndex;

    const clip = modelAnimations.current.actions[modelAnimations.current.names[index]];
    clip.setDuration(7/5);
    clip.startAt(3 * rand);
    clip.reset().fadeIn(2/5).play();
  }

  useEffect(()=>{
    if(!didEffect.current) {
      didEffect.current = true;
      return;
    }

    playAnimation(0);
    const clip1 = modelAnimations.current.actions[modelAnimations.current.names[0]];

    const eventFunc = () => {
      const oppositeIndex = Math.abs(index.current-1);
      modelAnimations.current.actions[modelAnimations.current.names[index.current]].fadeOut((1.5 * oppositeIndex + 0.5)/5);
      index.current = oppositeIndex;
      playAnimation(oppositeIndex)
    }

    clip1.getMixer().addEventListener("loop",eventFunc);

    return () => {
      clip1.getMixer().removeEventListener("loop",eventFunc);
      didEffect.current = false;
    }

  },[])

  useFrame(({},delta)=>{
    const clipTime = modelAnimations.current.actions[modelAnimations.current.names[1]].time;

    jellyfishRef.current.rotateY(props.rotationOffset.value);

    if(index.current == 1 && clipTime >= 2.3){
      let timeFactor = (1-(clipTime-2.3)/4);

      let distanceFactor = Math.min(Math.abs(distance.current - jellyfishRef.current.position.y) / goalDistance,1);

      const fixedDelta = (delta > 0.1) ? 0.01 : delta;
      const offsetY = fixedDelta * 8 * distanceFactor * timeFactor * 5;

      jellyfishRef.current.translateY(offsetY);
    }else{
      const randYAttractPos = props.bounds.y * 2 * props.rand.value - props.bounds.y;
      const distanceFactor = -Math.min(Math.max((jellyfishRef.current.position.y - props.basePos[1] + randYAttractPos) / (props.bounds.y + randYAttractPos),-1),1);

      let offsetX = jellyfishRef.current.position.x + props.offsetIdle.x;
      let offsetY = jellyfishRef.current.position.y + props.offsetIdle.y + baseOffset * distanceFactor;
      let newPos = new Vector3(offsetX, offsetY, jellyfishRef.current.position.z);
      
      console.log(offsetX > props.bounds.x || offsetX < -props.bounds.x);
      
      if(offsetX > props.bounds.x || offsetX < -props.bounds.x)
        newPos.setX(offsetX - 2* props.offsetIdle.x);
      else
        newPos.setX(offsetX);

      if(offsetY > props.bounds.y || offsetY < -props.bounds.y)
        newPos.setY(offsetY - 2* props.offsetIdle.y);
      else
        newPos.setY(offsetY);

      jellyfishRef.current.position.set(newPos.x,newPos.y,newPos.z);


      distance.current = jellyfishRef.current.position.y + goalDistance;
    }
  })

  return (
    <JellyfishModel ref={jellyfishRef} modelAnimations={modelAnimations} position={props.position} scale={props.scale} rand={props.rand.value}/>
  )
}

function JellyfishModel({position,scale,ref,modelAnimations,rand})
{
  const { scene, materials, animations } = useGLTF('/models/jellyfish.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const material = materials['Material.001'];
  material.depthWrite = true;
  material.depthTest = true;
  material.transparent = true;
  material.needsUpdate = true;
  modelAnimations.current = {...useAnimations(animations.slice(),clone)};
  modelAnimations.current.mixer.timeScale = rand+1;

  return (
    <group ref={ref} position={position} scale={scale} dispose={null}>
      <primitive object={clone}/>
    </group>
  )
}

useGLTF.preload('/models/jellyfish.glb')