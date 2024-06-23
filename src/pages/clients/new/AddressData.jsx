/* eslint-disable react/prop-types */
import { Button } from '../../../../globalStyles';

import { UFS, getCEP, cepFormat, translateError } from '../../../services/util';
// import { toast } from 'react-toastify';
import { CardData, InputData, SelectUfs } from './NewClient.styles';
import { useRef } from 'react';
import ReactLoading from 'react-loading';
import api from '../../../services/api';
import { useTranslation } from 'react-i18next';

export const AddressData = ({
  goStep,
  goBackStep,
  address,
  setAddress,
  loading,
}) => {
  // const cepInput = document.getElementById('cep');
  const {t} = useTranslation()
  const cepInput = useRef(0);
  // const addressInput = document.getElementById('address');
  // const numberInput = document.getElementById('number');
  // const districtInput = document.getElementById('district');
  // const cityInput = document.getElementById('city');
  // const ufInput = document.getElementById('uf');

  const getAddress = (id, type) => {
    if (type === 'dealer') {
      api.dealer
        .getAddress(id)
        .then((res) => {
          setAddress({
            ...address,
            cep: cepFormat(res.data.PostalCode),
            uf: res.data.UF || '',
            district: res.data.District || '',
            city: res.data.City || '',
            address: res.data.Address || '',
            number: res.data.Number,
            complement: res.data.Complement,
          });
        })
        .catch((err) => {
          translateError(err);
        });
    } else {
      api.client
        .getAddress(id)
        .then((res) => {
          setAddress({
            ...address,
            cep: cepFormat(res.data.PostalCode),
            uf: res.data.UF || '',
            district: res.data.District || '',
            city: res.data.City || '',
            address: res.data.Address || '',
            number: res.data.Number,
            complement: res.data.Complement,
          });
        })
        .catch((err) => {
          translateError(err);
        });
    }
  };

  // useEffect(() => {
  //   if (buyer && !otherAddress) {
  //     getAddress(buyer.value, buyer.type);
  //   }
  // }, [buyer, otherAddress]);

  const handleNext = () => {
    // if (
    //   address.cep !== '' &&
    //   address.cep.replace('.', '').replace('-', '').length === 8
    // ) {
    //   // cepInput?.style.removeProperty('border-color');
    //   cepInput.current.style.borderColor = '';
    //   if (address.address !== '' && address.address.trim().length > 0) {
    //     addressInput?.style.removeProperty('border-color');
    //     if (address.number !== '' && Number(address.number) > 0) {
    //       numberInput?.style.removeProperty('border-color');
    //       if (address.district !== '' && address.district.trim().length > 0) {
    //         districtInput?.style.removeProperty('border-color');
    //         if (address.city !== '' && address.city.trim().length > 0) {
    //           cityInput?.style.removeProperty('border-color');
    //           if (address.uf !== '') {
    //             ufInput?.style.removeProperty('border-color');
                goStep();
    //           } else {
    //             ufInput.style.borderColor = 'red';
    //             toast.error(t("ErrorMsgs.required.uf"));
    //           }
    //         } else {
    //           cityInput.style.borderColor = 'red';
    //           toast.error(t("ErrorMsgs.required.city"));
    //         }
    //       } else {
    //         districtInput.style.borderColor = 'red';
    //         toast.error(t("ErrorMsgs.required.neighborhood"));
    //       }
    //     } else {
    //       numberInput.style.borderColor = 'red';
    //       toast.error(t("ErrorMsgs.required.number"));
    //     }
    //   } else {
    //     addressInput.style.borderColor = 'red';
    //     toast.error(t("ErrorMsgs.required.address"));
    //   }
    // } else {
    //   console.log(cepInput.current.borderColor);
    //   cepInput.current.style.borderColor = 'red';
    //   // cepInput.style.borderColor = 'red';
    //   toast.error(t("ErrorMsgs.invalid.cep"));
    // }
  };

  const handleCep = async (e) => {
    setAddress({ ...address, cep: cepFormat(e.target.value) });

    const res = await getCEP(e);
    // console.log(res);
    if (res) {
      setAddress({
        ...address,
        cep: cepFormat(e.target.value),
        uf: res.uf || '',
        district: res.bairro || '',
        city: res.localidade || '',
        address: res.logradouro || '',
      });
    }
  };

  return (
    <CardData>
      <h5>{t('Register.addressLabel').toUpperCase()}</h5>
      <div className='input_row_2'>
        <InputData
          ref={cepInput}
          type='text'
          id='cep'
          name='cep'
          placeholder={t('Register.cep')}
          value={address.cep}
          onChange={handleCep}
          className='input_20'
        />
        <InputData
          type='text'
          id='address'
          placeholder={t('Register.address')}
          value={address.address}
          onChange={(e) => setAddress({ ...address, address: e.target.value })}
          className='input_80'
        />
      </div>
      <div className='input_row_2'>
        <InputData
          type='text'
          placeholder={t('Register.complement')}
          value={address.complement}
          onChange={(e) =>
            setAddress({ ...address, complement: e.target.value })
          }
          className='input_80'
        />
        <InputData
          type='number'
          id='number'
          placeholder={t('Register.number')}
          className='input_20'
          value={address.number}
          onChange={(e) => setAddress({ ...address, number: e.target.value })}
        />
      </div>
      <div className='input_row_3'>
        <InputData
          type='text'
          id='district'
          placeholder={t('Register.neighborhood')}
          value={address.district}
          onChange={(e) => setAddress({ ...address, district: e.target.value })}
          className='input_3'
        />
        <InputData
          type='text'
          id='city'
          placeholder={t('Register.city')}
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          className='input_3'
        />
        <SelectUfs
          name='UF'
          id='uf'
          placeholder={t('Register.uf')}
          value={address.uf}
          onChange={(e) => setAddress({ ...address, uf: e.target.value })}
          className='input_3'
          defaultValue={''}
        >
          <option disabled value={''}>
            UFs
          </option>
          {UFS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </SelectUfs>
      </div>
      <div style={{display: 'flex', justifyContent: 'end', marginTop: '1rem'}}>
        {/* <Button onClick={goBackStep}>VOLTAR</Button> */}
        <Button invert onClick={goBackStep}>
        {t('Register.goback').toUpperCase()}
        </Button>
        <Button notHover onClick={handleNext}>
        {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 15,
              }}
            >
              <ReactLoading type={'bars'} color={'#fff'} />
            </div>
          ) : location.pathname === '/clients/new' ? (
            t('Register.finally').toUpperCase()
          ) : location.pathname === '/clients/edit' ? (
            t('Register.update').toUpperCase()
          ) : (
            t('Register.finally').toUpperCase()
          )}
        </Button>
      </div>
    </CardData>
  );
};
