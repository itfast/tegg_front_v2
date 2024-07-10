import { IconButton, Menu, MenuItem } from '@mui/material';
import { IoMdMore } from 'react-icons/io';
import api from '../../services/api';
import { ModalMessage } from '../../components/ModalMessage/ModalMessage';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { translateError } from '../../services/util';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/* eslint-disable react/prop-types */
export const CardProducts = ({ prod, search }) => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteProduct = () => {
    setLoading(true);
    api.product
      .delete(prod.Id)
      .then((res) => {
        toast.success(res?.data?.Message);
        setShowModal(false);
        search();
      })
      .catch((err) => translateError(err))
      .finally(() => setLoading(false));
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
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '-10px',
            marginBottom: '-10px',
            // position: 'absolute',
            // top: '8px',
            // right: '16px',
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
        <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>{prod?.Name}</h4>
        <h5>{prod?.Description}</h5>
        <h5>{prod?.Technology}</h5>
        <h5>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(prod?.Amount)}
        </h5>
      </div>
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
          onClick={() =>
            navigate('/products/info', {
              state: { product: prod },
            })
          }
        >
          {t('Products.table.buttonDetails')}
        </MenuItem>
        {/* {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <MenuItem
            onClick={() =>
              navigate('/products/edit', {
                state: { product: prod },
              })
            }
          >
            Editar
          </MenuItem>
        )} */}
      </Menu>

      <ModalMessage
        showModal={showModal}
        setShowModal={setShowModal}
        title={'Apagar produto'}
        loading={loading}
        action={deleteProduct}
        message={`${t('Products.table.modalMsg1')} ${prod.Name}${t('Products.table.modalMsg2')}`}
      />
    </>
  );
};
