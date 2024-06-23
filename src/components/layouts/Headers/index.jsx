import { SessionComponent } from './styles';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io';
import { GiExitDoor } from 'react-icons/gi';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/prop-types
export const Header = ({ setOpen, open }) => {
  const {t} = useTranslation()
  const navigate = useNavigate();
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
    <SessionComponent>
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
                <h6 style={{ color: 'white' }}>{t("Menu.more")}</h6>
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <h5>{api.currentUser.Name}</h5>
                <h5>
                  {api.currentUser.Type === 'DEALER'
                    ?  t("Menu.resale")
                    : api.currentUser.Type === 'CLIENT'
                    ? t("Menu.client")
                    : api.currentUser.Type === 'AGENT'
                    ? t("Menu.agent")
                    : t("Menu.tegg")}
                </h5>
              </div>
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
  );
};
