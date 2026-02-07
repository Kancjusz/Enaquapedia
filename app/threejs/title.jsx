import { Center, MeshWobbleMaterial, Text3D} from "@react-three/drei"

export default function Title({sceneHeight})
{
    return(
        <Center position={[0,sceneHeight/2,10]}>
            <Text3D font={"fonts/Frijole_Regular.json"} scale={[2,3,0.2]}curveSegments={32} letterSpacing={0.15}>
                Enaquapedia
                <MeshWobbleMaterial color={"white"} factor={0.3} speed={0.5}/>
            </Text3D>
        </Center>
    );
}