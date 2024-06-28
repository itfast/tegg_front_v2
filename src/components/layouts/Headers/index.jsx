import { SessionComponent } from './styles';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io';
import { GiExitDoor } from 'react-icons/gi';
import { TbReplace } from 'react-icons/tb';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import { useState } from 'react';
import { Loading } from '../../../components/loading/Loading';
import { Menu } from '@mui/material';
import { ChangeProfile } from '../../changeProfile/ChangeProfile';

// eslint-disable-next-line react/prop-types
export const Header = ({ setOpen, open }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(Boolean(anchorEl));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const sideAction = () => {
    const action = document.getElementById('sideContainer');
    const headerAction = document.getElementById('headerContainer');
    if (action) {
      if (action?.classList.length === 2) {
        action.classList.remove('close');
        headerAction?.classList.remove('close');
        setOpen(true);
        localStorage.setItem('menu', true);
      } else {
        action.classList.add('close');
        headerAction?.classList.add('close');
        localStorage.setItem('menu', false);
        setOpen(false);
      }
    }
  };

  const goExit = () => {
    api.user.logout();
    navigate('/login');
  };

  return (
    <>
      <SessionComponent>
        <Loading open={loading} msg={'Mudando de perfil...'} />
        <section
          id='headerContainer'
          className={open ? 'home-section' : 'home-section close'}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div className='home-content'>
            {open ? (
              <IoIosClose
                onClick={sideAction}
                size={50}
                style={{ cursor: 'pointer', marginLeft: 20, color: '#fff' }}
              />
            ) : (
              <div style={{ marginLeft: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <AiOutlineMenuUnfold
                    onClick={sideAction}
                    size={30}
                    style={{ cursor: 'pointer', color: 'red' }}
                  />
                  <h6 style={{ color: 'white' }}>{t('Menu.more')}</h6>
                </div>
              </div>
            )}
          </div>
          {window.innerWidth > 768 && (
            <div
              style={{
                marginRight: '2rem',
                color: '#00D959',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div>
                  <h5>{api.currentUser.Name}</h5>
                  <h5>
                    {api.currentUser.Type === 'DEALER'
                      ? t('Menu.resale')
                      : api.currentUser.Type === 'CLIENT'
                      ? t('Menu.client')
                      : api.currentUser.Type === 'AGENT'
                      ? t('Menu.agent')
                      : t('Menu.tegg')}
                  </h5>
                </div>
                {api.currentUser.Type !== 'TEGG' && (
                  <div style={{ marginLeft: 10 }}>
                    <TbReplace
                      data-tooltip-id='inf-tooltip'
                      data-tooltip-content='Mudar perfil'
                      data-tooltip-place='left'
                      size={25}
                      style={{ cursor: 'pointer' }}
                      onClick={handleClick}
                      // onClick={() => setShowEditProfile(true)}
                    />
                    <Menu
                      id='basic-menu'
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <ChangeProfile
                        setShowEditProfile={handleClose}
                        setLoading={setLoading}
                      />
                    </Menu>
                  </div>
                )}
                <div style={{ marginLeft: 10 }}>
                  <GiExitDoor
                    data-tooltip-id='inf-tooltip'
                    data-tooltip-content='Sair'
                    data-tooltip-place='left'
                    size={25}
                    style={{ cursor: 'pointer' }}
                    onClick={goExit}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
        <Tooltip
          id='inf-tooltip'
          content='Hello world!'
          style={{ color: '#fff', zIndex: 9999 }}
          // isOpen={isOpen}
        />
      </SessionComponent>
    </>
  );
};
