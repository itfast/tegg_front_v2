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
import { useRef, useState } from 'react';
import { Button } from '../../../globalStyles';
// import { useTranslation } from 'react-i18next';
import { FormEditTutorial } from './FormEditTutorial'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { translateError } from '../../services/util'

/* eslint-disable react/prop-types */
export const CardManagerTutorial = ({
  tutorial,
  searchTutorials,
  setLoading,
  setMsg
}) => {
  const btnSubmit = useRef()
  // const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openExclud, setOpenExclud] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeStatus = () => {
    setMsg('Mudando status...');
    setLoading(true);
    const newStatus = tutorial.status === 'Publicado' ? 'Oculto' : 'Publicado';
    api.tutorials
      .edit(
        tutorial?.id,
        tutorial?.title,
        tutorial?.description,
        tutorial?.videoUrl,
        newStatus
      )
      .then((res) => {
        toast.success(res.data?.Message);
        searchTutorials();
        setOpenStatus(false);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const excludTutorial = () => {
    setMsg('Apagando...');
    setLoading(true);
    api.tutorials
      .delete(tutorial.id)
      .then(() => {
        toast.success('Tutorial apagado com sucesso');
        searchTutorials();
        setOpenExclud(false);
      })
      .catch((err) => translateError(err))
      .finally(()=> setLoading(false))
  };

  return (
    <>
      <div
        style={{
          width: '90%',
          backgroundColor: '#00D959',
          textAlign: 'center',
          padding: '0.5rem',
          margin: 'auto',
          borderRadius: '8px',
          marginTop: '0.2rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'end',
            marginTop: '-10px',
            marginBottom: '-10px',
          }}
        >
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
        </div> 
        <h5 style={{fontWeight: 'bold'}}>{tutorial?.status}</h5>
        <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
          {tutorial?.title}
        </h4>
        <h5>{tutorial?.description}</h5>
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
          onClick={() => {
            handleClose()
            setOpenEdit(true)
          }}
        >
          Editar
        </MenuItem>
        {tutorial.status === 'Publicado' && (
          <MenuItem
          onClick={() => {
            handleClose()
            setOpenStatus(true)
          }}
          >
            Ocultar
          </MenuItem>
        )}
        {tutorial.status === 'Oculto' && (
          <MenuItem
          onClick={() => {
            handleClose()
            setOpenStatus(true)
          }}
          >
            Publicar
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleClose()
            setOpenExclud(true)
          }}
        >
          Excluir
        </MenuItem>
      </Menu>
      <Dialog open={openEdit} fullWidth maxWidth={'lg'}>
        <DialogTitle>Editar tutorial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormEditTutorial btnSubmit={btnSubmit} data={tutorial} handleClose={() => {
                searchTutorials();
                setOpenEdit(false);
              }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={() => btnSubmit.current.click()}>Salvar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openStatus} fullWidth minWidth='sm'>
        <DialogTitle>Mudar status</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Deseja realmente{' '}
            {tutorial.status === 'Publicado' ? 'ocultar' : 'publicar'} o
            tutorial {tutorial?.title}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatus(false)}>Cancelar</Button>
          <Button onClick={changeStatus}>{tutorial.status === 'Publicado' ? 'Ocultar' : 'Publicar'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openExclud} fullWidth minWidth='sm'>
        <DialogTitle>Apagar tutorial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente apagar o tutorial {tutorial?.title}? Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExclud(false)}>Cancelar</Button>
          <Button onClick={excludTutorial}>Apagar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
