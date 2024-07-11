/* eslint-disable react/prop-types */
import { Button } from '../../../globalStyles';
import { useState } from 'react';
import api from '../../services/api';
import { MdOutlineAttachMoney, MdOutlineVisibility } from 'react-icons/md';
import { BsTelephonePlusFill } from 'react-icons/bs';
import { TbStatusChange } from 'react-icons/tb';
// import ReactLoading from 'react-loading';
// import './client_info.css';
import {
  documentFormat,
  phoneFormat,
  translateChipStatus,
  translateError,
  translateTypeClient,
} from '../../services/util';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {
  FaChartPie,
  FaExchangeAlt,
  FaRegRegistered,
  FaRegTrashAlt,
  FaRegIdCard,
} from 'react-icons/fa';
import { AiFillEdit, AiTwotoneContainer } from 'react-icons/ai';
import { Tooltip } from 'react-tooltip';
import { LineDetails } from './components/LineDetails';
import { useNavigate } from 'react-router-dom';
import { DialogContent, DialogContentText } from '@mui/material';
import { toast } from 'react-toastify';
// import { Loading } from "../../components/loading/Loading";

export const ActionsTable = ({ line, setLoading, setMsg }) => {
  const navigate = useNavigate();
  // const [showModal, setShowModal] = useState(false);
  const [statusInfo, setStatusInfo] = useState();
  const [modalInfo, setModalInfo] = useState(false);
  const [modalExclud, setModalExclud] = useState(false);
  // const [loading, setLoading] = useState(true)
  // const [baseInf, setBaseInf] = useState()

  const handleDetails = () => {
    setMsg('Buscando detalhes...');
    setLoading(true);
    const status = api.iccid.surfStatus(line.Iccid, 'status');
    const service = api.iccid.surfStatus(line.Iccid, 'service');
    const balance = api.iccid.getBalance(line.Iccid);

    Promise.all([status, service, balance])
      .then((valores) => {
        setStatusInfo({
          ...valores[0]?.data?.retStatus?.resultado,
          ...valores[1]?.data?.retStatus?.resultado,
          ...valores[2]?.data?.resultado,
        });
        setModalInfo(true);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    setMsg('Cancelando...');
    setLoading(true);
    api.iccid
      .cancel(line?.Iccid)
      .then((res) => {
        toast.success(res?.data?.Message);
        setModalExclud(false);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {/* <tbody> */}
      <tr>
        <td>
          <div>
            {line?.DealerId
              ? line?.Dealer?.CompanyName !== '' &&
                line?.Dealer?.CompanyName !== null
                ? line?.Dealer?.CompanyName
                : line?.Dealer?.Name
              : 'TEGG'}
          </div>
        </td>
        <td>
          {' '}
          <div
            style={{
              display: 'flex',
              width: '100%',
              gap: 10,
              justifyContent: 'space-between',
            }}
          >
            {line?.FinalClient?.Name}
            <div style={{ display: 'flex', gap: 10 }}>
              <AiFillEdit
                size={20}
                data-tooltip-id='action-tooltip'
                data-tooltip-content='Editar usuário'
                data-tooltip-place='top'
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate('/clients/edit', {
                    state: { clients: line?.FinalClient, path: 'actions' },
                  })
                }
              />
              {/* {api.currentUser?.Type === "TEGG" && ( */}
              <BsTelephonePlusFill
                size={20}
                data-tooltip-id='action-tooltip'
                data-tooltip-content='Ativar linha'
                data-tooltip-place='top'
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate('/activation/manual', {
                    state: {
                      document:
                        line?.FinalClient?.Cpf || line?.FinalClient?.Cnpj,
                      line,
                    },
                  })
                }
              />
              {/* // )} */}
            </div>
          </div>
        </td>
        <td>
          {line?.FinalClient?.User?.Type &&
            translateTypeClient(line?.FinalClient?.User?.Type)}
        </td>
        <td>
          {(line?.FinalClient?.Type === 'PJ' &&
            documentFormat(line?.FinalClient?.Cnpj)) ||
            documentFormat(line?.FinalClient?.Cpf)}
        </td>
        <td>{line.Iccid}</td>
        <td>
          {line?.IccidHistoric[0]?.SurfMsisdn &&
            phoneFormat(line?.IccidHistoric[0]?.SurfMsisdn.replace('55', ''))}
        </td>
        <td>{line?.Status && translateChipStatus(line?.Status)}</td>
        <td>
          {console.log(line?.Status)}
          <div
            style={{
              display: 'flex',
              width: '100%',
              gap: 10,
              justifyContent: 'space-between',
              // pointerEvents: line?.Status === "INVALID" && "none",
            }}
          >
            <Tooltip id='action-tooltip' />
            <MdOutlineVisibility
              size={20}
              data-tooltip-id='action-tooltip'
              data-tooltip-content={
                line?.Status === 'INVALID' ? 'Iccid inválido' : 'Detalhes'
              }
              data-tooltip-place='top'
              style={{
                cursor: line?.Status === 'INVALID' ? 'not-allowed' : 'pointer',
              }}
              onClick={() => line?.Status !== 'INVALID' && handleDetails()}
            />
            <FaChartPie
              size={20}
              data-tooltip-id='action-tooltip'
              data-tooltip-content={
                line?.Status === 'INVALID' ? 'Iccid inválido' : 'Consumo'
              }
              data-tooltip-place='top'
              style={{
                cursor: line?.Status === 'INVALID' ? 'not-allowed' : 'pointer',
              }}
              onClick={() => {
                line?.Status !== 'INVALID' &&
                  navigate('/actions/consum', {
                    state: {
                      line: line?.IccidHistoric[0]?.SurfMsisdn,
                      plan: line?.IccidHistoric[0]?.SurfNuPlano,
                    },
                  });
              }}
            />
            <AiTwotoneContainer
              data-tooltip-id='action-tooltip'
              data-tooltip-content={
                line?.Status === 'INVALID' ? 'Iccid inválido' : 'Alterar plano'
              }
              data-tooltip-place='top'
              style={{
                cursor: line?.Status === 'INVALID' ? 'not-allowed' : 'pointer',
              }}
              onClick={() =>
                line?.Status !== 'INVALID' &&
                navigate('/actions/changeplan', {
                  state: {
                    line: line,
                    plan: line?.IccidHistoric[0]?.SurfNuPlano,
                  },
                })
              }
              // state: { line: line?.IccidHistoric[0]?.SurfMsisdn, plan: line?.IccidHistoric[0]?.SurfNuPlano },
              size={20}
            />
            <FaRegRegistered
              size={20}
              data-tooltip-id='action-tooltip'
              data-tooltip-content={
                line?.Status === 'INVALID' ? 'Iccid inválido' : 'Recarga'
              }
              data-tooltip-place='top'
              style={{
                cursor: line?.Status === 'INVALID' ? 'not-allowed' : 'pointer',
              }}
              onClick={() =>
                line?.Status !== 'INVALID' &&
                navigate('/actions/recharge', {
                  state: { line: line, client: line?.FinalClient?.Name },
                })
              }
            />
            <FaExchangeAlt
              size={20}
              data-tooltip-id='action-tooltip'
              data-tooltip-content={
                line?.Status === 'INVALID' || line?.Status === 'EX'
                  ? line?.Status === 'EX'
                    ? 'Não permitido para esse ICCID'
                    : 'Iccid inválido'
                  : 'Portabilidade'
              }
              data-tooltip-place='top'
              style={{
                cursor:
                  line?.Status === 'INVALID' || line?.Status === 'EX'
                    ? 'not-allowed'
                    : 'pointer',
              }}
              onClick={() =>
                line?.Status !== 'INVALID' &&
                line?.Status !== 'EX' &&
                navigate('/actions/portin', {
                  state: { line: line, client: line?.FinalClient?.Name },
                })
              }
            />
            <MdOutlineAttachMoney
              size={20}
              data-tooltip-id='action-tooltip'
              data-tooltip-content={
                line?.Status === 'INVALID' ? 'Iccid inválido' : 'Cobranças'
              }
              data-tooltip-place='top'
              style={{
                cursor: line?.Status === 'INVALID' ? 'not-allowed' : 'pointer',
              }}
              onClick={() =>
                line?.Status !== 'INVALID' &&
                navigate('/actions/invoices', {
                  state: { line: line, client: line?.FinalClient?.Name },
                })
              }
            />
            {api.currentUser?.Type === 'TEGG' && (
              <>
                <TbStatusChange
                  size={20}
                  data-tooltip-id='action-tooltip'
                  data-tooltip-content={
                    line?.Status === 'INVALID' || line?.Status === 'EX'
                      ? line?.Status === 'EX'
                        ? 'Não permitido para esse ICCID'
                        : 'Iccid inválido'
                      : 'Trocar chip'
                  }
                  data-tooltip-place='top'
                  style={{
                    cursor:
                      line?.Status === 'INVALID' || line?.Status === 'EX'
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                  onClick={() =>
                    line?.Status !== 'INVALID' &&
                    line?.Status !== 'EX' &&
                    navigate('/actions/changechip', {
                      state: { line: line, client: line?.FinalClient?.Name },
                    })
                  }
                />
                <FaRegIdCard
                  size={20}
                  data-tooltip-id='action-tooltip'
                  data-tooltip-content={
                    line?.Status === 'INVALID' || line?.Status === 'EX'
                      ? line?.Status === 'EX'
                        ? 'Não permitido para esse ICCID'
                        : 'Iccid inválido'
                      : 'Trocar titularidade'
                  }
                  data-tooltip-place='top'
                  style={{
                    cursor:
                      line?.Status === 'INVALID' || line?.Status === 'EX'
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                  onClick={() =>
                    line?.Status !== 'INVALID' &&
                    line?.Status !== 'EX' &&
                    navigate('/actions/changedocument', {
                      state: { line: line, client: line?.FinalClient?.Name },
                    })
                  }
                />
                <FaRegTrashAlt
                  color='red'
                  size={20}
                  data-tooltip-id='action-tooltip'
                  data-tooltip-content={
                    line?.Status === 'INVALID'
                      ? 'Iccid inválido'
                      : 'Excluir linha'
                  }
                  data-tooltip-place='top'
                  style={{
                    cursor:
                      line?.Status === 'INVALID' ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() =>
                    line?.Status !== 'INVALID' && setModalExclud(true)
                  }
                />
              </>
            )}
          </div>
        </td>
      </tr>
      <Dialog
        open={modalInfo}
        fullWidth
        size='md'
        onClose={() => setModalInfo(false)}
      >
        <DialogTitle id='alert-dialog-title'>Detalhes da linha</DialogTitle>
        <LineDetails line={line} statusInfo={statusInfo} />
        <DialogActions>
          <Button invert onClick={() => setModalInfo(false)}>
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={modalExclud}
        fullWidth
        size='md'
        onClose={() => setModalExclud(false)}
      >
        {/* <Loading open={loading} msg={'Cancelando...'} /> */}
        <DialogTitle id='alert-dialog-title'>Excluir linha</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente escluir a linha:{' '}
            {line?.IccidHistoric[0]?.SurfMsisdn &&
              phoneFormat(
                line?.IccidHistoric[0]?.SurfMsisdn.replace('55', '')
              )}{' '}
            ? Esta ação não pode ser desfeita!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalExclud(false)}>
            CANCELAR
          </Button>
          <Button
            notHover
            style={{ backgroundColor: 'red' }}
            onClick={handleDelete}
          >
            EXCLUIR
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
