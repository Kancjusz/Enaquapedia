import WaterScene from "./threejs/waterScene";

export default function Home() {
  return (
    <div className="w-full h-[2000px] absolute">
      <div className="fixed h-[100vh] w-[100vw]">
        <WaterScene elements={[]} sceneHeight={30}/>
      </div>
    </div>
  );
}
