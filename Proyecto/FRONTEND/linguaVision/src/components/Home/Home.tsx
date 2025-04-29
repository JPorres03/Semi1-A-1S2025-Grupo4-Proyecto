import Files from "./Files/Files";
import Main from "./Main/Main";
import Navbar from "./Navbar/Navbar";
import { useState } from "react";

function Home() {
	const [content, setContent] = useState<React.ReactNode>(
		<Main />
	  );

	const handleNavClick = (option: string) => {
		switch (option) {
			case "upload":
				setContent(<Main />);
				break;
			case "files":
				setContent(<Files />);
				break;
			default:
				setContent(<Main />);
		}}

	return (
		<div className="d-flex flex-column">
			<Navbar onNavClick={handleNavClick}/>
            {content}
		</div>
	);
}

export default Home;