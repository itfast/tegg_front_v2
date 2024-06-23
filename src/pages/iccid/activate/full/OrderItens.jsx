/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
// import api from '../../../services/api';
import { CardData } from './NewOrder.styles';
import { Tooltip } from 'react-tooltip';
// import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import { translateError } from '../../../../services/util';
import { RechargeCard } from '../../../recharges/RechargeCard';
import { Button } from '../../../../../globalStyles';
import api from '../../../../services/api';
// import { translateError } from '../../../services/util';
// import { RechargeCard } from '../../recharges/RechargeCard';

// eslint-disable-next-line react/prop-types
export const OrderItens = ({
  handleNextExt,
  goBackStep,
  selected,
  setSelected,
}) => {
  const [planOpt, setPlanOpt] = useState([]);

  useEffect(() => {
    // const loadPlans = async () => {
    //   api.plans
    //     .get()
    //     .then((res) => {
    //       const pArray = res.data.filter(
    //         (plan) =>
    //           plan.Products.length === 1 && plan.Products[0].Product.SurfId
    //       );
    //       pArray.sort((a, b) => {
    //         return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
    //       });
    //       setPlanOpt(pArray);
    //     })
    //     .catch((err) => {
    //       translateError(err);
    //     });
    // };

    // .getByBuy("client", null)
    api.plans
      .getByRecharge()
      .then((res) => {
        console.log(res)
        const list = []
        res.data.forEach((r)=>{
          if(r.Name !== 'Prezinho'){
            list.push(r)
          }else{
            if(r.OnlyInFirstRecharge){
              list.push(r)
            }
          }
        })
        list.sort((a, b) => {
          return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
        });
        setPlanOpt(list);
      })
      .catch((err) => {
        translateError(err);
      });

    // loadPlans();
  }, []);

  const handleNext = () => {
    if (selected) {
      handleNextExt();
    } else {
      toast.error('Escolha pelo menos um plano para continuar');
    }
  };
  return (
    <>
      <Tooltip id='add-iccid' />
      <CardData>
        <h5>ESCOLHA O PLANO</h5>
        {/* <div className="input_container">
				<div className="tb mr"> */}
        <div>
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                marginTop: 40,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                gap: 10,
              }}
            >
              {planOpt?.map((p) => (
                <RechargeCard
                  key={p.Id}
                  disabled
                  plan={p}
                  name={p?.Name}
                  size={p?.Size}
                  internet={p?.Internet}
                  extra={p?.Extra}
                  extraPortIn={p?.ExtraPortIn}
                  free={p?.Free?.split(' ')}
                  price={p?.Amount}
                  comments={p?.Comments}
                  selected={selected?.label === p?.Name}
                  onClick={() => setSelected({ label: p?.Name, value: p })}
                />
              ))}
            </div>
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
            onClick={handleNext}
            style={{ width: window.innerWidth < 768 && '100%' }}
          >
            PRÓXIMO
          </Button>
        </div>
      </CardData>
    </>
  );
};
