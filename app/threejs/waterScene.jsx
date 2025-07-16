'use client'

import WaterPlane from "./waterPlane"
import WaterDepthPlane from "./waterDepthPlane"
import WaterParticles from "./waterParticles"
import Boids from "./Boids"
import DiscusFish from "./fish/DiscusFish"
import NeonTetraFish from "./fish/NeonTetraFish"
import DiamondTetraFish from "./fish/DiamondTetraFish"
import BluefaceAngelFish from "./fish/BluefaceAngelFish"
import IndianSalfinTang from "./fish/IndianSalfinTang"
import BackgroundPlane from "./backgroundPlane"
import WaterRipplesPlane from "./waterRipplesPlane"

import ScrollCamera from "./cameraScroll"
import {Canvas} from "@react-three/fiber"
import { Environment} from "@react-three/drei"
import { Suspense} from "react"
import { discusSettings, neonTetraSettings,diamondTetraSettings, bluefaceAngelfishSettings, indianSalfinTangSettings} from "./settings"
import * as THREE from "three";

export default function WaterScene({elements,sceneHeight})
{
    return(
        <>
            <Canvas style={{background:"#0c5e7d"}} camera={{position:[0,0,20],layers:[2]}} 
                gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} linear
                >
                <fog attach="fog" args={["#53a0bd", 0, 28]}/>
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
                    <Boids fish={DiscusFish} position={[0,15,8]} size={new THREE.Vector2(1,0.3)} depth={5} settings={discusSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Boids fish={NeonTetraFish} position={[0,0,2]} depth={8} settings={neonTetraSettings} avoidMouse={true} sceneHeight={sceneHeight}/>
                    <Boids fish={DiamondTetraFish} position={[0,20,10]} size={new THREE.Vector2(1,0.3)} depth={5} settings={diamondTetraSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Boids fish={NeonTetraFish} position={[0,0,12]} depth={4} settings={neonTetraSettings} avoidMouse={true} sceneHeight={sceneHeight} count={35}/>
                    <Boids fish={NeonTetraFish} position={[0,0,12]} depth={4} settings={neonTetraSettings} avoidMouse={true} sceneHeight={sceneHeight} count={35}/>
                    <Boids fish={BluefaceAngelFish} position={[0,-10,10]} size={new THREE.Vector2(1,0.3)} depth={5} settings={bluefaceAngelfishSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <Boids fish={IndianSalfinTang} position={[0,-30,6]} size={new THREE.Vector2(1,0.4)} depth={5} settings={indianSalfinTangSettings} avoidMouse={false} sceneHeight={sceneHeight}/>
                    <WaterPlane sceneHeight={sceneHeight}/>
                    <WaterDepthPlane sceneHeight={sceneHeight}/>
                    <WaterRipplesPlane sceneHeight={sceneHeight}/>
                    <Environment preset="city" environmentIntensity={0.5}/>
                </Suspense>
            </Canvas>

        </>
    )
}