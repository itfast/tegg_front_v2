import { useLocation, useNavigate } from 'react-router-dom';
// import ReactLoading from 'react-loading';
import {
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
// import { InputData } from '/resales/Resales.styles';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { translateError } from '../../services/util';
import { TableItens } from '../../pages/orders/new/NewOrder.styles';
import { Loading } from '../../components/loading/Loading';
import { useTranslation } from 'react-i18next';
import { PageTitles } from '../../components/PageTitle/PageTitle';
// import { ClientInfoDeleted } from './ClientInfoDeleted'
// import { ClientCardMobileDeleted } from './ClientCardMobileDeleted'
import { InputData } from '../../pages/resales/Resales.styles';
import { TableInfo } from './TableInfo';
import { PortDocMobile } from './PortDocMobile';

export const PortDoc = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [msg, setMsg] = useState('Buscando clientes...');
  const msg = 'Buscando clientes...';
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [users, setUsers] = useState([]);
  // const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const [type, setType] = useState('Client')

  console.log(location.pathname);

  const getPorts = () => {
    // http://localhost:4000/api/deletedusers
    const type =
      location.pathname === '/clients/deleteds' ? 'Client' : 'Dealer';
    setLoading(true);
    api.client
      .getDocPorts(pageNum, pageSize, search, type)
      .then((res) => {
        setMaxPages(res.data?.meta?.totalPages || 1);
        setUsers(res.data?.historic);
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
    getPorts();
  }, [pageNum, search, pageSize, location]);

  return (
    <>
      <PageLayout>
        <PageTitles title={'Trocas de titularidade'} />
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
                placeholder={'Iccid/Linha/Documento'}
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
                  <th>Nome</th>
                  <th>Linha</th>
                  <th>ICCID</th>
                  <th>Documento antigo</th>
                  <th>Novo documento</th>
                  <th>Data solicitação</th>
                </tr>
                {users.map((d) => (
                  <TableInfo key={d.Id} client={d} />
                ))}
              </TableItens>
            </ContainerWeb>
            <ContainerMobile style={{ width: '100%', height: '100%' }}>
              {users.map((d) => (
                <PortDocMobile key={d.Id} client={d} />
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
                Nenhum registro encontrado
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
