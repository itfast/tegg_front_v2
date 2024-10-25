import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { translateError } from '../../services/util';
import { InputData } from '../resales/Resales.styles';
// import { TableItens } from '../clients/clientNew/NewOrder.styles';
import Select from 'react-select';
import { ModalMessage } from '../../components/ModalMessage/ModalMessage';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './iccids.css';
import { AssociarIccids } from '../../components/AssociarIccids/AssociarIccids';
// import moment from 'moment';
// import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
// import { IoMdMore } from 'react-icons/io';
import { TableIccids } from './components/TableIccids';
import { Loading } from '../../components/loading/Loading';
import { CardsIccidMobile } from './CardsIccidMobile';
import { useTranslation } from 'react-i18next';
import { PageTitles } from '../../components/PageTitle/PageTitle';

export const Iccids = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const [loading, setLoading] = useState(false);

  const [loadingDownload, setLoadingDownload] = useState(false);

  const [iccids, setIccids] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [maxPages, setMaxPages] = useState(1);

  const [loadingAll, setLoadingAll] = useState(true);
  const [type, setType] = useState({ label: t('Status.all'), value: '' });
  const [stoke, setStoke] = useState({ label: t('Status.all'), value: '' });
  // const [allChecked, setAllChecked] = useState(false);
  const [checkedArray, setCheckedArray] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showMultiDelete, setShowMultiDelete] = useState(false);
  const [showLinkIccids, setShowLinkIccids] = useState(false);
  const [iccidToFind, setIccidToFind] = useState('');
  const [statusSearch, setStatusSearch] = useState('all');
  const [total, setTotal] = useState(0);
  const statusOptions = [
    {
      value: 'all',
      label: t('Status.all'),
    },
    {
      value: 'CREATED',
      label: t('Status.awaiting'),
    },
    {
      value: 'NOT USED',
      label: t('Status.notActive'),
    },
    {
      value: 'AVAILABLE',
      label: t('Status.available'),
    },
    {
      value: 'SENT',
      label: t('Status.sent'),
    },
    {
      value: 'ACTIVE',
      label: t('Status.active'),
    },
    {
      value: 'GRACE1',
      label: t('Status.grace1'),
    },
    {
      value: 'GRACE2',
      label: t('Status.grace2'),
    },
    {
      value: 'GRACE3',
      label: t('Status.grace3'),
    },
    {
      value: 'EX',
      label: 'EX',
    },
    {
      value: 'CANCELED',
      label: t('Status.canceled'),
    },
    {
      value: 'PORTOUT',
      label: t('Status.porOut'),
    },
    {
      value: 'INVALID',
      label: t('Status.invalid'),
    },
  ];
  // const [showStatusInfo, setShowStatusInfo] = useState(false)
  // const [statusInfo, setStatusInfo] = useState()
  // const [tmp, setTmp] = useState()
  const [msg, setMsg] = useState(t('Iccids.checkMsg'));

  const translateStatus = (str) => {
    switch (str) {
      case 'CREATED':
        return t('Status.awaiting');
      case 'NOT USED':
        return t('Status.notActive');
      case 'SENT':
        return t('Status.sent');
      case 'ACTIVE':
        return t('Status.active');
      case 'GRACE1':
        return t('Status.grace1');
      case 'GRACE2':
        return t('Status.grace2');
      case 'GRACE3':
        return t('Status.grace3');
      case 'EX':
        return t('Status.canceled');
      case 'PORTOUT':
        return t('Status.porOut');
      case 'AVAILABLE':
        return t('Status.available');
      default:
        return str;
    }
  };

  const searchIccids = () => {
    setMsg(t('Iccids.searching'));
    setLoadingAll(true);
    // console.log(pageNum, pageSize, statusSearch, iccidToFind, type?.value, stoke?.value)
    api.iccid
      .getAllTeste(
        pageNum,
        pageSize,
        statusSearch,
        iccidToFind,
        type?.value,
        stoke?.value
      )
      .then((res) => {
        console.log(res.data);
        setTotal(res?.data?.meta?.total);
        setIccids(res.data.iccids);
        setMaxPages(res.data.meta.totalPages || 1);
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoadingAll(false);
      });
  };

  const handleStatusSearch = (e) => {
    setStatusSearch(e.value);
  };

  const downloadXls = () => {
    setLoadingDownload(true);
    if (statusSearch === 'all') {
      api.iccid
        .getXls()
        .then((res) => {
          console.log(res.data);
          const today = new Date();
          const blob = new Blob([res.data], {
            type: 'application/octet-stream',
          });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.download = `ICCIDS_Todos_${today.getDate()}-${
            today.getMonth() + 1
          }-${today.getFullYear()}.xlsx`;
          a.href = url;
          document.body.appendChild(a);
          a.click();
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoadingDownload(false);
        });
    } else {
      api.iccid
        .getXlsByStatus(statusSearch)
        .then((res) => {
          // console.log(res.data);
          const today = new Date();
          const blob = new Blob([res.data], {
            type: 'application/octet-stream',
          });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.download = `ICCIDS_${translateStatus(
            statusSearch
          )}_${today.getDate()}-${
            today.getMonth() + 1
          }-${today.getFullYear()}.xlsx`;
          a.href = url;
          document.body.appendChild(a);
          a.click();
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoadingDownload(false);
        });
    }
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const handleSurfStatus = async () => {
    toast.info(t('Iccids.msgSurfSearch'));
    setStatusLoading(true);
    for (let i = 0; i < checkedArray.length; i++) {
      if (checkedArray[i].iccid) {
        try {
          await api.iccid.surfStatus(checkedArray[i].iccid, 'status');
          await api.iccid.surfStatus(checkedArray[i].iccid, 'service');
        } catch (err) {
          translateError(err);
          console.log(err);
        }
      }
    }
    setStatusLoading(false);
    toast.success(t('Iccids.searchStatusSuccess'));
    searchIccids();
  };

  const handleDelete = async () => {
    setShowMultiDelete(false);
    toast.info(t('Iccids.deleteIccidMsg'));
    setDeleteLoading(true);
    for (let i = 0; i < checkedArray.length; i++) {
      if (checkedArray[i]) {
        try {
          await api.iccid.delete(checkedArray[i].iccid);
        } catch (err) {
          translateError(err);
          console.log(err);
        }
      }
    }
    setDeleteLoading(false);
    toast.success(t('Iccids.deleteIccidMsgSuccess'));
    setPageNum(1);
    // searchIccids();
  };

  useEffect(() => {
    // console.log(api.currentUser);
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
    searchIccids();
  }, [statusSearch, pageNum, pageSize, type, stoke]);

  return (
    <>
      <Loading open={loadingAll} msg={msg} />
      <PageLayout>
        <PageTitles title='ICCIDS' />
        <div style={{ display: screen.width > 768 && 'flex', gap: 15 }}>
          {api.currentUser.AccessTypes[0] === 'TEGG' && (
            <Button
              style={{ width: screen.width < 768 && '100%' }}
              onClick={() => navigate('/iccids/new')}
            >
              {t('Iccids.newIccid')}
            </Button>
          )}
          {api.currentUser.AccessTypes[0] === 'TEGG' && (
            <Button
              style={{
                width: screen.width < 768 && '100%',
                marginTop: screen.width < 768 && 10,
              }}
              onClick={() => navigate('/iccids/new/spreadsheet')}
            >
              {t('Iccids.newIccidPlan')}
            </Button>
          )}
          {api.currentUser.AccessTypes[0] === 'TEGG' && (
            <Button
              style={{
                width: screen.width < 768 && '100%',
                marginTop: screen.width < 768 && 10,
              }}
              onClick={() => setShowLinkIccids(true)}
            >
              {t('Iccids.linkIccid')}
            </Button>
          )}

          <Button
            // disabled={!allChecked}
            style={{
              width: screen.width < 768 && '100%',
              marginTop: screen.width < 768 && 10,
            }}
            onClick={() => {
              if (checkedArray.length === 0) {
                toast.info(t('Iccids.checkStatusMsgWarning'));
              } else {
                handleSurfStatus();
              }
            }}
          >
            {statusLoading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : (
              t('Iccids.buttonCheckStatus')
            )}
          </Button>

          <Button
            // disabled={!allChecked}
            style={{
              width: screen.width < 768 && '100%',
              marginTop: screen.width < 768 && 10,
            }}
            onClick={() => {
              if (checkedArray.length === 0) {
                toast.info(t('Iccids.checkStatusMsgWarning'));
              } else {
                let canDelete = true;
                for (let i = 0; i < checkedArray.length; i++) {
                  if (checkedArray[i]) {
                    if (
                      checkedArray[i].status !== 'NOT USED' &&
                      checkedArray[i].status !== 'CREATED' &&
                      checkedArray[i].status !== 'INVALID'
                    ) {
                      canDelete = false;
                      break;
                    }
                  }
                }
                if (canDelete) {
                  setShowMultiDelete(true);
                  // console.log('vai poder deletar', checkedArray);
                } else {
                  toast.info(t('Iccids.deleteMsgWarning'));
                }
              }
            }}
          >
            {deleteLoading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : (
              t('Iccids.buttonDelete')
            )}
          </Button>
        </div>

        {/* <ContainerTable> */}
        {/* <h2>Meus ICCIDs</h2> */}
        <div style={{ marginTop: 30 }}>
          <div
            style={{
              display: screen.width > 768 && 'flex',
              width: '100%',
              alignItems: 'center',
              gap: 10,
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: screen.width > 768 && 'flex', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: screen.width < 768 && '25%' }}>
                  <p>{t('Iccids.type')}:</p>
                </div>
                <div style={{ width: screen.width < 768 && '100%' }}>
                  <Select
                    isSearchable={false}
                    // isDisabled={statusSearching}
                    options={[
                      { label: t('Status.all'), value: '' },
                      { label: t('Iccids.esim'), value: 'esim' },
                      { label: t('Iccids.chip'), value: 'simcard' },
                    ]}
                    value={type}
                    onChange={setType}
                  />
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: screen.width < 768 && '0.5rem',
                }}
              >
                <div style={{ width: screen.width < 768 && '25%' }}>
                  <p>{t('Iccids.status')}:</p>
                </div>
                <div style={{ width: screen.width < 768 ? '100%' : 250 }}>
                  <Select
                    isSearchable={false}
                    // isDisabled={statusSearching}
                    options={statusOptions}
                    defaultValue={statusOptions[0]}
                    onChange={(e) => {
                      handleStatusSearch(e);
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: screen.width < 768 && '0.5rem',
              }}
            >
              <div style={{ width: screen.width < 768 && '25%' }}>
                <h3>{t('Iccids.ICCID')}:</h3>
              </div>
              <InputData
                id='iccid'
                type='text'
                // disabled={searched}
                placeholder={t('Iccids.Iccid')}
                // style={{ width: "40%" }}
                value={iccidToFind}
                onChange={(e) => setIccidToFind(e.target.value)}
              />
              <Button
                onClick={() => {
                  setPageNum(1);
                  searchIccids();
                }}
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: '0.5rem',
          }}
        >
          <div style={{ width: screen.width < 768 && '25%' }}>
            <p>{t('Iccids.stoke')}:</p>
          </div>
          <div style={{ width: screen.width < 768 && '100%' }}>
            <Select
              isSearchable={false}
              // isDisabled={statusSearching}
              options={[
                { label: t('Status.all'), value: '' },
                { label: t('Iccids.local'), value: '0' },
                { label: t('Iccids.transport'), value: '1' },
              ]}
              value={stoke}
              onChange={setStoke}
            />
          </div>
        </div>

        <h4 style={{ marginTop: '1rem' }}>
          {t('Iccids.total')}: {total}
        </h4>

        <ContainerWeb>
          {iccids.length > 0 ? (
            <TableIccids
              iccids={iccids}
              handleSearch={searchIccids}
              setLoadingAll={setLoadingAll}
              setMsg={setMsg}
              checkedArray={checkedArray}
              setCheckedArray={setCheckedArray}
            />
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
                {t('Iccids.notHave')}
              </h2>
            </div>
          )}
        </ContainerWeb>
        <ContainerMobile style={{ width: '100%', height: '100%' }}>
          <CardsIccidMobile
            handleSearch={searchIccids}
            setLoadingAll={setLoadingAll}
            setMsg={setMsg}
            iccids={iccids}
            checkedArray={checkedArray}
            setCheckedArray={setCheckedArray}
          />
        </ContainerMobile>
        {/* </ContainerTable> */}
        <div className='flex end'>
          <Button
            style={{
              width: screen.width < 768 && '100%',
              marginTop: screen.width < 768 && '3rem',
            }}
            onClick={() => downloadXls()}
          >
            {loadingDownload ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : statusSearch === 'all' ? (
              t('Iccids.downloadAll')
            ) : (
              t('Iccids.downloadFiltered')
            )}
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: screen.width < 768 && '1rem',
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
              <p>{t('Iccids.itensPagination')}:</p>
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
        {/* )} */}
        <div className='mt-50'>
          <h2>{t('Iccids.status')}</h2>
          <br />
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.awaitingStatus')}
            </span>{' '}
            {t('Iccids.infMsgs.awaitingStatusResult')}
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.available')}
            </span>{' '}
            {t('Iccids.infMsgs.availableResult')}
            {/* {api.currentUser.AccessTypes[0] === 'TEGG' && (
              <span>{t('Iccids.infMsgs.availableresale')}</span>
            )} */}
            .
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.sale')}
            </span>{' '}
            {t('Iccids.infMsgs.saleResult')}
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.sent')}
            </span>{' '}
            {t('Iccids.infMsgs.sentResult')}
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.active')}
            </span>{' '}
            {t('Iccids.infMsgs.activeResult')}
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.grace')}
            </span>{' '}
            {t('Iccids.infMsgs.graceResult')}
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.canceled')}
            </span>{' '}
            {t('Iccids.infMsgs.canceledResult')}
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.portOut')}
            </span>{' '}
            {t('Iccids.infMsgs.portOutResult')}
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              {t('Iccids.infMsgs.invalid')}
            </span>
            {t('Iccids.infMsgs.invalidResult')}
          </p>
          <br />
        </div>
      </PageLayout>
      <ModalMessage
        showModal={showMultiDelete}
        setShowModal={setShowMultiDelete}
        title={t('Iccids.deleteTitle')}
        loading={deleteLoading}
        action={handleDelete}
        message={t('Iccids.deleteMsg')}
      />
      <AssociarIccids
        showModal={showLinkIccids}
        setShowModal={setShowLinkIccids}
      />
    </>
  );
};
