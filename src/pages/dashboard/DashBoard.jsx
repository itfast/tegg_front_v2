import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PageLayout } from '../../../globalStyles';
import { TeggMetrics } from '../../components/TeggMetrics/TeggMetrics';
import { ConsumptionChart } from '../../components/charts/ConsumptionChart';
import { ResalesMetrics } from '../../components/ResalesMetrics/ResalesMetrics';
import { MapsData } from '../../components/myMaps/MapsData';
import api from '../../services/api';
import { translateError } from '../../services/util';
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';

const UFS = [
  { lati: '-13.071338', longi: '-55.510218', uf: 'MT', qtd: '10' },
  { lati: '-8.868393', longi: '-70.254592', uf: 'AC', qtd: '10' },
  { lati: '-11.306805', longi: '-62.739058', uf: 'RD', qtd: '10' },
  { lati: '-3.302104', longi: '-60.001671', uf: 'AM', qtd: '1890' },
  { lati: '-5.943022', longi: '-52.039757', uf: 'PA', qtd: '10' },
  { lati: '1.765883', longi: '-61.070386', uf: 'RO', qtd: '10' },
  { lati: '1.404107', longi: '-51.864148', uf: 'AMAPA', qtd: '10' },
  { lati: '-5.311649', longi: '-45.222359', uf: 'MARANHÃO', qtd: '10' },
  { lati: '-7.584118', longi: '-42.610574', uf: 'PI', qtd: '10' },
  { lati: '-5.134837', longi: '-39.425929', uf: 'CE', qtd: '10' },
  { lati: '-5.731107', longi: '-36.370468', uf: 'RN', qtd: '10' },
  { lati: '-7.361012', longi: '-36.673113', uf: 'PARAIBA', qtd: '10' },
  { lati: '-8.496896', longi: '-37.835910', uf: 'PE', qtd: '10' },
  { lati: '-9.817825', longi: '-36.386397', uf: 'AL', qtd: '10' },
  { lati: '-10.632955', longi: '-37.246547', uf: 'SE', qtd: '10' },
  { lati: '-11.913880', longi: '-41.579159', uf: 'BH', qtd: '10' },
  { lati: '-15.955032', longi: '-49.375855', uf: 'GO', qtd: '10' },
  { lati: '-20.422825', longi: '-54.457796', uf: 'MTS', qtd: '10' },
  { lati: '-18.538759', longi: '-43.994343', uf: 'MG', qtd: '100' },
  { lati: '-19.567284', longi: '-40.520323', uf: 'ES', qtd: '10' },
  { lati: '-22.930489', longi: '-43.452862', uf: 'RJ', qtd: '10' },
  { lati: '-22.323859', longi: '-48.551700', uf: 'SP', qtd: '10' },
  { lati: '-24.580989', longi: '-51.388213', uf: 'PR', qtd: '980' },
  { lati: '-27.244599', longi: '-50.385818', uf: 'SC', qtd: '10' },
  { lati: '-29.810349', longi: '-53.244774', uf: 'RS', qtd: '10' },
];

let hasSearch = false;

