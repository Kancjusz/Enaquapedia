import { useEffect, useMemo, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';

export default function Jellyfish(props) {

  const jellyfishRef = useRef(new Group());
  const didEffect = useRef(false);

  const distance = useRef(0);
  const time = useRef(0);
  const goalDistance = 5;

  const index = useRef(0);

  const modelAnimations = useRef();

  const maxBoundsDistance = 5;
  const baseOffset = 0.01;

  const playAnimation = (index) => {
    const oppositeIndex = Math.abs(index-1)
    const rand = props.rand.value * oppositeIndex;

    const clip = modelAnimations.current.actions[modelAnimations.current.names[index]];
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
    const clip1 = modelAnimations.current.actions[modelAnimations.current.names[0]];

    const eventFunc = () => {
      const oppositeIndex = Math.abs(index.current-1);
      modelAnimations.current.actions[modelAnimations.current.names[index.current]].fadeOut(1.5 * oppositeIndex + 0.5);
      index.current = oppositeIndex;
      playAnimation(oppositeIndex)
    }

    clip1.getMixer().addEventListener("loop",eventFunc);

    return () => {
      clip1.getMixer().removeEventListener("loop",eventFunc);
    }

  },[])

  useFrame(({clock},delta)=>{
    const clipTime = modelAnimations.current.actions[modelAnimations.current.names[1]].time;

    jellyfishRef.current.rotateY(props.rotationOffset.value);

    if(index.current == 1 && clipTime >= 2.3){
      let timeFactor = (1-(clipTime-2.3)/4);

      let distanceFactor = Math.min(Math.abs(distance.current - jellyfishRef.current.position.y) / goalDistance,1);

      const offsetY = delta * 8 * distanceFactor * timeFactor;

      jellyfishRef.current.translateY(offsetY);
    }else{
      const randYAttractPos = props.bounds.y * 2 * props.rand.value - props.bounds.y;
      const distanceFactor = -Math.min(Math.max((jellyfishRef.current.position.y - props.basePos[1] + randYAttractPos) / (props.bounds.y + randYAttractPos),-1),1);

      jellyfishRef.current.translateX(props.offsetIdle.x);
      jellyfishRef.current.translateY(props.offsetIdle.y + baseOffset * distanceFactor);

      distance.current = jellyfishRef.current.position.y + goalDistance;
      time.current = clock.elapsedTime;
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
  const pos = useRef(position)

  const material = materials['Material.001'];
  material.depthWrite = true;
  material.depthTest = true;
  material.transparent= true;
  modelAnimations.current = {...useAnimations(animations.slice(),clone)};
  modelAnimations.current.mixer.timeScale = rand+1;
  //modelAnimations.current.actions.Idle.setDuration(7*(rand+1) * (1/rand));
  //console.log(modelAnimations.current.actions.Idle.duration);

  return (
    <group ref={ref} position={position} scale={scale} dispose={null}>
      <primitive object={clone}/>
    </group>
  )
}

useGLTF.preload('/models/jellyfish.glb')