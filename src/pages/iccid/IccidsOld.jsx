import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { Button, PageLayout } from '../../../globalStyles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatPhone, translateChipStatus, translateError, translatePlanType } from '../../services/util';
import { ContainerTable, InputData } from '../resales/Resales.styles';
import { IccidInfo } from './IccidInfo';
import { TableItens } from '../orders/new/NewOrder.styles';
// import { TableItens } from '../clients/clientNew/NewOrder.styles';
import Select from 'react-select';
import { ModalMessage } from '../../components/ModalMessage/ModalMessage';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './iccids.css';
import { AssociarIccids } from '../../components/AssociarIccids/AssociarIccids';
import moment from 'moment';
// import Loading from '../../components/loading/Loading'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem } from '@mui/material';
import { IoMdMore } from 'react-icons/io';
import { Loading } from '../../components/loading/Loading'

export const Iccids = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [loadingDownload, setLoadingDownload] = useState(false);

  const [iccids, setIccids] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [maxPages, setMaxPages] = useState(1);

  const [loadingAll, setLoadingAll] = useState(false)
  // const [allChecked, setAllChecked] = useState(false);
  const [checkedArray, setCheckedArray] = useState([]);
  const [iccidArray, setIccidArray] = useState([]);
  const [statusArray, setStatusArray] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showMultiDelete, setShowMultiDelete] = useState(false);
  const [showLinkIccids, setShowLinkIccids] = useState(false);
  const [iccidToFind, setIccidToFind] = useState('');
  const [statusSearch, setStatusSearch] = useState('all');
  const statusOptions = [
    {
      value: 'all',
      label: 'Todos',
    },
    {
      value: 'CREATED',
      label: 'Aguardando status',
    },
    {
      value: 'NOT USED',
      label: 'Não ativo',
    },
    {
      value: 'AVAILABLE',
      label: 'Disponível para venda',
    },
    {
      value: 'SENT',
      label: 'Enviado',
    },
    {
      value: 'ACTIVE',
      label: 'Ativado',
    },
    {
      value: 'GRACE1',
      label: 'Recarga atrasada 5 dias',
    },
    {
      value: 'GRACE2',
      label: 'Recarga atrasada 45 dias',
    },
    {
      value: 'GRACE3',
      label: 'Recarga atrasada 75 dias',
    },
    {
      value: 'EX',
      label: 'Cancelado',
    },
    {
      value: 'PORTOUT',
      label: 'Portado',
    },
    {
      value: 'INVALID',
      label: 'Inválido',
    },
  ];
  const [showStatusInfo, setShowStatusInfo] = useState(false)
  const [statusInfo, setStatusInfo] = useState()
  const [tmp, setTmp] = useState()
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, inf) => {
    setTmp(inf)
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const translateStatus = (str) => {
    switch (str) {
      case 'CREATED':
        return 'Aguardando status';
      case 'NOT USED':
        return 'Não ativo';
      case 'SENT':
        return 'Enviado';
      case 'ACTIVE':
        return 'Ativo';
      case 'GRACE1':
        return 'Recarga atrasada 5 dias';
      case 'GRACE2':
        return 'Recarga atrasada 45 dias';
      case 'GRACE3':
        return 'Recarga atrasada 75 dias';
      case 'EX':
        return 'Cancelado';
      case 'PORTOUT':
        return 'Portado';
      case 'AVAILABLE':
        return 'Disponível para venda';
      default:
        return 'Desconhecido';
    }
  };

  const getStatus = () => {
		setLoadingAll(true);
    const status = api.iccid.surfStatus(tmp.Iccid, "status")
    const service = 	api.iccid.surfStatus(tmp.Iccid, "service")

    Promise.all([status, service]).then((valores) => {
      setLoadingAll(false);
      console.log(valores);
      setStatusInfo({...valores[0]?.data?.retStatus?.resultado, ...valores[1]?.data?.retStatus?.resultado})
      setShowStatusInfo(true)
    })
    .catch((err) => {
      translateError(err);
    })
    .finally(() => {setLoadingAll(false);});
	};

  const searchIccids = (num, status, iccid, size) => {
    setLoading(true);
    api.iccid
      .getAllTeste(num, size, status, iccid)
      .then((res) => {
        console.log('tudo', res.data.meta);
        const cArray = [];
        const sArray = [];
        const iArray = [];
        for (let i = 0; i < res.data.meta.total; i++) {
          cArray.push(false);
          sArray.push('');
          iArray.push('');
        }
        setCheckedArray(cArray);
        setStatusArray(sArray);
        setIccidArray(iArray);
        setIccids(res.data.iccids);
        setMaxPages(res.data.meta.totalPages || 1);
      })
      .catch((err) => translateError(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleStatusSearch = (e) => {
    // console.log(e.value);
    setPageNum(1);
    setStatusSearch(e.value);
    searchIccids(1, e.value, iccidToFind, pageSize);
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
    searchIccids(value, statusSearch, iccidToFind, pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setPageNum(1);
    searchIccids(1, statusSearch, iccidToFind, e.target.value);
  };

  const handleSurfStatus = async () => {
    toast.info(
      'Aguarde enquanto os status são checados, isso pode levar algum tempo, por favor não saia dessa página.'
    );
    setStatusLoading(true);
    for (let i = 0; i < checkedArray.length; i++) {
      if (checkedArray[i]) {
        try {
          await api.iccid.surfStatus(iccidArray[i], 'status');
          await api.iccid.surfStatus(iccidArray[i], 'service');
        } catch (err) {
          translateError(err);
          console.log(err);
        }
      }
    }
    setStatusLoading(false);
    toast.success('Status checados com sucesso');
    searchIccids(pageNum, statusSearch, iccidToFind, pageSize);
  };

  const handleDelete = async () => {
    setShowMultiDelete(false);
    toast.info(
      'Aguarde enquanto os ICCIDs são deletados, isso pode levar algum tempo, por favor não saia dessa página.'
    );
    setDeleteLoading(true);
    for (let i = 0; i < checkedArray.length; i++) {
      if (checkedArray[i]) {
        try {
          await api.iccid.delete(iccidArray[i]);
        } catch (err) {
          translateError(err);
          console.log(err);
        }
      }
    }
    setDeleteLoading(false);
    toast.success('ICCIDs deletados com sucesso');
    setPageNum(1);
    searchIccids(1, statusSearch, iccidToFind, pageSize);
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
    searchIccids(pageNum, statusSearch, iccidToFind, pageSize);
  }, []);

  return (
    <>
    <Loading open={loadingAll} msg='Checando...'/>
      <PageLayout>
        {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <div className='btn_container'>
            <Button onClick={() => navigate('/iccids/new')}>+ ICCID</Button>
            <Button onClick={() => navigate('/iccids/new/spreadsheet')}>
              + PLANILHA
            </Button>
            <Button onClick={() => setShowLinkIccids(true)}>
              Associar Iccids
            </Button>
          </div>
        )}
        <ContainerTable>
        {/* <h2>Meus ICCIDs</h2> */}
        <div className='title-container mt-30'>
          <div className='flex'>
            <h3>Buscar ICCID:</h3>
            <InputData
              id='iccid'
              type='text'
              // disabled={searched}
              placeholder='Iccid'
              // style={{ width: "40%" }}
              value={iccidToFind}
              onChange={(e) => setIccidToFind(e.target.value)}
            />
          </div>

          <div className='btn_container'>
            <Button
              onClick={() => {
                // searchSingleIccid(pageNumSearch);
                setPageNum(1);
                searchIccids(1, statusSearch, iccidToFind, pageSize);
              }}
            >
              Buscar
            </Button>
          </div>
        </div>

        <div className='title-container'>
          <p>Filtrar por disponibilidade:</p>
          <div style={{ width: 250 }}>
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
        <div className='title-container'>
          <p>Ação em múltiplos:</p>
          <div className='btn_container'>
            <Button
              // disabled={!allChecked}
              onClick={() => {
                if (checkedArray.every((i) => i === false)) {
                  toast.info(
                    'Selecione ao menos um ICCID para realizar a operação.'
                  );
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
                'Checar status'
              )}
            </Button>

            <Button
              // disabled={!allChecked}
              onClick={() => {
                if (checkedArray.every((i) => i === false)) {
                  toast.info(
                    'Selecione ao menos um ICCID para realizar a operação.'
                  );
                } else {
                  let canDelete = true;
                  for (let i = 0; i < checkedArray.length; i++) {
                    if (checkedArray[i]) {
                      if (
                        statusArray[i] !== 'NOT USED' &&
                        statusArray[i] !== 'CREATED' &&
                        statusArray[i] !== 'INVALID'
                      ) {
                        canDelete = false;
                        break;
                      }
                    }
                  }
                  if (canDelete) {
                    setShowMultiDelete(true);
                  } else {
                    toast.info(
                      'ICCIDs que possuam uma linha ativa não podem ser deletados, por favor desmarque o ICCID errado antes de prosseguir.'
                    );
                  }
                }
              }}
            >
              {deleteLoading ? (
                <div className='loading'>
                  <ReactLoading type={'bars'} color={'#fff'} />
                </div>
              ) : (
                'Deletar'
              )}
            </Button>
          </div>
        </div>
        {loading ? (
          <div className='loading'>
            <ReactLoading type={'bars'} color={'#000'} />
          </div>
        ) : iccids.length > 0 ? (
          <table id='customers' className='mt-30'>
            <thead>
              <tr>
                <th></th>
                <th>ICCID</th>
                <th>Tipo</th>
                <th>Vendedor</th>
                <th>Cliente</th>
                <th>Status</th>
                <th>Checar</th>
                <th>Deletar</th>
              </tr>
            </thead>
            {iccids.map((d, i) => (
              <IccidInfo
                key={i}
                index={i}
                iccidArray={iccidArray}
                setIccidArray={setIccidArray}
                statusArray={statusArray}
                setStatusArray={setStatusArray}
                checkedArray={checkedArray}
                setCheckedArray={setCheckedArray}
                iccid={d}
                search={searchIccids}
                iccidToFind={iccidToFind}
                pageNum={pageNum}
                setPageNum={setPageNum}
                pageSize={pageSize}
                statusSearch={statusSearch}
              />
            ))}
          </table>
        )
        : (
          
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 150,
            }}
          >
            <h2 style={{ color: 'black', fontWeight: 'bold' }}>
              Ainda não existem ICCIDs cadastrados
            </h2>
          </div>
        )}
        </ContainerTable>
        <div className='flex end'>
          <Button onClick={() => downloadXls()}>
            {loadingDownload ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : statusSearch === 'all' ? (
              'BAIXAR TODOS ICCIDS'
            ) : (
              'BAIXAR ICCIDS FILTRADOS'
            )}
          </Button>
        </div>
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
        <div className='mt-50'>
          <h2>Status</h2>
          <br />
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>Aguardando status:</span>{' '}
            O ICCID foi cadastrado e está esperando seu status ser checado.
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>Disponível:</span> O ICCID está
            disponível para ser ativado por um usuário
            {api.currentUser.AccessTypes[0] === 'TEGG' && (
              <span> ou revenda</span>
            )}
            .
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>Vendido:</span> O ICCID já foi
            vendido porém ainda não foi ativado.
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>Enviado:</span> O ICCID foi
            enviado para o usuário para ativação.
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>Ativado:</span> O ICCID está
            ativo e pronto para uso.
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>
              Recarga atrasada 5/45/75 dias:
            </span>{' '}
            O plano do ICCID venceu e nenhuma recarga foi feita num período de
            5/45/75 dias após seu vencimento, a linha pode ser utilizada apenas
            para chamadas de emergência.
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>Cancelado:</span> A linha do
            ICCID foi cancelada.
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>Portado:</span> A linha do
            ICCID foi portada para outra operadora.
          </p>
          <br />
          <p>
            <span style={{ fontWeight: 'bold' }}>Inválido:</span> O ICCID é
            inválido.
          </p>
          <br />
        </div>
      </PageLayout>
      <ModalMessage
        showModal={showMultiDelete}
        setShowModal={setShowMultiDelete}
        title={'APAGAR MÚLTIPLOS ICCIDS'}
        loading={deleteLoading}
        action={handleDelete}
        message={`DESEJA REALMENTE APAGAR MÚLTIPLOS ICCIDS? ESSA AÇÃO NÃO PODERÁ SER DESFEITA!`}
      />
      <AssociarIccids
        showModal={showLinkIccids}
        setShowModal={setShowLinkIccids}
      />
      <Dialog
				open={showStatusInfo}
				onClose={() => {
          setTmp()
					setShowStatusInfo(false);
					// handleSearch();
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">ICCID {tmp?.Iccid}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<p>
							<span style={{ fontWeight: "bold" }}>Número:</span>{" "}
							{formatPhone(statusInfo?.msisdn)}
						</p>
						<p>
							<span style={{ fontWeight: "bold" }}>Status CHIP:</span>{" "}
							{translateChipStatus(statusInfo?.status, tmp?.FinalClientId)}
						</p>
						{statusInfo?.status == "ACTIVE" && (
							<div>
								<p>
									<span style={{ fontWeight: "bold" }}>Plano:</span>{" "}
									{translatePlanType(statusInfo?.nuPlano)}
								</p>
								<p>
									<span style={{ fontWeight: "bold" }}>Ativação:</span>{" "}
									{moment(statusInfo?.dtAtivacao).format('DD/MM/YYYY')}
								</p>
								<p>
									<span style={{ fontWeight: "bold" }}>Última recarga:</span>{" "}
									{moment(statusInfo?.dtUltimaRecarga).format('DD/MM/YYYY')}
								</p>
								<p>
									<span style={{ fontWeight: "bold" }}>Validade:</span>{" "}
									{moment(statusInfo?.dtPlanoExpira).format('DD/MM/YYYY')}
								</p>
								<p>
									<span style={{ fontWeight: "bold" }}>Status linha:</span>{" "}
									{statusInfo?.stBloqueioChip}
								</p>
							</div>
						)}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					{statusInfo?.status === "ACTIVE" &&
						(statusInfo?.stBloqueioChip === "Ativo" ? (
							<Button
								invert
								onClick={() => {
									// setShowStatusInfo(false);
									// setShowBlock(true);
                  console.log('Bloquear')
								}}>
								BLOQUEAR
							</Button>
						) : (
							<Button
								invert
								onClick={() => {
									// setShowStatusInfo(false);
									// setShowUnblock(true);
                  console.log('Desbloquear')
								}}>
								DESBLOQUEAR
							</Button>
						))}
					<Button
						invert
						onClick={() => {
							// handleSearch();
							setShowStatusInfo(false);
						}}>
						FECHAR
					</Button>
				</DialogActions>
			</Dialog>
    </>
  );
};
