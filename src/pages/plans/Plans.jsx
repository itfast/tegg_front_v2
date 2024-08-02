import { useEffect, useState } from 'react';
import {Loading} from '../../components/loading/Loading'
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../globalStyles';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { translateError } from '../../services/util';
import { PlanInfo } from './PlanInfo';
import { TableItens } from '../orders/new/NewOrder.styles';
import { PlanCard } from './PlanCard';
import { useTranslation } from 'react-i18next';
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const Plans = () => {
  const {t} =  useTranslation()
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);

  const searchPlan = () => {
    setLoadingPage(true);
    api.plans
      .get()
      .then((res) => {
        setPlans(res.data);
      })
      .catch((err) => translateError(err))
      .finally(() => setLoadingPage(false));
  };

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] === 'CLIENT' || api.currentUser.AccessTypes[0] === 'AGENT') {
      api.user
        .logout()
        .then(() => {
          navigate('/login');
        })
        .catch((err) => {
          console.log(err);
        });
    }
    searchPlan();
  }, []);

  return (
    <>
      <PageLayout>
      <PageTitles title='Planos' />
        {api.currentUser.AccessTypes[0] === 'TEGG' && (
          <Button
            style={{ width: screen.width < 768 && '100%' }}
            onClick={() => navigate('/plans/new')}
          >
            {t('plans.newPlan')}
          </Button>
        )}
        {plans.length > 0 ? (
          <>
            <ContainerWeb>
              <TableItens style={{ marginTop: '1rem' }}>
                {/* <table id='customers'> */}
                <thead>
                  <tr>
                    <th>{t('plans.table.name')}</th>
                    {api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' && (
                      <th>{t('plans.table.pointsCarreira')}</th>
                    )}
                    {api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' && (
                      <th>{t('plans.table.performance')} (%)</th>
                    )}
                    <th>{t('plans.table.multiLabel')}</th>
                    <th>{t('plans.table.duration')}</th>
                    {api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT' && (
                      <th>{t('plans.table.maxTop')}</th>
                    )}
                  </tr>
                </thead>
                {plans.map((p, index) => (
                  <PlanInfo key={index} plan={p} search={searchPlan} />
                ))}
                {/* </table> */}
              </TableItens>
            </ContainerWeb>
            <ContainerMobile style={{ width: '100%', height: '100%' }}>
              {plans.map((p, index) => (
                <PlanCard key={index} plan={p} search={searchPlan} />
              ))}
            </ContainerMobile>
          </>
        ) : (
          !loadingPage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 150,
              }}
            >
              <h2 style={{ color: 'black', fontWeight: 'bold' }}>
              {t('plans.table.notContent')}
              </h2>
            </div>
          )
        )}
      </PageLayout>
			<Loading open={loadingPage} msg={t('plans.table.search')}/>
    </>
  );
};
