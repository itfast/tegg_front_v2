import { useState, useEffect } from 'react';
import {
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../../globalStyles';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stepper } from '../../../components/stepper/Stepper';
import _ from 'lodash';
import { AddressData } from './AddressData';
import { OrderItens } from './OrderItens';
import { Revision } from './Revision';
import { Pgto } from './Pgto';

const stepperBusyness = [
  { name: 'ITENS', status: 'current' },
  { name: 'ENTREGA', status: '' },
  { name: 'REVISÃO', status: '' },
  { name: 'PAGAMENTO', status: '' },
];

const stepperClient = [
  { name: 'ITENS', status: 'current' },
  { name: 'REVISÃO', status: '' },
  { name: 'PAGAMENTO', status: '' },
];

export const NewOrderByDealer = () => {
  const navigate = useNavigate();
  const [typeStepper, setTypeStepper] = useState(stepperClient);
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    cep: '',
    address: '',
    complement: '',
    number: '',
    district: '',
    city: '',
    uf: '',
  });
  const [orderId, setOrderId] = useState();
  const [buyer, setBuyer] = useState();
  const [stoke, setStoke] = useState('local');
  const [otherSend, setOtherSend] = useState('mãos');
  const [orderItems, setOrderItems] = useState([]);
  const [selectedSinCard, setSelectedSinCard] = useState([]);
  const [selectedEsim, setSelectedEsim] = useState([]);
  const location = useLocation();

  const handleNext = () => {
    const orig = _.cloneDeep(typeStepper);
    orig[step].status = 'completed';
    orig[step + 1].status = 'current';
    setTypeStepper(orig);
    setStep(step + 1);
  };

  const goBack = () => {
    if (step === 1 && typeStepper.length === 4) {
      setStep(step - 1);
    } else if (step === 0) {
      navigate('/orders');
    } else {
      const orig = _.cloneDeep(typeStepper);
      orig[step - 1].status = 'current';
      orig[step].status = '';
      setTypeStepper(orig);
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (selectedSinCard.length > 0 || orderItems.some((s)=> s?.Products?.some((h)=> h.Product?.Technology === 'NA'))) {
      setTypeStepper(stepperBusyness);
    } else {
      setAddress({
        cep: '',
        address: '',
        complement: '',
        number: '',
        district: '',
        city: '',
        uf: '',
      });
      setTypeStepper(stepperClient);
    }
  }, [selectedSinCard, orderItems]);

  const returnStep = () => {
    switch (step) {
      case 0:
        return (
          <OrderItens
            buyer={buyer}
            clientRequest={location?.state?.clientRequest}
            setBuyer={setBuyer}
            stoke={stoke}
            setStoke={setStoke}
            handleNextExt={handleNext}
            goBackStep={goBack}
            mustIccid={stoke === 'local'}
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            setSelectedEsim={setSelectedEsim}
            setSelectedSinCard={setSelectedSinCard}
            selectedEsim={selectedEsim}
            selectedSinCard={selectedSinCard}
          />
        );
      case 1:
        if (typeStepper.length === 4) {
          return (
            <AddressData
              goStep={handleNext}
              goBackStep={goBack}
              address={address}
              setAddress={setAddress}
            />
          );
        }
        return (
          <Revision
            setOrderId={setOrderId}
            buyer={buyer}
            address={address}
            stoke={stoke}
            otherSend={otherSend}
            orderItems={orderItems}
            goBackStep={goBack}
            handleNext={handleNext}
          />
        );

      case 2:
        if (typeStepper.length === 3) {
          return (
            <Pgto
              buyer={buyer}
              setBuyer={setBuyer}
              stoke={stoke}
              setStoke={setStoke}
              setOtherSend={setOtherSend}
              otherSend={otherSend}
              handleNextExt={handleNext}
              orderId={orderId}
            />
          );
        }
        return (
          <Revision
            setOrderId={setOrderId}
            buyer={buyer}
            address={address}
            stoke={stoke}
            otherSend={otherSend}
            orderItems={orderItems}
            goBackStep={goBack}
            handleNext={handleNext}
          />
        );
      case 3:
        return (
          <Pgto
            buyer={buyer}
            setBuyer={setBuyer}
            stoke={stoke}
            setStoke={setStoke}
            setOtherSend={setOtherSend}
            otherSend={otherSend}
            handleNextExt={handleNext}
            orderId={orderId}
          />
        );
    }
  };
  return (
    <>
      <ContainerMobile>
        <PageLayout>
          <h2 style={{ color: '#7c7c7c', textAlign: 'center' }}>
            Informe os dados para o pedido
          </h2>
          <Stepper style={{ maxWidth: '1000px' }} typeStepper={typeStepper} />
          {returnStep()}
        </PageLayout>
      </ContainerMobile>
      <ContainerWeb>
        <PageLayout>
          <h2 style={{ color: '#7c7c7c', textAlign: 'center' }}>
            Informe os dados para o pedido
          </h2>
          <Stepper style={{ maxWidth: '1000px' }} typeStepper={typeStepper} />
          {returnStep()}
        </PageLayout>
      </ContainerWeb>
    </>
  );
};
