import { useEffect, useState } from 'react';
import {
  Button,
  CardInfo,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../../globalStyles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Stack,
} from '@mui/material';
import ReactLoading from 'react-loading';
import api from '../../../services/api';
import {
  cleanNumber,
  documentFormat,
  translateError,
} from '../../../services/util';
import { MdPhonelinkRing } from 'react-icons/md';
import { InputData } from '../../resales/Resales.styles';
import { NewActivateClient } from './full/NewActivateClient';
import { toast } from 'react-toastify';
import { TableActivation } from './TableActivation';
import { Loading } from '../../../components/loading/Loading';
import { PageTitles } from '../../../components/PageTitle/PageTitle';

export const Activation = () => {
  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [ddd, setDdd] = useState();
  const [cpf, setCpf] = useState();
  const [tmpActivate, setTmpActivate] = useState();
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [iccid, setIccid] = useState('');

  const handlePageChange = (event, value) => {
    setPageNum(value);
    // searchNFes(value, pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    // setPageNum(1);
    // searchNFes(1, e.target.value);
  };

  const handleActivate = () => {
    setLoading(true);
    api.iccid
      .activate(
        tmpActivate?.Iccid,
        tmpActivate?.AwardedSurfPlan,
        cleanNumber(cpf),
        ddd
      )
      .then((res) => {
        toast.success(res?.data?.Message);
        setShow(false);
        search();
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  const search = () => {
    setLoading(true);
    api.iccid
      .getAllTeste(pageNum, pageSize, 'NOT USED', iccid)
      .then((res) => {
        console.log(res);
        setMaxPages(res.data.meta.totalPages || 1);
        setActivations(res.data.iccids);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    search();
  }, [pageNum, pageSize]);

  return (
    <>
      <ContainerWeb>
        <Loading open={loading} msg={'Buscando ativações pendentes...'} />
        <PageLayout>
          {/* <h5 style={{ marginBottom: '1rem' }}>Ativações pendentes</h5> */}
          <PageTitles title={'Ativações pendentes'} />
          {api.currentUser.AccessTypes[0] === 'TEGG' && (
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'end',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3>ICCID:</h3>
                <InputData
                  id='iccid'
                  type='text'
                  placeholder='Iccid'
                  value={iccid}
                  onChange={(e) => setIccid(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setPageNum(1);
                    search();
                  }}
                >
                  Buscar
                </Button>
              </div>
            </div>
          )}
          <TableActivation activations={activations} search={search} />
          {!loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
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
          <PageTitles title={'Ativações pendentes'} />
          {activations.length === 0 && (
            <div style={{ margin: 'auto', marginTop: '2rem' }}>
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 15,
                  }}
                >
                  <ReactLoading type={'bars'} color={'#00D959'} />
                </div>
              ) : (
                <h5>Você não possui ativações pendentes</h5>
              )}
            </div>
          )}
          {activations.map((r) => (
            <CardInfo
              key={r.Iccid}
              style={{ color: '#3d3d3d', marginTop: '0.8rem' }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                }}
              >
                <MdPhonelinkRing
                  size={25}
                  style={{ cursor: 'pointer', color: 'white' }}
                  onClick={() => {
                    setTmpActivate(r);
                    setShow(true);
                  }}
                />
              </div>
              <h4>{r.Iccid}</h4>
              <h5>{r.LAPUrl ? 'E-sim' : 'Chip'}</h5>
            </CardInfo>
          ))}
          {!loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
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
      </ContainerMobile>
      <Dialog
        open={show}
        onClose={() => {
          setShow(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>ATIVAÇÃO</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Iccid: {tmpActivate?.Iccid}
            {tmpActivate?.AwardedSurfPlan ? (
              <>
                <h5 style={{ marginTop: '0.5rem' }}>DDD</h5>
                <InputData
                  id='ddd'
                  type='text'
                  style={{ width: '100%' }}
                  placeholder='DDD'
                  pattern='\d*'
                  // style={{ width: 250 }}
                  maxLength={2}
                  value={ddd}
                  onChange={(e) => setDdd(e.target.value)}
                />
                <h5>Documento</h5>
                <InputData
                  id='cpf'
                  style={{ width: '100%' }}
                  placeholder='CPF/CNPJ'
                  // style={{ width: 250 }}
                  value={cpf}
                  onChange={(e) => setCpf(documentFormat(e.target.value))}
                />
              </>
            ) : (
              <>
                <div style={{ width: '100%' }}>
                  <NewActivateClient
                    setShow={setShow}
                    iccid={tmpActivate?.Iccid}
                    search={search}
                  />
                </div>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {tmpActivate?.AwardedSurfPlan && (
            <>
              <Button
                invert
                onClick={() => {
                  setShow(false);
                }}
              >
                CANCELAR
              </Button>
              <Button onClick={() => handleActivate()}>
                {loading ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 15,
                    }}
                  >
                    <ReactLoading type={'bars'} color={'#00D959'} />
                  </div>
                ) : (
                  'ATIVAR'
                )}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
