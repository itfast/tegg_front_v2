import { useNavigate, useLocation } from 'react-router-dom';
import { PageLayout } from '../../../../globalStyles';
import { useEffect, useState } from 'react';
import { ClientData } from './ClientData';
import { TypeRegister } from './TypeRegister';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { translateError } from '../../../services/util';
import { Stepper } from '../../../components/stepper/Stepper';
import _ from 'lodash';
import './new_client.css';
import { AddressData } from './AddressData';
import { useTranslation } from 'react-i18next';

export const NewClient = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [step, setStep] = useState(0);
  const [stepperType, setStepperType] = useState([
    { name: t('Clients.new.steeps.type'), status: '' },
    { name: t('Clients.new.steeps.client'), status: '' },
    { name: t('Clients.new.steeps.address'), status: '' },
  ]);
  const [address, setAddress] = useState({
    cep: '',
    address: '',
    complement: '',
    number: '',
    district: '',
    city: '',
    uf: '',
  });
  const [user, setUser] = useState({
    name: '',
    cpf: '',
    rg: '',
    date: null,
    email: '',
    secondEmail: '',
    phone: '',
    cnpj: '',
    ie: '',
    whatsApp: '',
    icmsContributor: false,
    isAgent: false,
  });
  const [dealer, setDealer] = useState();
  const [userLegacy, setUserLegacy] = useState();
  const [pathReturn, setPathReturn] = useState()

  useEffect(() => {
    if (api?.currentUser?.AccessTypes?.[0] === 'CLIENT') {
      api.user
        .logout()
        .then(() => {
          navigate('/login');
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (location?.state?.clients) {
      setPathReturn(location?.state?.path)
      const u = location?.state?.clients;
      setUser({
        id: u.Id,
        name: u.Name,
        cpf: u.Cpf,
        rg: u.Rg,
        date: new Date(u.Birthday),
        email: u.Email,
        secondEmail: u.SecondEmail,
        phone: u.Mobile,
        cnpj: u.Cnpj,
        ie: u.Ie,
        whatsApp: u.Whatsapp,
        icmsContributor: u.ICMSContributor === 1 ? true : false,
        isAgent: u?.User?.Type === 'AGENT'
      });
      setAddress({
        cep: u.PostalCode,
        address: u.StreetName,
        complement: u.Complement,
        number: u.Number,
        district: u.District,
        city: u.City,
        uf: u.State,
      });
      setUserLegacy({
        value: u?.UserLegacySystem?.Id,
        label: (
          <div>
            <h4>{u?.UserLegacySystem?.nome}</h4>
            <h5>{u?.UserLegacySystem?.cpf}</h5>
          </div>
        ),
      })
      if (u.Type === 'PF') {
        setType('PESSOA FISICA');
      } else {
        setType('PESSOA JURÍDICA');
      }
      if (u.DealerId) {
        setDealer({
          value: u?.Dealer?.Id,
          label: u?.Dealer?.CompanyName || u?.Dealer?.Name,
          type: 'dealer',
        });
      }
    }
    if (location.pathname === '/clients/edit') {
      // setStep(1);
      setStepperType([
        { name: t('Clients.new.steeps.client'), status: '' },
        { name: t('Clients.new.steeps.address'), status: '' },
      ]);
    }
  }, []);
  const handleNext = () => {
    if (step === 2) {
      setLoading(true);
      // console.log(user);
      // console.log(type);
      api.client
        .new(user, type, dealer, address, userLegacy)
        .then((res) => {
          // console.log(res);
          toast.success(res.data.Message);
          navigate('/clients');
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (location.pathname === '/clients/edit' && step === 1) {
      setLoading(true);
      api.client
        .edit(user, type, dealer, address, userLegacy)
        .then((res) => {
          // console.log(res);
          toast.success(res.data.Message);
          navigate('/clients');
        })
        .catch((err) => {
          translateError(err);
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const orig = _.cloneDeep(stepperType);
      orig[step].status = 'completed';
      setStepperType(orig);
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step === 0) {
      if(pathReturn){
        navigate('/actions');
      }else{
        navigate('/clients');
      }
      
    } else {
      if (location.pathname === '/clients/new') {
        const orig = _.cloneDeep(stepperType);
        orig[step - 1].status = '';
        setStepperType(orig);
        setStep(step - 1);
      } else {
        navigate('/clients');
      }
    }
  };

  const returnStep = () => {
    switch (step) {
      case 0:
        if (location.pathname === '/clients/edit') {
          return (
            <ClientData
              loading={loading}
              type={type}
              goStep={handleNext}
              goBackStep={goBack}
              user={user}
              setUser={setUser}
              setDealer={setDealer}
              dealer={dealer}
              setUserLegacy={setUserLegacy}
              userLegacy={userLegacy}
              label={'CLIENTE'}
              // pathReturn={pathReturn}
            />
          );
        }
        return (
          <TypeRegister
            selected={type}
            setSelected={setType}
            goStep={handleNext}
            goBackStep={goBack}
          />
        );
      case 1:
        if (location.pathname === '/clients/edit') {
          return (
            <AddressData
              goStep={handleNext}
              goBackStep={goBack}
              address={address}
              setAddress={setAddress}
              loading={loading}
              buyer={'buyer'}
            />
          );
        }

        return (
          <ClientData
            loading={loading}
            type={type}
            goStep={handleNext}
            goBackStep={goBack}
            user={user}
            setUser={setUser}
            setDealer={setDealer}
            dealer={dealer}
            setUserLegacy={setUserLegacy}
            userLegacy={userLegacy}

            label={'CLIENTE'}
          />
        );
      case 2:
        return (
          <AddressData
            loading={loading}
            goStep={handleNext}
            goBackStep={goBack}
            address={address}
            setAddress={setAddress}
            buyer={'buyer'}
          />
        );
    }
  };
  return (
    <PageLayout>
      <h2 style={{ color: '#7c7c7c', textAlign: 'center' }}>
        {location.pathname === '/clients/new'
          ? t('Clients.new.title')
          : t('Clients.new.titleUpdate')}
      </h2>
      {/* {location.pathname === '/clients/new' && ( */}
      <Stepper typeStepper={stepperType} />
      {/* // )} */}
      {returnStep()}
    </PageLayout>
  );
};
