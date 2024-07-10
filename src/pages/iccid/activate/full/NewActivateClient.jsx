/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { OrderItens } from './OrderItens';
import { Pgto } from './Pgto';
import { Revision } from './Revision';
import { documentFormat, validateIccid } from '../../../../services/util';
import { Button, PageLayout } from '../../../../../globalStyles';
import { Stepper } from '../../../../components/stepper/Stepper';
import { InputData } from '../../../resales/Resales.styles';
import api from '../../../../services/api';
import { toast } from 'react-toastify';
import { Scanner } from '../../../../components/Scanner/Scanner';
import './myStylle.css';
import { Dialog, DialogActions, DialogContentText } from '@mui/material';
import { DialogContent } from '@mui/joy';
import { IoIosCamera } from 'react-icons/io';
import Quagga from 'quagga';
import { PageTitles } from '../../../../components/PageTitle/PageTitle';

const stepperClient = [
  { name: 'PLANOS', status: 'current' },
  { name: 'LINHA', status: '' },
  { name: 'REVISÃO', status: '' },
  { name: 'PAGAMENTO', status: '' },
];

export const NewActivateClient = ({
  setShow,
  iccid,
  search,
  tmpActivate,
  canGoBack,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [typeStepper, setTypeStepper] = useState(stepperClient);
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState();
  const [ddd, setDdd] = useState();
  const [cpf, setCpf] = useState();
  const [myIccid, setMyIccid] = useState();

  const [orderId, setOrderId] = useState();
  const [openCam, setOpenCam] = useState(false);
  const [camera, setCamera] = useState(false);

  const onDetected = (result) => {
    if (validateIccid(result)) {
      setMyIccid(result);
      setOpenCam(false);
      setCamera(false);
      Quagga.stop();
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (iccid === '') {
        if (validateIccid(myIccid)) {
          if (ddd?.length === 2) {
            const orig = _.cloneDeep(typeStepper);
            orig[step].status = 'completed';
            orig[step + 1].status = 'current';
            setTypeStepper(orig);
            setStep(step + 1);
          } else {
            toast.error('Informe um DDD válido');
          }
        } else {
          toast.error('Informe um iccid válido');
        }
      } else {
        const orig = _.cloneDeep(typeStepper);
        orig[step].status = 'completed';
        orig[step + 1].status = 'current';
        setTypeStepper(orig);
        setStep(step + 1);
      }
    } else {
      const orig = _.cloneDeep(typeStepper);
      orig[step].status = 'completed';
      orig[step + 1].status = 'current';
      setTypeStepper(orig);
      setStep(step + 1);
    }
    // const orig = _.cloneDeep(typeStepper);
    // orig[step].status = "completed";
    // orig[step + 1].status = "current";
    // setTypeStepper(orig);
    // setStep(step + 1);
  };

  useEffect(() => {
    console.log(api.currentUser);
    if (api.currentUser?.MyDocument) {
      setCpf(documentFormat(api.currentUser?.MyDocument));
    }
  }, []);

  const goBack = () => {
    if (step === 0) {
      // navigate('/subscriptions');
      setShow(false);
    } else {
      const orig = _.cloneDeep(typeStepper);
      orig[step - 1].status = 'current';
      orig[step].status = '';
      setTypeStepper(orig);
      setStep(step - 1);
    }
  };

  // let calculateRatio = function () {
  //   const width = window.innerWidth;
  //   const height = window.innerHeight - 150;
  //   const aspectRatio = width / height;
  //   const reverseAspectRatio = height / width;

  //   const mobileAspectRatio =
  //     reverseAspectRatio > 1.5
  //       ? reverseAspectRatio + (reverseAspectRatio * 12) / 100
  //       : reverseAspectRatio;

  //   return width < 600 ? mobileAspectRatio : aspectRatio;
  // };

  // console.log(calculateRatio())

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
          <div
            style={{
              width: window.innerWidth > 768 && '800px',
              margin: 'auto',
              padding: '1rem',
            }}
          >
            <h4>Informe os dados abaixo</h4>
            {/* <p>{calculateRatio()}</p> */}
            {iccid === '' && (
              <>
                <h5 style={{ marginTop: '0.5rem' }}>ICCID</h5>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <InputData
                    id='iccid'
                    type='number'
                    style={{ width: '100%' }}
                    placeholder='ICCID'
                    pattern='\d*'
                    maxLength={19}
                    value={myIccid}
                    onChange={(e) => setMyIccid(e.target.value)}
                  />
                  <IoIosCamera
                    style={{ cursor: 'pointer' }}
                    size={30}
                    color='#00D959'
                    onClick={() => {
                      setOpenCam(true);
                      setCamera(true);
                    }}
                  />
                </div>
              </>
            )}

            <h5 style={{ marginTop: '0.5rem' }}>DDD</h5>
            <InputData
              id='ddd'
              type='text'
              style={{ width: '100%' }}
              placeholder='DDD'
              pattern='\d*'
              maxLength={2}
              value={ddd}
              onChange={(e) => setDdd(e.target.value)}
            />

            {api.currentUser.Type !== 'CLIENT' && (
              <>
                <h5>Documento</h5>
                <InputData
                  id='cpf'
                  style={{ width: '100%' }}
                  placeholder='CPF/CNPJ'
                  // style={{ width: 250 }}
                  value={cpf}
                  onChange={(e) => setCpf(documentFormat(e.target.value))}
                />
              </>
            )}

            <div className='flex end btn_invert'>
              <Button
                onClick={goBack}
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
          </div>
        );
      case 2:
        return (
          <Revision
            setOrderId={setOrderId}
            orderId={orderId}
            plan={plan}
            buyer={''}
            address={{}}
            stoke={''}
            otherSend={false}
            orderItems={[]}
            goBackStep={goBack}
            handleNext={handleNext}
            cpf={cpf}
            ddd={ddd}
            iccid={myIccid}
            tmpActivate={tmpActivate}
          />
        );

      case 3:
        return (
          <Pgto
            plan={plan}
            cpf={cpf}
            ddd={ddd}
            iccid={iccid !== '' ? iccid : myIccid}
            goBackStep={goBack}
            orderId={orderId}
            setShow={setShow}
            search={search}
            canGoBack={canGoBack}
          />
        );
    }
  };

  return (
    <>
      {/* <PageLayout> */}
        <PageTitles title={'Ativar nova linha'} />
        <Stepper
          style={{ maxWidth: '1000px', marginTop: 10 }}
          typeStepper={typeStepper}
        />
        {returnStep()}
      {/* </PageLayout> */}
      <Dialog
        open={openCam}
        fullScreen={window.innerWidth < 768 ? true : false}
      >
        <DialogContent>
          <DialogContentText>
            <div className='ScannerApp'>
              <div className='Scannercontainer'>
                {camera && <Scanner onDetected={onDetected} Quagga={Quagga} />}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenCam(false);
              setCamera(false);
              Quagga.stop();
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
