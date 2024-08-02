import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import {
  PageLayout,
  Button,
  ContainerWeb,
  ContainerMobile,
  CardInfo,
} from '../../../globalStyles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
// import { ContainerTable } from '../resales/Resales.styles';
import { PortRequestInfo } from './PortRequestInfo';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import moment from 'moment';
import {
  formatPhone,
  translateError,
  translateStatus,
} from '../../services/util';
import { RiDeleteBin5Line } from 'react-icons/ri';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { toast } from 'react-toastify';
import { TableItens } from '../orders/clientNew/NewOrder.styles';
// import { PortInClient } from './component/PortinClient';
import { PortInSteep } from './component/PortInSteep';
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const PortRequests = () => {
  const navigate = useNavigate();
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [portinModal, setPortinModal] = useState(false)
  const [requests, setRequests] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [tmp, setTmp] = useState();

  // const [personalRequests, setPersonalRequests] = useState(false);

  const getRequests = () => {
    setLoading(true);
    api.line
      .getPortRequests(pageNum, pageSize, '')
      .then((res) => {
        console.log(res.data.portRequests);
        setRequests(res.data.portRequests);
        setMaxPages(res.data.meta.totalPages || 1);
      })
      .catch((err) => {
        console.log(err);
        // translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
    // getRequests(value, pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    // setPageNum(1);
    // getRequests(1, e.target.value);
  };

  useEffect(() => {
    getRequests();
  }, [pageNum, pageSize]);

  const handleCancel = () => {
    console.log(tmp)
    setLoadingCancel(true);
    api.line
      .cancelPortIn(tmp.Id)
      .then((res) => {
        toast.success(res.data.Message);
        setShowCancel(false);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoadingCancel(false);
      });
  };

  const handleSearch = (status) => {
    setPortinModal(status)
    getRequests()
  }

  return (
    <>
      <ContainerWeb>
        <PageLayout>
          <PageTitles title={'Portabilidade'} />
          {((api.currentUser.AccessTypes[0] !== 'TEGG' && api.currentUser.AccessTypes[0] !== 'DEALER')) && (
          <div className='btn_container'>
            <Button
              // onClick={() =>
              //   navigate('/orders/newbyclient', {
              //     state: { clientRequest: true },
              //   })
              // }
              // onClick={() => setPortinModal(true)}
              onClick={() => (api.currentUser.Type === 'CLIENT' || api.currentUser.Type === 'AGENT') ? navigate('/bringnumber') : setPortinModal(true)}
              style={{  marginBottom: '1rem' }}
            >
              + PORTABILIDADE
            </Button>
          </div>
          )}
          {/* <ContainerTable> */}
          {/* <h2>Requisições de Portabilidade</h2> */}
          {loading ? (
            <div className='loading'>
              <ReactLoading type={'bars'} color={'#000'} />
            </div>
          ) : requests.length > 0 ? (
            <TableItens style={{ marginTop: '1rem' }}>
              {/* <table id='customers' className='mt-30'> */}
              <thead>
                <tr>
                  {api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' && (
                    <th>Revenda</th>
                  )}
                  {api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' && (
                    <th>Cliente</th>
                  )}
                  <th>Status</th>
                  <th>Telefone</th>
                  {/* <th>Linha temporária</th> */}
                  <th>Operadora antiga</th>
                  {/* <th>Checar Status</th>
                  <th>Cancelar portabilidade</th> */}
                </tr>
              </thead>
              {requests.map((request, index) => (
                <PortRequestInfo
                  key={index}
                  request={request}
                  getRequests={getRequests}
                  pageNum={pageNum}
                  pageSize={pageSize}
                />
              ))}
              {/* </table> */}
            </TableItens>
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
                Ainda não existem requisições de portabilidade cadastradas
              </h2>
            </div>
          )}
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
        <PageLayout>
        <PageTitles title={'Portabilidade'} />
          {/* <div className='btn_container'> */}
          <Button
            // onClick={() =>
            //   navigate('/orders/newbyclient', {
            //     state: { clientRequest: true },
            //   })
            // }
            onClick={() => (api.currentUser.Type === 'CLIENT' || api.currentUser.Type === 'AGENT') ? navigate('/bringnumber') : setPortinModal(true)}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            + PORTABILIDADE
          </Button>
          {requests.map((r) => (
            <CardInfo
              key={r.Id}
              onClick={() => console.log('algo pra fazer')}
              style={{ color: '#3d3d3d' }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                }}
              >
                <RiDeleteBin5Line
                  size={25}
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => {
                    setTmp(r);
                    setShowCancel(true);
                  }}
                />
              </div>
              <h4>{moment(r.Created).format('DD/MM/YYYY')}</h4>
              <h5>{formatPhone(`55${r.OldLine}`)}</h5>
              <h5>{r.OldProvider}</h5>
              <h3>{translateStatus(r.Status)}</h3>
            </CardInfo>
          ))}
          {/* </div> */}
        </PageLayout>
      </ContainerMobile>
      <Dialog fullWidth open={portinModal} maxWidth="md">
        {/* <DialogTitle>Nova portabilidade</DialogTitle> */}
        <PortInSteep openModal={handleSearch} />
      </Dialog>
      <Dialog
        open={showCancel}
        onClose={() => {
          setShowCancel(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATENÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Deseja mesmo cancelar a portabilidade? Essa operação não poderá ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              setShowCancel(false);
            }}
          >
            CANCELAR
          </Button>
          <Button onClick={() => handleCancel()}>
            {loadingCancel ? (
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
              'CONTINUAR'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
