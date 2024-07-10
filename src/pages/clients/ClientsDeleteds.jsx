import { useLocation, useNavigate } from 'react-router-dom';
// import ReactLoading from 'react-loading';
import {
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
import { InputData } from '../resales/Resales.styles';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { translateError } from '../../services/util';
import { TableItens } from '../orders/new/NewOrder.styles';
import { Loading } from '../../components/loading/Loading';
import { useTranslation } from 'react-i18next';
import { PageTitles } from '../../components/PageTitle/PageTitle'
import { ClientInfoDeleted } from './ClientInfoDeleted'
import { ClientCardMobileDeleted } from './ClientCardMobileDeleted'

export const ClientsDeleteds = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [msg, setMsg] = useState('Buscando clientes...');
  const msg = 'Buscando clientes...'
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [users, setUsers] = useState([]);
  // const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const [type, setType] = useState('Client')

  console.log(location.pathname)


  const getClients = () => {
    // http://localhost:4000/api/deletedusers
    const type = location.pathname === '/clients/deleteds' ? 'Client' : 'Dealer'
    setLoading(true);
    api.client
      .getDeleteds(pageNum, pageSize, search, type)
      .then((res) => {
        console.log(res)
        // console.log(res.data.finalClients);
        setMaxPages(res.data?.meta?.totalPages || 1);
        setUsers(res.data?.deletedUsers);
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
        setLoadingDetails(false);
      });
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
  }, [pageNum, search, pageSize, location ]);

  return (
    <>
      <PageLayout>
        <PageTitles title={`${location.pathname === '/clients/deleteds' ? 'Clientes excluídos' : 'Revendas excluídas'}`}/>
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
              <h3>Buscar:</h3>
              <InputData
                id='iccid'
                type='text'
                // disabled={searched}
                placeholder={"Nome/Documento"}
                style={{
                  width: screen.width < 768 ? '100%' : 250,
                  marginBottom: screen.width < 768 && '1rem',
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {users.length > 0 ? (
          <>
            <ContainerWeb>
              <TableItens>
                <tr>
                  {/* <th>Tipo</th> */}
                  <th>{t('Clients.table.name')}</th>
                  <th>{t('Clients.table.document')}</th>
                  <th>ICCID</th>
                  <th>Linha</th>
                  <th>Data ativação</th>
                  <th>Data cancelamento</th>
                </tr>
                {users.map((d) => (
                  <ClientInfoDeleted
                    key={d.Id}
                    client={d}
                  />
                ))}
              </TableItens>
            </ContainerWeb>
            <ContainerMobile style={{ width: '100%', height: '100%' }}>
              {users.map((d) => (
                <ClientCardMobileDeleted
                  key={d.Id}
                  client={d}
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
                Sem clientes excluídos
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
