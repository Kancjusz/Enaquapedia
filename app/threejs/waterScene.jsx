'use client'

import WaterPlane from "./waterPlane"
import WaterParticles from "./waterParticles"
import Boids from "./Boids"
import Fish1Model from "./fish1Model"
import DiscusFish from "./fish/DiscusFish"
import NeonTetraFish from "./fish/NeonTetraFish"
import Fish2Model from "./fish2Model"
import BackgroundPlane from "./backgroundPlane"
import WaterRipplesPlane from "./waterRipplesPlane"

import ScrollCamera from "./cameraScroll"
import {Canvas} from "@react-three/fiber"
import { Environment} from "@react-three/drei"
import { Suspense} from "react"
import {boid1Settings, boid2Settings, discusSettings, neonTetraSettings} from "./settings"
import * as THREE from "three";

export default function WaterScene({elements,sceneHeight})
{
    return(
        <>
            <Canvas style={{background:"#0c5e7d"}} camera={{position:[0,0,20]}} 
                gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} linear
                >
                <fog attach="fog" args={["#55a0bc", 0, 28]}/>
                <BackgroundPlane/>
                <spotLight color={"#bcecff"} intensity={500} position={[0,sceneHeight*1.5,20]} angle={3*Math.PI/2} decay={1.5}/>
                <spotLight color={"#bcecff"} intensity={600} position={[0,sceneHeight*1.5,10]} angle={3*Math.PI/2} decay={1.5}/>
                <spotLight color={"#bcecff"} intensity={750} position={[0,sceneHeight*1.5,0]} angle={3*Math.PI/2} decay={1.5}/>
                <spotLight color={"#bcecff"} intensity={900} position={[0,sceneHeight*1.5,-10]} angle={3*Math.PI/2} decay={1.5}/>
                <spotLight color={"#bcecff"} intensity={1000} position={[0,sceneHeight*1.5,-20]} angle={3*Math.PI/2} decay={1.5}/>
                <directionalLight color={"#bcecff"} intensity={1}/>
                <ambientLight intensity={1} color={"#99fcff"}/>
                

                <Suspense>
                    <ScrollCamera sceneHeight={sceneHeight}/>
                    {elements.map((e)=>e)}
                    <WaterParticles sceneHeight={sceneHeight}/>
                    <Boids fish={DiscusFish} position={[0,0,8]} depth={5} settings={discusSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Boids fish={NeonTetraFish} position={[0,0,10]} depth={5} settings={neonTetraSettings} avoidMouse={true} sceneHeight={sceneHeight}/>
                    <Boids fish={Fish2Model} position={[0,0,0]} depth={10} settings={boid2Settings} avoidMouse={true} sceneHeight={sceneHeight}/>
                    <WaterPlane sceneHeight={sceneHeight}/>
                    <WaterRipplesPlane sceneHeight={sceneHeight}/>
                    <Environment preset="city" environmentIntensity={0.2}/>
                </Suspense>
            </Canvas>

        </>
    )
}