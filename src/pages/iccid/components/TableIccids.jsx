/* eslint-disable react/prop-types */
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  formatDate,
  formatPhone,
  translateChipStatus,
  translateError,
  translatePlanType,
} from '../../../services/util';
import { TableItens } from '../../orders/new/NewOrder.styles';
import { IoMdMore } from 'react-icons/io';
import { useState } from 'react';
import api from '../../../services/api';
import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import _ from 'lodash'

export const TableIccids = ({
  iccids,
  setLoadingAll,
  handleSearch,
  setMsg,
  checkedArray,
  setCheckedArray,
}) => {
  const ITEM_HEIGHT = 48;
  const [showBlock, setShowBlock] = useState(false);
  const [showUnblock, setShowUnblock] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusInfo, setStatusInfo] = useState({});
  const [showStatusInfo, setShowStatusInfo] = useState(false);
  const [tmp, setTmp] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event, iccid) => {
    setAnchorEl(event.currentTarget);
    setTmp(iccid);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getStatus = () => {
    setMsg('Buscando...');
    setLoadingAll(true);
    const status = api.iccid.surfStatus(tmp.Iccid, 'status');
    const service = api.iccid.surfStatus(tmp.Iccid, 'service');

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

  const handleDelete = () => {
    setMsg('Deletando...');
    setLoadingAll(true);
    api.iccid
      .delete(tmp?.Iccid)
      .then(() => {
        toast.success('Iccid deletado com sucesso');
        setShowDelete(false);
        // setPageNum(1);
        setShowUnblock(false);
        handleSearch();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingAll(false);
      });
  };


  const handleCheck = (e, iccid) => {
    if(e.target.checked){
      setCheckedArray([...checkedArray, {iccid: iccid.Iccid, status: iccid.Status}])
    }else{
      const orig = _.cloneDeep(checkedArray);
      const find = orig.findIndex((f) =>f===iccid.Iccid);
      orig.splice(find, 1)
      setCheckedArray(orig)
    }
  };

  return (
    <>
      <TableItens style={{ marginTop: '1rem' }}>
        <tr>
          <th>ICCID</th>
          <th>Tipo</th>
          <th>Vendedor</th>
          <th>Cliente</th>
          <th>Status</th>
          {/* <th>Checar SURF</th>
        <th>Deletar</th> */}
        </tr>
        {iccids.map((i) => (
          <tr key={i.Iccid}>
            <td>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <Checkbox
                    // checked={checkedArray[index]}
                    onChange={(e) => {
                      handleCheck(e, i);
                    }}
                  />
                </div>
                <div>{i.Iccid}</div>
              </div>
            </td>
            <td>{i.LPAUrl ? 'e-Sim' : 'SimCard'}</td>
            <td>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <p>{i.DealerId != null ? i.Dealer.Name : 'TEGG'}</p>
              </div>
            </td>
            <td>{i.FinalClientId !== null ? i.FinalClient?.Name : '-'}</td>
            <td>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <p>{translateChipStatus(i.Status)}</p>
                <IconButton
                  aria-label='more'
                  id='long-button'
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup='true'
                  onClick={(e) => handleClick(e, i)}
                >
                  {/* <MoreVertIcon /> */}
                  <IoMdMore />
                </IconButton>
              </div>
            </td>
          </tr>
        ))}
        {/* {order?.PurchaseOrderItems?.map((m, i) => ())} */}
      </TableItens>
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
            width: '10ch',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setShowDelete(true);
            handleClose();
          }}
        >
          Deletar
        </MenuItem>
        <MenuItem
          onClick={() => {
            getStatus();
            handleClose();
          }}
        >
          Status surf
        </MenuItem>
      </Menu>

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
            Deseja mesmo deletar o ICCID {tmp?.Iccid}? Essa ação não poderá ser
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
