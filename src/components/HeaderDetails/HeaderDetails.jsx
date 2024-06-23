import moment from "moment";
import { useEffect } from "react";
import {
	cnpjBancFormat,
	cpfBancFormat,
	phoneFormat,
} from "../../services/util";
import "./header_details.css";

/* eslint-disable react/prop-types */
export const HeaderDetails = ({ dealerDetails }) => {
	useEffect(() => {
		// console.log(dealerDetails);
	}, []);

	return (
		<>
			<div className="header_container">
				{dealerDetails?.Cnpj !== null ? (
					<div className="column-100">
						<div className="header_title">
							<p style={{ fontWeight: "bold" }}>{dealerDetails?.CompanyName}</p>
						</div>
						<div className="header_content">
							<div>
								<label style={{ fontWeight: "bold" }}>CNPJ</label>
								<p>
									{dealerDetails?.Cnpj && cnpjBancFormat(dealerDetails?.Cnpj)}
								</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>IE</label>
								<p>{dealerDetails?.Ie}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>IM</label>
								<p>{dealerDetails?.Im}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>E-mail</label>
								<p>{dealerDetails?.CompanyEmail}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>Telefone</label>
								<p>
									{dealerDetails?.CompanyMobile &&
										phoneFormat(dealerDetails.CompanyMobile)}
								</p>
							</div>
							{/* <div>
                <label>DATA CADASTRO</label>
                <p>
                  {dealerDetails?.CreatedAt &&
                    moment(dealerDetails?.CreatedAt).format('DD/MM/YYYY')}
                </p>
              </div> */}
						</div>
						<br />
						<div className="header_address">
							<p>{`${dealerDetails?.CompanyStreetName}, 
              ${dealerDetails?.CompanyNumber},
               ${dealerDetails?.CompanyDistrict} - 
               ${dealerDetails?.CompanyCity} - 
               ${dealerDetails?.CompanyState} -
               CEP ${dealerDetails?.CompanyPostalCode}`}</p>
							{dealerDetails?.ComanyComplement && (
								<p>{`Complemento: ${dealerDetails?.CompanyComplement}`}</p>
							)}
						</div>
						<br />
						<br />
						<div className="header_content">
							<div>
								<p style={{ fontWeight: "bold" }}>RESPONSÁVEL</p>
								<p>{dealerDetails?.Name}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>CPF</label>
								<p>{dealerDetails?.Cpf && cpfBancFormat(dealerDetails?.Cpf)}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>RG</label>
								<p>{dealerDetails?.Rg}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>E-MAIL</label>
								<p>{dealerDetails?.Email}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>Telefone</label>
								<p>
									{dealerDetails?.Mobile && phoneFormat(dealerDetails.Mobile)}
								</p>
							</div>
						</div>
						<br />
						<div className="header_address">
							<p>{`${dealerDetails?.StreetName}, 
              ${dealerDetails?.Number},
               ${dealerDetails?.District} - 
               ${dealerDetails?.City} - 
               ${dealerDetails?.State} -
               CEP ${dealerDetails?.PostalCode}`}</p>
							{dealerDetails?.Complement && (
								<p>{`Complemento: ${dealerDetails?.Complement}`}</p>
							)}
						</div>
						<div
							style={{ display: "flex", width: "100%", justifyContent: "end" }}>
							<div>
								<label style={{ fontWeight: "bold" }}>DATA CADASTRO</label>
								<p>
									{dealerDetails?.CreatedAt &&
										moment(dealerDetails?.CreatedAt).format("DD/MM/YYYY")}
								</p>
							</div>
						</div>
					</div>
				) : (
					<div className="column-100">
						<div className="header_title">
							<p>{dealerDetails?.Name}</p>
						</div>
						<div className="header_content">
							<div>
								<label style={{ fontWeight: "bold" }}>CPF</label>
								<p>{cpfBancFormat(dealerDetails?.Cpf)}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>RG</label>
								<p>{dealerDetails?.Rg}</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>Telefone</label>
								<p>
									{dealerDetails?.Mobile && phoneFormat(dealerDetails.Mobile)}
								</p>
							</div>
							<div>
								<label style={{ fontWeight: "bold" }}>DATA CADASTRO</label>
								<p>
									{dealerDetails?.CreatedAt &&
										moment(dealerDetails?.CreatedAt).format("DD/MM/YYYY")}
								</p>
							</div>
						</div>
						<br />
						<div className="header_address">
							<p>{`${dealerDetails?.StreetName}, 
              ${dealerDetails?.Number},
               ${dealerDetails?.District} - 
               ${dealerDetails?.City} - 
               ${dealerDetails?.State} -
               CEP ${dealerDetails?.PostalCode}`}</p>
							{dealerDetails?.Complement && (
								<p>{`Complemento: ${dealerDetails?.Complement}`}</p>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
};
