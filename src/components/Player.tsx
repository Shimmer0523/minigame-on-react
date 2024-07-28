import { useEffect, useState } from "react";
import Vector2 from "./Vector2";
import { Sprite, useTick } from "@pixi/react";
import img from "../assets/vite.png";
import { InputHandler } from "./useInput";

interface PlayerProps {
  inputHandler: InputHandler;
}

function Player({ inputHandler }: PlayerProps) {
  // 位置
  const [position, setPosition] = useState(new Vector2(0, 0));
  // 速度
  const [velocity, setVelocity] = useState(new Vector2(0, 0));
  const [speed, setSpeed] = useState(640 / 10 / 60);

  useEffect(() => {
    console.log("Initialize Player");

    return () => {
      console.log("Unmount Player");
    };
  }, []);

  useTick((delta) => {
    const vel = new Vector2(0, 0);
    const mousePosition = inputHandler.getMousePosiotion();
    setPosition(mousePosition);
  });

  return <Sprite image={img} x={position.x} y={position.y} anchor={0.5} />;
}

export default Player;
