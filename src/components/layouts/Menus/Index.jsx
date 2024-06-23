import { SidebarContainer } from './styles';

// import avatar from "/assets/avatar.png";
import logoCompleto from '/assets/tegg-verde.png';
import logo from '/assets/tegg-logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

import api from '../../../services/api';
import PermissionView from '../../../routes/PermissionView';

// eslint-disable-next-line react/prop-types
export function Menu({ open, setOpen }) {
  const navigate = useNavigate();
  const local = useLocation();
  // const submenuAction = (e) => {
  //   const submenu = e.target.parentElement.parentElement
  //   submenu.classList.toggle('showMenu')
  // }

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

  const closeAction = () => {
    // console.log(window.innerWidth);
    const action = document.getElementById('sideContainer');
    const headerAction = document.getElementById('headerContainer');
    if (Number(window.innerWidth) <= 768) {
      if (action) {
        if (action?.classList.length !== 2) {
          action.classList.add('close');
          headerAction?.classList.add('close');
          localStorage.setItem('menu', false);
          setOpen(false);
        }
      }
    }
  };

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
      <SidebarContainer open={open}>
        <div id='sideContainer' className={open ? 'sidebar' : 'sidebar close '}>
          <div className='logo-details'>
            {open ? (
              <img
                src={logoCompleto}
                alt='profileImg'
                style={{ cursor: 'pointer' }}
                onClick={() => sideAction()}
              />
            ) : (
              <img
                src={logo}
                alt='profileImg'
                style={{ cursor: 'pointer' }}
                onClick={() => sideAction()}
              />
            )}
          </div>
          <ul className='nav-links'>
            <PermissionView role='CLIENT'>
              {/* DASHBOARD */}
              <li
                style={{
                  backgroundColor: local.pathname === '/' ? '#00D959' : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    navigate('/');
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-dashboard'
                    style={{
                      color: local.pathname === '/' ? '#fff' : '',
                    }}
                  />
                  <span className='link_name'>Início</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/');
                      }}
                    >
                      Início
                    </a>
                  </li>
                </ul>
              </li>
              {/* RECARGAS */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/recharge' ||
                    local.pathname === '/recharge/new' ||
                    local.pathname === '/recharge/pay' ||
                    local.pathname === '/orders' ||
                    local.pathname === '/orders/' ||
                    local.pathname === '/orders/new/chip' ||
                    local.pathname === '/orders/new/esim' ||
                    local.pathname === '/orders/sendIccid' ||
                    local.pathname === '/orders/pay'
                      ? '#00D959'
                      : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/recharge');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-wallet-alt'
                      style={{
                        color:
                          local.pathname === '/recharge' ||
                          local.pathname === '/recharge/new' ||
                          local.pathname === '/recharge/pay' ||
                          local.pathname === '/orders' ||
                          local.pathname === '/orders/' ||
                          local.pathname === '/orders/new/chip' ||
                          local.pathname === '/orders/new/esim' ||
                          local.pathname === '/orders/sendIccid' ||
                          local.pathname === '/orders/pay'
                            ? '#fff'
                            : '',
                      }}
                    ></i>
                    <span className='link_name'>Recarga</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color:
                        local.pathname === '/recharge' ||
                        local.pathname === '/recharge/new' ||
                        local.pathname === '/recharge/pay' ||
                        local.pathname === '/orders' ||
                        local.pathname === '/orders/' ||
                        local.pathname === '/orders/new/chip' ||
                        local.pathname === '/orders/new/esim' ||
                        local.pathname === '/orders/sendIccid' ||
                        local.pathname === '/orders/pay'
                          ? '#fff'
                          : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/recharge');
                        closeAction();
                      }}
                    >
                      Recarga
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/orders' ||
                          local.pathname === '/orders/new/chip' ||
                          local.pathname === '/orders/new/esim' ||
                          local.pathname === '/orders/sendIccid' ||
                          local.pathname === '/orders/pay'
                            ? '#00D959'
                            : '',

                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/orders');
                        closeAction();
                      }}
                    >
                      Pedidos
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
                    local.pathname === '/subscriptions' ||
                    local.pathname === '/subscriptions/new/' ||
                    local.pathname === '/portRequests' ||
                    local.pathname === '/portRequests/new'
                      ? '#00D959'
                      : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/lines');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-phone'
                      style={{
                        color:
                          local.pathname === '/lines' ||
                          local.pathname === '/lines/esim/' ||
                          local.pathname === '/subscriptions' ||
                          local.pathname === '/subscriptions/new/' ||
                          local.pathname === '/portRequests' ||
                          local.pathname === '/portRequests/new'
                            ? '#fff'
                            : '',
                      }}
                    ></i>
                    <span className='link_name'>Linhas</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color:
                        local.pathname === '/lines' ||
                        local.pathname === '/lines/esim/' ||
                        local.pathname === '/subscriptions' ||
                        local.pathname === '/subscriptions/new/' ||
                        local.pathname === '/portRequests' ||
                        local.pathname === '/portRequests/new'
                          ? '#fff'
                          : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/lines');
                        closeAction();
                      }}
                    >
                      Linhas
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/subscriptions' ||
                          local.pathname === '/subscriptions/new/'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/subscriptions');
                        closeAction();
                      }}
                    >
                      Assinaturas
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/portRequests' ||
                          local.pathname === '/portRequests/new'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/portRequests');
                        closeAction();
                      }}
                    >
                      Portabilidade
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/activation' ||
                          local.pathname === '/activation/new'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/activation');
                        closeAction();
                      }}
                    >
                      Ativações
                    </a>
                  </li>
                </ul>
              </li>
              {/* NF-e */}
              <li
                style={{
                  backgroundColor: local.pathname === '/nfe' ? '#00D959' : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    navigate('/nfe');
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-receipt'
                    style={{
                      color: local.pathname === '/nfe' ? '#fff' : '',
                    }}
                  />
                  <span className='link_name'>Notas fiscais</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/nfe');
                        closeAction();
                      }}
                    >
                      Notas fiscais
                    </a>
                  </li>
                </ul>
              </li>
              {/* PERFIL */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/profile' ? '#00D959' : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/profile');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-user-circle'
                      style={{
                        color: local.pathname === '/profile' ? '#fff' : '',
                      }}
                    ></i>
                    <span className='link_name'>Perfil</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color: local.pathname === '/profile' ? '#fff' : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/profile');
                        closeAction();
                      }}
                    >
                      Perfil
                    </a>
                  </li>
                  <li>
                    <a href='#' style={{ paddingLeft: 5 }} onClick={goExit}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </PermissionView>
            <PermissionView role='DEALER'>
              {/* DASHBOARD */}
              <li
                style={{
                  backgroundColor: local.pathname === '/' ? '#00D959' : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    navigate('/');
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-dashboard'
                    style={{
                      color: local.pathname === '/' ? '#fff' : '',
                    }}
                  />
                  <span className='link_name'>Início</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/');
                        closeAction();
                      }}
                    >
                      Início
                    </a>
                  </li>
                </ul>
              </li>
              {/* CLIENTES */}
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
                    closeAction();
                  }}
                >
                  <i
                    className='bx bx-body'
                    style={{
                      color:
                        local.pathname === '/clients' ||
                        local.pathname === '/clients/' ||
                        local.pathname === '/clients/new' ||
                        local.pathname === '/clients/edit'
                          ? '#fff'
                          : '',
                    }}
                  />
                  <span className='link_name'>Clientes</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/clients');
                        closeAction();
                      }}
                    >
                      Clientes
                    </a>
                  </li>
                </ul>
              </li>
              {/* ICCIDS */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/iccids' ||
                    local.pathname === '/iccids/' ||
                    local.pathname === '/iccids/new'
                      ? '#00D959'
                      : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    navigate('/iccids');
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-chip'
                    style={{
                      color:
                        local.pathname === '/iccids' ||
                        local.pathname === '/iccids/' ||
                        local.pathname === '/iccids/new'
                          ? '#fff'
                          : '',
                    }}
                  />
                  <span className='link_name'>ICCIDs</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/iccids');
                        closeAction();
                      }}
                    >
                      ICCIDs
                    </a>
                  </li>
                </ul>
              </li>
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
                    local.pathname === '/nfe'
                      ? '#00D959'
                      : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/orders');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-add-to-queue'
                      style={{
                        color:
                          local.pathname === '/orders' ||
                          local.pathname === '/orders/' ||
                          local.pathname === '/orders/new/chip' ||
                          local.pathname === '/orders/new/esim' ||
                          local.pathname === '/orders/sendIccid' ||
                          local.pathname === '/orders/pay' ||
                          local.pathname === '/nfe'
                            ? '#fff'
                            : '',
                      }}
                    ></i>
                    <span className='link_name'>Pedidos</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color:
                        local.pathname === '/orders' ||
                        local.pathname === '/orders/' ||
                        local.pathname === '/orders/new/chip' ||
                        local.pathname === '/orders/new/esim' ||
                        local.pathname === '/orders/sendIccid' ||
                        local.pathname === '/orders/pay' ||
                        local.pathname === '/nfe'
                          ? '#fff'
                          : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/orders');
                        closeAction();
                      }}
                    >
                      Pedidos
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/nfe' ? '#00D959' : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/nfe');
                        closeAction();
                      }}
                    >
                      Notas fiscais
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/orders/pending' ? '#00D959' : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/orders/pending');
                        closeAction();
                      }}
                    >
                      Pedidos Pendentes
                    </a>
                  </li>
                  <PermissionView role='TEGG'>
                    <li>
                      <a
                        href='#'
                        style={{
                          paddingLeft: 5,
                          backgroundColor:
                            local.pathname === '/activation'
                              ? '#00D959'
                              : '',
                          opacity: 1,
                          borderRadius: 5,
                        }}
                        onClick={() => {
                          navigate('/activation');
                          closeAction();
                        }}
                      >
                        Ativações Pendentes
                      </a>
                    </li>
                  </PermissionView>
                </ul>
              </li>
              {/* LINHAS */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/lines' ||
                    local.pathname === '/lines/esim/' ||
                    local.pathname === '/subscriptions' ||
                    local.pathname === '/subscriptions/new/' ||
                    local.pathname === '/portRequests' ||
                    local.pathname === '/portRequests/new' ||
                    local.pathname === '/recharge' ||
                    local.pathname === '/recharge/new' ||
                    local.pathname === '/recharge/pay'
                      ? '#00D959'
                      : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/lines');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-phone'
                      style={{
                        color:
                          local.pathname === '/lines' ||
                          local.pathname === '/lines/esim/' ||
                          local.pathname === '/subscriptions' ||
                          local.pathname === '/subscriptions/new/' ||
                          local.pathname === '/portRequests' ||
                          local.pathname === '/portRequests/new' ||
                          local.pathname === '/recharge' ||
                          local.pathname === '/recharge/new' ||
                          local.pathname === '/recharge/pay'
                            ? '#fff'
                            : '',
                      }}
                    ></i>
                    <span className='link_name'>Linhas</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color:
                        local.pathname === '/lines' ||
                        local.pathname === '/lines/esim/' ||
                        local.pathname === '/subscriptions' ||
                        local.pathname === '/subscriptions/new/' ||
                        local.pathname === '/portRequests' ||
                        local.pathname === '/portRequests/new' ||
                        local.pathname === '/recharge' ||
                        local.pathname === '/recharge/new' ||
                        local.pathname === '/recharge/pay'
                          ? '#fff'
                          : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/lines');
                        closeAction();
                      }}
                    >
                      Linhas
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/subscriptions' ||
                          local.pathname === '/subscriptions/new/'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/subscriptions');
                        closeAction();
                      }}
                    >
                      Assinaturas
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/portRequests' ||
                          local.pathname === '/portRequests/new'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/portRequests');
                        closeAction();
                      }}
                    >
                      Portabilidade
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/recharge' ||
                          local.pathname === '/recharge/new' ||
                          local.pathname === '/recharge/pay'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/recharge');
                        closeAction();
                      }}
                    >
                      Recargas
                    </a>
                  </li>
                </ul>
              </li>
              {/* PERFIL */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/profile' ? '#00D959' : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/profile');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-user-circle'
                      style={{
                        color: local.pathname === '/profile' ? '#fff' : '',
                      }}
                    ></i>
                    <span className='link_name'>Perfil</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color: local.pathname === '/profile' ? '#fff' : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/profile');
                        closeAction();
                      }}
                    >
                      Perfil
                    </a>
                  </li>
                  <li>
                    <a href='#' style={{ paddingLeft: 5 }} onClick={goExit}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </PermissionView>
            <PermissionView role='TEGG'>
              {/* DASHBOARD */}
              <li
                style={{
                  backgroundColor: local.pathname === '/' ? '#00D959' : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    navigate('/');
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-dashboard'
                    style={{
                      color: local.pathname === '/' ? '#fff' : '',
                    }}
                  />
                  <span className='link_name'>Início</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/');
                      }}
                    >
                      Início
                    </a>
                  </li>
                </ul>
              </li>
              {/* PLANOS */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/plans' ||
                    local.pathname === '/plans/' ||
                    local.pathname === '/plans/new'
                      ? '#00D959'
                      : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    navigate('/plans');
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-notepad'
                    style={{
                      color:
                        local.pathname === '/plans' ||
                        local.pathname === '/plans/' ||
                        local.pathname === '/plans/new'
                          ? '#fff'
                          : '',
                    }}
                  />
                  <span className='link_name'>Planos</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/plans');
                      }}
                    >
                      Planos
                    </a>
                  </li>
                </ul>
              </li>
              {/* PRODUTOS */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/products' ||
                    local.pathname === '/products/' ||
                    local.pathname === '/products/new' ||
                    local.pathname === '/products/edit'
                      ? '#00D959'
                      : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    navigate('/products');
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-package'
                    style={{
                      color:
                        local.pathname === '/products' ||
                        local.pathname === '/products/' ||
                        local.pathname === '/products/new' ||
                        local.pathname === '/products/edit'
                          ? '#fff'
                          : '',
                    }}
                  />
                  <span className='link_name'>Produtos</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/products');
                      }}
                    >
                      Produtos
                    </a>
                  </li>
                </ul>
              </li>
              {/* ICCIDS */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/iccids' ||
                    local.pathname === '/iccids/' ||
                    local.pathname === '/iccids/new'
                      ? '#00D959'
                      : '',
                }}
              >
                <a
                  href='#'
                  onClick={() => {
                    navigate('/iccids');
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-chip'
                    style={{
                      color:
                        local.pathname === '/iccids' ||
                        local.pathname === '/iccids/' ||
                        local.pathname === '/iccids/new'
                          ? '#fff'
                          : '',
                    }}
                  />
                  <span className='link_name'>ICCIDs</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      href='#'
                      onClick={() => {
                        navigate('/iccids');
                        closeAction();
                      }}
                    >
                      ICCIDs
                    </a>
                  </li>
                </ul>
              </li>
              {/* REVENDAS */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/salesforce' ||
                    local.pathname === '/salesforce/' ||
                    local.pathname === '/salesforce/new' ||
                    local.pathname === '/salesforce/edit' ||
                    local.pathname === '/salesforce/details'
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
                    closeAction();
                  }}
                >
                  <i
                    className='bx bxs-store-alt'
                    style={{
                      color:
                        local.pathname === '/salesforce' ||
                        local.pathname === '/salesforce/' ||
                        local.pathname === '/salesforce/new' ||
                        local.pathname === '/salesforce/edit' ||
                        local.pathname === '/salesforce/details'
                          ? '#fff'
                          : '',
                    }}
                  />
                  <span className='link_name'>
                    {api.currentUser.AccessTypes[0] === 'TEGG'
                      ? 'Revendas'
                      : 'Revenda'}
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
                        ? 'Revendas'
                        : 'Revenda'}
                    </a>
                  </li>
                </ul>
              </li>
              {/* CLIENTES */}
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
                    closeAction();
                  }}
                >
                  <i
                    className='bx bx-body'
                    style={{
                      color:
                        local.pathname === '/clients' ||
                        local.pathname === '/clients/' ||
                        local.pathname === '/clients/new' ||
                        local.pathname === '/clients/edit'
                          ? '#fff'
                          : '',
                    }}
                  />
                  <span className='link_name'>Clientes</span>
                </a>
                <ul className='sub-menu blank'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/clients');
                        closeAction();
                      }}
                    >
                      Clientes
                    </a>
                  </li>
                </ul>
              </li>
              {/* COMISSÕES */}
              {/* 
							<li
								style={{
									backgroundColor:
										local.pathname === "/comissions" ||
										local.pathname === "/comissions/"
											? "#00D959"
											: "",
								}}>
								<a
									href="#"
									onClick={() => {
										navigate("/comissions");
										closeAction();
									}}>
									<i
										className="bx bx-money"
										style={{
											color:
												local.pathname === "/comissions" ||
												local.pathname === "/comissions/"
													? "#fff"
													: "",
										}}
									/>
									<span className="link_name">Comissões</span>
								</a>
								<ul className="sub-menu blank">
									<li>
										<a className="link_name" href="/clients/">
											Comissões
										</a>
									</li>
								</ul>
							</li>
						*/}
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
                    local.pathname === '/nfe'
                      ? '#00D959'
                      : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/orders');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-add-to-queue'
                      style={{
                        color:
                          local.pathname === '/orders' ||
                          local.pathname === '/orders/' ||
                          local.pathname === '/orders/new/chip' ||
                          local.pathname === '/orders/new/esim' ||
                          local.pathname === '/orders/sendIccid' ||
                          local.pathname === '/orders/pay' ||
                          local.pathname === '/nfe'
                            ? '#fff'
                            : '',
                      }}
                    ></i>
                    <span className='link_name'>Pedidos</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color:
                        local.pathname === '/orders' ||
                        local.pathname === '/orders/' ||
                        local.pathname === '/orders/new/chip' ||
                        local.pathname === '/orders/new/esim' ||
                        local.pathname === '/orders/sendIccid' ||
                        local.pathname === '/orders/pay' ||
                        local.pathname === '/nfe'
                          ? '#fff'
                          : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/orders');
                        closeAction();
                      }}
                    >
                      Pedidos
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/orders' ? '#00D959' : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/orders');
                        closeAction();
                      }}
                    >
                      Pedidos
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/statement' ? '#00D959' : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/statement');
                        closeAction();
                      }}
                    >
                      Extrato
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/orders/pending' ? '#00D959' : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/orders/pending');
                        closeAction();
                      }}
                    >
                      Pedidos Pendentes
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/nfe' ? '#00D959' : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/nfe');
                        closeAction();
                      }}
                    >
                      Notas fiscais
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
                    local.pathname === '/subscriptions' ||
                    local.pathname === '/subscriptions/new/' ||
                    local.pathname === '/portRequests' ||
                    local.pathname === '/portRequests/new' ||
                    local.pathname === '/recharge' ||
                    local.pathname === '/recharge/new' ||
                    local.pathname === '/recharge/pay'
                      ? '#00D959'
                      : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/lines');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-phone'
                      style={{
                        color:
                          local.pathname === '/lines' ||
                          local.pathname === '/lines/esim/' ||
                          local.pathname === '/subscriptions' ||
                          local.pathname === '/subscriptions/new/' ||
                          local.pathname === '/portRequests' ||
                          local.pathname === '/portRequests/new' ||
                          local.pathname === '/recharge' ||
                          local.pathname === '/recharge/new' ||
                          local.pathname === '/recharge/pay'
                            ? '#fff'
                            : '',
                      }}
                    ></i>
                    <span className='link_name'>Linhas</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color:
                        local.pathname === '/lines' ||
                        local.pathname === '/lines/esim/' ||
                        local.pathname === '/subscriptions' ||
                        local.pathname === '/subscriptions/new/' ||
                        local.pathname === '/portRequests' ||
                        local.pathname === '/portRequests/new' ||
                        local.pathname === '/recharge' ||
                        local.pathname === '/recharge/new' ||
                        local.pathname === '/recharge/pay'
                          ? '#fff'
                          : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/lines');
                        closeAction();
                      }}
                    >
                      Linhas
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/subscriptions' ||
                          local.pathname === '/subscriptions/new/'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/subscriptions');
                        closeAction();
                      }}
                    >
                      Assinaturas
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/portRequests' ||
                          local.pathname === '/portRequests/new'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/portRequests');
                        closeAction();
                      }}
                    >
                      Portabilidade
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      style={{
                        paddingLeft: 5,
                        backgroundColor:
                          local.pathname === '/recharge' ||
                          local.pathname === '/recharge/new' ||
                          local.pathname === '/recharge/pay'
                            ? '#00D959'
                            : '',
                        opacity: 1,
                        borderRadius: 5,
                      }}
                      onClick={() => {
                        navigate('/recharge');
                        closeAction();
                      }}
                    >
                      Recargas
                    </a>
                  </li>
                </ul>
              </li>
              {/* PERFIL */}
              <li
                style={{
                  backgroundColor:
                    local.pathname === '/profile' ? '#00D959' : '',
                }}
              >
                <div style={{ display: 'flex' }} onClick={submenuAction}>
                  <a
                    href='#'
                    onClick={() => {
                      navigate('/profile');
                      closeAction();
                    }}
                  >
                    <i
                      className='bx bxs-user-circle'
                      style={{
                        color: local.pathname === '/profile' ? '#fff' : '',
                      }}
                    ></i>
                    <span className='link_name'>Perfil</span>
                  </a>
                  <i
                    className='bx bxs-chevron-down arrow'
                    style={{
                      color: local.pathname === '/profile' ? '#fff' : '',
                    }}
                  ></i>
                </div>
                <ul className='sub-menu'>
                  <li>
                    <a
                      className='link_name'
                      href='#'
                      onClick={() => {
                        navigate('/profile');
                        closeAction();
                      }}
                    >
                      Perfil
                    </a>
                  </li>
                  <li>
                    <a href='#' style={{ paddingLeft: 5 }} onClick={goExit}>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </PermissionView>
            {/* <li>
							<div className="profile-details">
								<div className="profile-content">
									<img src={avatar} alt="profileImg" />
								</div>
								<div className="name-job">
									<div
										className="profile_name"
										onClick={() => {}}
										style={{
											color: "#fff",
										}}>
										<p>
											{api.currentUser.Name.includes(" ")
												? api.currentUser.Name.substring(
														0,
														api.currentUser.Name.indexOf(" ")
												  ).toUpperCase()
												: api.currentUser.Name.toUpperCase()}
										</p>
									</div>
								</div>
								<i className="bx bx-log-out" onClick={goExit}></i>
							</div>
						</li> */}
          </ul>
        </div>
      </SidebarContainer>
    </>
  );
}
