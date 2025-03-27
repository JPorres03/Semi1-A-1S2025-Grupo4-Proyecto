import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import Home from "./components/main/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
