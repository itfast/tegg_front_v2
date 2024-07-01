import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import {
  CardInfo,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
import api from '../../services/api';
import { translateError } from '../../services/util';
import Select from 'react-select';
// import { ContainerTable } from '../resales/Resales.styles';
// import { NFeInfo } from './NFeInfo';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import { BsFiletypeXml } from 'react-icons/bs';
import { AiOutlineFilePdf } from 'react-icons/ai';
import { TableNf } from './TableNf';
import { Loading } from '../../components/loading/Loading';
import { PageTitles } from '../../components/PageTitle/PageTitle';

export const NFe = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(
    api.currentUser.AccessTypes[0] === 'CLIENT'
      ? { label: 'Autorizada', value: 100 }
      : { label: 'Tudo', value: null }
  );
  const [nfes, setNfes] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const searchNFes = () => {
    setLoading(true);
    api.nfe
      .getAll(pageNum, pageSize, status.value)
      .then((res) => {
        console.log(res.data);
        setNfes(res.data.nfes);
        setMaxPages(res.data.meta.totalPages || 1);
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
    // searchNFes(value, pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    // setPageNum(1);
    // searchNFes(1, e.target.value);
  };

  useEffect(() => {
    searchNFes();
  }, [pageNum, pageSize, status]);

  return (
    <>
      <ContainerWeb>
        <Loading open={loading} msg={'Buscando notas...'} />
        <PageLayout>
          <PageTitles title={'Notas fiscais'} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
                <>
                  <h5 style={{ marginRight: 10 }}>STATUS</h5>
                  <div style={{ width: '10rem' }}>
                    <Select
                      name='pages'
                      id='page-select'
                      options={[
                        { label: 'Tudo', value: null },
                        { label: 'Autorizada', value: 100 },
                        { label: 'Rejeitadas', value: -1 },
                      ]}
                      value={status}
                      onChange={(e) => {
                        setStatus(e);
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {/* <ContainerTable> */}
          {/* <h4 style={{ marginBottom: 20 }}>Notas fiscais</h4> */}
          <TableNf nfs={nfes} search={searchNFes} />
          {/* {loading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#000'} />
              </div>
            ) : nfes.length > 0 ? (
              <table id='customers' className='mt-30'>
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Série</th>
                    <th>Status</th>
                    <th>Mensagem</th>
                    <th>Chave de acesso</th>
                    <th>Protocolo</th>
                    <th>Valor resumido</th>
                    <th>Download PDF</th>
                    <th>Download XML</th>
                    <th>Data de autorização</th>
                    {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
                      <th>Reemitir NF-e</th>
                    )}
                  </tr>
                </thead>
                {nfes.map((nfe, i) => (
                  <NFeInfo
                    key={i}
                    nfe={nfe}
                    search={searchNFes}
                    pageNum={pageNum}
                    pageSize={pageSize}
                  />
                ))}
              </table>
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
                  Ainda não foi emitida nenhuma nota fiscal
                </h2>
              </div>
            )} */}
          {/* </ContainerTable> */}
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
              </Stack>
            </div>
          )}
        </PageLayout>
      </ContainerWeb>
      <ContainerMobile>
        <div id='banner'>
          <PageLayout>
            <PageTitles title={'Notas fiscais'} />
            {loading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#00D959'} />
              </div>
            ) : nfes.length > 0 ? (
              // <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
              nfes.map((n) => (
                <CardInfo
                  key={n.Id}
                  style={{ padding: '1rem', color: '#3d3d3d' }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      // top: '50%',
                      right: '10%',
                    }}
                  >
                    <a
                      href={n.PDFLink}
                      style={{ color: 'inherit' }}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <AiOutlineFilePdf
                        size={25}
                        style={{ cursor: 'pointer' }}
                      />
                    </a>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      /* top: '50%'*/ left: '10%',
                    }}
                  >
                    <a
                      href={n.XMLLink}
                      style={{ color: 'inherit' }}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <BsFiletypeXml size={25} style={{ cursor: 'pointer' }} />
                    </a>
                  </div>
                  <h3>{moment(n?.CreatedAt).format('DD/MM/YYYY - HH:ss')}</h3>
                  <h4>Número: {n?.Number}</h4>
                  <h4>Série: {n?.Group}</h4>
                  <h4 style={{ wordWrap: 'break-word' }}>{n?.StatusDesc}</h4>
                </CardInfo>
              ))
            ) : (
              // </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: 300,
                  alignItems: 'center',
                }}
              >
                <h4>VOCÊ AINDA NÃO POSSUI NOTAS FISCAIS</h4>
              </div>
            )}
            <br />
            {!loading && nfes.length > 0 && (
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
                </Stack>
              </div>
            )}
          </PageLayout>
        </div>
      </ContainerMobile>
    </>
  );
};
