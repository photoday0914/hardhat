import { BrowserRouter, Route, Routes } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import Dapp from "./components/Dapp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Dapp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
