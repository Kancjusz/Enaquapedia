'use client'

import WaterPlane from "./waterPlane"
import WaterDepthPlane from "./waterDepthPlane"
import WaterParticles from "./waterParticles"
import Boids from "./Boids"
import OceanTrench from "./OceanTrench"
import DiscusFish from "./fish/DiscusFish"
import NeonTetraFish from "./fish/NeonTetraFish"
import DiamondTetraFish from "./fish/DiamondTetraFish"
import BluefaceAngelFish from "./fish/BluefaceAngelFish"
import Clownfish from "./fish/Clownfish"
import Anglerfish from "./fish/Anglerfish"
import Smack from "./fish/Smack"
import Cardinalfish from "./fish/Cardinalfish"
import IndianSalfinTang from "./fish/IndianSalfinTang"
import BackgroundPlane from "./backgroundPlane"
import WaterRipplesPlane from "./waterRipplesPlane"
import Title from "./title"

import ScrollCamera from "./cameraScroll"
import {Canvas} from "@react-three/fiber"
import { Box, Center, Environment, MeshWobbleMaterial, OrbitControls, Plane, Stats, Text, Text3D} from "@react-three/drei"
import { Suspense, useRef} from "react"
import { discusSettings, anglerfishSettings, neonTetraSettings,diamondTetraSettings, bluefaceAngelfishSettings, indianSalfinTangSettings, clownfishSettings} from "./settings"
import * as THREE from "three";

export default function WaterScene({elements,sceneHeight})
{
    const showFog = useRef(new THREE.Fog);
    const scrollPercent = useRef(-1);

    return(
        <>
            <Canvas style={{background:"#0c5e7d"}} camera={{position:[0,0,20],layers:[2]}} 
                gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} linear
                >
                <BackgroundPlane scrollPercent={scrollPercent}/>
                <spotLight layers={[0]} color={"#bcecff"} intensity={500} position={[0,sceneHeight*1.5,20]} angle={3*Math.PI/2} decay={1.5}/>
                <spotLight layers={[0]} color={"#bcecff"} intensity={600} position={[0,sceneHeight*1.5,10]} angle={3*Math.PI/2} decay={1.5}/>
                <spotLight layers={[0]} color={"#bcecff"} intensity={750} position={[0,sceneHeight*1.5,0]} angle={3*Math.PI/2} decay={1.5}/>
                <spotLight layers={[0]} color={"#bcecff"} intensity={900} position={[0,sceneHeight*1.5,-10]} angle={3*Math.PI/2} decay={1.5}/>
                <spotLight layers={[0]} color={"#bcecff"} intensity={1000} position={[0,sceneHeight*1.5,-20]} angle={3*Math.PI/2} decay={1.5}/>
                <directionalLight layers={[0]} color={"#bcecff"} intensity={1}/>
                <ambientLight layers={[0]} intensity={1} color={"#99fcff"}/>
                <Stats/>
                <Suspense>
                    <Title sceneHeight={sceneHeight}/>
                    <fog ref={showFog} attach="fog" args={["#53a0bd", 0, 28]}/>
                    <ScrollCamera sceneHeight={sceneHeight} showFog={showFog} scrollPercent={scrollPercent}/>
                    {elements.map((e)=>e)}
                    <WaterParticles sceneHeight={sceneHeight}/>
                    <OceanTrench position={[0,-50,12]} rotation={[0,-Math.PI/2,0]} scale={[2,2,2]}/>
                    <Boids fish={DiscusFish} position={[0,100,8]} size={new THREE.Vector2(1,0.1)} depth={5} settings={discusSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Boids fish={NeonTetraFish} position={[0,sceneHeight/2,2]} depth={8} size={new THREE.Vector2(1,0.4)} settings={neonTetraSettings} avoidMouse={true} sceneHeight={sceneHeight}/>
                    <Boids fish={DiamondTetraFish} position={[0,100,10]} size={new THREE.Vector2(1,0.2)} depth={5} settings={diamondTetraSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Boids fish={NeonTetraFish} position={[0,sceneHeight/2,11]} depth={4} size={new THREE.Vector2(1,0.17)} settings={neonTetraSettings} avoidMouse={true} sceneHeight={sceneHeight} count={35}/>
                    <Boids fish={NeonTetraFish} position={[0,sceneHeight/4,15]} depth={4} size={new THREE.Vector2(1,0.17)} settings={neonTetraSettings} avoidMouse={true} sceneHeight={sceneHeight} count={35}/>
                    <Boids fish={NeonTetraFish} position={[0,-5,12]} depth={4} size={new THREE.Vector2(1,0.08)} settings={neonTetraSettings} avoidMouse={true} sceneHeight={sceneHeight} count={35}/>
                    <Boids fish={BluefaceAngelFish} position={[0,5,10]} size={new THREE.Vector2(1,0.08)} depth={5} settings={bluefaceAngelfishSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Boids fish={IndianSalfinTang} position={[0,-15,6]} size={new THREE.Vector2(1,0.08)} depth={5} settings={indianSalfinTangSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Boids fish={Clownfish} position={[0,-50,12]} size={new THREE.Vector2(0.5,0.08)} depth={5} settings={clownfishSettings} avoidMouse={true} sceneHeight={sceneHeight}/>
                    <Boids fish={Cardinalfish} position={[0,-50,15]} size={new THREE.Vector2(1,0.08)} depth={5} settings={clownfishSettings} avoidMouse={true} sceneHeight={sceneHeight}/>
                    <Boids fish={Anglerfish} position={[0,-190,6]} size={new THREE.Vector2(1,0.04)} depth={10} settings={anglerfishSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Smack position={[0,-110,4]} scale={0.5} depth={2} count={12} sceneHeight={sceneHeight} size={new THREE.Vector2(0.5,0.04)}/>
                    <WaterPlane sceneHeight={sceneHeight}/>
                    <WaterDepthPlane sceneHeight={sceneHeight}/>
                    <WaterRipplesPlane sceneHeight={sceneHeight}/>
                    <Environment preset="city" environmentIntensity={0.5}/>
                </Suspense>
            </Canvas>

        </>
    )
}