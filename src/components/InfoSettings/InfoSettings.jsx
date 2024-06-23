import moment from "moment";
import {
  cnpjBancFormat,
  cpfBancFormat,
  phoneFormat,
} from "../../services/util";
import "./InfoSettings.css";

/* eslint-disable react/prop-types */
export const InfoSettings = ({ nfeInfo }) => {
  return (
    <>
      <div className="header_container">
        {nfeInfo?.CNPJ !== null ? (
          <div className="column-100">
            {/* <div className="header_title">
							<p style={{ fontWeight: "bold" }}>{nfeInfo?.CompanyName}</p>
						</div> */}
            <div>
              <p style={{ fontWeight: "bold" }}>DADOS</p>
              <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.Name}</p>
            </div>
            <div className="header_content">
              <div style={{ wordBreak: "break-all" }}>
                <label style={{ fontWeight: "bold" }}>CNPJ</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.CNPJ && cnpjBancFormat(nfeInfo?.CNPJ)}</p>
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <label style={{ fontWeight: "bold" }}>IE</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.IE}</p>
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <label style={{ fontWeight: "bold" }}>IM</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.IM}</p>
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <label style={{ fontWeight: "bold" }}>CNAE</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.CNAE}</p>
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <label style={{ fontWeight: "bold" }}>CRT</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.CRT && nfeInfo.CRT}</p>
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <label style={{ fontWeight: "bold" }}>SÉRIE</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.NFeGroup}</p>
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <label style={{ fontWeight: "bold" }}>NÚMERO NF</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.NFeNumber}</p>
              </div>
              <div style={{ wordBreak: "break-all" }}>
                <label style={{ fontWeight: "bold" }}>CHAVE MIGRATE</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.PartnerKeyMigrate}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>CHAVE COMUNICAÇÃO</label>
                <p style={{wordWrap: 'anywhere'}}>{nfeInfo?.CommunicationKeyMigrate}</p>
              </div>
              {/* <div>
                <label>DATA CADASTRO</label>
                <p>
                  {nfeInfo?.CreatedAt &&
                    moment(nfeInfo?.CreatedAt).format('DD/MM/YYYY')}
                </p>
              </div> */}
            </div>
            <br />
            {/* <div className="header_address">
							<p>{`${nfeInfo?.CompanyStreetName}, 
              ${nfeInfo?.CompanyNumber},
               ${nfeInfo?.CompanyDistrict} - 
               ${nfeInfo?.CompanyCity} - 
               ${nfeInfo?.CompanyState} -
               CEP ${nfeInfo?.CompanyPostalCode}`}</p>
							{nfeInfo?.ComanyComplement && (
								<p>{`Complemento: ${nfeInfo?.CompanyComplement}`}</p>
							)}
						</div> */}
            <br />
            <br />
            <div>
              <p style={{ fontWeight: "bold" }}>ENDEREÇO</p>
            </div>
            <div className="header_content">
              <div>
                <label style={{ fontWeight: "bold" }}>LOGRADOURO</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.Address}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>NÚMERO</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.AddressNumber}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>BAIRRO</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.District}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>CIDADE</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.City}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>ESTADO</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.UF}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>CEP</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.CEP}</p>
              </div>
            </div>
            <br />
            <div
              style={{ display: "flex", width: "100%", justifyContent: "end" }}
            >
              <div>
                <label style={{ fontWeight: "bold" }}>DATA ATUALIZAÇÃO</label>
                <p>
                  {nfeInfo?.CreatedAt &&
                    moment(nfeInfo?.CreatUPDATEATedAt).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="column-100">
            <div className="header_title">
              <p>{nfeInfo?.Name}</p>
            </div>
            <div className="header_content">
              <div>
                <label style={{ fontWeight: "bold" }}>CPF</label>
                <p style={{ wordWrap: 'anywhere' }}>{cpfBancFormat(nfeInfo?.Cpf)}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>RG</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.Rg}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>Telefone</label>
                <p style={{ wordWrap: 'anywhere' }}>{nfeInfo?.Mobile && phoneFormat(nfeInfo.Mobile)}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>DATA CADASTRO</label>
                <p style={{ wordWrap: 'anywhere' }}>
                  {nfeInfo?.CreatedAt &&
                    moment(nfeInfo?.CreatedAt).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
            <br />
            <div className="header_address">
              <p style={{ wordWrap: 'anywhere' }}>{`${nfeInfo?.StreetName}, 
              ${nfeInfo?.Number},
               ${nfeInfo?.District} - 
               ${nfeInfo?.City} - 
               ${nfeInfo?.State} -
               CEP ${nfeInfo?.PostalCode}`}</p>
              {nfeInfo?.Complement && (
                <p>{`Complemento: ${nfeInfo?.Complement}`}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
