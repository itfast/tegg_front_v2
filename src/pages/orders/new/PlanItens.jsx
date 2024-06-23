/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
// import api from '../../../services/api';
import { CardData, InputData } from './NewOrder.styles';
import { Tooltip } from 'react-tooltip';
import { FaFileUpload } from 'react-icons/fa';
import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const PlanItens = ({ handleNextExt, goBackStep, plan, setPlan }) => {
  const planRef = useRef(null);
  const {t} = useTranslation()
  // const [plan, setPlan] = useState();

  useEffect(() => {
    console.log(plan);
  }, [plan]);

  const handleNext = () => {
    if (plan) {
      handleNextExt();
    } else {
      toast.error(t('Order.new.planItens.mustPlan'));
    }
  };

  return (
    <>
      <Tooltip id='add-iccid' />
      <CardData>
        <div
          style={{
            display: screen.width > 768 && 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <h5>{t('Order.new.planItens.title')}</h5>
          <h5
            style={{ cursor: 'pointer', color: '#00d959' }}
            onClick={() => {
              window.open(
                'https://teggtelecom.com/apihomolog/payment/files/modelo_planilha_pedido.xlsx',
                '_black'
              );
            }}
          >
            {t('Order.new.planItens.model')}
          </h5>
        </div>
        <div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <InputData
              disabled
              id='plan'
              type='text'
              placeholder={t('Order.new.planItens.selectPlan')}
              style={{ width: '100%' }}
              onClick={() => planRef.current.click()}
              value={plan?.name}
            />
            <FaFileUpload
              style={{ cursor: 'pointer' }}
              size={30}
              color='#00D959'
              onClick={() => planRef.current.click()}
            />
          </div>
        </div>
        <div className='flex end btn_invert'>
          <Button
            style={{ width: screen.width < 768 && '100%' }}
            onClick={() => {
              setPlan(null);
              goBackStep();
            }}
          >
            {t('Order.new.planItens.buttonGoback')}
          </Button>
          <Button
            style={{ width: screen.width < 768 && '100%' }}
            notHover
            onClick={handleNext}
          >
            {t('Order.new.planItens.buttonNext')}
          </Button>
        </div>
      </CardData>
      <input
        ref={planRef}
        type='file'
        style={{ opacity: 0 }}
        accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        onChange={() => {
          setPlan(planRef.current.files[0]);
        }}
        className='form-control'
        placeholder='Planilha de ICCIDs'
        name='Planilha de ICCIDs'
      />
    </>
  );
};
