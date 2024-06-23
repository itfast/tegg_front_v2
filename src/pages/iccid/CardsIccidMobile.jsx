import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  formatDate,
  formatPhone,
  translateChipStatus,
  translateError,
  translatePlanType,
} from '../../services/util';
import { MdSignalWifiStatusbarNotConnected } from 'react-icons/md';
import _ from 'lodash';
import api from '../../services/api';
import { useState } from 'react';
import { Button } from '../../../globalStyles';
import { toast } from 'react-toastify'

/* eslint-disable react/prop-types */
export const CardsIccidMobile = ({
  iccids,
  setLoadingAll,
  handleSearch,
  setMsg,
  checkedArray,
  setCheckedArray,
}) => {
  const [statusInfo, setStatusInfo] = useState({});
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showUnblock, setShowUnblock] = useState(false);
  const [tmp, setTmp] = useState();

  const handleCheck = (e, iccid) => {
    if (e.target.checked) {
      setCheckedArray([
        ...checkedArray,
        { iccid: iccid.Iccid, status: iccid.Status },
      ]);
    } else {
      const orig = _.cloneDeep(checkedArray);
      const find = orig.findIndex((f) => f === iccid.Iccid);
      orig.splice(find, 1);
      setCheckedArray(orig);
    }
  };

  const getStatus = (i) => {
    setMsg('Buscando...');
    setTmp(i)
    setLoadingAll(true);
    const status = api.iccid.surfStatus(i.Iccid, 'status');
    const service = api.iccid.surfStatus(i.Iccid, 'service');

    Promise.all([status, service])
      .then((valores) => {
        setLoadingAll(false);
        console.log(valores);
        setStatusInfo({
          ...valores[0]?.data?.retStatus?.resultado,
          ...valores[1]?.data?.retStatus?.resultado,
        });
        setShowStatusInfo(true);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingAll(false);
      });
  };

  const handleBlock = () => {
    if (statusInfo.status === 'ACTIVE') {
      setMsg('Bloqueando...');
      setLoadingAll(true);
      api.iccid
        .block(statusInfo.nuMsisdn)
        .then((res) => {
          toast.success(res.data?.Message);
          setShowBlock(false);
          handleSearch();
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => setLoadingAll(false));
    } else {
      toast.info('Você só pode bloquear um CHIP que esteja ativo');
    }
  };

  const handleUnblock = () => {
    if (statusInfo.status === 'ACTIVE') {
      setMsg('Desbloqueando...');
      setLoadingAll(true);
      api.iccid
        .unblock(statusInfo.nuMsisdn)
        .then(() => {
          toast.success('Desbloqueio realizado com sucesso');
          handleSearch();
          setShowUnblock(false);
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => setLoadingAll(false));
    } else {
      toast.info('Você só pode desbloquear um CHIP que esteja ativo');
    }
  };

  return (
    <>
      {iccids?.map((i) => (
        <div
          key={i.Iccid}
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
            <MdSignalWifiStatusbarNotConnected
              style={{ color: 'red' }}
              size={25}
              onClick={() => getStatus(i)}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
            }}
          >
            <Checkbox
              // checked={checkedArray[index]}
              onChange={(e) => {
                handleCheck(e, i);
              }}
            />
          </div>
          <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>{i?.Iccid}</h4>
          <h5>{i.LPAUrl ? 'e-Sim' : 'SimCard'}</h5>
          <h5>
            <span style={{ fontWeight: 'bold' }}>REVENDA: </span>
            {i.DealerId != null ? i.Dealer.Name : 'TEGG'}
          </h5>

          {i.FinalClientId && (
            <h4>
              <span style={{ fontWeight: 'bold' }}>CLIENTE: </span>
              {i.FinalClientId !== null ? i.FinalClient?.Name : ''}
            </h4>
          )}
          <h4>{translateChipStatus(i.Status)}</h4>
        </div>
      ))}

      <Dialog
        open={showStatusInfo}
        onClose={() => {
          setShowStatusInfo(false);
          handleSearch();
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ICCID {tmp?.Iccid}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              <span style={{ fontWeight: 'bold' }}>Número:</span>{' '}
              {formatPhone(statusInfo?.msisdn)}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Status CHIP:</span>{' '}
              {translateChipStatus(statusInfo?.status, tmp?.FinalClientId)}
            </p>
            {statusInfo?.status == 'ACTIVE' && (
              <div>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Plano:</span>{' '}
                  {translatePlanType(statusInfo?.nuPlano)}
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Ativação:</span>{' '}
                  {formatDate(statusInfo?.dtAtivacao)}
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Última recarga:</span>{' '}
                  {formatDate(statusInfo?.dtUltimaRecarga)}
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Validade:</span>{' '}
                  {formatDate(statusInfo?.dtPlanoExpira)}
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Status linha:</span>{' '}
                  {statusInfo?.stBloqueioChip}
                </p>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {statusInfo?.status === 'ACTIVE' &&
            (statusInfo?.stBloqueioChip === 'Ativo' ? (
              <Button
                invert
                onClick={() => {
                  setShowStatusInfo(false);
                  setShowBlock(true);
                }}
              >
                BLOQUEAR
              </Button>
            ) : (
              <Button
                invert
                onClick={() => {
                  setShowStatusInfo(false);
                  setShowUnblock(true);
                }}
              >
                DESBLOQUEAR
              </Button>
            ))}
          <Button
            invert
            onClick={() => {
              handleSearch();
              setShowStatusInfo(false);
            }}
          >
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showBlock}
        onClose={() => {
          handleSearch();
          setShowBlock(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo bloquear o ICCID {tmp?.Iccid}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              handleSearch();
              setShowBlock(false);
            }}
          >
            FECHAR
          </Button>
          <Button onClick={() => handleBlock()}>BLOQUEAR</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showUnblock}
        onClose={() => {
          handleSearch();
          setShowUnblock(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo desbloquear o ICCID {tmp?.Iccid}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              handleSearch();
              setShowUnblock(false);
            }}
          >
            FECHAR
          </Button>
          <Button onClick={() => handleUnblock()}>DESBLOQUEAR</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
