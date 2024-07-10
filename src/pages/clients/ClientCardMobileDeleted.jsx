import {
  documentFormat,
  formatPhone,
} from "../../services/util";
import moment from "moment";

/* eslint-disable react/prop-types */
export const ClientCardMobileDeleted = ({
  client,
}) => {
 

  return (
    <>
      <div
        style={{
          width: "90%",
          backgroundColor: "#00D959",
          textAlign: "center",
          // color: '#3d3d3d',
          padding: "0.5rem",
          margin: "auto",
          borderRadius: "8px",
          marginTop: "0.2rem",
          position: "relative",
        }}
      >
        <h4 style={{ padding: "0.2rem", fontWeight: "bold" }}>
          {client.Name}
        </h4>
        {/* <h5>{translateTypeClient(client?.Type)}</h5> */}
        <h5>
          {client.Document
            && documentFormat(client.Document)
           }
        </h5>
        <h5>ICCID: {client?.Iccid}</h5>
        <h5>{client?.SurfMsisdn && formatPhone(client.SurfMsisdn)}</h5>
        <h5>Data Criação: {client?.CreatedAt && moment(client.CreatedAt).format('DD/MM/YYYY')}</h5>
        <h5>Data Ativação: {client?.SurfDtAtivacao && moment(client.SurfDtAtivacao).format('DD/MM/YYYY')}</h5>
        <h5>Data Exclusão:{client?.DeletedAt && moment(client.DeletedAt).format('DD/MM/YYYY')}</h5>
      </div>
    </>
  );
};
