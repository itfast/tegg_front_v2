/* eslint-disable react/prop-types */
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const outerTheme = createTheme({
	palette: {
		primary: {
			main: "#00D959",
		},
	},
});

export const CustomPagination = ({ total, setPage, page, itens, setItens }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (e) => {
		setItens(e);
		setAnchorEl(null);
	};
	const handleChange = (event, value) => {
		setPage(value);
	};

	return (
		<ThemeProvider theme={outerTheme}>
			<Stack spacing={2} style={{ display: "flex" }}>
				<div style={{ display: "flex", flexDirection: "row" }}>
					{/* <div> */}
					<Button
						id="basic-button"
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={handleClick}>
						{itens} por página
					</Button>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}>
						<MenuItem onClick={() => handleClose(10)}>10</MenuItem>
						<MenuItem onClick={() => handleClose(25)}>25</MenuItem>
						<MenuItem onClick={() => handleClose(50)}>50</MenuItem>
						<MenuItem onClick={() => handleClose(100)}>100</MenuItem>
					</Menu>
					{/* </div> */}
					<Pagination
						count={total}
						page={page}
						color="primary"
						variant="outlined"
						onChange={handleChange}
					/>
				</div>
			</Stack>
		</ThemeProvider>
	);
};
