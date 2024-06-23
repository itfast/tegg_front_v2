/* eslint-disable react/prop-types */
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ModalMessage } from '../../components/ModalMessage/ModalMessage';
import { toast } from 'react-toastify';
import { translateError } from '../../services/util';
import { useTranslation } from 'react-i18next';

export const PlanCard = ({ plan, search }) => {
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

  const deletePlan = () => {
    setLoading(true);
    api.plans
      .delete(plan.Id)
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
            position: 'absolute',
            top: '8px',
            right: '16px',
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
        <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>{plan?.Name}</h4>
        <h5>{plan?.PointsForCarrerPlan} {t('plans.table.pointsCarrer')}</h5>
        <h5>{t('plans.table.performance')}: {plan?.Performance}%</h5>
        <h5>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(plan?.Amount)}
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
            navigate('/plans/info', {
              state: { plan: plan },
            })
          }
        >
          {t('plans.table.menu.details')}
        </MenuItem>
      </Menu>

      <ModalMessage
        showModal={showModal}
        setShowModal={setShowModal}
        title={t('plans.table.modal.delete')}
        loading={loading}
        action={deletePlan}
        message={`${t('plans.table.menu.msg1')} ${plan.Name}${t('plans.table.menu.msg2')}`}
      />
    </>
  );
};
