import { useState, useEffect } from 'react';
import { PageLayout } from '../../../../globalStyles';
// import { CompanyData } from "./CompanyData";
// import { TypeRegister } from "./TypeRegister";
// import { UserData } from "./UserData";
// import { BankAccount } from "./BankAccount";
// import { Review } from "./Review";
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../../components/stepper/Stepper';
import _ from 'lodash';
import api from '../../../services/api';
import { Buyer } from './Buyer';
import { AddressData } from './AddressData';
import { OrderItens } from './OrderItens';
import { Revision } from './Revision';
import { PlanItens } from './PlanItens';
import { useTranslation } from 'react-i18next';

export const NewOrderNew = () => {
  const navigate = useNavigate();
  const {t} = useTranslation()

  const stepperBusyness = [
    { name: t('Order.new.steeps.buyer'), status: 'current' },
    { name: t('Order.new.steeps.address'), status: '' },
    { name: t('Order.new.steeps.itens'), status: '' },
    { name: t('Order.new.steeps.review'), status: '' },
  ];
  
  const stepperClient = [
    { name: t('Order.new.steeps.buyer'), status: 'current' },
    { name: t('Order.new.steeps.itens'), status: '' },
    { name: t('Order.new.steeps.review'), status: '' },
  ];
  // const [loading, setLoading] = useState(false);
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
  const [buyer, setBuyer] = useState();
  const [stoke, setStoke] = useState('local');
  const [linkIccid, setLinkIccid] = useState('manual');
  const [typeOrder, setTypeOrder] = useState('unit');
  const [typeClient, setTypeClient] = useState('finalClient');
  const [otherSend, setOtherSend] = useState('mãos');
  const [orderItems, setOrderItems] = useState([]);
  const [selectedSinCard, setSelectedSinCard] = useState([]);
  const [selectedEsim, setSelectedEsim] = useState([]);
  const [isPortIn, setIsPortIn] = useState(false);
  const [plan, setPlan] = useState();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (stoke === 'local') {
      if (otherSend !== 'mãos') {
        setTypeStepper(stepperBusyness);
      } else {
        setTypeStepper(stepperClient);
      }
    } else {
      setOtherSend('outros');
      setTypeStepper(stepperBusyness);
    }
  }, [stoke, otherSend]);

  const handleNext = () => {
    // console.log(typeStepper.length === 5, type);
    if (step === 0 && typeStepper.length === 5) {
      const orig = _.cloneDeep(typeStepper);
      orig[step].status = 'completed';
      orig[step + 1].status = 'current';
      setTypeStepper(orig);
      setStep(step + 1);
    } else {
      const orig = _.cloneDeep(typeStepper);
      orig[step].status = 'completed';
      orig[step + 1].status = 'current';
      setTypeStepper(orig);
      setStep(step + 1);
    }

    // typeStepper[step].status = 'completed'
  };

  const goBack = () => {
    if (step === 1 && typeStepper.length === 4) {
      setTypeStepper(stepperBusyness);
      setStep(step - 1);
    } else if (step === 1) {
      setOrderItems([]);
      setStep(step - 1);
    } else if (step === 0) {
      navigate('/salesforce');
    } else {
      const orig = _.cloneDeep(typeStepper);
      orig[step - 1].status = 'current';
      orig[step].status = '';
      setTypeStepper(orig);
      setStep(step - 1);
    }
  };

  const returnStep = () => {
    switch (step) {
      case 0:
        return (
          <Buyer
            typeOrder={typeOrder}
            setTypeOrder={setTypeOrder}
            setLinkIccid={setLinkIccid}
            linkIccid={linkIccid}
            typeClient={typeClient}
            setTypeClient={setTypeClient}
            buyer={buyer}
            setBuyer={setBuyer}
            stoke={stoke}
            setStoke={setStoke}
            setOtherSend={setOtherSend}
            otherSend={otherSend}
            handleNextExt={handleNext}
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
              buyer={buyer}
            />
          );
        }
        if (typeOrder === 'unit') {
          return (
            <OrderItens
              linkIccid={linkIccid}
              isPortIn={isPortIn}
              setIsPortIn={setIsPortIn}
              buyer={buyer}
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
        }

        return (
          <PlanItens
            handleNextExt={handleNext}
            goBackStep={goBack}
            setPlan={setPlan}
            plan={plan}
          />
        );

      case 2:
        if (typeStepper.length === 4) {
          if (typeOrder === 'unit') {
            return (
              <OrderItens
                linkIccid={linkIccid}
                isPortIn={isPortIn}
                setIsPortIn={setIsPortIn}
                buyer={buyer}
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
          } else {
            return (
              <PlanItens
                handleNextExt={handleNext}
                goBackStep={goBack}
                setPlan={setPlan}
                plan={plan}
              />
            );
          }
        }
        return (
          <Revision
            automatic={linkIccid === 'automatic'}
            buyer={buyer}
            address={address}
            stoke={stoke}
            otherSend={otherSend}
            orderItems={orderItems}
            goBackStep={goBack}
            handleNext={handleNext}
            plan={plan}
            typeOrder={typeOrder}
          />
        );
      case 3:
        return (
          <Revision
            automatic={linkIccid === 'automatic'}
            buyer={buyer}
            address={address}
            stoke={stoke}
            otherSend={otherSend}
            orderItems={orderItems}
            goBackStep={goBack}
            handleNext={handleNext}
            plan={plan}
            typeOrder={typeOrder}
          />
        );
    }
  };
  return (
    <PageLayout>
      <h2 style={{ color: '#7c7c7c', textAlign: 'center' }}>
        {t('Order.new.title')}
      </h2>
      <Stepper style={{ maxWidth: '1000px' }} typeStepper={typeStepper} />
      {returnStep()}
    </PageLayout>
  );
};
