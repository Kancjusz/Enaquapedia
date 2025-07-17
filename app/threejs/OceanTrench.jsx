
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function OceanTrench(props) {
  const { nodes, materials } = useGLTF('/models/ocean_trench.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        material={materials['Material.003']}
        position={[0, 0, -2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube002.geometry}
        material={materials['Material.003']}
        position={[-1, 0, 2]}
        rotation={[Math.PI, 0, Math.PI]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane.geometry}
        material={materials['Material.004']}
        position={[0.755, 3.181, -3.271]}
        rotation={[0.27, -0.454, -1.008]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane001.geometry}
        material={materials['Material.005']}
        position={[-0.523, 3.873, -3.062]}
        rotation={[Math.PI / 2, 0, -1.003]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane002.geometry}
        material={materials['Material.006']}
        position={[0.212, 3.812, -3.002]}
        rotation={[2.067, 0, -0.871]}
        scale={[1, 1, 0.3]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003.geometry}
        material={materials['Material.007']}
        position={[0.244, 3.882, 3.026]}
        rotation={[Math.PI / 2, 1.075, -2.442]}
        scale={[1, 1, 0.3]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane004.geometry}
        material={materials['Material.008']}
        position={[-0.564, 4.069, 3.067]}
        rotation={[Math.PI / 2, 0, -2.225]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane005.geometry}
        material={materials['Material.009']}
        position={[1.099, 2.529, 3.277]}
        rotation={[0.5, Math.PI / 3, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane006.geometry}
        material={materials['Material.010']}
        position={[0.176, 4.575, 3.47]}
        rotation={[0.5, Math.PI / 3, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane007.geometry}
        material={materials['Material.011']}
        position={[1.388, 4.069, 3.386]}
        rotation={[1.397, 0.323, -1.89]}
        scale={[1, 1, 0.3]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane008.geometry}
        material={materials['Material.012']}
        position={[1.21, 4.575, 3.645]}
        rotation={[0.626, 1.15, -1.712]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane009.geometry}
        material={materials['Material.013']}
        position={[1.379, 6.17, 3.586]}
        rotation={[1.781, -0.282, -2.191]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane010.geometry}
        material={materials['Material.014']}
        position={[1.419, 5.891, 3.359]}
        rotation={[0.733, 0.418, -2.361]}
        scale={0.65}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane011.geometry}
        material={materials['Material.015']}
        position={[0.279, 7.082, -3.203]}
        rotation={[Math.PI / 2, 0, -0.616]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane012.geometry}
        material={materials['Material.016']}
        position={[-0.509, 6.878, -2.946]}
        rotation={[2.259, -0.454, -1.008]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane013.geometry}
        material={materials['Material.017']}
        position={[1.13, 5.001, -4.559]}
        rotation={[1.23, 0.135, -1.187]}
        scale={[1, 1, 0.3]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane014.geometry}
        material={materials['Material.018']}
        position={[1.43, 4.408, -4.479]}
        rotation={[-0.013, -0.447, -1.701]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane015.geometry}
        material={materials['Material.019']}
        position={[1.099, 7.595, 3.277]}
        rotation={[0.5, Math.PI / 3, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane016.geometry}
        material={materials['Material.020']}
        position={[-0.564, 0.513, 2.376]}
        rotation={[Math.PI / 2, 0, -2.225]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane017.geometry}
        material={materials['Material.021']}
        position={[-0.709, 0.471, 1.96]}
        rotation={[1.397, 0.323, -1.89]}
        scale={[1, 1, 0.3]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane018.geometry}
        material={materials['Material.022']}
        position={[-1.52, 0.471, 1.96]}
        rotation={[2.008, 0.323, -1.89]}
        scale={[1, 1, 0.3]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane019.geometry}
        material={materials['Material.023']}
        position={[1.896, 0.513, 3.702]}
        rotation={[Math.PI / 2, 0, -2.082]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane020.geometry}
        material={materials['Material.024']}
        position={[1.987, 0.217, 3.014]}
        rotation={[-0.173, 0.334, -1.237]}
        scale={0.473}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane021.geometry}
        material={materials['Material.025']}
        position={[1.601, 0.358, 2.7]}
        rotation={[3.091, -0.71, -2.021]}
        scale={0.473}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane022.geometry}
        material={materials['Material.026']}
        position={[1.381, 0.306, -2.541]}
        rotation={[1.531, 0.681, -1.757]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane023.geometry}
        material={materials['Material.027']}
        position={[1.388, 0.177, -3.095]}
        rotation={[2.266, 0.323, -1.89]}
        scale={[1, 1, 0.3]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane024.geometry}
        material={materials['Material.028']}
        position={[1.419, -1.531, 2.611]}
        rotation={[0.733, 0.418, -2.361]}
        scale={0.65}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane025.geometry}
        material={materials['Material.029']}
        position={[1.381, -3.066, 2.567]}
        rotation={[0.892, 0.184, -2.47]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane026.geometry}
        material={materials['Material.030']}
        position={[1.787, -2.152, -3.271]}
        rotation={[-0.15, -0.504, -1.874]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane027.geometry}
        material={materials['Material.031']}
        position={[-0.075, 9.426, -5.304]}
        rotation={[0.018, 0.308, -0.806]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane028.geometry}
        material={materials['Material.032']}
        position={[0.6, 9.956, 4.442]}
        rotation={[1.341, -0.121, -2.083]}
        scale={[1, 1, 0.3]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane029.geometry}
        material={materials['Material.033']}
        position={[1.1, 9.548, 4.39]}
        rotation={[1.775, 0.163, -2.283]}
        scale={0.886}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane030.geometry}
        material={materials['Material.034']}
        position={[0.875, 9.505, 3.866]}
        rotation={[3.091, -0.71, -2.021]}
        scale={0.473}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane031.geometry}
        material={materials['Material.035']}
        position={[1.132, 9.364, 4.179]}
        rotation={[-0.191, 0.544, -1.194]}
        scale={0.473}
      />
    </group>
  )
}

useGLTF.preload('/models/ocean_trench.glb')