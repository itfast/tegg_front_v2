/* eslint-disable react/prop-types */
import {
  Button,
  ContainerMobile,
  ContainerWeb,
} from '../../../../globalStyles';
import { CardData, InputData, SelectUfs } from '../../resales/Resales.styles';
import ReactLoading from 'react-loading';
import { AiFillDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { translateError } from '../../../services/util';
import './plans_data.css';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from '@mui/material';
import { TableItens } from '../../orders/new/NewOrder.styles';
// import { PlanCard } from '../PlanCard';
import { PlansCard } from './PlansCard';
import { useTranslation } from 'react-i18next';

export const PlansData = ({
  goStep,
  info,
  goBackStep,
  plan,
  setPlan,
  label,
  loading,
}) => {
  const {t} = useTranslation()
  const location = useLocation();

  const [products, setProducts] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const [planProds, setPlanProds] = useState([]);
  const [planProdsIds, setPlanProdsIds] = useState([]);
  const [selectedProd, setSelectedProd] = useState(-1);

 
  const nameInput = document.getElementById('planName');
  const minimumInvestInput = document.getElementById('minimumInvest');
  const maximumInvestInput = document.getElementById('maximumInvest');
  const performanceInput = document.getElementById('performance');
  const durationInput = document.getElementById('duration');
  const pointsInput = document.getElementById('points');
  const productsInput = document.getElementById('planTypeProducts');

  const checkDiscount = () => {
    if (location?.pathname === '/plans/edit') {
      let val = 0;
      plan.Products.forEach((product) => {
        val += Number(product.Product.Amount);
      });
      if (val > plan.Amount) {
        console.log(val)
        console.log(plan.Amount)
        setDiscount(
          new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(val - plan.Amount)
        );
      }
    }
  };

  useEffect(() => {
    // console.log(plan);
    getProducts();
  }, []);

  useEffect(() => {
    // console.log(plan);
    checkDiscount();
  }, [plan]);

  useEffect(() => {
    if (products.length !== 0) {
      if (plan.Products.length !== 0) {
        const array = [];
        const idArray = [];
        let val = 0;
        plan.Products.forEach((p) => {
          const prod = products.find((pr) => pr.Id === p.ProductId);
          const idObj = {
            ProductId: prod.Id,
          };
          val += Number(prod.Amount);
          array.push(prod);
          idArray.push(idObj);
        });
        setPlanProds(array);
        setTotalValue(val);
        setPlanProdsIds(idArray);
      }
    }
  }, [products]);

  const getProducts = () => {
    api.product
      .getAll()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        translateError(err);
        console.log(err);
      });
  };

  const translateValue = (value) => {
    let converted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
    return converted;
  };

  const handleChangeDiscount = (e) => {
    console.log(e.target.value)
    let count = e.target.value.replace('R$', '').replace(',','.')
    setDiscount(e.target.value);
    const origVal = totalValue;
    setPlan({ ...plan, Amount: (origVal - Number(count)).toString() });
  };

  const handleProductChange = (e) => {
    setSelectedProd(e.target.value);
  };

  const handleAdd = () => {
    if (selectedProd === -1) {
      toast.error(t('plans.errorMsg.requireProduct'));
    } else {
      const array = [...planProds];
      const idArray = [...planProdsIds];
      const origVal = totalValue;
      const newVal = origVal + Number(products[selectedProd].Amount);
      const idObj = {
        ProductId: products[selectedProd].Id,
      };
      array.push(products[selectedProd]);
      idArray.push(idObj);
      setPlan({ ...plan, Amount: newVal - discount });
      setTotalValue(newVal);
      setPlanProds(array);
      setPlanProdsIds(idArray);
    }
  };

  const handleDelete = (index) => {
    const array = [...planProds];
    const idArray = [...planProdsIds];
    const origVal = totalValue;
    const newVal = origVal - Number(planProds[index].Amount);
    array.splice(index, 1);
    idArray.splice(index, 1);
    setPlanProds(array);
    setPlanProdsIds(idArray);
    setTotalValue(newVal);
    setPlan({ ...plan, Amount: newVal - discount });
  };

  const handleNext = () => {
    if (plan.Name !== '') {
      nameInput?.style.removeProperty('border-color');
      if (plan.MinimumInvestment !== '' && Number(plan.MinimumInvestment) > 0) {
        minimumInvestInput?.style.removeProperty('border-color');
        if (
          plan.MaximumInvestment !== '' &&
          Number(plan.MaximumInvestment) > 0
        ) {
          maximumInvestInput?.style.removeProperty('border-color');
          if (plan.Performance !== '' && Number(plan.Performance) > 0.1) {
            performanceInput?.style.removeProperty('border-color');
            if (plan.Duration !== '' && Number(plan.Duration) > 0) {
              durationInput?.style.removeProperty('border-color');
              if (
                plan.PointsForCarrerPlan !== '' &&
                Number(plan.PointsForCarrerPlan) > 0
              ) {
                pointsInput?.style.removeProperty('border-color');
                if (planProdsIds.length > 0) {
                  productsInput?.style.removeProperty('border-color');
                  goStep(planProdsIds);
                } else {
                  toast.error(t('plans.errorMsg.requireItem'));
                  productsInput.style.borderColor = 'red';
                }
              } else {
                toast.error(t('plans.errorMsg.requirePoints'));
                pointsInput.style.borderColor = 'red';
              }
            } else {
              toast.error(t('plans.errorMsg.requireDuration'));
              durationInput.style.borderColor = 'red';
            }
          } else {
            toast.error(t('plans.errorMsg.requirePerformance'));
            performanceInput.style.borderColor = 'red';
          }
        } else {
          toast.error(t('plans.errorMsg.requireDispendMax'));
          maximumInvestInput.style.borderColor = 'red';
        }
      } else {
        toast.error(t('plans.errorMsg.requireDispendMin'));
        minimumInvestInput.style.borderColor = 'red';
      }
    } else {
      toast.error(t('plans.errorMsg.requireName'));
      nameInput.style.borderColor = 'red';
    }
  };

  const handleChange = (key, value) => {
    const onlyNumbers = new RegExp(/[^.0123456789]/g);
    if (!onlyNumbers.test(value)) {
      setPlan({ ...plan, [key]: value });
    }
  };

  return (
    <CardData style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h3>{label}</h3>
      <div className='input_container'>
        <div style={{ width: '100%' }}>
          <label>{t('plans.modalPlan.name')}</label>
          <InputData
            id='planName'
            disabled={info}
            type='text'
            placeholder='Nome *'
            style={{ width: '100%' }}
            value={plan.Name}
            onChange={(e) =>
              setPlan({ ...plan, Name: e.target.value.slice(0, 30) })
            }
          />
        </div>
      </div>
      <div className='input_container'>
        <div className='input mr'>
          <label>{t('plans.modalPlan.dispendMin')}</label>
          <InputData
            id='minimumInvest'
            disabled={info}
            type='number'
            min={0}
            // disabled={true}
            placeholder={t('plans.modalPlan.dispendMinRequired')}
            style={{ minWidth: '100%' }}
            value={plan.MinimumInvestment}
            onChange={(e) => handleChange('MinimumInvestment', e.target.value)}
          />
        </div>
        <div className='input mr'>
        <label>{t('plans.modalPlan.dispendMax')}</label>
          <InputData
            id='maximumInvest'
            disabled={info}
            type='number'
            min={0}
            // disabled={true}
            placeholder={t('plans.modalPlan.dispendMaxRequired')}
            style={{ minWidth: '100%', marginRight: '1%' }}
            value={plan.MaximumInvestment}
            onChange={(e) => handleChange('MaximumInvestment', e.target.value)}
          />
        </div>
        <div className='input'>
          <label>{t('plans.modalPlan.performance')}</label>
          <InputData
            id='performance'
            disabled={info}
            type='number'
            min={0.1}
            placeholder={t('plans.modalPlan.performanceRequired')}
            style={{ minWidth: '100%' }}
            value={plan.Performance}
            onChange={(e) => handleChange('Performance', e.target.value)}
          />
        </div>
      </div>
      <div className='input_container'>
        <div className='input mr'>
          <label>{t('plans.modalPlan.maxTop')}</label>
          <InputData
            type='number'
            min={0}
            disabled={info}
            placeholder={t('plans.modalPlan.maxTopRequired')}
            style={{ minWidth: '100%' }}
            value={plan.EarningsCeiling}
            onChange={(e) => handleChange('EarningsCeiling', e.target.value)}
          />
        </div>
        <div className='input mr'>
          <label>{t('plans.modalPlan.duration')}</label>
          <InputData
            id='duration'
            disabled={info}
            type='number'
            min={0}
            placeholder={t('plans.modalPlan.durationRequired')}
            style={{ minWidth: '100%' }}
            value={plan.Duration}
            onChange={(e) => handleChange('Duration', e.target.value)}
          />
        </div>
        <div className='input'>
          <label>{t('plans.modalPlan.points')}</label>
          <InputData
            id='points'
            disabled={info}
            type='number'
            min={0}
            placeholder={t('plans.modalPlan.pointsRequired')}
            style={{ minWidth: '100%' }}
            value={plan.PointsForCarrerPlan}
            onChange={(e) =>
              handleChange('PointsForCarrerPlan', e.target.value)
            }
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: screen.width < 768 && 'column-reverse',
          margin: screen.width > 768 && '1rem',
          width: '100%',
         
        }}
      >
        <div className='tb mr' style={{ maxHeight: '300px',
          overflowY: 'scroll', padding: '0.2rem'}}>
          <label>{t('plans.modalPlan.itens')}</label>
          <ContainerWeb>
            <TableItens style={{ borderRadius: '0px'}}>
              <thead>
                <tr>
                  <th>{t('plans.modalPlan.itensName')}</th>
                  <th>{t('plans.modalPlan.itensPrice')}</th>
                </tr>
              </thead>
              {planProds.length == 0 && (
                <tr>
                  <td>-</td>
                  <td>-</td>
                </tr>
              )}
              {planProds.map((m, i) => (
                <tr key={i}>
                  <td>{m.Name}</td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <p>{translateValue(m.Amount)}</p>
                      {!info && (
                        <AiFillDelete
                          style={{ cursor: 'pointer', color: 'red' }}
                          onClick={() => {
                            handleDelete(i);
                          }}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </TableItens>
          </ContainerWeb>
          <ContainerMobile style={{ width: '100%', height: '100%' }}>
            {planProds.map((m, i) => (
              <PlansCard
                key={m.Id}
                plan={m}
                info={info}
                index={i}
                handleDelete={handleDelete}
              />
            ))}
          </ContainerMobile>
        </div>
        <div>
          {!info && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
              }}
            >
              <div style={{ width: '100%' }}>
                <label>{t('plans.modalPlan.products')}</label>
                <SelectUfs
                  name='UF'
                  id='planTypeProducts'
                  placeholder='ITEM *'
                  value={selectedProd}
                  onChange={(e) => {
                    handleProductChange(e);
                  }}
                  style={{ width: '100%' }}
                  defaultValue={0}
                >
                  <option disabled value={-1}>
                  {t('plans.modalPlan.item')}
                  </option>
                  {products.map((m, i) => (
                    <option key={i} value={i}>
                      {m.Name}
                    </option>
                  ))}
                </SelectUfs>
              </div>
              <div>
                <div style={{ height: 20 }} />
                <Button
                  style={{
                    marginRight: 10,
                    // height: 20,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() => handleAdd()}
                >
                  +
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='input_container'>
        <div className='input mr'>
          <label>{t('plans.modalPlan.discount')}</label>
          <InputData
            // type='number'
            min={0}
            disabled={info}
            placeholder={t('plans.modalPlan.value')}
            className='input'
            value={discount}
            onChange={(e) => handleChangeDiscount(e)}
          />
        </div>
        <div className='input'>
          <label>{t('plans.modalPlan.value')}</label>
          <InputData
            // type="number"
            disabled={true}
            placeholder={t('plans.modalPlan.value')}
            className='input'
            value={plan.Amount}
            // value={translateValue(plan.Amount)}
          />
        </div>
      </div>
      <div style={{ display: screen.width > 768 && 'flex' }}>
        <div>
          <label>{t('plans.modalPlan.canPurchase')}</label>
          <div className='input_container'>
            <div className='input mr'>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{ color: 'green' }}
                      checked={plan.FinalClientCanBuy}
                      onChange={(e) =>
                        setPlan({
                          ...plan,
                          FinalClientCanBuy: e.target.checked,
                        })
                      }
                    />
                  }
                  label={t('plans.modalPlan.client')}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{ color: 'green' }}
                      checked={plan.DealerCanBuy}
                      onChange={(e) =>
                        setPlan({ ...plan, DealerCanBuy: e.target.checked })
                      }
                    />
                  }
                  label={t('plans.modalPlan.resale')}
                />
              </FormGroup>
            </div>
          </div>
        </div>
        <div>
          <label>{t('plans.modalPlan.type')}</label>
          <div className='input_container'>
            <div className='input mr'>
              <FormControl>
                {/* <FormLabel id='demo-row-radio-buttons-group-label'>
                  Gender
                </FormLabel> */}
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={plan.Type}
                  onChange={(e) => setPlan({ ...plan, Type: e.target.value })}
                >
                  <FormControlLabel
                    value='BUY'
                    control={<Radio style={{ color: 'green' }} />}
                    label={t('plans.modalPlan.sale')}
                  />
                  <FormControlLabel
                    value='RECHARGE'
                    control={<Radio style={{ color: 'green' }} />}
                    label={t('plans.modalPlan.recharge')}
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
        <div>
          <label>{t('plans.modalPlan.available')}</label>
          <div className='input_container'>
            <div className='input mr'>
              <FormControl>
                {/* <FormLabel id='demo-row-radio-buttons-group-label'>
                  Gender
                </FormLabel> */}
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={plan.OnlyInFirstRecharge}
                  onChange={(e) =>
                    setPlan({ ...plan, OnlyInFirstRecharge: e.target.value })
                  }
                >
                  <FormControlLabel
                    value={false}
                    control={<Radio style={{ color: 'green' }} />}
                    label={t('plans.modalPlan.no')}
                  />
                  <FormControlLabel
                    value={true}
                    control={<Radio style={{ color: 'green' }} />}
                    label={t('plans.modalPlan.yes')}
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
      {plan?.Type === 'RECHARGE' && (
        <>
          <label>{t('plans.modalPlan.descriptions')}</label>
          <div className='input_container'>
            <div className='input mr'>
              <label>{t('plans.modalPlan.maxInternet')}</label>
              <InputData
                // type="number"
                // min={0}
                disabled={info}
                placeholder='Ex: 1 GB'
                className='input'
                value={plan.Size}
                onChange={(e) => setPlan({ ...plan, Size: e.target.value })}
              />
            </div>
            <div className='input mr'>
              <label>{t('plans.modalPlan.descriptionInternet')}</label>
              <InputData
                // type="number"
                // disabled={true}
                placeholder={t('plans.modalPlan.sampleInternet')}
                className='input'
                value={plan?.Internet}
                onChange={(e) => setPlan({ ...plan, Internet: e.target.value })}
              />
            </div>
            <div className='input mr'>
              <label>{t('plans.modalPlan.portInBonus')}</label>
              <InputData
                // type="number"
                placeholder={t('plans.modalPlan.sampleBonus')}
                className='input'
                value={plan?.ExtraPortIn}
                onChange={(e) =>
                  setPlan({ ...plan, ExtraPortIn: e.target.value })
                }
              />
            </div>
            <div className='input'>
              <label>{t('plans.modalPlan.recurrenceBonus')}</label>
              <InputData
                // type="number"
                placeholder={t('plans.modalPlan.sampleRecurrence')}
                className='input'
                value={plan?.Extra}
                onChange={(e) => setPlan({ ...plan, Extra: e.target.value })}
              />
            </div>
          </div>
          <div className='input_container'>
            <div className='input mr'>
              <label>{t('plans.modalPlan.observation')}</label>
              <InputData
                // type="number"
                // min={0}
                disabled={info}
                placeholder={t('plans.modalPlan.sampleObservation')}
                className='input'
                value={plan.Comments}
                onChange={(e) => setPlan({ ...plan, Comments: e.target.value })}
              />
            </div>
            <div className='input'>
              <label>{t('plans.modalPlan.freeServices')}</label>
              <InputData
                placeholder={t('plans.modalPlan.sampleFree')}
                className='input'
                value={plan?.Free}
                onChange={(e) => setPlan({ ...plan, Free: e.target.value })}
              />
            </div>
          </div>
        </>
      )}
      <div style={{display: 'flex', justifyContent: 'end', marginTop: '1rem'}}>
        <Button invert style={{ marginRight: 10 }} onClick={goBackStep}>
          {t('plans.modalPlan.buttonGoback')}
        </Button>
        {location.pathname !== '/plans/info' && (
          <Button notHover onClick={handleNext}>
            {loading ? (
              <div className='loading'>
                <ReactLoading type={'bars'} color={'#fff'} />
              </div>
            ) : location.pathname === '/plans/new' ? (
              t('plans.modalPlan.buttonRegister')
            ) : location.pathname === '/plans/edit' ? (
              t('plans.modalPlan.buttonUpdate')
            ) : (
              t('plans.modalPlan.buttonNext')
            )}
          </Button>
        )}
      </div>
    </CardData>
  );
};
