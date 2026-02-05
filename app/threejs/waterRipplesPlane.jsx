'use client';

import { OrthographicCamera, PerspectiveCamera, useFBO } from "@react-three/drei";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import {rippleVertex, rippleFragment, renderVertex, renderFragment} from "./shaders/ripplesShader"
import {bloomVertex,bloomFragment} from "./shaders/bloomShader"
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function WaterRipplesPlane({sceneHeight})
{
    const endYPosition = -(sceneHeight/2);

    const secondaryCamera = useRef();

    const plane1 = useRef();
    const plane2 = useRef();
    const planeBloom = useRef();

    const material1 = useRef();
    const material2 = useRef();
    const materialBloom = useRef();

    const refs = useRef({
        enableRipples: false,
        prevMouse : new THREE.Vector2(0,0),
    });

    const disableRipples = () => refs.current.enableRipples = false;
    const enableRipples = () => refs.current.enableRipples = true;

    const {viewport} = useThree();

    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
    const options = {
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        stencilBuffer: true,
        depthBuffer: true
    }
    let renderTargetA = useFBO(width,height,options);
    let renderTargetB = useFBO(width,height,options);
    let renderTargetBloom = useFBO(width,height,options);
    let downSampledTargets = [
        useFBO(width/2,height/2,options),
        useFBO(width/4,height/4,options),
        useFBO(width/8,height/8,options),
    ]

    const uniformsRipples = useRef({
        uTime: {value: 0},
        uFrame: {value: -1},
        uMouse: {value:new THREE.Vector2(0,0)},
        resolution: {value: new THREE.Vector2(width,height)},
        uTextureA: {value: null},
        uTextureB: {value: null}
    });

    const uniformsRender = useRef({
        uTextureA: {value: null},
        uTextureB: {value: null},
        uMouse: {value:new THREE.Vector2(0,0)}
    });

    const uniformsBloom = useRef({
        uCameraPos: {value: new THREE.Vector3(0,0,0)},
        uTexWidth: {value: width},
        uTexHeight: {value: height},
        uTextureA: {value: null},
    });

    useEffect(()=>{
        window.addEventListener("mousedown",enableRipples);
        window.addEventListener("mouseup",disableRipples);

        return()=>{
            window.removeEventListener("mousedown",enableRipples);
            window.removeEventListener("mouseup",disableRipples);
        }
    },[])

    useFrame(({clock, pointer, gl, scene, camera})=>{
        //SCROLL
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight;
        var winHeight = window.innerHeight;
        var scrollPercent = (scrollTop) / (docHeight - winHeight) * 2 - 1;

        //RIPPLES
        const doRipples = refs.current.enableRipples && !(pointer.x == refs.current.prevMouse.x && pointer.y == refs.current.prevMouse.y);
        const ogpointer = new THREE.Vector2((pointer.x+1)*0.5, (pointer.y+1)*0.5)
        const newPointer = doRipples ? ogpointer : new THREE.Vector2(0,0);

        var scrollY = endYPosition * scrollPercent;
        plane2.current.position.set(0,scrollY,19);

        camera.layers.disableAll();
        camera.layers.enable(0);

        gl.setRenderTarget(renderTargetBloom);
        gl.render(scene, camera);

        camera.layers.disableAll();
        camera.layers.enable(2);

        secondaryCamera.current.layers.disableAll();
        secondaryCamera.current.layers.enable(1);
        for(let i = 0; i <= 1; i++)
        {
            materialBloom.current.uniforms.uTextureA.value = renderTargetBloom.texture;
            materialBloom.current.uniforms.uCameraPos.value = camera.position;

            gl.setRenderTarget(renderTargetB);
            gl.render(scene, secondaryCamera.current);

            materialBloom.current.uniforms.uTextureA.value = renderTargetB.texture;
            materialBloom.current.uniforms.uCameraPos.value = camera.position;

            gl.setRenderTarget(renderTargetBloom);
            gl.render(scene, secondaryCamera.current);
        }
        secondaryCamera.current.layers.disableAll();
        secondaryCamera.current.layers.enable(0);

        material1.current.uniforms.uTime.value = clock.getElapsedTime() * 2;
        material1.current.uniforms.uFrame.value += 1;
        material1.current.uniforms.uMouse.value = newPointer;
        material1.current.uniforms.uTextureA.value = renderTargetA.texture;

        gl.setRenderTarget(renderTargetB);
        gl.render(scene, secondaryCamera.current);

        material2.current.uniforms.uTextureA.value = renderTargetB.texture;
        material2.current.uniforms.uTextureB.value = renderTargetBloom.texture;
        material2.current.uniforms.uMouse.value = ogpointer;

        gl.setRenderTarget(renderTargetA);
        gl.render(scene, camera);
        gl.setRenderTarget(null);

        const temp = renderTargetB;
        renderTargetB = renderTargetA;
        renderTargetA = temp;

        refs.current.prevMouse = new THREE.Vector2(pointer.x, pointer.y);
    });

    return(
        <>
            <OrthographicCamera layers={[1]} position={[2000,0,100]} ref={secondaryCamera}/>
            <mesh ref={plane1} scale={[width,height,1]} position={[2000,0,0]}>
                <planeGeometry/>
                <shaderMaterial
                    ref={material1}
                    vertexShader={rippleVertex}
                    fragmentShader={rippleFragment}
                    uniforms={uniformsRipples.current}
                    depthWrite={true}
                    depthTest={true}
                    toneMapped={false}
                />
            </mesh>
            <mesh ref={planeBloom} layers={[1]} scale={[width,height,1]} position={[2000,0,0]}>
                <planeGeometry/>
                <shaderMaterial
                    ref={materialBloom}
                    vertexShader={bloomVertex}
                    fragmentShader={bloomFragment}
                    uniforms={uniformsBloom.current}
                    depthWrite={true}
                    depthTest={true}
                    toneMapped={false}
                />
            </mesh>
            <mesh ref={plane2} layers={[2]} scale={[viewport.width/20 * viewport.dpr,viewport.height/20* viewport.dpr,1]} position={[0,sceneHeight/2,19]}>
                <planeGeometry/>
                <shaderMaterial
                    ref={material2}
                    vertexShader={renderVertex}
                    fragmentShader={renderFragment}
                    uniforms={uniformsRender.current}
                    depthWrite={true}
                    depthTest={true}
                    toneMapped={true}
                    transparent={true}
                />
            </mesh>

        </>

    )
}