import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ApiProvider } from "./contexts/ApiProvider.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<ApiProvider>
				<App />
			</ApiProvider>
		</StrictMode>,
	);
} else {
	console.error("Root element not found");
}
