import { useEffect, useState } from "react";
import Vector2 from "./Vector2";
import { Sprite, useTick } from "@pixi/react";
import img from "../assets/vite.png";
import { InputHandlers } from "./useInputs";

interface PlayerProps {
  inputHandlers: InputHandlers;
}

function Player(props: PlayerProps) {
  // 位置
  const [position, setPosition] = useState(new Vector2(0, 0));
  // 速度
  const [velocity, setVelocity] = useState(new Vector2(0, 0));
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Initialize Player");
    props.inputHandlers.addInputDownHandler("a", () => {
      console.log("hi");
    });
    return () => {
      console.log("Unmount Player");
    };
  }, []);

  useTick((delta) => {
    setPosition(position.plus(new Vector2(1, 0)));
  });

  return <Sprite image={img} x={position.x} y={position.y} anchor={0.5} />;
}

export default Player;
