/* eslint-disable react/prop-types */
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
import { TableItens } from './full/NewOrder.styles';
import { useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import { Button } from '../../../../globalStyles';
import { InputData } from '../../resales/Resales.styles';
import { NewActivateClient } from './full/NewActivateClient';
import {
  cleanNumber,
  documentFormat,
  translateError,
  translatePlanType,
} from '../../../services/util';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { Loading } from '../../../components/loading/Loading';

export const TableActivation = ({ activations, search }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tmpActivate, setTmpActivate] = useState();
  const [ddd, setDdd] = useState();
  const [cpf, setCpf] = useState();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, iccid) => {
    setAnchorEl(event.currentTarget);
    setTmpActivate(iccid);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActivate = () => {
    setLoading(true);
    api.iccid
      .activate(
        tmpActivate?.Iccid,
        tmpActivate?.AwardedSurfPlan,
        cleanNumber(cpf),
        ddd
      )
      .then((res) => {
        toast.success(res?.data?.Message);
        setShow(false);
        search();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Loading open={loading} msg={'Ativando...'} />
      <TableItens>
        <tr>
          <th>ICCID</th>
          <th>Tipo</th>
          <th>Plano</th>
          <th>LPA URL</th>
        </tr>
        {activations?.length === 0 && (
          <tr>
            <td colSpan='4' style={{ textAlign: 'center' }}>
              Você não possui ativações pendentes
            </td>
          </tr>
        )}
        {activations?.map((r) => (
          <tr key={r?.Iccid}>
            {console.log(r?.LPAUrl)}
            <td>{r?.Iccid}</td>
            <td>{r?.LPAUrl ? 'e-Sim' : 'Chip'}</td>
            <td>{r?.AwardedSurfPlan && translatePlanType(r?.AwardedSurfPlan)}</td>
            <td>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>{r?.LPAUrl}</div>
                <div>
                  <IconButton
                    aria-label='more'
                    id='long-button'
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={(e) => handleClick(e, r)}
                  >
                    <IoMdMore />
                  </IconButton>
                </div>
              </div>
            </td>
          </tr>
        ))}
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
            setShow(true);
            handleClose();
          }}
        >
          Ativar
        </MenuItem>
      </Menu>
      <Dialog
        open={show}
        onClose={() => {
          setShow(false);
        }}
        fullWidth
        maxWidth='md'
      >
        <DialogTitle id='alert-dialog-title'>ATIVAÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Iccid: {tmpActivate?.Iccid}
            {tmpActivate?.AwardedSurfPlan ? (
              <>
                <h5 style={{ marginTop: '0.5rem' }}>DDD</h5>
                <InputData
                  id='ddd'
                  type='text'
                  style={{ width: '100%' }}
                  placeholder='DDD'
                  pattern='\d*'
                  // style={{ width: 250 }}
                  maxLength={2}
                  value={ddd}
                  onChange={(e) => setDdd(e.target.value)}
                />
                <h5>Documento</h5>
                <InputData
                  id='cpf'
                  style={{ width: '100%' }}
                  placeholder='CPF/CNPJ'
                  // style={{ width: 250 }}
                  value={cpf}
                  onChange={(e) => setCpf(documentFormat(e.target.value))}
                />
              </>
            ) : (
              <>
                {/* <div style={{ width: '100%' }}> */}
                  <NewActivateClient
                    setShow={setShow}
                    iccid={tmpActivate?.Iccid}
                    search={search}
                    tmpActivate={tmpActivate}
                  />
                {/* </div> */}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {tmpActivate?.AwardedSurfPlan && (
            <>
              <Button
                invert
                onClick={() => {
                  setShow(false);
                }}
              >
                CANCELAR
              </Button>
              <Button onClick={() => handleActivate()}>ATIVAR</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
