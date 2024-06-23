/* eslint-disable react/prop-types */
import { Button } from '../../../globalStyles';
import { toast } from 'react-toastify';
import { GrUpdate } from 'react-icons/gr';
import { ImCancelCircle } from 'react-icons/im';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import ReactLoading from 'react-loading';
import _ from 'lodash';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { translateError, translateStatus } from '../../services/util';
import { IoMdMore } from 'react-icons/io';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Loading } from '../../components/loading/Loading';

export const PortRequestInfo = ({
  request,
  getRequests,
  pageNum,
  pageSize,
}) => {
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [loadingCancel, setLoadingCancel] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [tmp, setTmp] = useState();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, iccid) => {
    setAnchorEl(event.currentTarget);
    setTmp(iccid);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const translateRequestStatus = (str) => {
    let status = '';
    str == 'ACTIVE'
      ? (status = 'Ativa')
      : str == 'TESTE'
      ? (status = 'Teste')
      : str == 'PENDING'
      ? (status = 'Pendente')
      : str == 'CANCEL_PENDING'
      ? (status = 'Cancelamento pendente')
      : str == 'OLD'
      ? (status = 'Requisição antiga')
      : str == 'CONFLICT'
      ? (status = 'Requisição com conflito')
      : str == 'CANCELLED'
      ? (status = 'Cancelada')
      : 'Desconhecido';

    return status;
  };

  const formatPhone = (str) => {
    if (str != undefined) {
      const fullNumber = str.toString();
      const country = fullNumber.slice(0, 2);
      const area = fullNumber.slice(2, 4);
      const number1 = fullNumber.slice(4, 9);
      const number2 = fullNumber.slice(9);
      // console.log(fullNumber, country, area, number1, number2);
      return `+${country} (${area}) ${number1}-${number2}`;
    }
  };

  const updateStatus = (status) => {
    api.line
      .updatePortRequest(request.Id, status)
      .then((res) => {
        toast.success(res.data.Message);
        getRequests(pageNum, pageSize);
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      });
  };

  const checkStatus = async () => {
    api.line
      .checkPortIn(request.OldLine, request.NewLine)
      .then((res) => {
        // console.log(res);
        toast.success(res.data.Message);
        updateStatus(res.data.Data.ticketStatus);
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      })
      .finally(() => {
        setShowCheck(false);
      });
  };

  const handleCheck = async () => {
    setLoadingCheck(true);
    setLoadingStatus(true);
    await checkStatus();
    setLoadingCheck(false);
    setLoadingStatus(false);
  };

  // const handleCancel = () => {
  //   setLoadingCancel(true);
  //   api.line
  //     .cancelPortIn(request.OldLine, request.NewLine)
  //     .then((res) => {
  //       toast.success(res.data.Message);
  //       checkStatus();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       translateError(err);
  //     })
  //     .finally(() => {
  //       setLoadingCheck(false);
  //     });
  // };
  const handleCancel = () => {
    setLoadingCancel(true);
    console.log(tmp);
    api.line
      .cancelPortIn(tmp.Id)
      .then((res) => {
        toast.success(res.data.Message);
        setShowCancel(false);
        getRequests();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingCancel(false);
      });
  };

  return (
    <>
      {/* <tbody> */}
      <tr>
        {/* <td></td> */}
        {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
          <td>
            {request.DealerId !== null
              ? request?.Dealer?.CompanyName || request?.Dealer?.Name
              : 'TEGG'}
          </td>
        )}
        {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
          <td>{request?.FinalClient?.Name}</td>
        )}
        <td>{translateStatus(request.Status)}</td>
        <td>{formatPhone(request.OldLine)}</td>
        {/* <td>{formatPhone(request.NewLine)}</td> */}
        <td>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>{_.capitalize(request.OldProvider)}</div>
            <div>
              <IconButton
                aria-label='more'
                id='long-button'
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={(e) => handleClick(e, request)}
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
                    // width: '10ch',
                  },
                }}
              >
                <MenuItem
                  disabled={tmp?.Status === 'CANCELED'}
                  onClick={() => {
                    setShowCancel(true);
                    handleClose();
                  }}
                >
                  Cancelar portabilidade
                </MenuItem>
              </Menu>
            </div>
          </div>
        </td>
        {/* <td>
						{!loadingCheck ? (
							<div style={{ display: "flex", justifyContent: "center" }}>
								<GrUpdate
									style={{ cursor: "pointer" }}
									size={20}
									onClick={() => {
										setShowCheck(true);
									}}
								/>
							</div>
						) : (
							<div className="loading">
								<ReactLoading type={"bars"} color={"#000"} />
							</div>
						)}
					</td> */}
        {/* <td>
						{!loadingCancel ? (
							<div style={{ display: "flex", justifyContent: "center" }}>
								<ImCancelCircle
									style={{ cursor: "pointer" }}
									size={20}
									onClick={() => {
										setShowCancel(true);
									}}
								/>
							</div>
						) : (
							<div className="loading">
								<ReactLoading type={"bars"} color={"#000"} />
							</div>
						)}
					</td> */}
      </tr>
      {/* </tbody> */}
      <Dialog
        open={showCheck}
        onClose={() => {
          setShowCheck(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo checar o status da requisição de portabilidade?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowCheck(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={() => handleCheck()}>
            {!loadingStatus ? (
              'CONTINUAR'
            ) : (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showCancel}
        onClose={() => {
          setShowCancel(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <Loading open={loadingCancel} msg={'Cancelando portabilidade...'} />
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo cancelar a requisição de portabilidade? Essa operação
            não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowCancel(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={() => handleCancel()}>CONTINUAR</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
