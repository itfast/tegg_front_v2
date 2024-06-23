/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import { Button } from "../../../../globalStyles";
import { CardData } from "../Resales.styles";
import moment from "moment";
import ReactLoading from "react-loading";
import {useEffect} from 'react'
import { useTranslation } from "react-i18next";
export const Review = ({
	type,
	company,
	user,
	bank,
	goBackStep,
	goStep,
	loading,
	citys,
	setService,
}) => {
	const {t} = useTranslation()
	const location = useLocation();
	// const [service, setService] = useState();
	useEffect(() => {
		const list = []
		citys.forEach(city => {
			if(city.complet){
				list.push(city.complet)
			}
			
		})
		setService(list);
	},[])
	return (
		<CardData style={{maxWidth: '1000px', margin: 'auto'}}>
			<h5>{t('Register.review.title')}</h5>
			{type === "EMPRESA" && (
				<CardData>
					<h3 className="review_title">{t('Register.review.company')}</h3>
					<div className="review_line">
						<div>
							<label>{t('Register.review.rz')}</label>
							<p>{company.rz}</p>
						</div>
					</div>
					<div className="review_line">
						<div>
							<label>{t('Register.review.cnpj')}</label>
							<p>{company.cnpj}</p>
						</div>
						<div>
							<label>{t('Register.review.ie')}</label>
							<p>{company.ie}</p>
						</div>
						<div>
							<label>{t('Register.review.im')}</label>
							<p>{company.im}</p>
						</div>
					</div>
					<div className="review_line">
						<div>
							<label>{t('Register.review.email')}</label>
							<p>{company.email}</p>
						</div>
						<div>
							<label>{t('Register.review.phone')}</label>
							<p>{company.phone}</p>
						</div>
					</div>
					<div className="review_line">
						<div>
							<label>{t('Register.review.address')}</label>
							<p>{company.address}</p>
						</div>
						<div>
							<label>{t('Register.review.postalCode')}</label>
							<p>{company.cep}</p>
						</div>
					</div>
					<div className="review_line">
						<div>
							<label>{t('Register.review.complement')}</label>
							<p>{company.complement}</p>
						</div>
						<div>
							<label>{t('Register.review.number')}</label>
							<p>{company.number}</p>
						</div>
					</div>
					<div className="review_line">
						<div>
							<label>{t('Register.review.neighborhood')}</label>
							<p>{company.district}</p>
						</div>
						<div>
							<label>{t('Register.review.city')}</label>
							<p>{company.city}</p>
						</div>
						<div>
							<label>{t('Register.review.uf')}</label>
							<p>{company.uf}</p>
						</div>
					</div>
				</CardData>
			)}

			<CardData>
				<h3 className="review_title">{t('Register.review.responsible')}</h3>
				<div className="review_line">
					<div>
						<label>{t('Register.review.name')}</label>
						<p>{user.name}</p>
					</div>
				</div>
				<div className="review_line">
					<div>
						<label>{t('Register.review.cpf')}</label>
						<p>{user.cpf}</p>
					</div>
					<div>
						<label>{t('Register.review.rg')}</label>
						<p>{user.rg}</p>
					</div>
					<div>
						<label>{t('Register.review.birthday')}</label>
						<p>{moment(user.date).format("DD/MM/YYYY")}</p>
					</div>
				</div>
				<div className="review_line">
					<div>
						<label>{t('Register.review.email')}</label>
						<p>{user.email}</p>
					</div>
					<div>
						<label>{t('Register.review.phone')}</label>
						<p>{user.phone}</p>
					</div>
				</div>
				<div className="review_line">
					<div>
						<label>{t('Register.review.address')}</label>
						<p>{user.address}</p>
					</div>
					<div>
						<label>{t('Register.review.postalCode')}</label>
						<p>{user.cep}</p>
					</div>
				</div>
				<div className="review_line">
					<div>
						<label>{t('Register.review.complement')}</label>
						<p>{user.complement}</p>
					</div>
					<div>
						<label>{t('Register.review.number')}</label>
						<p>{user.number}</p>
					</div>
				</div>

				<div className="review_line">
					<div>
						<label>{t('Register.review.neighborhood')}</label>
						<p>{user.district}</p>
					</div>
					<div>
						<label>{t('Register.review.city')}</label>
						<p>{user.city}</p>
					</div>
					<div>
						<label>{t('Register.review.state')}</label>
						<p>{user.uf}</p>
					</div>
				</div>
			</CardData>
			<CardData>
				<h3 className="review_title">{t('Register.review.bankData')}</h3>
				{bank.type === "PIX" && (
					<div className="review_line">
						<div>
							<label>{t('Register.review.paymentType')}</label>
							<p>Pix</p>
						</div>
						<div>
							<label>{t('Register.review.typeKey')}</label>
							<p>{bank.pixType}</p>
						</div>
						<div>
							<label>{t('Register.review.key')}</label>
							<p>{bank.pixKey}</p>
						</div>
					</div>
				)}
				{bank.type === "TRANSFER" && (
					<>
						<div className="review_line">
							<div>
								<label>{t('Register.review.paymentType')}</label>
								<p>{t('Register.review.transfer')}</p>
							</div>
							<div>
								<label>{t('Register.review.bank')}</label>
								<p>{bank.bankName}</p>
							</div>
							<div>
								<label>{t('Register.review.agency')}</label>
								<p>{bank.ag}</p>
							</div>
							<div>
								<label>{t('Register.review.agencyDigit')}</label>
								<p>{bank.agDigit}</p>
							</div>
							<div>
								<label>{t('Register.review.account')}</label>
								<p>{bank.account}</p>
							</div>
							<div>
								<label>{t('Register.review.accountDigit')}</label>
								<p>{bank.accountDigit}</p>
							</div>
							<div>
								<label>{t('Register.review.operation')}</label>
								<p>{bank.op}</p>
							</div>
						</div>
					</>
				)}
			</CardData>
			<div className="flex end btn_invert">
				<Button onClick={goBackStep} invert>
				{t('Register.review.goback')}
				</Button>
				<Button notHover onClick={goStep}>
					{loading ? (
						<div style={{ display: "flex", justifyContent: "center" }}>
							<ReactLoading type={"bars"} color={"#fff"} />
						</div>
					) : (location.pathname === "/salesforce/edit" || location.pathname === "/salesforce/edit/pj") ? (
						t('Register.review.update')
					) : (
						t('Register.review.register')
					)}
				</Button>
			</div>
		</CardData>
	);
};
