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

export const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [personalOrders, setPersonalOrders] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

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
            console.log(res)
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
          console.log("ORDER", res.data.orders);
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
  }, []);

  useEffect(() => {
    setPageNum(1);
    searchOrders(1, 'all', pageSize);
  }, [personalOrders]);

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
              if (api.currentUser.AccessTypes[0] !== 'CLIENT') {
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
            api.currentUser?.AccessTypes !== 'CLIENT' && (
              <>
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
              </>
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
                  api.currentUser.AccessTypes[0] !== 'CLIENT'
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
        )}
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
      </PageLayout>
    </>
  );
};
