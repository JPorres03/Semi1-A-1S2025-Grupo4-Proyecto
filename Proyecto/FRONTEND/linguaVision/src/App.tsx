import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
