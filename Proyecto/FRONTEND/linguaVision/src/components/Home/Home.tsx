import Main from "./Main/Main";
import Navbar from "./Navbar/Navbar";

function Home() {
	return (
		<div className="d-flex flex-column">
			<Navbar />
            <Main />
		</div>
	);
}

export default Home;