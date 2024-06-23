/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button, CardInfo } from '../../../globalStyles';
import {
  formatDate,
  formatPhone,
  translateChipStatus,
  translateError,
  translatePlanType,
  translateValue,
} from '../../services/util';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
// import moment from 'moment';
import { InputData } from '../resales/Resales.styles';

const formatBalance = (str) => {
  if (str !== undefined) {
    const val = Math.floor(str);
    return val / 1000;
  }
};

export const LinesCLient = ({ line, getLines, pageNum, pageSize }) => {
  const [warningDay, setWarningDay] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  // const [warningLoading, setWarningLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [tempLine, setTempLine] = useState({});
  const [serviceInfo, setServiceInfo] = useState({});
  const [statusInfo, setStatusInfo] = useState({});

  const [balance, setBalance] = useState();
  const [showBalance, setShowBalance] = useState(false);

  const handleWarning = () => {
    if (warningDay !== '') {
      if (Number(warningDay) >= 1 && Number(warningDay) <= 10) {
        // setWarningLoading(true);
        setShowWarning(false);
        api.line
          .updateExpireWarningDay(tempLine?.Iccid, Number(warningDay))
          .then(() => {
            toast.success('Dia de aviso alterado com sucesso!');
          })
          .catch((err) => {
            console.log(err);
            translateError(err);
          })
          .finally(() => {
            // setWarningLoading(false);
            getLines(pageNum, pageSize);
          });
      } else {
        toast.error('Escolha um valor entre 1 e 10');
      }
    } else {
      toast.error('Insira um novo dia');
    }
  };

  const getService = (myLine) => {
    api.iccid
      .surfStatus(myLine.Iccid, 'service')
      .then((res) => {
        // console.log("service", res.data.retStatus.resultado);
        setServiceInfo(res.data.retStatus.resultado);
        setShowStatusInfo(true);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setStatusLoading(false);
      });
  };

  const getStatus = (myLine, idx) => {
    setStatusLoading(true);
    // setStatusLoading([...statusLoading]);
    console.log(myLine);
    api.iccid
      .surfStatus(myLine.Iccid, 'status')
      .then((res) => {
        // console.log("status", res.data.retStatus.resultado);
        setStatusInfo(res.data.retStatus.resultado);
        getService(myLine, idx);
        // setServiceInfo(res.data.retStatus.resultado);
        // setShowStatusInfo(true)
      })
      .catch((err) => {
        setStatusLoading(false);
        translateError(err);
      });
  };

  const getBalance = (myLine) => {
    setBalanceLoading(true);
    api.iccid
      .getBalance(myLine.Iccid)
      // .getBalance("8955170110318190921")
      .then((res) => {
        // console.log(res.data.resultado);
        setBalance(res.data.resultado);
        setShowBalance(true);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setBalanceLoading(false);
      });
  };

  return (
    <>
      <CardInfo>
        <h3 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
          {formatPhone(line?.IccidHistoric[0]?.SurfMsisdn)}
        </h3>
        <h5>{line?.ExpireWarningDay ? `Avisar vencimento plano: ${line?.ExpireWarningDay} dias` : 'Sem aviso configurado'}</h5>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
          }}
        >
          <Button
            invert
            style={{ width: '49%' }}
            onClick={() => {
              setTempLine(line);
              getBalance(line);
            }}
          >
            {balanceLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 15,
                }}
              >
                <ReactLoading type={'bars'} color={'#00D959'} />
              </div>
            ) : (
              'SALDO'
            )}
          </Button>
          <Button
            invert
            style={{ width: '49%' }}
            onClick={() => {
              getStatus(line);
              setTempLine(line);
            }}
          >
            {statusLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 15,
                }}
              >
                <ReactLoading type={'bars'} color={'#00D959'} />
              </div>
            ) : (
              'STATUS'
            )}
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '0.5rem',
          }}
        >
          <Button
            invert
            style={{ width: '100%' }}
            onClick={() => {
              setTempLine(line);
              setShowWarning(true);
            }}
          >
            ALTERAR AVISO
          </Button>
        </div>
      </CardInfo>
      <Dialog
        open={showWarning}
        onClose={() => setShowWarning(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Alterar dia de aviso de vencimento do plano
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              Escolha um novo dia para receber o email de aviso de vencimento do
              plano.
            </p>
            <p>
              Você receberá um email X dias antes do vencimento de seu plano,
              sendo X o valor que você escolher abaixo.
            </p>
            <p>Escolha um valor entre 1 e 10.</p>
            <br />
            <InputData
              type='number'
              placeholder='Novo dia'
              className='input'
              value={warningDay}
              onChange={(e) => setWarningDay(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setWarningDay('');
              setShowWarning(false);
            }}
          >
            FECHAR
          </Button>
          <Button
            onClick={() => {
              handleWarning();
            }}
          >
            CONTINUAR
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showStatusInfo}
        onClose={() => setShowStatusInfo(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {/* {console.log(tempLine)} */}
          Linha:{' '}
          {tempLine.IccidHistoric &&
            formatPhone(tempLine?.IccidHistoric[0]?.SurfMsisdn)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              <span style={{ fontWeight: 'bold' }}>Status CHIP:</span>{' '}
              {translateChipStatus(statusInfo.status)}
            </p>
            {statusInfo.status !== '' && (
              <div>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Plano:</span>{' '}
                  {translatePlanType(statusInfo.nuPlano)}
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Ativação:</span>{' '}
                  {formatDate(statusInfo.dtAtivacao)}
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Última recarga:</span>{' '}
                  {formatDate(statusInfo.dtUltimaRecarga)}
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Validade:</span>{' '}
                  {formatDate(statusInfo.dtPlanoExpira)}
                </p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>Status linha:</span>{' '}
                  {serviceInfo.stBloqueioChip}
                </p>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowStatusInfo(false)}>
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showBalance}
        onClose={() => setShowBalance(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Linha:{' '}
          {tempLine?.IccidHistoric &&
            formatPhone(tempLine?.IccidHistoric[0]?.SurfMsisdn)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              <span style={{ fontWeight: 'bold' }}>Saldo:</span>{' '}
              {translateValue(balance?.vlSaldo)}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Dados restantes:</span>{' '}
              {`${formatBalance(balance?.qtDadoRestante)} GB`}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>SMS restantes:</span>{' '}
              {balance?.qtSmsRestante}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Minutos restantes:</span>{' '}
              {balance?.qtMinutoRestante}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Validade:</span>{' '}
              {balance?.dtPlanoExpira}
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowBalance(false)}>
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
