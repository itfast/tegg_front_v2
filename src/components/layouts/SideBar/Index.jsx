/* eslint-disable react/prop-types */
import api from '../../../services/api';
import { SidebarContainer } from './styles';
import ReactCardFlip from 'react-card-flip';

// import avatar from '/assets/avatar.png';
// import aguia from '../../assets/itfast_aguia.png'
import logoCompleto from '/assets/tegg-verde.png';
import logo from '/assets/tegg-logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import PermissionView from '../../../routes/PermissionView';
import { useTranslation } from 'react-i18next';

export function SideBar({ open }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const local = useLocation();
  const submenuAction = (e) => {
    const submenu = e.target.parentElement.parentElement;
    submenu.classList.toggle('showMenu');
  };

  const goExit = () => {
    api.user.logout();
    navigate('/login');
  };

  return (
    <>
      <SidebarContainer>
        <div id='sideContainer' className={open ? 'sidebar' : 'sidebar close '}>
          <div className='logo-details'>
            <ReactCardFlip isFlipped={open}>
              <div>
                <img src={logo} alt='profileImg' />
              </div>
              <div>
                <img
                  src={logoCompleto}
                  style={{ width: '70%', marginTop: 15 }}
                  alt='profileImg'
                />
              </div>
            </ReactCardFlip>
          </div>
          {/* DASBOARD */}
          <ul className='nav-links'>
            {/* DASHBOARD */}
            <li
              style={{
                backgroundColor:
                  local.pathname === '/' || local.pathname === '/'
                    ? '#00D959'
                    : '',
              }}
            >
              <a href='#' onClick={() => navigate('/')}>
                <i className='bx bx-grid-alt'></i>
                <span className='link_name'>{t('Menu.dashboard')}</span>
              </a>
              <ul className='sub-menu blank'>
                <li>
                  <a
                    className='link_name'
                    href='#'
                    onClick={() => navigate('/')}
                  >
                    {t('Menu.dashboard')}
                  </a>
                </li>
              </ul>
            </li>
            {/* TEGG TV */}
            <PermissionView role='CLIENT,AGENT'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/streaming' ? '#00D959' : '',
                }}
              >
                <a href='#' onClick={() => navigate('/streaming')}>
                  <i className='bx bx-tv'></i>
                  <span className='link_name'>{t('Menu.streaming')}</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => navigate('/streaming')}
                    >
                      {t('Menu.streaming')}
                    </a>
                  </li>
                </ul>
              </li>
            </PermissionView>
            <PermissionView role='TEGG'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/management/streaming' ? '#00D959' : '',
                }}
              >
                <a href='#' onClick={() => navigate('/management/streaming')}>
                  <i className='bx bx-tv'></i>
                  <span className='link_name'>Tegg TV</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => navigate('/management/streaming')}
                    >
                      Tegg TV
                    </a>
                  </li>
                </ul>
              </li>
            </PermissionView>
            {/* PLANOS */}
            <PermissionView role='TEGG'>
              <li
                style={{
                  backgroundColor: local.pathname === '/plans' ? '#00D959' : '',
                }}
              >
                <div className='iocn-link' onClick={submenuAction}>
                  <a href='#' onClick={() => navigate('/plans')}>
                    <i className='bx bxs-notepad'></i>
                    <span className='link_name'>{t('Menu.plans')}</span>
                  </a>
                  {/* <i className='bx bxs-chevron-down arrow'></i> */}
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => navigate('/plans')}
                    >
                      {t('Menu.plans')}
                    </a>
                  </li>
                  {/* <li>
                  <a href='/admin/providers/new'>Novo Provedor</a>
                </li> */}
                </ul>
              </li>
            </PermissionView>
            {/* PRODUTOS */}
            <PermissionView role='TEGG'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/products' ? '#00D959' : '',
                }}
              >
                <div className='iocn-link' onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/products');
                    }}
                  >
                    <i className='bx bxs-package'></i>
                    <span className='link_name'>{t('Menu.products')}</span>
                  </a>
                  {/* <i className='bx bxs-chevron-down arrow'></i> */}
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/products');
                      }}
                    >
                      {t('Menu.products')}
                    </a>
                  </li>
                  {/* <li>
                  <a href='/admin/partners/new'>Novo Parceiro</a>
                </li> */}
                  {/* <li>
                  <a href="/admin/partners/manager">Bloquear/Desbloquear</a>
                </li> */}
                </ul>
              </li>
            </PermissionView>
            {/* ICCIDS */}
            <PermissionView role='TEGG,DEALER'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/iccids' ? '#00D959' : '',
                }}
              >
                <a href='#' onClick={() => navigate('/iccids')}>
                  <i className='bx bxs-chip'></i>
                  <span className='link_name'>{t('Menu.iccids')}</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a href='#' onClick={() => navigate('/iccids')}>
                      {t('Menu.iccids')}
                    </a>
                  </li>
                </ul>
              </li>
            </PermissionView>
            {/* REVENDAS */}
            <PermissionView role='TEGG'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/salesforce' ||
                    local.pathname === '/salesforce/' ||
                    local.pathname === '/salesforce/new' ||
                    local.pathname === '/salesforce/edit' ||
                    local.pathname === '/clients/pending' ||
                    local.pathname === '/salesforce/details' ||
                    local.pathname === '/salesforce/deleteds'
                      ? '#00D959'
                      : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    if (api.currentUser.AccessTypes[0] === 'TEGG') {
                      navigate('/salesforce');
                    } else {
                      navigate('/salesforce/details');
                    }
                  }}
                >
                  <i className='bx bxs-store-alt'></i>
                  <span className='link_name'>
                    {api.currentUser.AccessTypes[0] === 'TEGG'
                      ? t('Menu.resales')
                      : t('Menu.resale')}
                  </span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        if (api.currentUser.AccessTypes[0] === 'TEGG') {
                          navigate('/salesforce');
                        } else {
                          navigate('/salesforce/details');
                        }
                      }}
                    >
                      {api.currentUser.AccessTypes[0] === 'TEGG'
                        ? t('Menu.resales')
                        : t('Menu.resale')}
                    </a>
                  </li>
                  <PermissionView role='TEGG'>
                    <li>
                      <a
                        href='#'
                        onClick={() => {
                          navigate('/clients/pending');
                        }}
                      >
                        {t('Menu.pendings')}
                      </a>
                    </li>
                  </PermissionView>
                  <PermissionView role='TEGG'>
                    <li>
                      <a
                        href='#'
                        onClick={() => {
                          navigate('/salesforce/deleteds');
                        }}
                      >
                        Excluídas
                      </a>
                    </li>
                  </PermissionView>
                </ul>
              </li>
            </PermissionView>
            {/* CLIENTES */}
            {/* <PermissionView role="TEGG,DEALER">
            <li
              style={{
                backgroundColor:
                  local.pathname === '/clients' ||
                  local.pathname === '/clients/' ||
                  local.pathname === '/clients/new' ||
                  local.pathname === '/clients/edit'
                    ? '#00D959'
                    : '',
              }}
            >
              <a
                href='#'
                onClick={() => {
                  navigate('/clients');
                }}
              >
                <i className='bx bx-body'></i>
                <span className='link_name'>Clientes</span>
              </a>
              <ul className='sub-menu'>
                <li>
                  <a className='link_name' href='#' onClick={() => {
                  navigate('/clients');
                }}>
                    Clientes
                  </a>
                </li>
              </ul>
            </li>
            </PermissionView> */}
            <PermissionView role='TEGG,DEALER'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/clients' ||
                    local.pathname === '/clients/' ||
                    local.pathname === '/clients/new' ||
                    local.pathname === '/clients/edit' ||
                    local.pathname === '/clients/deleteds'
                      ? '#00D959'
                      : '',
                }}
              >
                <div className='iocn-link' onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/clients');
                    }}
                  >
                    <i className='bx bx-body'></i>
                    <span className='link_name'>{t('Menu.clients')}</span>
                  </a>
                  <i className='bx bxs-chevron-down arrow'></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/clients');
                      }}
                    >
                      {t('Menu.clients')}
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/clients/deleteds');
                      }}
                    >
                      Excluídos
                    </a>
                  </li>
                </ul>
              </li>
            </PermissionView>
            <PermissionView role='TEGG,DEALER'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/agents'
                      ? // local.pathname === "/clients/" ||
                        // local.pathname === "/clients/new" ||
                        // local.pathname === "/clients/edit" ||
                        // local.pathname === "/clients/deleteds"
                        '#00D959'
                      : '',
                }}
              >
                <div className='iocn-link' onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/agents');
                    }}
                  >
                    <i className='bx bx-street-view'></i>
                    <span className='link_name'>Representantes</span>
                  </a>
                  <i className='bx bxs-chevron-down arrow'></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/agents');
                      }}
                    >
                      Representantes
                    </a>
                  </li>
                  {/* <li>
                    <a
                      href="#"
                      onClick={() => {
                        navigate("/clients/deleteds");
                      }}
                    >
                      Excluídos
                    </a>
                  </li> */}
                </ul>
              </li>
            </PermissionView>
            {/* PEDIDOS */}
            <li
              style={{
                backgroundColor:
                  local.pathname === '/orders' ||
                  local.pathname === '/orders/' ||
                  local.pathname === '/orders/new/chip' ||
                  local.pathname === '/orders/new/esim' ||
                  local.pathname === '/orders/sendIccid' ||
                  local.pathname === '/orders/pay' ||
                  local.pathname === '/nfe' ||
                  local.pathname === '/activation'
                    ? '#00D959'
                    : '',
              }}
            >
              <div className='iocn-link' onClick={submenuAction}>
                <a
                  href='#'
                  onClick={() => {
                    navigate('/orders');
                  }}
                >
                  <i className='bx bxs-add-to-queue'></i>
                  <span className='link_name'>{t('Menu.orders')}</span>
                </a>
                <i className='bx bxs-chevron-down arrow'></i>
              </div>
              <ul className='sub-menu'>
                <li>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/orders');
                    }}
                  >
                    {t('Menu.orders')}
                  </a>
                </li>
                <PermissionView role='TEGG'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/statement');
                      }}
                    >
                      {t('Menu.extract')}
                    </a>
                  </li>
                </PermissionView>
                <PermissionView role='TEGG,DEALER'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/orders/pending');
                      }}
                    >
                      {t('Menu.ordersPending')}
                    </a>
                  </li>
                </PermissionView>
                <PermissionView role='TEGG'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/activation');
                      }}
                    >
                      {t('Menu.activationsPending')}
                    </a>
                  </li>
                </PermissionView>
                <PermissionView role='TEGG'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/activation/manual');
                      }}
                    >
                      {t('Menu.activeNewLine')}
                    </a>
                  </li>
                </PermissionView>
                <li>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/nfe');
                    }}
                  >
                    {t('Menu.invoices')}
                  </a>
                </li>
                <PermissionView role='TEGG,DEALER,AGENT'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/preorder');
                      }}
                    >
                      Pré-Cadastros
                    </a>
                  </li>
                </PermissionView>
              </ul>
            </li>
            {/* Assinaturas */}
            <li
              style={{
                backgroundColor:
                  // local.pathname === "/streaming" ||
                  local.pathname === '/subscriptions' ||
                  local.pathname === '/subscriptions/new/'
                    ? '#00D959'
                    : '',
              }}
            >
              <div className='iocn-link' onClick={submenuAction}>
                <a
                  href='#'
                  onClick={() => {
                    navigate('/subscriptions');
                  }}
                >
                  <i className='bx bx-food-menu'></i>
                  <span className='link_name'> {t('Menu.subscriptions')}</span>
                </a>
                <i className='bx bxs-chevron-down arrow'></i>
              </div>
              <ul className='sub-menu'>
                <li>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/subscriptions');
                    }}
                  >
                    {t('Menu.subscriptions')}
                  </a>
                </li>
              </ul>
            </li>
            {/* LINHAS */}
            <li
              style={{
                backgroundColor:
                  local.pathname === '/lines' ||
                  local.pathname === '/lines/esim/' ||
                  // local.pathname === "/subscriptions" ||
                  // local.pathname === "/subscriptions/new/" ||
                  local.pathname === '/portRequests' ||
                  local.pathname === '/portRequests/new' ||
                  local.pathname === '/recharge' ||
                  local.pathname === '/recharge/new' ||
                  local.pathname === '/recharge/pay'
                    ? '#00D959'
                    : '',
              }}
            >
              <div className='iocn-link' onClick={submenuAction}>
                <a
                  href='#'
                  onClick={() => {
                    navigate('/lines');
                  }}
                >
                  <i className='bx bxs-phone'></i>
                  <span className='link_name'> {t('Menu.lines')}</span>
                </a>
                <i className='bx bxs-chevron-down arrow'></i>
              </div>
              <ul className='sub-menu'>
                <li>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/lines');
                    }}
                  >
                    {t('Menu.lines')}
                  </a>
                </li>
                <PermissionView role='TEGG'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/subscriptions');
                      }}
                    >
                      {t('Menu.subscriptions')}
                    </a>
                  </li>
                </PermissionView>
                <PermissionView role='TEGG'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/portRequests');
                      }}
                    >
                      {t('Menu.portin')}
                    </a>
                  </li>
                </PermissionView>
                <PermissionView role='CLIENT,AGENT'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/portRequests');
                        // navigate("/bringnumber");
                      }}
                    >
                      Portabilidade
                    </a>
                  </li>
                </PermissionView>
                <li>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/recharge');
                    }}
                  >
                    {t('Menu.recharge')}
                  </a>
                </li>
                <PermissionView role='CLIENT,AGENT'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/activation');
                      }}
                    >
                      {t('Menu.activation')}
                    </a>
                  </li>
                </PermissionView>
                <PermissionView role='CLIENT,AGENT'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/activation/client/manual');
                      }}
                    >
                      {t('Menu.activeNewLine')}
                    </a>
                  </li>
                </PermissionView>
              </ul>
            </li>
            {/* NOTAS FISCAIS SOMENTE CLIENTE */}
            {/* <PermissionView role="CLIENT">
            <li
              style={{
                backgroundColor: local.pathname === '/nfe' ? '#00D959' : '',
              }}
            >
              <div className='iocn-link' onClick={submenuAction}>
                <a href='#' onClick={() => navigate('/nfe')}>
                  <i className='bx bxs-receipt'></i>
                  <span className='link_name'>Notas fiscais</span>
                </a>
              </div>
              <ul className='sub-menu'>
                <li>
                  <a
                    className='link_name'
                    href='#'
                    onClick={() => navigate('/nfe')}
                  >
                    Notas fiscais
                  </a>
                </li>
              </ul>
            </li>
            </PermissionView> */}
            <PermissionView role='TEGG,DEALER'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/actions' ? '#00D959' : '',
                }}
              >
                <div className='iocn-link' onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/actions');
                    }}
                  >
                    <i className='bx bx-cross'></i>
                    <span className='link_name'>{t('Menu.actions')}</span>
                  </a>
                  {/* <i className='bx bxs-chevron-down arrow'></i> */}
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/actions');
                      }}
                    >
                      {t('Menu.actions')}
                    </a>
                  </li>
                  <PermissionView role='TEGG'>
                  <li>
                    <a href='#' onClick={() => {
                        navigate('/actions/portDoc');
                      }}>
                      Trocas de titularidades
                    </a>
                  </li>
                  </PermissionView>
                  {/* <li>
                  <a href='/admin/partners/new'>Novo Parceiro</a>
                </li> */}
                  {/* <li>
                  <a href="/admin/partners/manager">Bloquear/Desbloquear</a>
                </li> */}
                </ul>
              </li>
            </PermissionView>
            {/* NOTIFICACOES */}
            <PermissionView role='TEGG,DEALER'>
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/iccids' ? '#00D959' : '',
                }}
              >
                <a href='#' onClick={() => navigate('/notifications')}>
                  <i className='bx bxs-chip'></i>
                  <span className='link_name'>Notificações</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a href='#' onClick={() => navigate('/notifications')}>
                      {t('Menu.iccids')}
                    </a>
                  </li>
                </ul>
              </li>
            </PermissionView>
            {/* TUTORIAIS */}
            <li
              style={{
                backgroundColor:
                  // local.pathname === "/streaming" ||
                  local.pathname === '/tutorials' ||
                  local.pathname === '/tutorials/manager'
                    ? '#00D959'
                    : '',
              }}
            >
              <div className='iocn-link' onClick={submenuAction}>
                <a
                  href='#'
                  onClick={() => {
                    navigate('/tutorials');
                  }}
                >
                  <i className='bx bx-play-circle'></i>
                  <span className='link_name'>Tutoriais</span>
                </a>
                <i className='bx bxs-chevron-down arrow'></i>
              </div>
              <ul className='sub-menu'>
                <li>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/tutorials');
                    }}
                  >
                    Tutoriais
                  </a>
                </li>
              </ul>
            </li>
            {/* PERFIL */}
            <li
              style={{
                backgroundColor: local.pathname === '/profile' ? '#00D959' : '',
              }}
            >
              <div className='iocn-link' onClick={submenuAction}>
                <a
                  href='#'
                  onClick={() => {
                    navigate('/profile');
                  }}
                >
                  <i className='bx bxs-user-circle'></i>
                  <span className='link_name'> {t('Menu.profile')}</span>
                </a>
                <i className='bx bxs-chevron-down arrow'></i>
              </div>
              <ul className='sub-menu'>
                <li>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/profile');
                    }}
                  >
                    {t('Menu.profile')}
                  </a>
                </li>
                <li>
                  <a href='#' onClick={goExit}>
                    {t('Menu.exit')}
                  </a>
                </li>
              </ul>
            </li>
            {/* <li>
              <div className='profile-details'>
                <div className='profile-content'>
                  <img src={avatar} alt='profileImg' />
                </div>
                <div className='name-job'>
                  <div className='profile_name'>IT4R Agent</div>
                  <div className='job'>Supervisor</div>
                </div>
                <i className='bx bx-log-out' onClick={goExit}></i>
              </div>
            </li> */}
          </ul>
        </div>
        {/* <section className="home-section">
          <div className="home-content">
            <i className="bx bx-menu" onClick={sideAction}></i>
          </div>
        </section> */}
      </SidebarContainer>
    </>
  );
}
