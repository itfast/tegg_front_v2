import { useState, useEffect } from 'react';
import { PageLayout } from '../../../../globalStyles';
import { CompanyData } from './CompanyData';
// import { TypeRegister } from './TypeRegister';
import { UserData } from './UserData';
import { BankAccount } from './BankAccount';
import { Review } from './Review';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Stepper } from '../../../components/stepper/Stepper';
import _ from 'lodash';
import api from '../../../services/api';
import { translateError } from '../../../services/util';
import { toast } from 'react-toastify';
import { Service } from './Service';
import { useTranslation } from 'react-i18next';


export const EditResales = () => {
  const { t : Type } = useParams();
  const {t} = useTranslation()


const stepperBusyness = [
  { name: t('Resales.new.steeps.busyness.company'), status: 'current' },
  { name: t('Resales.new.steeps.busyness.responsible'), status: '' },
  { name: t('Resales.new.steeps.busyness.service'), status: '' },
  { name: t('Resales.new.steeps.busyness.bank'), status: '' },
  { name: t('Resales.new.steeps.busyness.review'), status: '' },
];

const stepperClient = [
  { name: t('Resales.new.steeps.client.responsible'), status: 'current' },
  { name: t('Resales.new.steeps.client.service'), status: '' },
  { name: t('Resales.new.steeps.client.bank'), status: '' },
  { name: t('Resales.new.steeps.client.review'), status: '' },
];

  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [typeStepper, setTypeStepper] = useState(
    Type === 'pj' ? stepperBusyness : stepperClient
  );
  const [step, setStep] = useState(0);
  const [dealerID, setDealerID] = useState('');
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
  const [citys, setCitys] = useState([]);
  const [tmpUf, setTmpUf] = useState({});

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
    // console.log(location.state.dealer);
    if (location?.state) {
      const dealer = location?.state?.dealer;
      setUserLegacy({
        value: dealer?.UserLegacySystem?.Id,
        label: (
          <div>
            <h4>{dealer?.UserLegacySystem?.nome}</h4>
            <h5>{dealer?.UserLegacySystem?.cpf}</h5>
          </div>
        ),
      });
      setDealerID(dealer.Id);
      setType(dealer.Cnpj ? 'EMPRESA' : 'PESSOA FISICA');
      // setTypeStepper(dealer.Cnpj !== "" ? stepperBusyness : stepperClient);
      setCompany({
        rz: dealer.CompanyName,
        cnpj: dealer.Cnpj,
        ie: dealer.Ie,
        im: dealer.Im,
        email: dealer.CompanyEmail,
        phone: dealer.CompanyMobile,
        cep: dealer.CompanyPostalCode,
        address: dealer.CompanyStreetName,
        complement: dealer.CompanyComplement,
        number: dealer.CompanyNumber,
        district: dealer.CompanyDistrict,
        city: dealer.CompanyCity,
        uf: dealer.CompanyState,
      });

      setUser({
        icmsContributor: dealer.ICMSContributor === 1 ? true : false,
        name: dealer.Name,
        cpf: dealer.Cpf,
        rg: dealer.Rg,
        date: dealer?.Birthday ? new Date(dealer.Birthday) : null,
        email: dealer.Email,
        companyEmail: dealer.CompanyEmail,
        phone: dealer.Mobile,
        cep: dealer.PostalCode,
        address: dealer.StreetName,
        complement: dealer.Complement,
        number: dealer.Number,
        district: dealer.District,
        city: dealer.City,
        uf: dealer.State,
      });

      setBank({
        type: dealer?.PixKey !== '' ? 'PIX' : 'TRANSFER',
        pixType: dealer?.PixKeyType,
        pixKey: dealer?.PixKey,
        bankName: dealer?.Bank,
        ag: dealer?.BranchNumber,
        agDigit: dealer?.BranchVerifier,
        account: dealer?.AcountNumber,
        accountDigit: dealer?.AccountNumberVerifier,
        op: dealer?.Operation,
      });

      let tmpCitys = []
      if(dealer?.OperationCity){
        if(dealer?.OperationCity !== ""){
          tmpCitys = JSON.parse(dealer?.OperationCity)
        }
      }
      while(typeof(tmpCitys) === 'string'){
        let tmp =  JSON.parse(tmpCitys)
        tmpCitys =tmp
      }
    
    //  (dealer?.OperationCity && dealer?.OperationCity !== "") ? JSON.parse(dealer?.OperationCity) : [];
      // const tmpCitys = []
      const list = [];
      let myUf = '';
      // console.log(JSON.parse(tmpCitys))
      tmpCitys?.forEach((city) => {
        list.push({
          label: `${city.city} - ${city.uf}`,
          value: city.city,
          complet: city,
        });
        myUf = city.uf;
      });
      // console.log(JSON.parse(dealer?.OperationCity));
      setCitys(list);
      setTmpUf({ label: myUf, value: myUf });
    }
  }, [location?.state]);

  const handleNext = () => {
    // console.log(typeStepper.length === 4, type);
    if (step === 0 && typeStepper.length === 4) {
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
      (type === 'EMPRESA' && step === 4) ||
      (type === 'PESSOA FISICA' && step === 3)
    ) {
      setLoading(true);
      api.dealer
        .update(dealerID, company, user, bank, userLegacy, service)
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
    if (step === 1 && typeStepper.length === 4) {
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
            type={type}
            goStep={handleNext}
            goBackStep={goBack}
            user={user}
            setUser={setUser}
            userLegacy={userLegacy}
            setUserLegacy={setUserLegacy}
            label={t('Resales.new.steeps.busyness.responsible')}
          />
        );

      case 1:
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
            uf={tmpUf}
            setUf={setTmpUf}
            goBackStep={goBack}
            goStep={handleNext}
            setCitys={setCitys}
            citys={citys}
          />
        );

      case 2:
        if (type === 'EMPRESA') {
          return (
            <Service
              uf={tmpUf}
              setUf={setTmpUf}
              goBackStep={goBack}
              goStep={handleNext}
              setCitys={setCitys}
              citys={citys}
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
      case 3:
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
      case 4:
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
        {t('Resales.new.title')}
      </h2>
      <Stepper typeStepper={typeStepper} />
      {returnStep()}
    </PageLayout>
  );
};
