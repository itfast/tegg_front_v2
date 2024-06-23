/* eslint-disable react/prop-types */
import { Button } from "../../../globalStyles";
import { useState } from "react";
import { LuReceipt } from "react-icons/lu";
// import ReactLoading from 'react-loading';
// import './client_info.css';
import {
  translateError,
  translateStatus,
} from "../../services/util";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Tooltip } from "react-tooltip";
// import { useNavigate } from 'react-router-dom'
import { DialogContent, DialogContentText } from '@mui/material'
import moment from 'moment'
import { MdOutlineEmail } from 'react-icons/md'
import { InputData } from '../resales/Resales.styles'
import api from '../../services/api'
import { toast } from 'react-toastify'

const calcAmount = (payment) => {
  let price = 0.0;
  payment?.forEach((p) => {
    price += Number(p.Amount);
  });
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export const InvoicesTable = ({ order, setLoading, setMsg }) => {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState();
  // const [baseInf, setBaseInf] = useState()

  const sendEmail = () => {
    setMsg('Enviando email...')
    setLoading(true);
    api.order
      .resendEmail(order.Id, email)
      .then((res) => {
        toast.info(res.data?.Message);
        setModal(false);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const handleQrcode = () => {
    setMsg('Gerando fatura...')
    setLoading(true);
    api.order
      .pay(
        order.Id,
        'UNDEFINED',
        {
          number: '',
          expiry: '',
          cvc: '',
          name: '',
          focus: '',
        },
        {
          cep: '',
          address: '',
          complement: '',
          number: '',
          district: '',
          city: '',
          uf: '',
        },
        null
      )
      .then((res) => {
        console.log(res)
        window.open(res.data?.InvoiceUrl, '_black')
        toast.success(res.data?.Message);
      })
      .catch((err) => {
        console.log(err?.response);
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* <tbody> */}
      <tr>
        <td>
          <div>
            {moment(order?.CreatedAt).format('DD/MM/YYYY HH:mm')}
          </div>
        </td>
        <td>{order?.Payments[0]?.PaymentDate && moment(order?.Payments[0].PaymentDate).format('DD/MM/YYYY HH:mm')}</td>
        {/* <td>{client.Cnpj || client.Cpf}</td> */}
        <td>
        {order.Type === 0 ? 'Compra' : 'Recarga'}
        </td>
        <td>{calcAmount(order?.OrderItems)}</td>
        <td>{translateStatus(order.Status)}</td>
        <td>
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: 20,
              justifyContent: "center",
            }}
          >
            <Tooltip id="action-tooltip" />
            <LuReceipt
              size={20}
              data-tooltip-id="action-tooltip"
              data-tooltip-content="Recibo"
              data-tooltip-place="top"
              style={{ cursor: "pointer" }}
              onClick={() => {
                order?.Payments[0]?.InvoiceUrl ? window.open(order.Payments[0].InvoiceUrl, '_black') : handleQrcode()
              }}
            />
            <MdOutlineEmail
              // color="red"
              size={20}
              data-tooltip-id="action-tooltip"
              data-tooltip-content="Enviar cobrança"
              data-tooltip-place="top"
              cursor={(order?.Status === 'RECEIVED_IN_CASH' ||
              order?.Status === 'RECEIVED' ||
              order?.Status === 'CONFIRMED' ||
              order?.Status === 'PROCESSED') ? 'not-allowed' : 'pointer'}
              onClick={() => {
                if(order?.Status !== 'RECEIVED_IN_CASH' &&
                order?.Status !== 'RECEIVED' &&
                order?.Status !== 'CONFIRMED' &&
                order?.Status !== 'PROCESSED'){
                  setEmail(order?.FinalClient?.Email);
                  setModal(true)
                }
                
              }}
              // cursor={'no-drop'}
            />
          </div>
        </td>
      </tr>
      {/* REENVIO DE EMAIL */}
      <Dialog
        open={modal}
        onClose={() => {
          setModal(false);
        }}
        fullWidth
        size='md'
      >
        <DialogTitle id='alert-dialog-title'>Reenviar e-mail</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <InputData
              id='email'
              type='text'
              // disabled={searched}
              placeholder='Email'
              style={{ width: '100%' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setModal(false);
            }}
          >
            FECHAR
          </Button>
          <Button onClick={() => sendEmail()}>
              Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
