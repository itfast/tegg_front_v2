import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "styled-components";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import 'dayjs/locale/pt-br';
// import pt from 'date-fns/locale/pt-BR';
import 'react-tooltip/dist/react-tooltip.css'
import theme from "./themes";
import { ptBR } from "date-fns/locale";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
				<ThemeProvider theme={theme["light"]}>
					<ToastContainer />
					<Router />
				</ThemeProvider>
			</LocalizationProvider>
		</BrowserRouter>
	);
}

export default App;
