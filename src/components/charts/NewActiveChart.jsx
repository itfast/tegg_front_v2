/* eslint-disable react/prop-types */
import { useResizeDetector } from "react-resize-detector";
import { BsFillTelephoneFill } from "react-icons/bs";
import "./active_chart.css";
import api from "../../services/api";
import ReactLoading from "react-loading";

export const NewActiveChart = ({ lines, loadingLines }) => {
	return (
		<div className="card_container">
			<div className="card">
				<div className="card_title">
					<h4>LINHAS</h4>
				</div>
				<div className="card_content_box">
					<div className="card_icon">
						<BsFillTelephoneFill size={50} color="#00D959" />
					</div>
					<hr />
					<div className="card_content">
						{!loadingLines ? (
							<h1>{lines}</h1>
						) : (
							<div className="loading">
								<ReactLoading type={"bars"} color={"#000"} />
							</div>
						)}
						<h5>{`${
							api.currentUser.AccessTypes[0] === "CLIENT" ? "Minhas" : "Total"
						} linhas ativas`}</h5>
						{/* <hr style={{ width: '50%' }} /> */}
					</div>
				</div>
			</div>
		</div>
	);
};
