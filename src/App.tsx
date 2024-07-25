import "./App.css";
import React, { useState, useMemo } from "react";
import { useSpring, useSprings, animated } from "@react-spring/web";
import { BlurFilter, TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text } from "@pixi/react";

function App() {
  const blurFiler = useMemo(() => new BlurFilter(0.1));
  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";

  const positionList = [
    [300, 150],
    [500, 150],
    [400, 200],
  ];

  return (
    <div className="wrapper">
      <div className="container">
        <Stage width={640} height={480} options={{ background: 0x1099bb }}>
          {positionList.map((position) => (
            <Sprite
              image={bunnyUrl}
              x={position[0]}
              y={position[1]}
              filters={[blurFiler]}
            />
          ))}
          <Container x={200} y={200}>
            <Text
              text="Hello, world"
              anchor={0.5}
              x={220}
              y={150}
              filters={[]}
              style={
                new TextStyle({
                  align: "center",
                  fill: "0xffffff",
                  fontSize: 50,
                  letterSpacing: 2,
                  dropShadow: true,
                  dropShadowColor: "0xE72264",
                  dropShadowDistance: 6,
                })
              }
            ></Text>
          </Container>
        </Stage>
      </div>
    </div>
  );
}

export default App;
