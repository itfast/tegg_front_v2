import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { IoMdMore } from 'react-icons/io';
import { useState } from 'react';
import {
  translateError,
  translateStatus,
  translateValue,
} from '../../services/util';
import moment from 'moment';
import ReactLoading from 'react-loading';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Button } from '../../../globalStyles';

/* eslint-disable react/prop-types */
export const StatementMobile = ({ statement, returnClient, search }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [modalReceive, setModalReceive] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalRefund, setModalRefund] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const receive = () => {
    setLoading(true);
    api.order
      .paymentMoney(statement.Id, statement.Amount)
      .then((res) => {
        toast.success(res.data.Message);
        setModalReceive(false);
        search();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteAction = () => {
    setLoading(true);
    api.order
      .deletePayment(statement.Id)
      .then((res) => {
        toast.success(res.data.Message);
        setModalDelete(false);
        search();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refundAction = () => {
    setLoading(true);
    api.order
      .refundPayment(statement.Id)
      .then((res) => {
        toast.success(res.data.Message);
        setModalRefund(false);
        search();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '16px',
          }}
        >
          {/* <MdSignalWifiStatusbarNotConnected
            style={{ color: 'red' }}
            size={25}
            onClick={() => getStatus(i)}
          /> */}
          <IconButton
            aria-label='more'
            id='long-button'
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup='true'
            onClick={handleClick}
          >
            <IoMdMore />
          </IconButton>
        </div>
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
          }}
        >
          {/* <Checkbox
            // checked={checkedArray[index]}
            onChange={(e) => {
              handleCheck(e, i);
            }}
          /> */}
        </div>
        <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
          {translateValue(statement?.Amount)}
        </h4>
        <h5>
          Criado: {moment(statement?.CreatedAt).format('DD/MM/YYYY HH:mm')}
        </h5>
        <h5>Vencimento: {moment(statement?.DueDate).format('DD/MM/YYYY')}</h5>
        <h5>
          Pago em:{' '}
          {statement?.PaymentDate &&
            statement?.PaymentDate !== '' &&
            moment(statement?.PaymentDate).format('DD/MM/YYYY')}
        </h5>
        <h5>
          {statement.BillingType === 'PIX'
            ? 'PIX'
            : statement.BillingType === 'BOLETO'
            ? 'BOLETO'
            : 'CARTÃO DE CRÉDITO'}
        </h5>
        <h5>{translateStatus(statement.Status)}</h5>
        <h5>
          {' '}
          {statement.EstimatedCreditDate &&
            moment(statement.EstimatedCreditDate).format('DD/MM/YYYY')}
        </h5>
        <h5>{returnClient(statement.Order)}</h5>
        {/* <h4>{translateChipStatus(i.Status)}</h4> */}
      </div>

      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          disabled={
            statement?.Status === 'CONFIRMED' ||
            statement?.Status === 'RECEIVED' ||
            statement?.Status === 'RECEIVED_IN_CASH'
          }
          onClick={() => {
            setAnchorEl(null);
            setModalReceive(true);
          }}
        >
          Receber em dinheiro
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setModalDelete(true);
          }}
        >
          Deletar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setModalRefund(true);
          }}
        >
          Estornar
        </MenuItem>
        {statement?.BillingType === 'BOLETO' && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              window.open(statement?.BankSlipUrl, '_black');
            }}
          >
            Boleto
          </MenuItem>
        )}
        <MenuItem
          disabled={!statement?.ReceiptFileUrl}
          onClick={() => {
            setAnchorEl(null);
            window.open(
              `https://teggtelecom.com/apihomolog/payment/files/${statement?.ReceiptFileUrl}`,
              '_black'
            );
          }}
        >
          Comprovante
        </MenuItem>
      </Menu>

      {/* RECEBER DINHEIRO */}
      <Dialog
        open={modalReceive}
        onClose={() => setModalReceive(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Recebimento</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Ao confirmar um recebimento em dinheiro de uma cobrança que possua
            uma negativação em andamento uma taxa de ativação de serviço de
            negativação poderá ser cobrada. Deseja prosseguir?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalReceive(false)}>
            CANCELAR
          </Button>
          <Button notHover={loading} onClick={receive} autoFocus>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 15,
                }}
              >
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : (
              'RECEBER'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETAR */}
      <Dialog
        open={modalDelete}
        onClose={() => setModalDelete(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Deletar</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja realmente excluir a cobrança (ASAAS) do cliente{' '}
            {statement &&
              returnClient(statement?.Order || statement?.PurchaseOrder)}{' '}
            no valor de {translateValue(statement?.Amount)}? Esta ação não
            podera ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalDelete(false)}>
            CANCELAR
          </Button>
          <Button
            notHover={loading}
            onClick={deleteAction}
            autoFocus
            style={{ backgroundColor: 'red' }}
          >
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 15,
                }}
              >
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : (
              'DELETAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ESTORNO */}
      <Dialog
        open={modalRefund}
        onClose={() => setModalRefund(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Estornar</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <div
              style={{
                border: '1px dashed red',
                padding: '0.5rem',
                textAlign: 'justify',
              }}
            >
              As taxas referentes à cobrança como a de compensação e de
              notificação não são devolvidas em caso de estorno. Portanto, caso
              você tenha acabado de receber uma cobrança em Pix e tente estornar
              o valor total, retornará erro e será necessário aumentar o próprio
              saldo para conseguir o estorno total.
            </div>{' '}
            <br />
            O estorno implicara também em remover o credito colocado na linha do
            cliente, caso esse pagamento seja referente a uma recarga.
            <br /> <br /> Deseja realemente estornar o pagamento do cliente{' '}
            {statement &&
              returnClient(statement?.Order || statement?.PurchaseOrder)}{' '}
            no valor de {translateValue(statement?.Amount)}? Esta ação não
            podera ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalRefund(false)}>
            CANCELAR
          </Button>
          <Button
            notHover={loading}
            onClick={refundAction}
            autoFocus
            style={{ backgroundColor: 'red' }}
          >
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 15,
                }}
              >
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : (
              'ESTORNAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
