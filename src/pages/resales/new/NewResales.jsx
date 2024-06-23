import { useState, useEffect } from 'react';
import { PageLayout } from '../../../../globalStyles';
import { CompanyData } from './CompanyData';
import { TypeRegister } from './TypeRegister';
import { UserData } from './UserData';
import { BankAccount } from './BankAccount';
import { Review } from './Review';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../../components/stepper/Stepper';
import _ from 'lodash';
import api from '../../../services/api';
import { translateError } from '../../../services/util';
import { toast } from 'react-toastify';
import { Service } from './Service';

const stepperBusyness = [
  { name: 'TIPO', status: 'current' },
  { name: 'EMPRESA', status: '' },
  { name: 'RESPONSÁVEL', status: '' },
  { name: 'ATENDIMENTO', status: '' },
  { name: 'BANCO', status: '' },
  { name: 'REVISÃO', status: '' },
];

const stepperClient = [
  { name: 'TIPO', status: 'current' },
  { name: 'RESPONSÁVEL', status: '' },
  { name: 'ATENDIMENTO', status: '' },
  { name: 'BANCO', status: '' },
  { name: 'REVISÃO', status: '' },
];

export const NewResales = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [typeStepper, setTypeStepper] = useState(stepperBusyness);
  const [step, setStep] = useState(0);
  const [citys, setCitys] = useState([]);
  const [uf, setUf] = useState();
  const [service, setService] = useState();
  const [company, setCompany] = useState({
    rz: '',
    cnpj: '',
    ie: '',
    im: '',
    email: '',
    phone: '',
    cep: '',
    address: '',
    complement: '',
    number: '',
    district: '',
    city: '',
    uf: '',
  });
  const [userLegacy, setUserLegacy] = useState();
  const [user, setUser] = useState({
    icmsContributor: false,
    name: '',
    cpf: '',
    rg: '',
    date: null,
    email: '',
    companyEmail: '',
    phone: '',
    cep: '',
    address: '',
    complement: '',
    number: '',
    district: '',
    city: '',
    uf: '',
  });

  const [bank, setBank] = useState({
    type: '',
    pixType: '',
    pixKey: '',
    bankName: '',
    ag: '',
    agDigit: '',
    account: '',
    accountDigit: '',
    op: '',
  });

  const [type, setType] = useState('');

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] !== 'TEGG') {
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

  const handleNext = () => {
    // console.log(typeStepper.length === 5, type);
    if (step === 0 && typeStepper.length === 6) {
      if (type !== 'EMPRESA') {
        const orig = _.cloneDeep(stepperClient);
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
    } else if (
      (type === 'EMPRESA' && step === 5) ||
      (type === 'PESSOA FISICA' && step === 4)
    ) {
      setLoading(true);
      api.dealer
        .new(company, user, bank, userLegacy, service)
        .then((res) => {
          toast.success(res.data.Message);
          navigate('/salesforce');
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => setLoading(false));
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
    if (step === 1 && typeStepper.length === 5) {
      setTypeStepper(stepperBusyness);
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
          <TypeRegister
            selected={type}
            setSelected={setType}
            goStep={handleNext}
            goBackStep={goBack}
          />
        );
      case 1:
        if (type === 'EMPRESA') {
          return (
            <CompanyData
              goStep={handleNext}
              goBackStep={goBack}
              company={company}
              setCompany={setCompany}
            />
          );
        }
        return (
          <UserData
            goStep={handleNext}
            type={type}
            goBackStep={goBack}
            user={user}
            setUser={setUser}
            userLegacy={userLegacy}
            setUserLegacy={setUserLegacy}
          />
        );

      case 2:
        if (type === 'EMPRESA') {
          return (
            <UserData
              type={type}
              goStep={handleNext}
              goBackStep={goBack}
              user={user}
              setUser={setUser}
              userLegacy={userLegacy}
              setUserLegacy={setUserLegacy}
            />
          );
        }
        return (
          <Service
            goBackStep={goBack}
            goStep={handleNext}
            setCitys={setCitys}
            citys={citys}
            uf={uf}
            setUf={setUf}
          />
        );

      case 3:
        if (type === 'EMPRESA') {
          return (
            <Service
              goBackStep={goBack}
              goStep={handleNext}
              setCitys={setCitys}
              citys={citys}
              uf={uf}
              setUf={setUf}
            />
          );
        }
        return (
          <BankAccount
            goStep={handleNext}
            goBackStep={goBack}
            bank={bank}
            setBank={setBank}
          />
        );
      case 4:
        if (type === 'EMPRESA') {
          return (
            <BankAccount
              goStep={handleNext}
              goBackStep={goBack}
              bank={bank}
              setBank={setBank}
            />
          );
        }
        return (
          <Review
            type={type}
            company={company}
            user={user}
            bank={bank}
            goBackStep={goBack}
            goStep={handleNext}
            loading={loading}
            citys={citys}
            setService={setService}
          />
        );
      case 5:
        return (
          <Review
            type={type}
            company={company}
            user={user}
            bank={bank}
            goBackStep={goBack}
            goStep={handleNext}
            loading={loading}
            citys={citys}
            setService={setService}
          />
        );
    }
  };
  return (
    <PageLayout>
      <h2 style={{ color: '#7c7c7c', textAlign: 'center' }}>
        Informe os dados da nova Revenda
      </h2>
      <Stepper typeStepper={typeStepper} />
      {returnStep()}
    </PageLayout>
  );
};
