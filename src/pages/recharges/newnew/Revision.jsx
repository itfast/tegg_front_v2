import { toast } from 'react-toastify';
import { Button } from '../../../../globalStyles';
import api from '../../../services/api';
import { translateError } from '../../../services/util';
import { CardData } from './NewOrder.styles';
import { useState } from 'react';
// import ReactLoading from 'react-loading';
import { RechargeCard } from '../RechargeCard';
import {Loading} from '../../../components/loading/Loading'

/* eslint-disable react/prop-types */
export const Revision = ({
  goBackStep,
  handleNext,
  setOrderId,
  line,
  plan,
}) => {
  const [loading, setLoading] = useState(false);
  const handleCreateOrder = () => {
    setLoading(true);
    // toast.info('Aguarde enquanto é gerado um pedido de recarga...');
    const array = [line?.value?.Iccid];
    line?.value?.FinalClientId;

    // api.order
    //   .create(
    //     api.currentUser.AccessTypes[0] === 'DEALER'
    //       ? api.currentUser.MyFinalClientId === line?.value?.FinalClientId
    //         ? null
    //         : line?.value?.FinalClientId
    //       : line?.value?.FinalClientId,
    //     api.currentUser.AccessTypes[0] === 'DEALER'
    //       ? api.currentUser.MyFinalClientId === line?.value?.FinalClientId
    //         ? api.currentUser.DealerId
    //         : null
    //       : null,
    //     api.currentUser.AccessTypes[0] === 'DEALER'
    //       ? api.currentUser.MyFinalClientId === line?.value?.FinalClientId
    //         ? null
    //         : api.currentUser.DealerId
    //       : api.currentUser.AccessTypes[0] === 'CLIENT'
    //       ? api.currentUser.MyDealerId || null
    //       : null,
    //     api.currentUser.Type === 'TEGG' ? 2 : 1,
    //     false,
    //     0,
    //     false
    //   )
    
    api.order
      .create(
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser.MyFinalClientId === line?.value?.FinalClientId
            ? null
            : line?.value?.FinalClientId
          : line?.value?.FinalClientId,
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser.MyFinalClientId === line?.value?.FinalClientId
            ? api.currentUser.DealerId
            : null
          : null,
        1,
        false,
        null,
        null,
        false
      )
      .then((res) => {
        if (res.status == 201) {
          setLoading(true);
          let orderId = res.data.OrderId;
          setOrderId(res.data.OrderId);
          api.order
            .addItem(plan.value.Id, 1, orderId, plan.value.Amount, array)
            .then((res) => {
              toast.success(res.data.Message);
              handleNext();
            })
            .catch((err) => {
              console.log(err);
              translateError(err);
            })
            .finally(() => setLoading(false));
        }
      })
      .catch((err) => {
        translateError(err);
        setLoading(false);
      })
      .finally(()=> setLoading(false))
  };

  return (
    <CardData>
      <Loading open={loading} msg={'Solicitando recarga...'}/>
      <h5>REVISE SEU PEDIDO</h5>
      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h4>TIPO</h4>
            <h5>Pedido de Recarga</h5>
          </div>
          <div>
            <h4>TELEFONE</h4>
            <h5>{line?.label}</h5>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          <RechargeCard
            disabled
            plan={plan?.value}
            name={plan?.value?.Name}
            size={plan?.value?.Size}
            internet={plan?.value?.Internet}
            extra={plan?.value?.Extra}
            extraPortIn={plan?.value?.ExtraPortIn}
            free={plan?.value?.Free?.split(' ')}
            price={plan?.value?.Amount}
            comments={plan?.value?.Comments}
          />
        </div>
      </div>
      <div className='flex end btn_invert'>
        <Button
          onClick={goBackStep}
          style={{ width: window.innerWidth < 768 && '100%' }}
        >
          VOLTAR
        </Button>
        <Button
          notHover
          style={{ width: window.innerWidth < 768 && '100%' }}
          onClick={() => {
            // setLoading(true)
            if(!loading)
            handleCreateOrder();
          }}
        >
          CRIAR PEDIDO
          {/* {loading ? (
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
            'CRIAR PEDIDO'
          )} */}
        </Button>
      </div>
    </CardData>
  );
};
