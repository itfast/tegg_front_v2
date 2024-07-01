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
import api from '../../services/api';
import { phoneFormat, translateError } from '../../services/util';
import { IoMdMore } from 'react-icons/io';
import { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Button } from '../../../globalStyles';
import { MultiLineInputData } from '../resales/Resales.styles';
import { useTranslation } from 'react-i18next';

/* eslint-disable react/prop-types */
export const ClientCardMobilePending = ({
  client,
  setLoading,
  setMsg,
  getClients,
}) => {
  const {t} = useTranslation()
  const ITEM_HEIGHT = 48;
  const [userDetails, setUserDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalAprov, setShowModalAprov] = useState(false);
  const [showModalReprov, setShowModalReprov] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [justify, setJustify] = useState('');
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDetails = () => {
    setAnchorEl(null);
    setShowModal(true);
  };

  const getInfo = () => {
    setMsg(t('ClientsPending.searchDetailsClient'));
    console.log(client.Id);
    setLoading(true);
    api.client
      .getPreregistrationId(client.Id)
      .then((res) => {
        console.log(res);
        setUserDetails(res.data);
        handleDetails();
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const action = () => {
    setMsg(t('ClientsPending.actionApprovMsg'));
    setLoading(true);
    api.client
      .updateStatusPreregistration(userDetails?.Id, 'APPROVED', null)
      .then((res) => {
        toast.success(res?.data?.Message);
        setShowModal(false);
        setShowModalAprov(false);
        getClients();
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
        setMsg(t('ClientsPending.searchMsg'));
      });
  };

  const actionReprov = () => {
    if (justify === '') {
      toast.error(t('ClientsPending.errorMsgRepprov'));
    } else {
      setMsg(t('ClientsPending.actionRepprovMsg'));
      setLoading(true);
      api.client
        .updateStatusPreregistration(userDetails?.Id, 'REPPROVED', justify)
        .then((res) => {
          toast.success(res?.data?.Message);
          setShowModal(false);
          setShowModalReprov(false);
          getClients();
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoading(false);
          setMsg(t('ClientsPending.searchMsg'));
        });
    }
  };

  return (
    <>
      <div
        style={{
          width: '90%',
          backgroundColor: '#00D959',
          textAlign: 'center',
          // color: '#3d3d3d',
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
        <h4 style={{ padding: '0.2rem', fontWeight: 'bold' }}>
          {client.CompanyName || client.Name}
        </h4>
        <h5>{/* {documentFormat(client.Cpf)} */}</h5>
        <h5>{client?.Mobile}</h5>
        <h5>{client?.Email}</h5> 
        <h5>Criado em: {client.CreatedAt && moment(client.CreatedAt).format('DD/MM/YYYY HH:mm')}</h5>
        {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <h5>
            <span style={{ fontWeight: 'bold' }}>{t('ClientsPending.resale')}: </span>
            {client?.DealerId
              ? client?.Dealer?.CompanyName !== ''
                ? client?.Dealer?.CompanyName
                : client?.Dealer?.Name
              : 'TEGG'}
          </h5>
        )}
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
          onClick={() => {
            if (Object.keys(userDetails).length !== 0) {
              handleDetails();
            } else {
              getInfo();
            }
          }}
        >
          {t('ClientsPending.buttonDetails')}
        </MenuItem>
      </Menu>

      <Dialog
        open={showModal}
        // onClose={() => console.log('fechar')}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'> {t('ClientsPending.modalDetails.title')}</DialogTitle>
        <DialogContent>
          <div className='info_container'>
            <div>
              <div className='info_title'>
                <p className='bold'>
                  {userDetails?.Type === 'DEALER' ? t('ClientsPending.modalDetails.ambassador') : t('ClientsPending.modalDetails.client')}
                </p>
              </div>
              <div className='info_line'>
                <div className='info_item_2'>
                  <label className='bold'>{t('ClientsPending.modalDetails.name')}</label>
                  <p>{userDetails?.Name}</p>
                </div>
                <div className='info_item_2'>
                  <label className='bold'>{t('ClientsPending.modalDetails.userLegacy')}</label>
                  <p>{userDetails?.UserLegacySystem?.nome}</p>
                  <p></p>
                </div>
              </div>
              <div className='info_line'>
                <div className='info_item_2'>
                  <label className='bold'>{t('ClientsPending.modalDetails.email')}</label>
                  <p>{userDetails?.Email}</p>
                </div>
                <div className='info_item_2'>
                  <label className='bold'>{t('ClientsPending.modalDetails.secondMail')}</label>
                  <p>{userDetails?.SecondEmail}</p>
                </div>
              </div>
              <div className='info_line'>
                <div className='info_item_2'>
                  <label className='bold'>{t('ClientsPending.modalDetails.cpf')}</label>
                  {/* <p>{userDetails?.Cpf && documentFormat(userDetails?.Cpf)}</p> */}
                </div>
                <div className='info_item_2'>
                  <label className='bold'>{t('ClientsPending.modalDetails.rg')}</label>
                  <p>{userDetails?.Rg}</p>
                </div>
              </div>

              <div className='info_line'>
                <div className='info_item_2'>
                  <label className='bold'>{t('ClientsPending.modalDetails.phone')}</label>
                  <p>
                    {userDetails?.Mobile && phoneFormat(userDetails.Mobile)}
                  </p>
                </div>
                <div className='info_item_2'>
                  <label className='bold'>{t('ClientsPending.modalDetails.whatsapp')}</label>
                  <p>
                    {userDetails?.Whatsapp && phoneFormat(userDetails.Whatsapp)}
                  </p>
                </div>
              </div>
              <hr className='margin_half' />
              <div className='info_line'>
                <p className='bold'>{t('ClientsPending.modalDetails.address')}</p>
              </div>
              <div className='info_line'>
                <div className='info_item_80'>
                  <label className='bold'>{t('ClientsPending.modalDetails.street')}</label>
                  <p>{userDetails?.StreetName}</p>
                </div>
                <div className='info_item_20'>
                  <label className='bold'>{t('ClientsPending.modalDetails.number')}</label>
                  <p>{userDetails?.Number}</p>
                </div>
              </div>

              <div className='info_line'>
                <div className='info_item_80'>
                  <label className='bold'>{t('ClientsPending.modalDetails.complement')}</label>
                  <p>{userDetails?.Complement}</p>
                </div>
                <div className='info_item_20'>
                  <label className='bold'>{t('ClientsPending.modalDetails.postalCode')}</label>
                  <p>{userDetails?.PostalCode}</p>
                </div>
              </div>

              <div className='info_line'>
                <div className='info_item_45'>
                  <label className='bold'>{t('ClientsPending.modalDetails.neighborhood')}</label>
                  <p>{userDetails?.District}</p>
                </div>
                <div className='info_item_40'>
                  <label className='bold'>{t('ClientsPending.modalDetails.city')}</label>
                  <p>{userDetails?.City}</p>
                </div>
                <div>
                  <label className='bold'>{t('ClientsPending.modalDetails.state')}</label>
                  <p>{userDetails?.State}</p>
                </div>
              </div>
              {userDetails?.Status === 'REPPROVED' && (
                <>
                  <hr className='margin_half' />
                  <div className='info_line space_between'>
                    <div>
                      <label className='bold'>{t('ClientsPending.modalDetails.repprovMsg')}</label>
                      <p>{userDetails?.Comments}</p>
                    </div>
                  </div>
                </>
              )}
              <hr className='margin_half' />
              <div className='info_line space_between'>
                <div>
                  <label className='bold'>{t('ClientsPending.modalDetails.registerDate')}</label>
                  <p>
                    {userDetails?.CreatedAt &&
                      moment(userDetails?.CreatedAt).format('DD/MM/YYYY')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ width: '100%' }}>
          <div
            style={{
              display: screen.width < 768 && 'flex',
              flexDirection: screen.width < 768 && 'column',
              gap: 10,
            }}
          >
            <Button
              style={{ width: screen.width < 768 && '100%' }}
              invert
              onClick={() => setShowModal(false)}
            >
              {t('ClientsPending.modalDetails.buttonClose')}
            </Button>
            <Button
              disabled={userDetails?.Status !== 'PENDING'}
              style={{
                backgroundColor: userDetails?.Status === 'PENDING' && 'red',
                width: screen.width < 768 && '100%',
              }}
              notHover={userDetails?.Status === 'PENDING'}
              onClick={() => setShowModalReprov(true)}
            >
              {t('ClientsPending.modalDetails.buttonRepprov')}
            </Button>
            <Button
              disabled={userDetails?.Status !== 'PENDING'}
              style={{ width: screen.width < 768 && '100%' }}
              onClick={() => setShowModalAprov(true)}
            >
              {t('ClientsPending.modalDetails.buttonApprov')}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showModalAprov}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{t('ClientsPending.modalApprov.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
          {t('ClientsPending.modalApprov.msg')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowModalAprov(false)}>
          {t('ClientsPending.modalApprov.buttonCancel')}
          </Button>
          <Button notHover onClick={action} autoFocus>
          {t('ClientsPending.modalApprov.buttonApprov')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showModalReprov}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{t('ClientsPending.modalRepprov.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
          {t('ClientsPending.modalRepprov.msg1')} <br/>  {t('ClientsPending.modalRepprov.msg2')} &#40;{t('ClientsPending.modalRepprov.msg3')}&#41;:
            <MultiLineInputData
              placeholder={t('ClientsPending.modalRepprov.justifyRepprov')}
              rows={3}
              className='input'
              style={{ textAlign: 'start' }}
              value={justify}
              onChange={(e) => {
                setJustify(e.target.value);
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowModalReprov(false);
              // setJustify('');
            }}
          >
            {t('ClientsPending.modalRepprov.buttonCancel')}
          </Button>
          <Button
            style={{ backgroundColor: 'red' }}
            notHover
            onClick={actionReprov}
            autoFocus
          >
            {t('ClientsPending.modalRepprov.buttonRepprov')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
