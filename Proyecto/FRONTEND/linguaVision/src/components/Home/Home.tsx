import Main from "./Main/Main";
import Navbar from "./Navbar/Navbar";
import { useState } from "react";
import Translate from "./Translate/Translate";
import Polly from "./Polly/Polly";
import Transcribe from "./Transcribe/Transcribe";


function Home() {


	const [content, setContent] = useState<React.ReactNode>(<Main />);

	const handleNavClick = (option: string) => {
		switch (option) {
			case "rekognition":
				setContent(<Main />);
				break;
			case "translate":
				setContent(<Translate />);
				break;
			case "polly":
				setContent(<Polly />);
				break;
			case "transcribe":
				setContent(<Transcribe />);
				break;
			default:
				setContent(<Main />);
		}
	};

	return (
		<div className="d-flex flex-column">
			<Navbar onNavClick={handleNavClick} />
			{content}
		</div>
	);
}

export default Home;
