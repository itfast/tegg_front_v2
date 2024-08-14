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
import { useRef, useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import { Button } from '../../../globalStyles';
import { FormEditTutorial } from './FormEditTutorial';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { translateError } from '../../services/util';
// import { Loading } from "../../components/loading/Loading";

export const TableTutorials = ({
  tutorial,
  searchTutorials,
  setLoading,
  setMsg,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openExclud, setOpenExclud] = useState(false);
  const btnSubmit = useRef();
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
      <tr>
        <td style={{ minWidth: 250 }}>{tutorial?.title}</td>
        <td>{tutorial?.description}</td>
        <td>{tutorial?.videoUrl}</td>
        <td>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>{tutorial?.status}</div>
            <div>
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
          </div>
        </td>
      </tr>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenEdit(true);
          }}
        >
          Editar
        </MenuItem>
        {tutorial.status === 'Publicado' && (
          <MenuItem
            onClick={() => {
              handleClose();
              setOpenStatus(true);
            }}
          >
            Ocultar
          </MenuItem>
        )}
        {tutorial.status === 'Oculto' && (
          <MenuItem
            onClick={() => {
              handleClose();
              setOpenStatus(true);
            }}
          >
            Publicar
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleClose();
            setOpenExclud(true);
          }}
        >
          Excluir
        </MenuItem>
      </Menu>
      <Dialog open={openEdit} fullWidth maxWidth={'lg'}>
        <DialogTitle>Editar tutorial</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormEditTutorial
              btnSubmit={btnSubmit}
              data={tutorial}
              handleClose={() => {
                searchTutorials();
                setOpenEdit(false);
              }}
            />
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
            tutorial?
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
            Deseja realmente apagar o tutorial {tutorial?.title}? Esta ação não
            poderá ser desfeita.
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
