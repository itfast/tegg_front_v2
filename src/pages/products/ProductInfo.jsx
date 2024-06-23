/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { translateError } from '../../services/util';
// import { AiFillDelete } from 'react-icons/ai';
// import { BsInfoCircleFill } from 'react-icons/bs';
// import { CiEdit } from 'react-icons/ci';
import { ModalMessage } from '../../components/ModalMessage/ModalMessage';
import { toast } from 'react-toastify';
import { IoMdMore } from 'react-icons/io';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ProductInfo = ({ product, search }) => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const translateValue = (value) => {
    let converted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
    return converted;
  };

  const deleteProduct = () => {
    setLoading(true);
    api.product
      .delete(product.Id)
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
      <tr>
        <td>{product.Name}</td>
        <td>{product.Description}</td>
        <td>{product.Technology}</td>
        <td>{product.Version}</td>
        <td>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>{translateValue(product.Amount)}</div>
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
							state: { product: product },
						})
          }
        >
          {t('Products.table.buttonDetails')}
        </MenuItem>
        {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <MenuItem
            onClick={() =>
							navigate('/products/edit', {
								state: { product: product },
							})
            }
          >
            {t('Products.table.buttonEdit')}
          </MenuItem>
        )}
      </Menu>
      <ModalMessage
        showModal={showModal}
        setShowModal={setShowModal}
        title={t('Products.table.modalDelete')}
        loading={loading}
        action={deleteProduct}
        message={`${t('Products.table.modalMsg1')} ${product.Name}${t('Products.table.modalMsg2')}`}
      />
    </>
  );
};
