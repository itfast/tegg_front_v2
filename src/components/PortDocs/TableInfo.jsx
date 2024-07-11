/* eslint-disable react/prop-types */
// import ReactLoading from 'react-loading';
// import "./client_info.css";
import {
  documentFormat,
  formatPhone,
} from "../../services/util";
import moment from "moment";
import { useEffect } from 'react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

export const TableInfo = ({ client }) => {
  const navigate = useNavigate()
  useEffect(()=>{
    if(api.currentUser.Type !== 'TEGG'){
      navigate('/')
    }
  },[])

  console.log(client)
  return (
    <>
      <tr>
        {/* <td>{client?.Type && client?.Type === 'CLIENT' ? 'Cliente' : 'Revenda'}</td> */}
        <td>{client?.DestinationClient?.Name}</td>
        <td>{client?.Msisdn && formatPhone(client?.Msisdn)}</td>
        <td>{client?.Iccid}</td>
        <td>
          {client?.OriginalClient ? client?.OriginalClient?.Type === 'PF' ? documentFormat(client?.OriginalClient?.Cpf) : documentFormat(client?.OriginalClient?.Cnpj) : ''}
        </td>
        <td>{documentFormat(client?.Document)}</td>
        <td>{client?.CreatedAt && moment(client?.CreatedAt).format('DD/MM/YYYY HH:mm')}</td>
      </tr>
    </>
  );
};
