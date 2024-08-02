import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { Button, PageLayout } from '../../../globalStyles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ContainerTable } from '../resales/Resales.styles';
import { toast } from 'react-toastify';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Switch from 'react-switch';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import './orders.css';
import { OrderInfo } from './OrderInfo';
import { TableItens } from './clientNew/NewOrder.styles';
import { translateError, translateStatus } from '../../services/util';
import moment from 'moment';
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
import { IoMdMore } from 'react-icons/io';

export const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersPending, setOrdersPending] = useState([]);
  const [personalOrders, setPersonalOrders] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [esim, setEsim] = useState();
  const [esimOpt, setEsimOpt] = useState([]);
  const [openEsim, setOpenEsim] = useState(false);

  const [tmpOrder, setTmpOrder] = useState();
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [dealerSearching, setDealerSearching] = useState(false);
  const [dealerLoading, setDealerLoading] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState({
    label: 'Todas',
    value: 'all',
  });
  const [pageNumDealer, setPageNumDealer] = useState(1);
  const [maxPagesDealer, setMaxPagesDealer] = useState(1);

  const [statusSearching, setStatusSearching] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({
    value: 'all',
    label: 'Todos',
  });
  const [pageNumStatus, setPageNumStatus] = useState(1);
  const [maxPagesStatus, setMaxPagesStatus] = useState(1);
  const statusOptions = [
    {
      value: 'all',
      label: 'Todos',
    },
    {
      value: 'Created',
      label: 'Aguardando pagamento',
    },
    {
      value: 'CONFIRMED',
      label: 'Pagamento confirmado',
    },
    {
      value: 'RECEIVED',
      label: 'Pagamento recebido',
    },
    {
      value: 'CANCELED',
      label: 'Cancelado',
    },
  ];

  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);

  const searchOrder = () => {
    api.purchaseorder
      .getAll(pageNum, pageSize, '')
      .then((res) => {
        console.log(res.data);
        setMaxPages(res.data.meta.totalPages || 1);
        setOrdersPending(res.data?.purchaseOrder);
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      });
  };

  const searchOrders = (num, dealer, pageSize) => {
    setLoadingPage(true);
    setDealerLoading(true);
    setOrders([]);
    if (api.currentUser.AccessTypes[0] === 'DEALER' && personalOrders) {
      api.order
        .getDealerOrders(num, pageSize)
        .then((res) => {
          // console.log("ORDER", res.data.orders);
          setOrders(res.data.orders);
          setMaxPages(res.data.meta.totalPages || 1);
        })
        .catch((err) => {
          console.log(err);
          // translateError(err);
        })
        .finally(() => {
          setLoadingPage(false);
          setDealerLoading(false);
        });
    } else {
      if (dealer === 'all') {
        api.order
          .getAll(num, pageSize)
          // .getDealerOrders(num, pageSize)
          .then((res) => {
            console.log(res);
            setOrders(res.data.orders);
            setMaxPages(res.data.meta.totalPages || 1);
          })
          .catch((err) => {
            console.log(err);
            // translateError(err);
          })
          .finally(() => {
            setLoadingPage(false);
            setDealerLoading(false);
          });
      } else {
        api.order
          .getSome(num, pageSize, dealer)
          // .getDealerOrders(num, pageSize)
          .then((res) => {
            // console.log("ORDER", res.data.orders);
            setOrders(res.data.orders);
            setMaxPagesDealer(res.data.meta.totalPages || 1);
          })
          .catch((err) => {
            console.log(err);
            // translateError(err);
          })
          .finally(() => {
            setLoadingPage(false);
            setDealerLoading(false);
          });
      }
    }
  };

  const searchStatusOrders = (num, status, pageSize) => {
    setLoadingPage(true);
    setStatusLoading(true);
    setOrders([]);

    if (status === 'all') {
      api.order
        .getAll(num, pageSize)
        // .getDealerOrders(num, pageSize)
        .then((res) => {
          console.log('ORDER', res.data.orders);
          setOrders(res.data.orders);
          setMaxPages(res.data.meta.totalPages || 1);
        })
        .catch((err) => {
          console.log(err);
          // translateError(err);
        })
        .finally(() => {
          setLoadingPage(false);
          setStatusLoading(false);
        });
    } else {
      api.order
        .getByStatus(num, pageSize, status)
        // .getDealerOrders(num, pageSize)
        .then((res) => {
          // console.log("ORDER", res.data.orders);
          setOrders(res.data.orders);
          setMaxPagesStatus(res.data.meta.totalPages || 1);
        })
        .catch((err) => {
          console.log(err);
          // translateError(err);
        })
        .finally(() => {
          setLoadingPage(false);
          setStatusLoading(false);
        });
    }
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
    searchOrders(value, 'all', pageSize);
  };

  const handlePageChangeDealer = (event, value) => {
    setPageNumDealer(value);
    searchOrders(value, selectedDealer, pageSize);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadDealers = async (search) => {
    // console.log(search);
    if (api.currentUser.AccessTypes[0] === 'TEGG') {
      const response = await api.dealer.getSome(
        pageNumDealer,
        pageSize,
        search
      );
      // console.log(response.data.dealers);
      const dealers = await response.data.dealers;
      const array = [];
      array.push({
        label: 'Todas',
        value: 'all',
      });
      for (const d of dealers) {
        array.push({
          label: d.CompanyName || d.Name,
          value: d.Cnpj || d.Cpf,
        });
      }
      return array;
    }
  };

  const handleDealerChange = (e) => {
    // console.log(e);
    setSelectedStatus({
      value: 'all',
      label: 'Todos',
    });
    setSelectedDealer(e);
    setStatusSearching(false);
    if (e.value === 'all') {
      setDealerSearching(false);
    } else {
      setDealerSearching(true);
    }
    setPageNum(1);
    setPageNumDealer(1);
    searchOrders(1, e.value, pageSize);
  };

  const handleSwitchChange = (checked) => {
    // console.log(checked);
    setPersonalOrders(checked);
  };

  const handleStatusSearch = (e) => {
    // console.log(e.value);
    setSelectedStatus(e);
    setSelectedDealer({
      label: 'Todas',
      value: 'all',
    });
    setPersonalOrders(false);
    setDealerSearching(false);
    if (e.value === 'all') {
      setPageNum(1);
      setStatusSearching(false);
      searchOrders(1, 'all', pageSize);
    } else {
      setPageNumStatus(1);
      setStatusSearching(true);
      searchStatusOrders(1, e.value, pageSize);
    }
  };

  const handlePageChangeStatus = (event, value) => {
    setPageNumStatus(value);
    searchStatusOrders(value, selectedStatus, pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNum(1);
    setPageNumDealer(1);
    setPageNumStatus(1);
    setSelectedDealer({
      label: 'Todas',
      value: 'all',
    });
    setSelectedStatus({
      value: 'all',
      label: 'Todos',
    });
    searchOrders(1, 'all', e.target.value);
  };

  useEffect(() => {
    searchOrders(pageNum, 'all', pageSize);
    searchOrder();
  }, []);

  useEffect(() => {
    setPageNum(1);
    searchOrders(1, 'all', pageSize);
  }, [personalOrders]);

  const returnQtdEsim = (items) => {
    let eSim = 0;
    items.forEach((item) => {
      eSim += item.QuantityEsim;
    });
    return eSim;
  };

  const returnQtdSimCard = (items) => {
    let simCard = 0;
    items.forEach((item) => {
      simCard += item.QuantitySimCard;
    });
    return simCard;
  };

  const handleClick = (event, order) => {
    setTmpOrder(order);
    setAnchorEl(event.currentTarget);
  };

  const searchEsim = (e) => {
    console.log(e);
    const list = [];
    e.PurchaseOrderItems?.forEach((item) => {
      item?.TrackerIccid?.forEach((i) => {
        if (i?.Iccid?.LPAUrl) {
          list.push({ label: i.IccidId, value: i.IccidId });
        }
      });
    });
    setEsimOpt(list);
  };

  const getQrcode = () => {
    if(esim){
      setLoading(true);
      api.iccid
        .getlpaqrcode(esim.value)
        .then((res) => {
          var blob = new Blob([res.data], { type: 'application/octet-stream' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.download = 'esim.pdf';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          setOpenEsim(false)
          setEsim()
          toast.success('Download do pdf realizado com sucesso.')
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {setLoading(false)})
    }else{
      toast.error('Selecione um Iccid')
    }
    
  };

  return (
    <>
      <PageLayout>
        {/* {api.currentUser.AccessTypes[0] === 'CLIENT' && (
          <Button
            onClick={async () => {
              if (personalOrders) {
                navigate('/orders/new/chip', {
                  state: {
                    personal: true,
                  },
                });
              } else {
                if (api.currentUser.AccessTypes[0] !== 'CLIENT') {
                  navigate('/orders/new/chip');
                } else {
                  const { data } = await api.iccid.checkFree('iccid', 'all');
                  if (data !== 0) {
                    navigate('/orders/new/chip');
                  } else {
                    toast.error(
                      'Não existem chips físicos disponíveis para compra, fale com seu vendedor para saber quando haverá estoque'
                    );
                  }
                }
              }
            }}
          >
            {api.currentUser.AccessTypes[0] === 'TEGG' ||
            api.currentUser.AccessTypes[0] === 'DEALER'
              ? `+ PEDIDO${personalOrders ? ' PESSOAL' : ''} DE CHIP FÍSICO`
              : '+ COMPRAR NOVO CHIP FÍSICO'}
          </Button>
        )} */}
        {/* {api.currentUser.AccessTypes[0] === 'CLIENT' && (
          <Button
            style={{ marginLeft: 20 }}
            onClick={async () => {
              if (personalOrders) {
                navigate('/orders/new/esim', {
                  state: {
                    personal: true,
                  },
                });
              } else {
                if (api.currentUser.AccessTypes[0] !== 'CLIENT') {
                  navigate('/orders/new/esim');
                } else {
                  const { data } = await api.iccid.checkFree('esim', 'all');
                  if (data !== 0) {
                    navigate('/orders/new/esim');
                  } else {
                    toast.error(
                      'Não existem e-SIMs disponíveis para compra, fale com seu vendedor para saber quando haverá estoque'
                    );
                  }
                }
              }
            }}
          >
            {api.currentUser.AccessTypes[0] === 'TEGG' ||
            api.currentUser.AccessTypes[0] === 'DEALER'
              ? `+ PEDIDO${personalOrders ? ' PESSOAL' : ''} DE e-SIM`
              : '+ COMPRAR NOVO e-SIM'}
          </Button>
        )} */}
        {/* {console.log(api.currentUser.AccessTypes[0])} */}
        {/* {api.currentUser.AccessTypes[0] !== 'CLIENT' && ( */}
        <Button
          style={{ marginLeft: 20 }}
          onClick={async () => {
            if (api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') {
              navigate('/orders/new');
            } else {
              navigate('/orders/newbyclient');
            }
          }}
        >
          + Novo Pedido
        </Button>
        {/* )} */}
        <ContainerTable>
          <div className='order_select_container'>
            <h2>
              {api.currentUser.AccessTypes[0] === 'TEGG' ||
              api.currentUser.AccessTypes[0] === 'DEALER'
                ? 'Pedidos'
                : 'Minhas compras'}
            </h2>
            <div className='order_select_container_2'>
              <div className='order_select'>
                {api.currentUser.AccessTypes[0] === 'TEGG' && (
                  <>
                    <p>Filtrar por revenda:</p>
                    <div>
                      <AsyncSelect
                        placeholder='Selecione...'
                        value={selectedDealer}
                        defaultOptions
                        isDisabled={dealerLoading}
                        loadOptions={loadDealers}
                        onChange={(e) => {
                          // console.log(e);
                          handleDealerChange(e);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              {api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' && (
                <div className='order_select'>
                  <p>Filtrar por status:</p>
                  <div>
                    <Select
                      placeholder='Selecione...'
                      value={selectedStatus}
                      isSearchable={false}
                      isDisabled={statusLoading}
                      options={statusOptions}
                      // defaultValue={statusOptions[0]}
                      onChange={(e) => {
                        handleStatusSearch(e);
                      }}
                    />
                  </div>
                </div>
              )}

              {api.currentUser.AccessTypes[0] === 'DEALER' && (
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <h3>Clientes</h3>
                  <Switch
                    disabled={statusSearching}
                    checked={personalOrders}
                    onColor='#888'
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onChange={handleSwitchChange}
                  />
                  <h3>Pessoais</h3>
                </div>
              )}
            </div>
          </div>
          {loadingPage ? (
            <div className='loading'>
              <ReactLoading type={'bars'} color={'#000'} />
            </div>
          ) : orders.length > 0 ? (
            api.currentUser.Type !== 'CLIENT' ? (
              <table id='customers'>
                <thead>
                  <tr>
                    <th>Data de criação</th>
                    <th>Vendedor</th>
                    <th>Cliente</th>
                    <th>Tipo</th>
                    <th>Status pagamento</th>
                    <th>Status frete</th>
                    <th>Opções</th>
                  </tr>
                </thead>
                {orders.map((o, ind) => (
                  <OrderInfo
                    key={ind}
                    order={o}
                    search={searchOrders}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    personalOrders={personalOrders}
                  />
                ))}
              </table>
            ) : (
              <TableItens>
                <tr>
                  <th>Cliente</th>
                  {api.currentUser.AccessTypes[0] === 'TEGG' && (
                    <th>Revenda</th>
                  )}
                  <th>Status</th>
                  <th>Itens do pedido</th>
                  <th>Data criação</th>
                  <th>Iccids</th>
                </tr>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan='6'>
                      <h5 style={{ textAlign: 'center' }}>
                        Sem pedidos pendentes
                      </h5>{' '}
                    </td>
                  </tr>
                )}

                {ordersPending.map((o) => (
                  <tr key={o.Id}>
                    <td>{o?.FinalClient?.Name}</td>
                    {api.currentUser.AccessTypes[0] === 'TEGG' && (
                      <td>{o?.Dealer?.Name || 'TEGG'}</td>
                    )}
                    <td>{translateStatus(o?.Status)}</td>
                    <td>
                      {o?.PurchaseOrderItems?.map((i, ii) => (
                        <h5 key={ii}>{i?.Plan?.Name}</h5>
                      ))}
                    </td>
                    <td>{moment(o?.CreatedAt).format('DD/MM/YYYY HH:mm')}</td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <h5>
                            SimCard: {returnQtdSimCard(o?.PurchaseOrderItems)}
                          </h5>
                          <h5>e-Sim: {returnQtdEsim(o?.PurchaseOrderItems)}</h5>
                        </div>
                        <div>
                          <IconButton
                            aria-label='more'
                            id='long-button'
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup='true'
                            onClick={(e) => handleClick(e, o)}
                          >
                            {/* <MoreVertIcon /> */}
                            <IoMdMore />
                          </IconButton>
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
                              },
                            }}
                          >
                            {/* <MenuItem
                              disabled={
                                tmpOrder?.Status !== 'AWAITINGPROCESSING'
                              }
                              onClick={() => {
                                setAnchorEl(null);
                                setShowAddIccid(true);
                              }}
                            >
                              Atender pedido
                            </MenuItem> */}
                            <MenuItem
                              disabled={!tmpOrder?.Payments[0]?.InvoiceUrl}
                              onClick={() => {
                                setAnchorEl(null);
                                window.open(
                                  tmpOrder?.Payments[0]?.InvoiceUrl,
                                  '_black'
                                );
                              }}
                            >
                              Recibo pagamento
                            </MenuItem>
                            <MenuItem
                              disabled={!tmpOrder?.NFe[0]?.PDFLink}
                              onClick={() => {
                                setAnchorEl(null);
                                window.open(
                                  tmpOrder?.NFe[0]?.PDFLink,
                                  '_black'
                                );
                              }}
                            >
                              PDF Nfe
                            </MenuItem>
                            <MenuItem
                              // disabled={tmpOrder?.PurchaseOrderItems?.forEach((p)=> {return p?.TrackerIccid?.find((t) => t.Iccid?.LPAUrl)})}
                              disabled={!tmpOrder?.PurchaseOrderItems.some((s) =>
                                s?.TrackerIccid?.some((t) => t.Iccid.LPAUrl)
                              )}
                              onClick={() => {
                                // console.log(tmpOrder);
                                searchEsim(tmpOrder);
                                setAnchorEl(null);
                                setOpenEsim(true);
                                // window.open(tmpOrder?.NFe[0]?.PDFLink, '_black');
                              }}
                            >
                              e-Sim do pedido
                            </MenuItem>
                          </Menu>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </TableItens>
            )
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
              }}
            >
              <h2 style={{ color: 'black', fontWeight: 'bold' }}>
                {`Ainda não existem ${
                  api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT'
                    ? 'pedidos cadastrados'
                    : 'compras cadastradas'
                }`}
              </h2>
            </div>
          )}
        </ContainerTable>
        <br />
        {dealerSearching ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={2}>
              <Pagination
                count={maxPagesDealer}
                page={pageNumDealer}
                onChange={handlePageChangeDealer}
                variant='outlined'
                shape='rounded'
              />
            </Stack>
          </div>
        ) : statusSearching ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={2}>
              <Pagination
                count={maxPagesStatus}
                page={pageNumStatus}
                onChange={handlePageChangeStatus}
                variant='outlined'
                shape='rounded'
              />
            </Stack>
          </div>
        ) : (
          api.currentUser.Type !== 'CLIENT' && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Stack spacing={2}>
                <Pagination
                  count={maxPages}
                  page={pageNum}
                  onChange={handlePageChange}
                  variant='outlined'
                  shape='rounded'
                />
              </Stack>
            </div>
          )
        )}
        {api.currentUser.Type !== 'CLIENT' ? (
          <div
            style={{
              display: 'flex',
              gap: 5,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <p>Itens por página:</p>
            <select
              name='pages'
              id='page-select'
              value={pageSize}
              onChange={(e) => {
                handlePageSizeChange(e);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        ) : (
          <div/>
          // <div
          //   style={{
          //     display: 'flex',
          //     justifyContent: 'center',
          //     marginTop: '1rem',
          //   }}
          // >
          //   <div
          //     style={{
          //       display: 'flex',
          //       gap: 5,
          //       alignItems: 'center',
          //       justifyContent: 'center',
          //     }}
          //   >
          //     <p>Itens por página:</p>
          //     <Select
          //       name='pages'
          //       id='page-select'
          //       options={[
          //         { label: '5', value: '5' },
          //         { label: '10', value: '10' },
          //         { label: '30', value: '30' },
          //         { label: '50', value: '50' },
          //       ]}
          //       value={pageSize}
          //       onChange={(e) => {
          //         handlePageSizeChange(e);
          //       }}
          //     />
          //   </div>
          //   <div>
          //     <Pagination
          //       count={maxPages}
          //       page={pageNum}
          //       onChange={handlePageChange}
          //       variant='outlined'
          //       shape='rounded'
          //       size='large'
          //     />
          //   </div>
          // </div>
        )}
      </PageLayout>
      <Dialog open={openEsim} onClose={() => {
        setOpenEsim(false)
        setEsim()
      }} fullWidth>
        <DialogTitle id='alert-dialog-title'>ESIM DO PEDIDO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <Select
              name='pages'
              id='page-select'
              options={esimOpt}
              style={{ minWidth: '100px' }}
              value={esim}
              placeholder='Selecione o ESIm'
              onChange={(e) => {
                setEsim(e);
              }}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={'fixed'}
            />
          </DialogContentText>
          <DialogActions style={{ marginTop: '1rem' }}>
            <Button
              invert
              onClick={() => {
                setOpenEsim(false);
                setEsim();
              }}
            >
              CANCELAR
            </Button>
            <Button onClick={getQrcode}>
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 15,
                  }}
                >
                  <ReactLoading type={'bars'} color={'#fff'} />
                </div>
              ) : (
                'GERAR PDF'
              )}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};
