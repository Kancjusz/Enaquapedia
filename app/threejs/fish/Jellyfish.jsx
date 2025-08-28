import { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Group, LoopOnce, LoopRepeat, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export default function Jellyfish(props) {
  const { scene, materials, animations } = useGLTF('/models/jellyfish.glb')

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const jellyfishRef = useRef(new Group());
  const didEffect = useRef(false);

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
    const oppositeIndex = Math.abs(index-1)
    const rand = Math.random() * oppositeIndex;

    const clip = modelAnimations.actions[modelAnimations.names[index]];
    clip.setDuration(7);
    clip.startAt(3 * rand);
    clip.reset().fadeIn(2).play();
  
    const eventFunc = () => {
      modelAnimations.actions[modelAnimations.names[index]].fadeOut(1.5 * oppositeIndex + 0.5);
      setIndex(oppositeIndex);
    }

    clip.getMixer().addEventListener("loop",eventFunc);

    return () => clip.getMixer().removeEventListener("loop",eventFunc);

  }, [index])

  useFrame(({clock})=>{
    let delta = clock.getDelta();
    const clipTime = modelAnimations.actions[modelAnimations.names[1]].time;

    let rotationY = Math.sin(clock.elapsedTime / 50) * delta * 0.5;
    jellyfishRef.current.rotateY(rotationY);

    if(index == 1 && clipTime >= 2.3){
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