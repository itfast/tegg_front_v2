/* eslint-disable react/prop-types */
import ReactLoading from "react-loading";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "../../../globalStyles";

// eslint-disable-next-line react/prop-types
export const ModalMessage = ({
	showModal,
	setShowModal,
	title,
	message,
	action,
	loading,
}) => {
	return (
		<>
			<Dialog
				open={showModal}
				onClose={() => setShowModal(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{message}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button invert onClick={() => setShowModal(false)}>
						CANCELAR
					</Button>
					<Button notHover={loading} onClick={action} autoFocus>
						{loading ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: 15,
								}}>
								<ReactLoading type={"bars"} color={"#fff"} />
							</div>
						) : (
							"APAGAR"
						)}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
