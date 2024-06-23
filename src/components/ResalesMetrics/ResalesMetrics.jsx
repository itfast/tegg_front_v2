/* eslint-disable react/prop-types */
import { FaSimCard } from "react-icons/fa";
import ReactLoading from "react-loading";
import { BsFillTelephoneFill } from "react-icons/bs";
import api from "../../services/api";
import { useTranslation } from "react-i18next";

export const ResalesMetrics = ({
	iccidInfo,
	iccidLoading,
	lines,
	loadingLines,
}) => {
	const {t} = useTranslation()
	return (
		<div className="card_container">
			<div className="card">
				<div className="card_title">
					<h4>{t('Metrics.lines')}</h4>
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
							api.currentUser.AccessTypes[0] === "CLIENT" ? t('Metrics.my') : t('Metrics.total')
						} ${t('Metrics.linesActives')}`}</h5>
					</div>
				</div>
			</div>
			<div className="card">
				<div className="card_title">
					<h4>{t('Metrics.totalIccids')}</h4>
				</div>
				<div className="card_content_box">
					<div className="card_icon">
						<FaSimCard size={50} color="#00D959" />
					</div>
					<hr />
					<div className="card_content">
						{!iccidLoading ? (
							<h1>{iccidInfo.total}</h1>
						) : (
							<div className="loading">
								<ReactLoading type={"bars"} color={"#000"} />
							</div>
						)}
						<h5>{t('Metrics.totalRegistered')}</h5>
					</div>
				</div>
			</div>
			<div className="card">
				<div className="card_title">
					<h4>{t('Metrics.iccidsActives')}</h4>
				</div>
				<div className="card_content_box">
					<div className="card_icon">
						<FaSimCard size={50} color="#00D959" />
					</div>
					<hr />
					<div className="card_content">
						{!iccidLoading ? (
							<h1>{iccidInfo.Active}</h1>
						) : (
							<div className="loading">
								<ReactLoading type={"bars"} color={"#000"} />
							</div>
						)}
						<h5>{t('Metrics.numbersSales')}</h5>
					</div>
				</div>
			</div>
			<div className="card">
				<div className="card_title">
					<h4>{t('Metrics.iccidsFrees')}</h4>
				</div>

				<div className="card_content_box">
					<div className="card_icon">
						<FaSimCard size={50} color="#00D959" />
					</div>
					<hr />
					<div className="card_content">
						{!iccidLoading ? (
							<h1>{iccidInfo.Available}</h1>
						) : (
							<div className="loading">
								<ReactLoading type={"bars"} color={"#000"} />
							</div>
						)}
						<h5>{t('Metrics.numbersNotSales')}</h5>
					</div>
				</div>
			</div>
		</div>
	);
};
