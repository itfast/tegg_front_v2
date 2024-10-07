import { useLocation, useNavigate } from 'react-router-dom';
// import ReactLoading from 'react-loading';
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
import { InputData } from '../resales/Resales.styles';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import AsyncSelect from 'react-select/async';
import { ClientInfo } from './ClientInfo';
import { translateError } from '../../services/util';
import { TableItens } from '../../pages/orders/new/NewOrder.styles';
import { Loading } from '../../components/loading/Loading';
import { ClientCardMobile } from './ClientCardMobile';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const Clients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('Buscando clientes...');
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [users, setUsers] = useState([]);
  // const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [dealer, setDealer] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [clientType, setClientType] = useState({label: 'Todos', value: ''});

  useEffect(() => {
    console.log(location.pathname)
    if(location?.pathname === '/agents'){
      setClientType({label: 'Representante', value: 'AGENT'})
    }else{
      setClientType({label: 'Cliente', value: 'CLIENT'})
    }
   
  },[location]);

  const getClients = () => {
    setLoading(true);
    api.client
      .getAll(pageNum, pageSize, search, dealer, clientType)
      .then((res) => {
        console.log(res.data)
        console.log(res.data.finalClients);
        setMaxPages(res.data?.meta?.totalPages || 1);
        setUsers(res.data.finalClients);
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
        setLoadingDetails(false);
      });
  };

  const loadDealers = async (search) => {
    if (api.currentUser.AccessTypes[0] === 'TEGG') {
      const response = await api.dealer.getSome(1, 15, search);
      const dealers = await response.data.dealers;
      const array = [];

      if (dealers.length !== 0) {
        for (const d of dealers) {
          array.push({
            value: d.Id,
            label: d.CompanyName || d.Name,
          });
        }
      }
      return array;
    }
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
    // getClients();
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    // setPageNum(1);
    // getClients(1, search, dealer, e.target.value);
  };

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] === 'CLIENT') {
      api.user
        .logout()
        .then(() => {
          navigate('/login');
        })
        .catch((err) => {
          console.log(err);
        });
    }
    getClients();
  }, [pageNum, search, pageSize, dealer, clientType]);

 
  return (
    <>
      <PageLayout>
        <PageTitles title="Clientes/Representantes"/>
        <Button
          style={{ width: screen.width < 768 && '100%' }}
          onClick={() => navigate('/clients/new')}
        >
          {t('Clients.title')}
        </Button>
        {/* <h2 style={{ marginTop: '1rem' }}>Clientes</h2> */}
        <div style={{ marginTop: '1rem' }}>
          <div
            style={{
              display: screen.width > 768 && 'flex',
              flexDirection: screen.width < 768 && 'column',
              alignItems: 'center',
              margin: '1rem 0',
              gap: 10,
            }}
          >
            <div
              style={{
                display: screen.width > 768 && 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <h3>{t('Clients.searchClient')}:</h3>
              <InputData
                id='iccid'
                type='text'
                // disabled={searched}
                placeholder={t('Clients.searchType')}
                style={{
                  width: screen.width < 768 ? '100%' : 250,
                  marginBottom: screen.width < 768 && '1rem',
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {api.currentUser.AccessTypes[0] === 'TEGG' && (
              <AsyncSelect
                style={{ width: 250 }}
                loadOptions={loadDealers}
                placeholder={t('Clients.searchResalePlaceHolder')}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={'fixed'}
                defaultOptions
                isClearable
                onChange={(e) => {
                  // console.log(e);
                  if (e === null) {
                    setDealer('');
                  } else {
                    setDealer(e.value);
                  }
                }}
              />
            )}
            <div style={{ width: window.innerWidth > 768 && 150, marginTop: window.innerWidth < 768 && 10 }}>
              <Select
                // style={{ width: 250, marginTop: window.innerWidth < 768 && 10 }}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                isSearchable={false}
                // isClearable={false}
                value={clientType}
                options={[
                  { label: 'Cliente', value: 'CLIENT' },
                  { label: 'Representante', value: 'AGENT' },
                  { label: 'Todos', value: '' },
                ]}
                placeholder='Tipo'
                menuPosition='fixed'
                onChange={(e) => {
                  setClientType(e);
                }}
              />
            </div>
          </div>
        </div>
        {users.length > 0 ? (
          <>
            <ContainerWeb>
              <TableItens>
                <tr>
                  <th>{t('Clients.table.name')}</th>
                  <th>Perfil ativo</th>
                  <th>Status</th>
                  <th>{t('Clients.table.document')}</th>
                  <th>{t('Clients.table.contact')}</th>
                  {api.currentUser.AccessTypes[0] === 'TEGG' && (
                    <th>{t('Clients.table.resale')}</th>
                  )}
                  <th>Email de contato</th>
                  <th>Email principal (Acesso ao sistema)</th>
                  {/* <th>{t("Clients.table.email")}</th> */}
                </tr>
                {users.map((d) => (
                  <ClientInfo
                    key={d.Id}
                    client={d}
                    setLoading={setLoadingDetails}
                    setMsg={setMsg}
                    getClients={getClients}
                  />
                ))}
              </TableItens>
            </ContainerWeb>
            <ContainerMobile style={{ width: '100%', height: '100%' }}>
              {users.map((d) => (
                <ClientCardMobile
                  key={d.Id}
                  client={d}
                  setLoading={setLoadingDetails}
                  setMsg={setMsg}
                  getClients={getClients}
                />
              ))}
            </ContainerMobile>
          </>
        ) : (
          !loadingDetails && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
              }}
            >
              <h2
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {t('Clients.table.notHave')}
              </h2>
            </div>
          )
        )}

        <br />
        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Stack
              spacing={2}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Pagination
                count={maxPages}
                page={pageNum}
                onChange={handlePageChange}
                variant='outlined'
                shape='rounded'
              />
              <div style={{ display: 'flex', gap: 5 }}>
                <p>{t('Clients.table.itensForPage')}:</p>
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
            </Stack>
          </div>
        )}
      </PageLayout>
      <Loading open={loadingDetails} msg={msg} />
    </>
  );
};
