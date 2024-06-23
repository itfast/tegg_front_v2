/* eslint-disable react/prop-types */
import moment from 'moment';
import {
  formatPhone,
  translateError,
  translateStatus,
  translateValue,
} from '../../services/util';
import { Button, CardInfo } from '../../../globalStyles';
import { RiDeleteBin5Line } from 'react-icons/ri';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import { TiEdit } from 'react-icons/ti';
import Select from 'react-select';
import { RechargeCard } from '../recharges/RechargeCard';

const returnDays = () => {
  const date = new Date();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (month > 12) {
    month = 1;
    year++;
  }

  const array = [];
  const date2 = new Date(year, month, 0);
  for (let i = 1; i <= date2.getDate(); i++) {
    array.push({
      label: i,
      value: i.toString(),
    });
  }
  return array;
};

export const SubscriptionInfoMobile = ({ n, reload, planOpt }) => {
  const [showCancel, setShowCancel] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [dueDate, setDueDate] = useState({
    label: n.DueDate,
    value: n.DueDate,
  });
  const [selected, setSelected] = useState();

  const translateName = (plan) => {
    switch (plan) {
      case '4533':
        return 'Promo';
      case '4534':
        return 'Basic';
      case '4535':
        return 'Start';
      case '4536':
        return 'Gold';
      case '4537':
        return 'Plus';
      case '4511':
        return 'Family';
      case '4512':
        return 'Ultra';
      default:
        return plan;
    }
  };

  useEffect(() => {
    const find = planOpt.find(
      (p) => p?.Products[0]?.Product?.SurfId === n.SurfPlan
    );
    if (find) {
      setSelected({ label: translateName(n.SurfPlan), value: find });
    }
  }, [n, planOpt]);

  const handleCancel = () => {
    setLoadingCancel(true);
    api.iccid
      .cancelSubscription(n.Id)
      .then((res) => {
        toast.success(res.data.Message);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingCancel(false);
        reload();
        // getSubscriptions(pageNum, pageSize);
      });
  };

  const handleEdit = () => {
    setLoadingEdit(true);
    api.iccid
      .updateSubscription(
        n.Id,
        dueDate?.value,
        selected?.value?.Amount,
        selected?.value?.Products[0]?.Product?.SurfId
      )
      .then((res) => {
        toast.success(res?.data?.Message);
        setShowEdit(false);
        reload();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingEdit(false);
      });
  };

  return (
    <>
      <CardInfo style={{ padding: '1rem', color: '#3d3d3d' }}>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
          }}
        >
          <RiDeleteBin5Line
            size={25}
            style={{ cursor: 'pointer', color: 'red' }}
            onClick={() => setShowCancel(true)}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'yellow',
          }}
        >
          <TiEdit
            size={25}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowEdit(true)}
          />
        </div>
        <h3>{formatPhone(n?.Iccid?.IccidHistoric[0]?.SurfMsisdn)}</h3>
        <h4>Inicio: {moment(n?.CreatedAt).format('DD/MM/YYYY - HH:ss')}</h4>
        <h4>Vencimento: {n?.DueDate}</h4>
        <h4>Valor: {translateValue(n?.Amount)}</h4>
        <h4>{translateStatus(n?.Status)}</h4>
      </CardInfo>
      <Dialog
        open={showCancel}
        onClose={() => {
          setShowCancel(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo cancelar a assinatura? Essa operação não poderá ser
            desfeita.
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
          <Button onClick={() => handleCancel()}>
            {loadingCancel ? (
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
              'CONTINUAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>EDITAR ASSINATURA</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {/* <div className='input_row_2'> */}
            <div className='input'>
              <label>DIA DO VENCIMENTO</label>
              <Select
                isSearchable={false}
                options={returnDays()}
                placeholder='Dia *'
                // menuPortalTarget={document.body}
                menuPosition='fixed'
                value={dueDate}
                onChange={setDueDate}
              />
            </div>
            {/* </div> */}
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  marginTop: 40,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                  gap: 10,
                }}
              >
                {planOpt?.map((p) => (
                  <RechargeCard
                    key={p.Id}
                    disabled
                    plan={p}
                    name={p?.Name}
                    size={p?.Size}
                    internet={p?.Internet}
                    extra={p?.Extra}
                    extraPortIn={p?.ExtraPortIn}
                    free={p?.Free?.split(' ')}
                    price={p?.Amount}
                    comments={p?.Comments}
                    selected={selected?.label === p?.Name}
                    onClick={() => setSelected({ label: p?.Name, value: p })}
                  />
                ))}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowEdit(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={() => handleEdit()}>
            {loadingEdit ? (
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
              'ATUALIZAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
