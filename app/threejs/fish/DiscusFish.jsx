import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations, useTexture, Clone } from '@react-three/drei'
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { Color, DoubleSide, Material, MeshStandardMaterial } from 'three';

export default function DiscusFish(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/disc_fish.glb');

  const [alphaMap,texture1,texture2,texture3] = useTexture(['/textures/discus_alpha.png','/textures/discus_fish.png','/textures/discus_fish2.png','/textures/discus_fish3.png']);
  const textures = [texture1,texture2,texture3];

  const modelAnimations = useAnimations(animations, props.ref)

  const randIndex = Math.floor(Math.random() * 3);
  const sceneClone = useMemo(()=>SkeletonUtils.clone(scene),[scene]);
  const materialClone = new MeshStandardMaterial();

  materialClone.depthTest = true;
  materialClone.depthWrite = true;
  materialClone.shadowSide = DoubleSide;
  materialClone.transparent = true;

  materialClone.map = sceneClone.children[1].children[0].material.map.clone();
  materialClone.map.source = textures[randIndex].source;

  materialClone.alphaMap = sceneClone.children[1].children[0].material.map.clone();
  materialClone.alphaMap.source = alphaMap.source;

  materialClone.normalMap = sceneClone.children[1].children[0].material.normalMap.clone();
  materialClone.roughnessMap = sceneClone.children[1].children[0].material.roughnessMap.clone();

  const randTexture = useRef(materialClone);
  const primitiveRef = useRef();

  useEffect(() => {
    modelAnimations.actions[modelAnimations.names[0]].play();
  }, [])
  
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive ref={primitiveRef} object={sceneClone} children-1-children-0-material={randTexture.current}/>
    </group>
  )
}

useGLTF.preload('/models/disc_fish.glb')