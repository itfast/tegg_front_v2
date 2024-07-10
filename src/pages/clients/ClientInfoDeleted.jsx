/* eslint-disable react/prop-types */
// import ReactLoading from 'react-loading';
import "./client_info.css";
import {
  documentFormat,
  formatPhone,
} from "../../services/util";
import moment from "moment";
import { useEffect } from 'react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

export const ClientInfoDeleted = ({ client }) => {
  const navigate = useNavigate()
  // const formatPhone = (str) => {
  //   if (str != undefined) {
  //     const fullNumber = str.toString();
  //     const country = fullNumber.slice(0, 2);
  //     const area = fullNumber.slice(2, 4);
  //     const number1 = fullNumber.slice(4, 9);
  //     const number2 = fullNumber.slice(9);
  //     // console.log(fullNumber, country, area, number1, number2);
  //     return `+${country} (${area}) ${number1}-${number2}`;
  //   }
  // };
console.log(client)
  useEffect(()=>{
    if(api.currentUser.Type !== 'TEGG'){
      navigate('/')
    }
  },[])

  return (
    <>
      <tr>
        {/* <td>{client?.Type && client?.Type === 'CLIENT' ? 'Cliente' : 'Revenda'}</td> */}
        <td>{client.Name}</td>
        <td>
          {(documentFormat(client.Document))}
        </td>
        <td>{client?.Iccid}</td>
        <td>{client?.SurfMsisdn && formatPhone(client?.SurfMsisdn)}</td>
        <td>{client?.SurfDtAtivacao && moment(client?.SurfDtAtivacao).format('DD/MM/YYYY')}</td>
        <td>{client?.DeletedAt && moment(client?.DeletedAt).format('DD/MM/YYYY')}</td>
      </tr>
    </>
  );
};
