import "./App.css";
import { TextStyle } from "pixi.js";
import { Stage, Container, Text } from "@pixi/react";
import useInputs from "./components/useInputs";
import Player from "./components/Player";

function App() {
  const inputHandlers = useInputs([
    "Escape",
    "w",
    "a",
    "s",
    "d",
    "Tab",
    "Space",
  ]);

  return (
    <div className="wrapper">
      <div className="container">
        <Stage width={640} height={480} options={{ background: "#222222" }}>
          <Container x={0} y={0}>
            <Text
              text={
                inputHandlers.getInputState("a").toString() +
                Math.random().toString()
              }
              anchor={0}
              x={0}
              y={0}
              filters={[]}
              style={
                new TextStyle({
                  align: "center",
                  fill: "#fff235",
                  fontSize: 50,
                  letterSpacing: 2,
                  dropShadow: true,
                  dropShadowColor: "0xE72264",
                  dropShadowDistance: 6,
                })
              }
            ></Text>
            <Player inputHandlers={inputHandlers} />
          </Container>
        </Stage>
      </div>
    </div>
  );
}

export default App;
