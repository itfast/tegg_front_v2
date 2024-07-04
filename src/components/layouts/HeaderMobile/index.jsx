/* eslint-disable no-unused-vars */
import { SessionComponent } from './styles';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io';
import { TbReplace } from 'react-icons/tb';
import { GiExitDoor } from 'react-icons/gi';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { translateError } from '../../../services/util'
import {Loading} from '../../../components/loading/Loading'
import { useState } from 'react'
import { Dialog, DialogTitle, Menu } from '@mui/material'
import { ChangeProfile } from '../../changeProfile/ChangeProfile'

// eslint-disable-next-line react/prop-types
export const HeaderMobile = ({ setOpen, open, has }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(Boolean(anchorEl));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        className='home-section close'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className='home-content'>
          <div style={{zIndex: 100}} onClick={() => setOpen(!open)} className={`burger ${open ? 'open' : ''}`}>
            <div className={`x ${open && has >0 ? 'collapse' : ''} ${has === 1 ? 'rotate30' : has ===2 ? 'rotate30 rotate45': has ===3 ? 'rotate30' : ''}`}></div>
            <div className={`y ${open && has >0? 'collapse' : ''}`} style={{visibility: has > 0 && 'hidden'}}></div>
            <div className={`z ${open && has >0? 'collapse' : ''} ${has == 1 ? 'rotate150' : has ===2 ? 'rotate150 rotate135' : has ===3 ? 'rotate150' : ''}`} ></div>
          </div>
        </div>
        {!open&& (
          <div
            style={{
              marginRight: '2rem',
              color: '#00D959',
              textAlign: 'center',
            }}
          >
            {/* <div style={{ display: "flex", alignItems: "center", flexDirection: 'column' }}> */}
                {/* <h5></h5>
                 */}
                {/* <div style={{width: '100%',textOverflow: "ellipsis"}}> */}
                  {/* <h5 style={{ width: '50%',whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: "ellipsis", textAlign: 'end' }}>
                    Vagner Adriano Targino da Silva de Paula Fonseca Assis
                    Bastião Teodoro
                  </h5> */}
                {/* </div> */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <h5>{`${api.currentUser.Name?.substring(0,25)} ${api.currentUser.Name.length > 25 ? '...' : ''}`}</h5>
                <h5>
                  {api.currentUser.Type === 'DEALER'
                    ? 'Revenda'
                    : api.currentUser.Type === 'CLIENT'
                    ? 'Cliente'
                    : api.currentUser.Type === 'AGENT'
                    ? 'Representante'
                    : 'Tegg'}
                </h5>
              </div>
              {api.currentUser.Type !== 'TEGG' && (api.currentUser.MyUserFinalClientId ||
                    api.currentUser.MyUserDealerId || api.currentUser.Type === 'CLIENT' || api.currentUser.Type === 'AGENT') && (
                <div style={{ marginLeft: 10 }}>
                  <TbReplace
                    data-tooltip-id='inf-tooltip'
                    data-tooltip-content='Mudar perfil'
                    data-tooltip-place='left'
                    size={25}
                    style={{ cursor: 'pointer' }}
                    onClick={handleClick}
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
                  size={25}
                  style={{ cursor: 'pointer' }}
                  onClick={goExit}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </SessionComponent>
    </>
  );
};
