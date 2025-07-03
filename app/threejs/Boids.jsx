
import { useFrame, useThree } from "@react-three/fiber";
import {  useMemo, useRef } from "react";
import { Vector3, Vector2, Euler } from "three";
import { randFloat } from "three/src/math/MathUtils.js";


function remap(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

const limits = new Vector3();
const wander = new Vector3();
const horizontalWander = new Vector3();
const alignment = new Vector3();
const avoidance = new Vector3();
const cohesion = new Vector3();

const steering = new Vector3();

export default function Boids ({ fish, position, depth, settings, avoidMouse, sceneHeight}) {
  const {viewport} = useThree();
  const zDistance = position[2]/5 +1;
  let boundaries = {x:viewport.width/zDistance, y:(sceneHeight + viewport.height/2), z:depth};

  const { NB_BOIDS, MIN_SCALE, MAX_SCALE, MIN_SPEED, MAX_SPEED, MAX_STEERING } = settings.general;

  const { threeD, ALIGNEMENT, AVOIDANCE, COHESION } = settings.rules
  const { WANDER_RADIUS, WANDER_STRENGTH} = settings.wander
  const { ALIGN_RADIUS, ALIGN_STRENGTH } = settings.alignment
  const { AVOID_RADIUS, AVOID_STRENGTH} = settings.avoidance
  const { COHESION_RADIUS, COHESION_STRENGTH } = settings.cohesion

  const boids = useMemo(() => {
    return new Array(NB_BOIDS).fill().map((_, i) => ({
      position: new Vector3(
        randFloat(-boundaries.x / 2, boundaries.x / 2),
        randFloat(-boundaries.y / 2, boundaries.y / 2),
        threeD ? randFloat(-boundaries.z / 2, boundaries.z / 2) : 0
      ),
      velocity: new Vector3(0, 0, 0),
      wander: randFloat(0, Math.PI * 2),
      scale: randFloat(MIN_SCALE, MAX_SCALE),
    }));
  }, [NB_BOIDS, boundaries, MIN_SCALE, MAX_SCALE, threeD]);

  useFrame(({pointer}, delta) => {
    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];

      // WANDER
      boid.wander += randFloat(-0.05, 0.05);

      wander.set(
        Math.cos(boid.wander) * WANDER_RADIUS,
        Math.sin(boid.wander) * WANDER_RADIUS,
        0
      );

      wander.normalize();
      wander.multiplyScalar(WANDER_STRENGTH);

      horizontalWander.set(
        Math.cos(boid.wander) * WANDER_RADIUS,
        0,
        Math.sin(boid.wander) * WANDER_RADIUS
      );

      horizontalWander.normalize();
      horizontalWander.multiplyScalar(WANDER_STRENGTH);

      // RESET FORCES
      limits.multiplyScalar(0);
      steering.multiplyScalar(0);
      alignment.multiplyScalar(0);
      avoidance.multiplyScalar(0);
      cohesion.multiplyScalar(0);

      // LIMITS
      if (Math.abs(boid.position.x) + 1 > boundaries.x / 2) {
        limits.x = -boid.position.x;
        boid.wander += Math.PI;
      }
      if (Math.abs(boid.position.y) + 1 > boundaries.y / 2) {
        limits.y = -boid.position.y;
        boid.wander += Math.PI;
      }
      if (Math.abs(boid.position.z) + 1 > boundaries.z / 2) {
        limits.z = -boid.position.z;
        boid.wander += Math.PI;
      }

      limits.normalize();
      limits.multiplyScalar(50);

      let totalCohesion = 0;

      // Loop through all boids
      for (let b = 0; b < boids.length; b++) {
        if (b === i) {
          // skip to get only other boids
          continue;
        }
        const other = boids[b];
        let d = boid.position.distanceTo(other.position);
        // ALIGNEMENT
        if (d > 0 && d < ALIGN_RADIUS) {
          const copy = other.velocity.clone();
          copy.normalize();
          copy.divideScalar(d);
          alignment.add(copy);
        }

        // AVOID
        if (d > 0 && d < AVOID_RADIUS) {
          const diff = boid.position.clone().sub(other.position);
          diff.normalize();
          diff.divideScalar(d);
        }

        // COHESION
        if (d > 0 && d < COHESION_RADIUS) {
          cohesion.add(other.position);
          totalCohesion++;
        }

      }

      // APPLY FORCES

      steering.add(limits);
      steering.add(wander);
      if (threeD) {
        steering.add(horizontalWander);
      }

      if (ALIGNEMENT) {
        alignment.normalize();
        alignment.multiplyScalar(ALIGN_STRENGTH);
        steering.add(alignment);
      }

      if (AVOIDANCE) {
        avoidance.normalize();
        avoidance.multiplyScalar(AVOID_STRENGTH);
        steering.add(avoidance);
      }

      if (COHESION && totalCohesion > 0) {
        cohesion.divideScalar(totalCohesion);
        cohesion.sub(boid.position);
        cohesion.normalize();
        cohesion.multiplyScalar(COHESION_STRENGTH);
        steering.add(cohesion);
      }

      steering.clampLength(0, MAX_STEERING * delta);
      boid.velocity.add(steering);
      boid.velocity.clampLength(
        0,
        remap(boid.scale, MIN_SCALE, MAX_SCALE, MAX_SPEED, MIN_SPEED) * delta
      );

      // APPLY VELOCITY
      //boid.position.add(boid.velocity);
    }
  });

  return( 
      <group position={position}>
        {boids.map((boid, index) => (
        <Boid
          boundaries={boundaries}
          key={index}
          Fish={fish}
          position={boid.position}
          scale={boid.scale}
          velocity={boid.velocity}
          generalSettings = {settings.general}
          avoidMouse={avoidMouse}
          sceneHeight={sceneHeight}
        />
      ))}
    </group>
  )

};

