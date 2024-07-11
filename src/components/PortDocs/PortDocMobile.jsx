import { documentFormat, formatPhone } from '../../services/util';
import moment from 'moment';

/* eslint-disable react/prop-types */
export const PortDocMobile = ({ client }) => {
  return (
    <>
      <div
        style={{
          width: '90%',
          backgroundColor: '#00D959',
          textAlign: 'center',
          // color: '#3d3d3d',
          padding: '0.5rem',
          margin: 'auto',
          borderRadius: '8px',
          marginTop: '0.2rem',
          position: 'relative',
        }}
      >
        <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
          {client?.DestinationClient?.Name}
        </h4>
        <h5>{client?.Msisdn && formatPhone(client.Msisdn)}</h5>
        <h5>ICCID: {client?.Iccid}</h5>
        <h5>
          Documento antigo:{' '}
          {client?.OriginalClient
            ? client?.OriginalClient?.Type === 'PF'
              ? documentFormat(client?.OriginalClient?.Cpf)
              : documentFormat(client?.OriginalClient?.Cnpj)
            : ''}
        </h5>
        <h5>
          Novo documento: {client.Document && documentFormat(client.Document)}
        </h5>
        <h5>
          Data solicitação:{' '}
          {client?.CreatedAt &&
            moment(client.CreatedAt).format('DD/MM/YYYY HH:mm')}
        </h5>
      </div>
    </>
  );
};
