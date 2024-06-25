import { useState } from 'react';
import { PageLayout } from '../../../../globalStyles';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../../components/stepper/Stepper';
import _ from 'lodash';
import { OrderItens } from './OrderItens';
import { Pgto } from './Pgto';
import { SelectLines } from './SelectLines';
import api from '../../../services/api';
import { formatPhone } from '../../../services/util';
import { Revision } from './Revision';

export const NewRechargeClient = () => {
  const stepperClient =
    api.currentUser.AccessTypes[0] === 'CLIENT'
      ? [
          { name: 'PLANOS', status: 'current' },
          { name: 'LINHA', status: '' },
          { name: 'REVISÃO', status: '' },
          { name: 'PAGAMENTO', status: '' },
        ]
      : [
          { name: 'PLANOS', status: 'current' },
          { name: 'LINHA', status: '' },
          { name: 'REVISÃO', status: '' },
        ];
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [typeStepper, setTypeStepper] = useState(stepperClient);
  const [step, setStep] = useState(0);
  const [dueDate, setDueDate] = useState();
  const [selectedLine, setSelectedLine] = useState();
  const [plan, setPlan] = useState();

  const [orderId, setOrderId] = useState();

  // const [optLines, setOptLines] = useState([]);

  // useEffect(() => {

  const loadLines = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    console.log(search);
    if (
      api.currentUser.AccessTypes[0] === 'CLIENT' ||
      api.currentUser.AccessTypes[0] === 'AGENT' //||
      // api.currentUser.AccessTypes[0] === 'DEALER'
    ) {
      const response = await api.line.myLines(
        vlr / 10 === 0 ? 1 : vlr / 10 + 1,
        10
      );
      console.log(response);
      const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
      const lines = await response.data.iccids;
      const array = [];
      for (const line of lines) {
        if (line?.IccidHistoric?.length > 0) {
          console.log(line);
          array.push({
            value: line,
            label: formatPhone(line?.IccidHistoric[0]?.SurfMsisdn),
          });
        }
      }
      return {
        options: array,
        hasMore,
      };
    } else {
      const response = await api.line.getLines(
        vlr / 10 === 0 ? 1 : vlr / 10 + 1,
        10,
        '',
        search,
        '',
        'Line'
      );
      const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
      const lines = await response.data.iccids;
      const array = [];
      for (const line of lines) {
        if (line?.IccidHistoric?.length > 0) {
          console.log(line);
          array.push({
            value: line,
            label: formatPhone(line?.IccidHistoric[0]?.SurfMsisdn),
          });
        }
      }
      console.log(array);
      return {
        options: array,
        hasMore,
      };
    }
  };

  // loadLines();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleNext = () => {
    if (step === 2 && api.currentUser.AccessTypes[0] !== 'CLIENT') {
      navigate('/orders');
    } else {
      const orig = _.cloneDeep(typeStepper);
      orig[step].status = 'completed';
      orig[step + 1].status = 'current';
      setTypeStepper(orig);
      setStep(step + 1);
    }
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
          <OrderItens
            handleNextExt={handleNext}
            goBackStep={goBack}
            selected={plan}
            setSelected={setPlan}
          />
        );
      case 1:
        return (
          <SelectLines
            handleNextExt={handleNext}
            goBackStep={goBack}
            dueDate={dueDate}
            setDueDate={setDueDate}
            selectedLine={selectedLine}
            setSelectedLine={setSelectedLine}
            optLines={loadLines}
          />
        );
      case 2:
        return (
          <Revision
            setOrderId={setOrderId}
            dueDate={dueDate}
            line={selectedLine}
            plan={plan}
            buyer={''}
            address={{}}
            stoke={''}
            otherSend={false}
            orderItems={[]}
            goBackStep={goBack}
            handleNext={handleNext}
          />
        );

      case 3:
        return (
          <Pgto
            plan={plan}
            line={selectedLine}
            dueDate={dueDate}
            goBackStep={goBack}
            orderId={orderId}
          />
        );
    }
  };
  return (
    <PageLayout>
      <h2
        style={{
          color: '#7c7c7c',
          textAlign: 'center',
          marginBottom: '0.5rem',
        }}
      >
        Recarga
      </h2>
      <Stepper
        style={{ maxWidth: '1000px', marginTop: 0 }}
        typeStepper={typeStepper}
      />
      {returnStep()}
    </PageLayout>
  );
};
