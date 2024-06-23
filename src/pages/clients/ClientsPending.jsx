import { useNavigate } from 'react-router-dom';
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
import { ClientInfoPending } from './ClientInfoPending';
import { ClientCardMobilePending } from './ClientCardMobilePending';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

export const ClientsPending = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(t('ClientsPending.searchMsg'));
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [users, setUsers] = useState([]);
  // const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState({ label: t('ClientsPending.status.pending'), value: 'PENDING' });

  const getClients = () => {
    setLoading(true);
    api.client
      .getPreregistration(pageNum, pageSize, search, status.value)
      .then((res) => {
        console.log(res.data);
        setMaxPages(res.data?.meta?.totalPages || 1);
        setUsers(res.data.preregistration);
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
  }, [pageNum, search, pageSize, status]);

  return (
    <>
      <PageLayout>
        <h5>{t('ClientsPending.title')}</h5>
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
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: '0.5rem',
              }}
            >
              <div style={{ width: screen.width < 768 && '25%' }}>
                <p>{t('ClientsPending.statusLabel')}:</p>
              </div>
              <div style={{ width: screen.width < 768 && '100%' }}>
                <Select
                  isSearchable={false}
                  options={[
                    { label: t('ClientsPending.status.approved'), value: 'APPROVED' },
                    { label: t('ClientsPending.status.pending'), value: 'PENDING' },
                    { label: t('ClientsPending.status.repproved'), value: 'REPPROVED' },
                    { label: t('ClientsPending.status.pending'), value: 'PENDING_PLAN' },
                  ]}
                  value={status}
                  onChange={setStatus}
                />
              </div>
            </div>
            <div
              style={{
                display: screen.width > 768 && 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <h3>{t('ClientsPending.searchLabel')}:</h3>
              <InputData
                id='iccid'
                type='text'
                // disabled={searched}
                placeholder={t('ClientsPending.searchPlaceHolder')}
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
                  <th>{t('ClientsPending.table.name')}</th>
                  <th>{t('ClientsPending.table.document')}</th>
                  <th>{t('ClientsPending.table.contact')}</th>
                  <th>{t('ClientsPending.table.email')}</th>
                  <th>{t('ClientsPending.table.status')}</th>
                </tr>
                {users.map((d) => (
                  <ClientInfoPending
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
                <ClientCardMobilePending
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
                {t('ClientsPending.table.notHave')}: {status.label}
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
                <p>{t('ClientsPending.table.itensPagination')}:</p>
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