const Boid = ({
  Fish,
  boundaries,
  position,
  velocity,
  generalSettings,
  avoidMouse,
  sceneHeight,
  ...props
}) => {

  const { MIN_SCALE, MAX_SCALE, MIN_SPEED, MAX_SPEED } = generalSettings;
  const group = useRef();
  const {viewport} = useThree();
  const prevPointer = useRef(new Vector2(0,0));

  useFrame(({pointer},delta) => {


    //SCROLL ADJUST

    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight;
    var winHeight = window.innerHeight;

    var scrollRange = (scrollTop) / (docHeight - winHeight) * -2 + 1; //from -1 to 1

    //FISH AVOIDANCE
    const target = group.current.clone(false);

    const xyBoidPos = new Vector2(position.x,position.y);
    const transformedPointer = new Vector2(pointer.x * boundaries.x * 0.5, pointer.y * boundaries.y * 0.5 + sceneHeight/2 * scrollRange);
    const transformedPointerV3 = new Vector3(transformedPointer.x, transformedPointer.y, position.z);


    let lookAtVector = group.current.position.clone().add(velocity);
    let copyPosition = position.clone();

    const distance = xyBoidPos.distanceTo(transformedPointer)
    const maxDistance = 0.1 * boundaries.x;

    if(distance < maxDistance && !(pointer.x == prevPointer.current.x && pointer.y == prevPointer.current.y) && avoidMouse)
    {
      const subtractedVec = position.clone().sub(transformedPointerV3);
      lookAtVector = position.clone().add(subtractedVec);

      const axis = velocity.clone().cross(subtractedVec);

      const angle = Math.acos(velocity.clone().dot(subtractedVec)/(subtractedVec.length() * velocity.length()));
      const rotatedVelocity = velocity.clone().applyAxisAngle(axis,angle);

      velocity.add(rotatedVelocity.clone().normalize().multiplyScalar((maxDistance-distance)/ maxDistance * 0.1));
    }
    else
    {
      
      velocity.clampLength(
        0,
        remap(props.scale, MIN_SCALE, MAX_SCALE, MAX_SPEED, MIN_SPEED) * delta
      );
    }

    copyPosition.add(velocity);

    target.lookAt(lookAtVector);
    group.current.quaternion.slerp(target.quaternion, 0.1);

    group.current.position.copy(copyPosition);
    position.copy(copyPosition);

    prevPointer.current = pointer.clone();
  });

  return (
    <Fish {...props} ref={group} position={position}/>
  );
};
