
export default function BackgroundPlane()
{
    return(
        <mesh scale={200} position={[0,0,-20]}>

        <planeGeometry/>
        <shaderMaterial
            vertexShader="
                varying vec2 vUv;
            
                void main() {
                    vUv = uv;
            
                    vec3 newPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            "
            fragmentShader="
                varying vec2 vUv;

                void main() {

                    gl_FragColor = vec4(0.047, 0.368, 0.49,1.);
                }
            "
        />
    </mesh>
    )
}