import "./App.css";
import { TextStyle } from "pixi.js";
import { Stage, Container, Text } from "@pixi/react";
import useInput from "./components/useInput";
import Player from "./components/Player";
import { useRef } from "react";

function App() {
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const inputHandler = useInput(
    [
      "w",
      "a",
      "s",
      "d",
      "ArrowUp",
      "ArrowLeft",
      "ArrowDown",
      "ArrowRight",
      "Escape",
      "Tab",
      "Space",
    ],
    [0]
  );

  return (
    <div className="app">
      <header className="header">
        <h1>dev</h1>
      </header>
      <main className="main">
        <div className="ui-container">
          <div className="side-bar">
            <p>Hello, world.</p>
            <span>My life is going.</span>
            <br />
            <button>???</button>
            <button>!!!</button>
          </div>
        </div>
        <Stage
          className="stage"
          width={640}
          height={480}
          options={{ background: "#222222" }}
          ref={stageRef}
        >
          <Container x={0} y={0} ref={containerRef}>
            <Text
              text={`${inputHandler.getMousePosiotion().x}`}
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
            <Player inputHandler={inputHandler} />
          </Container>
        </Stage>
      </main>
    </div>
  );
}

export default App;
