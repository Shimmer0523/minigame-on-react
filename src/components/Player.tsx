import { useCallback, useEffect, useState } from "react";
import Vector2 from "./Vector2";
import { Sprite, useTick } from "@pixi/react";
import img from "../assets/vite.png";
import { InputHandler } from "./useInput";
import { Spring, animated, useSpring } from "@react-spring/web";

const AnimatedSprite = animated(Sprite);

interface PlayerProps {
  inputHandler: InputHandler;
}

function Player({ inputHandler }: PlayerProps) {
  // 位置
  const [position, setPosition] = useState(new Vector2(0, 0));
  // 速度
  const [velocity, setVelocity] = useState(new Vector2(0, 0));
  const [speed, setSpeed] = useState(640 / 10 / 60);

  const [spring, setSpring] = useSpring(() => ({
    value: 1,
    config: { tension: 210, friction: 20, clamp: true, velocity: 1 },
    onStart: () => console.log("start spring"),
  }));

  const doSpring = useCallback(() => {
    console.log("set");
    setSpring({ value: Math.random() * 2 });
  }, [setSpring]);

  useEffect(() => {
    console.log("Initialize Player");
    const id = inputHandler.addButtonDownCallback(0, () => doSpring());

    return () => {
      console.log("Unmount Player");
      inputHandler.deleteButtonDownCallback(0, id);
    };
  }, []);

  useTick((delta) => {
    const mousePosition = inputHandler.getMousePosiotion();
    const newPosition = mousePosition
      .minus(position)
      .times(0.15)
      .plus(position);
    setPosition(newPosition);
  });

  return (
    <AnimatedSprite
      scale={spring.value}
      image={img}
      x={position.x}
      y={position.y}
      anchor={0.5}
    />
  );
}

export default Player;
