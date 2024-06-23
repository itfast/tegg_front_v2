/* eslint-disable react/prop-types */
import api from '../../../services/api';
import { CardData, CardDataCard, InputDataCard } from './NewOrder.styles';
import ReactCardFlip from 'react-card-flip';
import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
  cleanNumber,
  documentFormat,
  formatCVC,
  formatCreditCardNumber,
  formatExpirationDate,
  phoneFormat,
  translateError,
} from '../../../services/util';
import Cards from 'react-credit-cards-2';
import { CardAddress } from './CardAddress';
import { PayCardContainer } from '../../orders/payment/PayOrder.styles';

export const Pgto = ({ goBackStep, plan, line, dueDate }) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });
  const [cardAddres, setCardAddress] = useState({
    name: '',
    document: '',
    email: '',
    mobile: '',
    cep: '',
    address: '',
    complement: '',
    number: '',
    district: '',
    city: '',
    uf: '',
  });
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const nameCardRef = useRef(null);

  const handleFlipp = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    setLoading(true);
    const CreditCard = {
      holderName: state.name,
      number: state.number,
      expiryMonth: state?.expiry?.slice(0, 2),
      expiryYear: state?.expiry?.slice(3, 7),
      ccv: state.cvc,
    };

    const CreditCardHolderInfo = {
      name: cardAddres.name,
      email: cardAddres.email,
      cpfCnpj: cardAddres?.document && cleanNumber(cardAddres.document),
      postalCode: cardAddres?.cep && cleanNumber(cardAddres.cep),
      addressNumber: cardAddres?.number,
      addressComplement: cardAddres?.complement,
      phone: cardAddres?.mobile && cleanNumber(cardAddres?.mobile),
      mobilePhone: cardAddres?.mobile && cleanNumber(cardAddres?.mobile),
    };

    api.iccid
      .createSubscription(
        line?.value?.FinalClientId,
        plan.value.Amount,
        dueDate.value,
        CreditCard,
        CreditCardHolderInfo,
        plan.value.Products[0].Product.SurfId,
        line.value.Iccid
      )
      .then((res) => {
        toast.success(res.data.Message);
        navigate('/subscriptions');
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (evt) => {
    if (evt.target.name === 'number') {
      evt.target.value = formatCreditCardNumber(evt.target.value);
    } else if (evt.target.name === 'expiry') {
      evt.target.value = formatExpirationDate(evt.target.value);
    } else if (evt.target.name === 'cvc') {
      evt.target.value = formatCVC(evt.target.value);
    }
    const { name, value } = evt.target;

    setState((prev) => ({ ...prev, [name]: value }));

    if (name === 'expiry') {
      if (value.length === 5) {
        handleFlipp();
      }
    }
    if (name === 'number') {
      if (value.length === 16) {
        nameCardRef.current.focus();
      }
    }
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <CardData style={{ padding: window.innerWidth < 769 && '1rem' }}>
      <h5>Informe os dados do cartão</h5>
      <>
        {/* <div className='flex_center'> */}
        <PayCardContainer>
          <Cards
            number={state.number}
            expiry={state.expiry}
            cvc={state.cvc}
            name={state.name}
            focused={state.focus}
            placeholders={{ name: 'SEU NOME AQUI' }}
            locale={{ valid: 'VALIDADE' }}
          />
        </PayCardContainer>
        <ReactCardFlip isFlipped={flipped}>
          <div style={{display: 'flex', justifyContent: 'center'}} >
          <CardDataCard
            style={{
              width: window.innerWidth > 768 ? 650 : '100%',
              padding: window.innerWidth < 769 && '1rem',
            }}
          >
            <h6>NOME DO DONO DO CARTÃO</h6>
            <InputDataCard
              style={{ width: '100%' }}
              name='dono'
              autoFocus
              placeholder='Dono do cartão'
              value={cardAddres.name}
              onChange={(e) =>
                setCardAddress({ ...cardAddres, name: e.target.value })
              }
            />
            <div
              style={{
                width: '100%',
                display: window.innerWidth > 768 && 'flex',
                marginTop: 5,
              }}
            >
              <div style={{ width: '100%' }}>
                <h6>E-MAIL</h6>
                <InputDataCard
                  style={{ width: '100%' }}
                  type='text'
                  name='email'
                  placeholder='E-mail *'
                  value={cardAddres.email}
                  onChange={(e) =>
                    setCardAddress({ ...cardAddres, email: e.target.value })
                  }
                />
              </div>
              <div
                style={{
                  marginLeft: window.innerWidth > 768 && 5,
                  width: '100%',
                }}
              >
                <h6>TELEFONE</h6>
                <InputDataCard
                  id='mobile'
                  name='mobile'
                  placeholder='Telefone *'
                  style={{ width: '100%' }}
                  value={cardAddres.mobile}
                  onChange={(e) =>
                    setCardAddress({
                      ...cardAddres,
                      mobile: phoneFormat(e.target.value),
                    })
                  }
                />
              </div>
              <div
                style={{
                  marginLeft: window.innerWidth > 768 && 5,
                  width: '100%',
                }}
              >
                <h6>CPF</h6>
                <InputDataCard
                  id='cpf'
                  name='cpf'
                  placeholder='CPF *'
                  style={{ width: '100%' }}
                  value={cardAddres.document}
                  onChange={(e) =>
                    setCardAddress({
                      ...cardAddres,
                      document: documentFormat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <h6>NÚMERO DO CARTÃO</h6>
            <InputDataCard
              style={{ width: '100%' }}
              type='number'
              name='number'
              placeholder='Número do cartão'
              value={state.number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            <h6 style={{ marginTop: 5 }}>NOME COMO NO CARTÃO</h6>
            <InputDataCard
              style={{ width: '100%' }}
              type='text'
              name='name'
              ref={nameCardRef}
              placeholder='Nome como no cartão'
              value={state.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            <div style={{ width: '100%', display: 'flex', marginTop: 5 }}>
              <div style={{ width: '100%' }}>
                <h6>CVC</h6>
                <InputDataCard
                  style={{ width: '100%' }}
                  type='text'
                  name='cvc'
                  placeholder='CVC'
                  value={state.cvc}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
              <div style={{ marginLeft: 5, width: '100%' }}>
                <h6>VALIDADE</h6>
                <InputDataCard
                  id='expire'
                  name='expiry'
                  placeholder='Validade *'
                  style={{ width: '100%' }}
                  value={state.expiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
            </div>
            <div className='flex end btn_invert'>
              <Button notHover onClick={goBackStep} style={{ width: '100%' }}>
                Voltar
              </Button>
              <Button notHover onClick={handleFlipp} style={{ width: '100%' }}>
                Endereço cartão
              </Button>
            </div>
          </CardDataCard>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}} >
          <CardDataCard
            style={{
              width: window.innerWidth > 768 ? 650 : '100%',
              padding: window.innerWidth < 769 && '1rem',
              // margin: 0
            }}
          >
            <CardAddress
              loading={loading}
              goStep={handleNext}
              goBackStep={handleFlipp}
              address={cardAddres}
              setAddress={setCardAddress}
            />
          </CardDataCard>
          </div>
        </ReactCardFlip>
        {/* </div> */}
      </>
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'start' }}
      ></div>
    </CardData>
  );
};
