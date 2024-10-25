/* eslint-disable react/prop-types */
// import { useNavigate } from "react-router-dom";
import ReactLoading from 'react-loading';
import { Button } from '../../../globalStyles';
import { toast } from 'react-toastify';
import { BsInfoCircleFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { useState } from 'react';
import api from '../../services/api';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { translateError } from '../../services/util';

export const IccidInfo = ({
  iccid,
  index,
  iccidArray,
  setIccidArray,
  statusArray,
  setStatusArray,
  checkedArray,
  setCheckedArray,
  search,
  iccidToFind,
  pageNum,
  setPageNum,
  pageSize,
  statusSearch,
}) => {
  // const navigate = useNavigate();
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showUnblock, setShowUnblock] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [statusInfo, setStatusInfo] = useState({});
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const translateChipStatus = (str) => {
    switch (str) {
      case 'CREATED':
        return 'Aguardando status';
      case 'NOT USED':
        return 'Não ativo';
      case 'SENT':
        return 'Enviado';
      case 'ACTIVE':
        return 'Ativo';
      case 'GRACE1':
        return 'Recarga atrasada 5 dias';
      case 'GRACE2':
        return 'Recarga atrasada 45 dias';
      case 'GRACE3':
        return 'Recarga atrasada 75 dias';
      case 'EX':
        return 'EX';
      case 'CANCELED':
        return 'Cancelado';
      case 'PORTOUT':
        return 'Portado';
      case 'AVAILABLE':
        return 'Disponível para venda';
      default:
        return 'Desconhecido';
    }
  };

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
    if (str === 'Invalid date') {
      return '-';
    }
    return str.slice(0, 10).replaceAll('-', '/');
  };

  const formatPhone = (str) => {
    if (str !== undefined) {
      const fullNumber = str.toString();
      const country = fullNumber.slice(0, 2);
      const area = fullNumber.slice(2, 4);
      const number1 = fullNumber.slice(4, 9);
      const number2 = fullNumber.slice(9);
      // console.log(fullNumber, country, area, number1, number2);
      return `+${country} (${area}) ${number1}-${number2}`;
    }
  };

  const formatDoc = (str) => {
    if (str !== undefined) {
      if (str.length === 14) {
        return `${str.slice(0, 2)}.${str.slice(2, 5)}.${str.slice(
          5,
          8
        )}/${str.slice(8, 12)}-${str.slice(12)}`;
      } else {
        return `${str.slice(0, 3)}.${str.slice(3, 6)}.${str.slice(6, 9)}
					-${str.slice(9)}`;
      }
    }
  };

  const getService = () => {
    api.iccid
      .surfStatus(iccid.Iccid, 'service')
      .then((res) => {
        console.log('SERVICE', res.data);
        setServiceInfo(res.data.retStatus.resultado);
        setShowStatusInfo(true);
        // handleSearch();
      })
      .catch((err) => {
        translateError(err);
        handleSearch();
        toast.error('Não foi possível coletar as informações do ICCID');
      })
      .finally(() => {
        setStatusLoading(false);
      });
  };

  const getStatus = () => {
    // console.log(iccid);
    setStatusLoading(true);
    api.iccid
      .surfStatus(iccid.Iccid, 'status')
      .then((res) => {
        console.log('STATUS', res.data.retStatus.resultado);
        setStatusInfo(res.data.retStatus.resultado);
        getService();
      })
      .catch((err) => {
        translateError(err);
        setStatusLoading(false);
        handleSearch();
        toast.error('Não foi possível coletar as informações do ICCID');
      });
  };

  const handleSearch = () => {
    search(pageNum, statusSearch, iccidToFind, pageSize);
  };

  const handleDetails = () => {
    if (
      Object.keys(serviceInfo).length !== 0 &&
      Object.keys(statusInfo).length !== 0
    ) {
      setShowStatusInfo(true);
    } else {
      toast.info(
        'Aguarde um momento enquanto as informações sobre esse ICCID terminam de ser coletadas'
      );
      getStatus();
    }
  };

  const handleBlock = () => {
    if (
      Object.keys(serviceInfo).length !== 0 &&
      Object.keys(statusInfo).length !== 0
    ) {
      if (statusInfo.status === 'ACTIVE') {
        api.iccid
          .block(serviceInfo.nuMsisdn)
          .then(() => {
            toast.success('Bloqueio realizado com sucesso');
            handleSearch();
          })
          .catch((err) => {
            translateError(err);
          })
          .finally(() => setShowBlock(false));
      } else {
        toast.info('Você só pode bloquear um CHIP que esteja ativo');
      }
    } else {
      toast.info(
        'Aguarde um momento enquanto as informações sobre esse ICCID terminam de ser coletadas'
      );
    }
  };

  const handleUnblock = () => {
    if (
      Object.keys(serviceInfo).length !== 0 &&
      Object.keys(statusInfo).length !== 0
    ) {
      if (statusInfo.status === 'ACTIVE') {
        api.iccid
          .unblock(serviceInfo.nuMsisdn)
          .then(() => {
            toast.success('Desbloqueio realizado com sucesso');
            handleSearch();
          })
          .catch((err) => {
            translateError(err);
          })
          .finally(() => setShowUnblock(false));
      } else {
        toast.info('Você só pode desbloquear um CHIP que esteja ativo');
      }
    } else {
      toast.info(
        'Aguarde um momento enquanto as informações sobre esse ICCID terminam de ser coletadas'
      );
    }
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    api.iccid
      .delete(iccid.Iccid)
      .then(() => {
        toast.success('Iccid deletado com sucesso');
        setShowDelete(false);
        setPageNum(1);
        handleSearch();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setDeleteLoading(false);
        setShowUnblock(false);
      });
  };

  const handleCheck = (e) => {
    let cArray = [...checkedArray];
    let sArray = [...statusArray];
    let iArray = [...iccidArray];
    cArray[index] = e.target.checked;
    if (e.target.checked) {
      sArray[index] = iccid.Status;
      iArray[index] = iccid.Iccid;
    } else {
      sArray[index] = '';
      iArray[index] = '';
    }
    setCheckedArray(cArray);
    setStatusArray(sArray);
    setIccidArray(iArray);
  };

  return (
    <>
      <tbody>
        <tr>
          <td>
            <div className='checkbox'>
              <Checkbox
                checked={checkedArray[index]}
                onChange={(e) => {
                  handleCheck(e);
                }}
              />
            </div>
          </td>
          <td>{iccid.Iccid}</td>
          <td>{iccid.LPAUrl ? 'e-Sim' : 'Físico'}</td>
          <td>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <p>{iccid.DealerId != null ? iccid.Dealer.Name : 'TEGG'}</p>
            </div>
          </td>
          <td>
            {iccid.FinalClientId !== null ? iccid.FinalClient?.Name : '-'}
          </td>
          <td>
            <p>{translateChipStatus(iccid.Status, iccid.FinalClientId)}</p>
          </td>
          <td>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {!statusLoading ? (
                <BsInfoCircleFill
                  style={{ cursor: 'pointer' }}
                  size={20}
                  onClick={() => {
                    if (iccid.Status === 'INVALID') {
                      toast.error('ICCID inválido');
                    } else {
                      handleDetails();
                    }
                  }}
                />
              ) : (
                <div className='loading'>
                  <ReactLoading type={'bars'} color={'#000'} />
                </div>
              )}
            </div>
          </td>
          <td>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {!deleteLoading ? (
                <AiFillDelete
                  style={{ cursor: 'pointer' }}
                  size={20}
                  onClick={() => {
                    // console.log(iccid);
                    if (
                      iccid.Status !== 'NOT USED' &&
                      iccid.Status !== 'CREATED' &&
                      iccid.Status !== 'INVALID'
                    ) {
                      if (iccid.FinalClientId === null) {
                        toast.info(
                          'Você só pode deletar um ICCID que não possua uma linha vinculada.'
                        );
                      } else {
                        toast.info(
                          `Você não pode deletar esse ICCID, ele está vinculado ao cliente ${
                            iccid.FinalClient.Name
                          }, cujo ${
                            iccid.FinalClient.Cnpj !== null ? 'CNPJ' : 'CPF'
                          } é ${formatDoc(
                            iccid.FinalClient.Cpf || iccid.FinalClient.Cnpj
                          )}`
                        );
                      }
                    } else {
                      setShowDelete(true);
                    }
                  }}
                />
              ) : (
                <div className='loading'>
                  <ReactLoading type={'bars'} color={'#000'} />
                </div>
              )}
            </div>
          </td>
        </tr>
      </tbody>
      <Dialog
        open={showStatusInfo}
        onClose={() => {
          setShowStatusInfo(false);
          handleSearch();
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ICCID {iccid.Iccid}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              <span style={{ fontWeight: 'bold' }}>Número:</span>{' '}
              {formatPhone(statusInfo?.msisdn)}
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>Status CHIP:</span>{' '}
              {translateChipStatus(statusInfo?.status, iccid.FinalClientId)}
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
                  {serviceInfo?.stBloqueioChip}
                </p>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {statusInfo?.status === 'ACTIVE' &&
            (serviceInfo?.stBloqueioChip === 'Ativo' ? (
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
            Deseja mesmo bloquear o ICCID {iccid.Iccid}?
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
            Deseja mesmo desbloquear o ICCID {iccid.Iccid}?
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
      <Dialog
        open={showDelete}
        onClose={() => {
          handleSearch();
          setShowDelete(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo deletar o ICCID {iccid.Iccid}? Essa ação não poderá ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              handleSearch();
              setShowDelete(false);
            }}
          >
            FECHAR
          </Button>
          <Button onClick={() => handleDelete()}>DELETAR</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