// eslint-disable-next-line react/prop-types
export const DashBoard = ({ installApp }) => {
  const { t } = useTranslation();
  const [totalClients, setTotalClients] = useState(0);
  const [totalCreated, setTotalCreated] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [markers, setMarkers] = useState([]);
  const navigate = useNavigate();
  // const location = useLocation();
  // const [hasSearch, setHasSearch] = useState(false);

  const [totalDealers, setTotalDealers] = useState(0);

  const [orderMetrics, setOrdermetrics] = useState({
    Recharges: {
      Total: { ConfirmedOrders: 0, ReceivedOrders: 0 },
      Month: { ConfirmedOrders: 0, ReceivedOrders: 0 },
    },
    Chips: {
      Total: { ConfirmedOrders: 0, ReceivedOrders: 0 },
      Month: {
        ConfirmedOrders: 0,
        ReceivedOrders: 0,
      },
    },
  });

  const [lines, setLines] = useState(0);
  const [iccidInfo, setIccidInfo] = useState({
    Active: 0,
    Available: 0,
    total: 0,
  });

  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingDealers, setLoadingDealers] = useState(true);
  const [loadingLines, setLoadingLines] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingIccids, setLoadingIccids] = useState(true);

  const getCLients = () => {
    if (
      api.currentUser.AccessTypes[0] !== 'CLIENT' &&
      api.currentUser.AccessTypes[0] !== 'AGENT'
    ) {
      api.client
        .getTotals()
        .then((res) => {
          let total = 0;
          let created = 0;
          let active = 0;
          const list = [];
          res.data?.TotalClients?.forEach((t) => {
            total += t._count?.Id;
            const find = UFS.find((uf) => uf.uf === t.State);
            if (find) {
              list.push({
                lati: find.lati,
                longi: find.longi,
                uf: find.uf,
                qtd: t._count?.Id?.toString(),
              });
            }
          });
          res.data?.TotalClientCreated?.forEach((t) => {
            created += t._count?.Id;
          });
          res.data?.TotalClientsActived?.forEach((t) => {
            active += t._count?.Id;
          });
          setMarkers(list);
          setTotalClients(total);
          setTotalCreated(created);
          setTotalActive(active);
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingClients(false);
        });
    }
  };

  const syncMyLines = async () => {
    console.log(api.currentUser)
    try {
      const res = await api.line.syncMyLines(
        api.currentUser.MyDocument,
        api.currentUser.MyFinalClientId,
        api.currentUser.DealerId
      );
      if (res.data?.lines?.length > 0) {
        hasSearch = true;
        getLines();
      } else {
        hasSearch = true;
        setLoadingLines(false);
      }
    } catch (err) {
      console.log(err), setLoadingLines(false);
    }
  };

  const getLines = () => {
    if (
      api.currentUser.AccessTypes[0] !== 'CLIENT' &&
      api.currentUser.AccessTypes[0] !== 'AGENT'
    ) {
      api.line
        .getLines(1, 1, '', '')
        .then((res) => {
          setLines(
            res.data?.iccids?.some((s) => s?.IccidHistoric?.length > 0)
              ? res.data.meta.total
              : 0
          );
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingLines(false);
        });
    } else {
      api.line
        .myLines(1, 1)
        .then((res) => {
          setLines(
            res.data?.iccids?.some((s) => s?.IccidHistoric?.length > 0)
              ? res.data.meta.total
              : 0
          );
          if (!hasSearch) {
            console.log('Syncar');
            syncMyLines();
          } else {
            console.log('Syncado', hasSearch);
            setLoadingLines(false);
          }
        })
        .catch((err) => {
          translateError(err);
          setLoadingLines(false);
        });
    }
  };

  const getDealers = () => {
    if (api.currentUser.AccessTypes[0] === 'TEGG') {
      api.dealer
        .getTotals()
        .then((res) => {
          let total = 0;
          res.data.TotalDealers.forEach((state) => {
            total += state._count.Id;
          });
          setTotalDealers(total);
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingDealers(false);
        });
    }
  };

  const getMetrics = () => {
    if (api.currentUser.AccessTypes[0] === 'TEGG') {
      api.order
        .getAllMetrics()
        .then((res) => {
          setOrdermetrics(res.data);
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingMetrics(false);
        });
    } else if (api.currentUser.AccessTypes[0] === 'DEALER') {
      api.order
        .getDealerMetrics(api.currentUser.DealerId)
        .then((res) => {
          setOrdermetrics(res.data);
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingMetrics(false);
        });
    } else {
      api.order
        .getFinalClientMetrics(api.currentUser.MyFinalClientId)
        .then((res) => {
          setOrdermetrics(res.data);
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoadingMetrics(false);
        });
    }
  };

  const getIccidInfo = () => {
    if (api.currentUser.AccessTypes[0] === 'TEGG') {
      api.iccid
        .getTotals()
        .then((res) => {
          setIccidInfo(res.data);
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoadingIccids(false);
        });
    }
  };

  // const changeClientProfile = (profile) => {
  //   api.user
  //     .updateProfile(api.currentUser.UserId, profile)
  //     .then(async (res) => {
  //       toast.success(
  //         `${res.data.Message}. A página será recarregada para aplicar o novo perfil.`
  //       );
  //       await new Promise((r) => setTimeout(r, 3000));

  //       window.location.reload();
  //     })
  //     .catch((err) => {
  //       translateError(err);
  //     })
  // };

  // const reloadPage = async (AccessToken, profile) => {
  //   api.mySession.set(AccessToken).then(async () => {
  //     window.history.replaceState({}, '')
  //     if (profile === 'DEALER') {
  //         window.location.reload();
  //     } else {
  //       changeClientProfile(profile);
  //     }
  //   });
  //   // toast.success(
  //   //   `Usuário atualizado com sucesso. A página será recarregada para aplicar o novo perfil.`
  //   // );
  //   // await new Promise((r) => setTimeout(r, 3000));
  //   // console.log('recarregar');
  //   // window.location.reload();
  // };

  useEffect(() => {
    // if (location?.state?.mustReload) {
    //   console.log('precisa recarregar')
    //   reloadPage(location?.state?.AccessToken, location?.state?.profile);
    // }
    getCLients();
    getDealers();
    getMetrics();
    getLines();
    getIccidInfo();
  }, []);

  const lineMetrics = (e) => {
    console.log('line metrics', e);
  };

  return (
    <PageLayout style={{ padding: window.innerWidth < 768 && 0 }}>
      <>
        {(api.currentUser.Type === 'CLIENT' ||
          api.currentUser.Type === 'AGENT') && (
          <div
            style={{
              margin:
                window.innerWidth < 768 ? '1rem 1rem 0 1rem' : '0 0 0 1rem',
              gap: 10,
              display: 'flex',
              justifyContent:
                window.innerWidth < 768 ? 'space-around' : 'start',
            }}
          >
            <Button
              style={{ minWidth: 153 }}
              onClick={() => navigate('/activation/client/manual')}
            >
              Ativar nova linha
            </Button>
            <Button
              style={{ minWidth: 153 }}
              onClick={() => navigate('/recharge')}
            >
              Recargas
            </Button>
          </div>
        )}
        <TeggMetrics
          totalClients={totalClients}
          totalCreated={totalCreated}
          totalActive={totalActive}
          totalDealers={totalDealers}
          orderMetrics={orderMetrics}
          loadingClients={loadingClients}
          loadingDealers={loadingDealers}
          loadingMetrics={loadingMetrics}
        />

        {(api.currentUser.AccessTypes[0] === 'CLIENT' ||
          api.currentUser.AccessTypes[0] === 'AGENT') &&
          lines !== 0 && (
            <div style={{ margin: window.innerWidth > 768 && '1rem' }}>
              <ConsumptionChart lineMetrics={lineMetrics} />
            </div>
          )}

        {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <ResalesMetrics
            iccidInfo={iccidInfo}
            iccidLoading={loadingIccids}
            lines={lines}
            loadingLines={loadingLines}
          />
        )}

        {api.currentUser.AccessTypes[0] !== 'CLIENT' &&
          api.currentUser.AccessTypes[0] !== 'AGENT' && (
            <div style={{ margin: '1rem' }}>
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: '#00D959',
                  color: '#fff',
                  borderRadius: '8px 8px 0 0',
                  padding: '0.5rem',
                }}
              >
                <h4>{t('Metrics.clientsForRegion')}</h4>
              </div>
              <div style={{ width: '100%' }}>
                <MapsData zoom={4} markerClick markers={markers} />
              </div>
            </div>
          )}
      </>
      {window.innerWidth < 768 && (
        <footer
          style={{ bottom: '20px', marginTop: '2rem', marginBottom: '2rem' }}
        >
          <p style={{ padding: '1%', textAlign: 'center', margin: '1rem' }}>
            {t('ModalInstall.msg1')}{' '}
            <span style={{ fontWeight: 500 }}>{t('ModalInstall.msg2')}</span>{' '}
            {t('ModalInstall.msg3')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button notHover style={{ width: '96%' }} onClick={installApp}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {t('ModalInstall.install')}
              </span>
            </Button>
          </div>
        </footer>
      )}
    </PageLayout>
  );
};
