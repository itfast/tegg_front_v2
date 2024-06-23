/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { Button /*, ContainerMobile*/ } from '../../../globalStyles';
import { toast } from 'react-toastify';
// import { AiOutlineQrcode, AiOutlineEdit } from 'react-icons/ai';
// import { BsInfoCircleFill } from 'react-icons/bs';
// import { MdAttachMoney, MdOutlineAccountBalanceWallet } from 'react-icons/md';
// import { TbExchange } from 'react-icons/tb';
import { Loading } from '../../components/loading/Loading';
import { IoMdMore } from 'react-icons/io';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { InputData } from '../resales/Resales.styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { translateChipStatus, translateError } from '../../services/util';
import { IconButton, Menu, MenuItem } from '@mui/material';
import moment from 'moment';

export const LineInfo = ({
  line,
  personalLines,
  getLines,
  // pageNum,
  // pageSize,
}) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({});
  const [showBalance, setShowBalance] = useState(false);
  const [statusInfo, setStatusInfo] = useState({});
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningDay, setWarningDay] = useState('');

  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('Linhas...');
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setWarningDay(line?.ExpireWarningDay);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const translateChipStatus = (str) => {
  //   switch (str) {
  //     case 'NOT USED':
  //       return 'Desativado';
  //     case 'ACTIVE':
  //       return 'Ativado';
  //     default:
  //       return str;
  //   }
  // };

  const translatePlanType = (planType) => {
    let translated = '';
    planType === '4533'
      ? (translated = 'Plano 4GB')
      : planType === '4534'
      ? (translated = 'Basic 7GB')
      : planType === '4535'
      ? (translated = 'Start 13GB')
      : planType === '4536'
      ? (translated = 'Gold 21GB')
      : planType === '4537'
      ? (translated = 'Plus 44GB')
      : planType === '4511'
      ? (translated = 'Family 80GB')
      : planType === '4512'
      ? (translated = 'Ultra 100GB')
      : (translated = 'Desconhecido');

    return translated;
  };

  const formatDate = (str) => {
    return str?.slice(0, 10)?.replaceAll('-', '/');
  };

  const formatPhone = (str) => {
    if (str != undefined) {
      const fullNumber = str.toString();
      // const country = fullNumber?.slice(0, 2);
      const area = fullNumber?.slice(2, 4);
      const number1 = fullNumber?.slice(4, 9);
      const number2 = fullNumber?.slice(9);
      return `(${area}) ${number1}-${number2}`;
    }
  };

  const formatBalance = (str) => {
    if (str !== undefined) {
      const val = Math.floor(str);
      return val / 1000;
    }
  };

  const translateValue = (value) => {
    let converted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
    return converted;
  };

  const getBalance = () => {
    api.iccid
      .getBalance(line.Iccid)
      .then((res) => {
        setBalance(res.data.resultado);
      })
      .catch((err) => {
        translateError(err);
      });
  };

  const handleBalance = () => {
    setMsg('Buscando saldo...');
    if (Object.keys(balance).length !== 0) {
      setLoading(false);
      setShowBalance(true);
    } else {
      setLoading(true);
      getBalance();
    }
  };

  const handleDetails = () => {
    setMsg('Buscando status...');
    setLoading(true);
    const status = api.iccid.surfStatus(line.Iccid, 'status');
    const service = api.iccid.surfStatus(line.Iccid, 'service');

    Promise.all([status, service])
      .then((valores) => {
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
        setLoading(false);
      });
  };

  const handleRecharge = async () => {
    setShowRecharge(false);
    toast.info(
      'Aguarde um momento enquanto é gerada uma cobrança para a recarga, isso pode levar alguns instantes.'
    );
    try {
      const response = await api.plans.get();
      const plan = response.data.filter(
        (p) =>
          p.Products.length === 1 &&
          p.Products[0].Product.SurfId === line.SurfNuPlano
      );

      const array = [];
      array.push({
        Iccid: line.Iccid,
        Awarded: 0,
        AwardedSurfPlan: plan[0].Products[0].Product.SurfId,
      });
      api.order
        .create(
          line.FinalClientId,
          personalLines ? api.currentUser.DealerId : null,
          line.DealerId,
          1,
          false,
          0
        )
        .then((res) => {
          if (res.status === 201) {
            let orderId = res.data.OrderId;
            api.order
              .addItem(
                plan[0].Id,
                line?.SurfMsisdn?.slice(2, 4).toString(),
                orderId,
                plan[0].Amount,
                array,
                'all'
              )
              .then(() => {
                toast.success('Pedido gerado com sucesso');
                if (
                  (api.currentUser.AccessTypes[0] === 'CLIENT' || api.currentUser.AccessTypes[0] === 'AGENT') ||
                  (api.currentUser.AccessTypes[0] === 'DEALER' && personalLines)
                ) {
                  navigate(`/recharge/pay/${orderId}`);
                }
              })
              .catch((err) => {
                translateError(err);
              });
          }
        })
        .catch((err) => {
          translateError(err);
        });
    } catch (err) {
      translateError(err);
    }
  };

  const handleWarning = () => {
    if (warningDay !== '') {
      setMsg('Alterando dia de aviso...');
      if (Number(warningDay) >= 1 && Number(warningDay) <= 10) {
        setLoading(true);

        api.line
          .updateExpireWarningDay(line.Iccid, Number(warningDay))
          .then(() => {
            toast.success('Dia de aviso alterado com sucesso!');
            setShowWarning(false);
          })
          .catch((err) => {
            translateError(err);
          })
          .finally(() => {
            setLoading(false);
            getLines();
          });
      } else {
        toast.error('Escolha um valor entre 1 e 10');
      }
    } else {
      toast.error('Insira um novo dia');
    }
  };

  useEffect(() => {
    if (Object.keys(balance).length !== 0) {
      setLoading(false);
      setShowBalance(true);
    }
  }, [balance]);

  return (
    <>
      {/* <tbody> */}
      {loading && <Loading open={loading} msg={msg} />}
      <tr>
        {/* <td></td> */}
        {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') && <td>{line.Iccid}</td>}
        <td>{formatPhone(line?.IccidHistoric[0]?.SurfMsisdn)}</td>
        <td>{translateChipStatus(line?.Status)}</td>
        <td>
          {line?.IccidHistoric[0]?.SurfDtPlanoExpira &&
            moment(line?.IccidHistoric[0]?.SurfDtPlanoExpira).format(
              'DD/MM/YYYY'
            )}
        </td>
        {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') && !personalLines && (
          <td>
            {line.DealerId !== null
              ? line.Dealer.CompanyName || line.Dealer.Name
              : 'TEGG'}
          </td>
        )}
        {(api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') && !personalLines && (
          <td>{line?.FinalClient?.Name}</td>
        )}
        <td>
          {/* {!warningLoading ? ( */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p>{`${line.ExpireWarningDay || 5} ${
              line.ExpireWarningDay === 1 ? 'dia' : 'dias'
            }`}</p>
            <div>
              <IconButton
                aria-label='more'
                id='long-button'
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleClick}
              >
                {/* <MoreVertIcon /> */}
                <IoMdMore />
              </IconButton>
              <Menu
                id='long-menu'
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleBalance();
                    handleClose();
                  }}
                >
                  Saldo
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleDetails();
                  }}
                >
                  Status
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setShowWarning(true);
                    handleClose();
                  }}
                >
                  Alterar dia aviso
                </MenuItem>
              </Menu>
            </div>
          </div>
        </td>
      </tr>

      <Dialog
        open={showBalance}
        onClose={() => setShowBalance(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Linha: {formatPhone(line?.IccidHistoric[0]?.SurfMsisdn)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              <span style={{ fontWeight: 'bold' }}>Saldo:</span>{' '}
              {translateValue(balance.vlSaldo)}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Dados restantes:</span>{' '}
              {`${formatBalance(balance.qtDadoRestante)} GB`}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>SMS restantes:</span>{' '}
              {balance.qtSmsRestante}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Minutos restantes:</span>{' '}
              {balance.qtMinutoRestante}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Validade:</span>{' '}
              {balance.dtPlanoExpira}
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowBalance(false)}>
            FECHAR
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
          Linha: {formatPhone(line?.IccidHistoric[0]?.SurfMsisdn)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              <span style={{ fontWeight: 'bold' }}>Status CHIP:</span>{' '}
              {translateChipStatus(statusInfo.status)}
            </p>
            {statusInfo?.status !== '' && (
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
          <Button invert onClick={() => setShowStatusInfo(false)}>
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showRecharge}
        onClose={() => setShowRecharge(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Realizar recarga?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              Deseja mesmo realizar uma recarga para a linha{' '}
              <span style={{ fontWeight: 'bold' }}>
                {formatPhone(line.SurfMsisdn)}
              </span>
              ?
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowRecharge(false)}>
            FECHAR
          </Button>
          <Button onClick={() => handleRecharge()}>CONTINUAR</Button>
        </DialogActions>
      </Dialog>
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
    </>
  );
};
