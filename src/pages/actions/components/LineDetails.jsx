/* eslint-disable react/prop-types */
import { DialogContent, DialogContentText } from '@mui/material'
import { documentFormat, formatBalance, formatDate, phoneFormat, translateStatus } from '../../../services/util'

export const LineDetails = ({line, statusInfo}) => {
  return(
    <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "50%" }}>
                <h4>Nome</h4>
                <h4>{line?.FinalClient?.Name}</h4>
              </div>
              <div style={{ width: "50%", textAlign: "end" }}>
                <h4>Linha</h4>
                <h4>{phoneFormat(line?.IccidHistoric[0]?.SurfMsisdn)}</h4>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <hr />
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "50%" }}>
                <h4>CPF/CNPJ</h4>
                <h4>
                  {(line?.FinalClient?.Type === "PJ" &&
                    documentFormat(line?.FinalClient?.Cnpj)) ||
                    documentFormat(line?.FinalClient?.Cpf)}
                </h4>
              </div>
              <div style={{ width: "50%", textAlign: "end" }}>
                <h4>ICCID</h4>
                <h4>{line.Iccid}</h4>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <hr />
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "50%" }}>
                <h4>Operadora</h4>
                <h4>TEGG</h4>
              </div>
              <div style={{ width: "50%", textAlign: "end" }}>
                <h4>Portabilidade</h4>
                <h4>{(statusInfo?.stPortin && statusInfo?.stPortin === 1) ? 'Portabilidade socilitada' : 'Não'}</h4>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <hr />
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "50%" }}>
                <h4>Status do plano</h4>
                <h4>{translateStatus(statusInfo?.status)}</h4>
              </div>
              <div style={{ width: "50%", textAlign: "end" }}>
                <h4>Plano</h4>
                <h4>{statusInfo?.noPlano}</h4>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <hr />
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "50%" }}>
                <h4>Ativação da linha</h4>
                <h4>{formatDate(statusInfo?.dtAtivacao)}</h4>
              </div>
              <div style={{ width: "50%", textAlign: "end" }}>
                <h4>Vencimento do plano</h4>
                <h4>{formatDate(statusInfo?.dtPlanoExpira)}</h4>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <hr />
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "50%" }}>
                <h4>Dados</h4>
                <h4>{formatBalance(statusInfo?.qtDadoRestante)} GB</h4>
              </div>
              <div style={{ width: "50%", textAlign: "end" }}>
                <h4>Minutos</h4>
                <h4>{statusInfo?.qtMinutoRestante}</h4>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <hr />
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div style={{ width: "50%" }}>
                <h4>SMS</h4>
                <h4>{statusInfo?.qtSmsRestante}</h4>
              </div>
              <div style={{ width: "50%", textAlign: "end" }}>
                <h4>Revenda</h4>
                <h4>
                  {" "}
                  {line?.DealerId
                    ? line?.Dealer?.CompanyName !== "" &&
                      line?.Dealer?.CompanyName !== null
                      ? line?.Dealer?.CompanyName
                      : line?.Dealer?.Name
                    : "TEGG"}
                </h4>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
  )
}