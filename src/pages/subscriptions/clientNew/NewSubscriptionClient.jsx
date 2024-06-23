import { useState } from 'react';
import { PageLayout } from '../../../../globalStyles';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../../components/stepper/Stepper';
import _ from 'lodash';
import { OrderItens } from './OrderItens';
import { Pgto } from './Pgto';
import { SelectLines } from './SelectLines';

const stepperClient = [
  { name: 'LINHA', status: 'current' },
  { name: 'PLANOS', status: '' },
  { name: 'PAGAMENTO', status: '' },
];

export const NewSubscriptionClient = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [typeStepper, setTypeStepper] = useState(stepperClient);
  const [step, setStep] = useState(0);
  const [dueDate, setDueDate] = useState({ label: 1, value: '1' });
  const [selectedLine, setSelectedLine] = useState();
  const [plan, setPlan] = useState();
  
  const handleNext = () => {
    const orig = _.cloneDeep(typeStepper);
    orig[step].status = 'completed';
    orig[step + 1].status = 'current';
    setTypeStepper(orig);
    setStep(step + 1);
  };

  const goBack = () => {
    if (step === 0) {
      navigate('/subscriptions');
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
          <SelectLines
            handleNextExt={handleNext}
            goBackStep={goBack}
            dueDate={dueDate}
            setDueDate={setDueDate}
            selectedLine={selectedLine}
            setSelectedLine={setSelectedLine}
          />
        );
      case 1:
        return (
          <OrderItens
            handleNextExt={handleNext}
            goBackStep={goBack}
            selected={plan}
            setSelected={setPlan}
          />
        );
      case 2:
        return (
          <Pgto
            plan={plan}
            line={selectedLine}
            dueDate={dueDate}
            goBackStep={goBack}
          />
        );

      case 3:
        return <h1>UNDEFINE</h1>;
    }
  };
  return (
    <PageLayout>
      <h2 style={{ color: '#7c7c7c', textAlign: 'center' }}>
        Informe os dados para a assinatura
      </h2>
      <Stepper style={{ maxWidth: '1000px' }} typeStepper={typeStepper} />
      {returnStep()}
    </PageLayout>
  );
};
