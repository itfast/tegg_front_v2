import { ContainerMobile, ContainerWeb } from '../../../../globalStyles';
import { BackgroundForPay } from './PayOrder.styles';
import { PayOrderData } from './PayOrderData';
import { useNavigate, useParams } from 'react-router-dom';

export const PayOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/orders');
  };

  return (
    <>
      <ContainerWeb>
        <BackgroundForPay>
          <div style={{ display: 'flex', height: '100%' }}>
            <PayOrderData
              order={id}
              goBackStep={goBack}
              label={'ESCOLHER FORMA DE PAGAMENTO'}
            />
          </div>
        </BackgroundForPay>
      </ContainerWeb>
      <ContainerMobile>
        <BackgroundForPay>
          <div style={{ display: 'flex', height: '100%' }}>
            <PayOrderData
              order={id}
              goBackStep={goBack}
              label={'ESCOLHER FORMA DE PAGAMENTO'}
            />
          </div>
        </BackgroundForPay>
      </ContainerMobile>
    </>
  );
};
