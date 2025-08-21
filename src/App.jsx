import { useState } from "react";
import SnakeGame from "./components/SnakeGame";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return <SnakeGame />;
}

export default App;
