import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import FiboPage from "./FiboPage";
import OtherPage from "./OtherPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FiboPage/>} />
        <Route path="/other" element={<OtherPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
