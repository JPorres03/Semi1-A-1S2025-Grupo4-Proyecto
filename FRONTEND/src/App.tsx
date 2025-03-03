import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Startpage from "./components/Startpage/Startpage";
import Details from "./components/Startpage/Books/Details/Details";
import data from '../MOCK_DATA.json'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Startpage data={data}/>} />
        <Route path="/details/:id" element={<Details data={data}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;