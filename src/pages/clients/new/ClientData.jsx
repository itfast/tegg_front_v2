/* eslint-disable react/prop-types */
import { Button } from '../../../../globalStyles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ReactLoading from 'react-loading';
import {
  cnpjFormat,
  cpfFormat,
  phoneFormat,
  validateCnpj,
  validateCpf,
  validateEmail,
  validateName,
} from '../../../services/util';
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { CardData, InputData } from '../../resales/Resales.styles';
import AsyncSelect from 'react-select/async';
import { AsyncPaginate } from 'react-select-async-paginate';
import api from '../../../services/api';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ClientData = ({
  goStep,
  goBackStep,
  user,
  setUser,
  label,
  type,
  loading,
  dealer,
  setDealer,
  userLegacy,
  setUserLegacy,
}) => {
  const {t} = useTranslation()
  const location = useLocation();
  const [hasUser, setHasUser] = useState(false);
  // const [isAgent, setIsAgent] = useState(false)
  const clientNameInput = document.getElementById('clientName');
  const clientCPFInput = document.getElementById('clientCPF');
  const clientCNPJInput = document.getElementById('clientCNPJ');
  // const clientRGInput = document.getElementById('clientRG');
  // const clientIEInput = document.getElementById('clientIE');
  const clientEmailInput = document.getElementById('clientEmail');
  const clientSecondEmailInput = document.getElementById('clientSecondEmail');
  const clientPhoneInput = document.getElementById('clientPhone');
  const clientCelInput = document.getElementById('clientWhatsapp');

  // const [userLegacy, setUserLegacy] = useState();

  useEffect(() => {
    if (userLegacy?.value) {
      setHasUser(true);
    }
  }, [userLegacy]);

  const loadClientsDealers = async (search) => {
    if (api.currentUser.AccessTypes[0] !== 'CLIENT' && api.currentUser.AccessTypes[0] !== 'AGENT') {
      let responseD = [];
      let dealers = [];
      if (api.currentUser.AccessTypes[0] === 'TEGG') {
        responseD = await api.dealer.getSome(1, 15, search);
        dealers = await responseD.data.dealers;
      }
      const array = [];
      if (dealers.length !== 0) {
        for (const d of dealers) {
          array.push({
            value: d.Id,
            label: d.CompanyName || d.Name,
            type: 'dealer',
          });
        }
      }
      return array;
    }
  };

  const loadLegacyClients = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const response = await api.userLegacy.get(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );
    const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
    const finalClients = await response.data.finalClients;
    const array = [];
    for (const f of finalClients) {
      array.push({
        value: f.Id,
        label: (
          <div>
            <h4>{f.nome}</h4>
            <h5>{f.cpf}</h5>
          </div>
        ),
      });
    }
    return {
      options: array,
      hasMore,
    };
  };

  const handleNext = () => {
    if (type === 'PESSOA FISICA') {
      if (validateName(user.name)) {
        clientNameInput?.style.removeProperty('border-color');
        if (user.cpf !== '') {
          if (validateCpf(user.cpf)) {
            clientCPFInput?.style.removeProperty('border-color');
            // if (user.rg !== '') {
            //   clientRGInput?.style.removeProperty('border-color');
            //   if (user.date !== '') {
                if (validateEmail(user.email)) {
                  if (user.email !== user.secondEmail) {
                    clientEmailInput?.style.removeProperty('border-color');
                    clientSecondEmailInput?.style.removeProperty(
                      'border-color'
                    );
                    if (user.phone !== '') {
                      clientPhoneInput?.style.removeProperty('border-color');
                      // if (user.whatsApp !== '') {
                      //   clientCelInput?.style.removeProperty('border-color');
                        goStep();
                      // } else {
                      //   toast.error(t('ErrorMsgs.required.whatsapp'));
                      //   clientCelInput.style.borderColor = 'red';
                      // }
                    } else {
                      toast.error(t('ErrorMsgs.required.phone'));
                      clientPhoneInput.style.borderColor = 'red';
                    }
                  } else {
                    toast.error(
                      t('ErrorMsgs.secondMailMatch')
                    );
                    clientEmailInput.style.borderColor = 'red';
                    clientSecondEmailInput.style.borderColor = 'red';
                  }
                } else {
                  toast.error('Informe um email válido');
                  // clientEmailInput.style.borderColor = 'red';
                }
            //   } else {
            //     toast.error(t('ErrorMsgs.required.birthday'));
            //   }
            // } else {
            //   toast.error(t('ErrorMsgs.required.rg'));
            //   clientRGInput.style.borderColor = 'red';
            // }
          } else {
            toast.error(t('ErrorMsgs.invalid.cpf'));
            clientCPFInput.style.borderColor = 'red';
          }
        } else {
          toast.error(t('ErrorMsgs.required.cpf'));
          clientCPFInput.style.borderColor = 'red';
        }
      } else {
        toast.error(t('ErrorMsgs.required.name'));
        clientNameInput.style.borderColor = 'red';
      }
    } else {
      if (validateName(user.name)) {
        clientNameInput?.style.removeProperty('border-color');
        if (validateCnpj(user.cnpj)) {
          clientCNPJInput?.style.removeProperty('border-color');
          // if (user.ie !== '') {
          //   clientIEInput?.style.removeProperty('border-color');
          //   if (user.date !== '') {
              if (validateEmail(user.email)) {
                if (user.email !== user.secondEmail) {
                  clientEmailInput?.style.removeProperty('border-color');
                  clientSecondEmailInput?.style.removeProperty('border-color');
                  if (user.phone !== '') {
                    clientPhoneInput?.style.removeProperty('border-color');
                    // if (user.whatsApp !== '') {
                    //   clientCelInput?.style.removeProperty('border-color');
                      goStep();
                    // } else {
                    //   toast.error(t('ErrorMsgs.required.whatsapp'));
                    //   clientCelInput.style.borderColor = 'red';
                    // }
                  } else {
                    toast.error(t('ErrorMsgs.required.phone'));
                    clientPhoneInput.style.borderColor = 'red';
                  }
                } else {
                  toast.error(t('ErrorMsgs.secondMailMatch'));
                  clientEmailInput.style.borderColor = 'red';
                  clientSecondEmailInput.style.borderColor = 'red';
                }
              } else {
                toast.error("Informe um email válido");
                clientEmailInput.style.borderColor = 'red';
              }
          //   } else {
          //     toast.error(t('ErrorMsgs.required.date'));
          //   }
          // } else {
          //   toast.error(t('ErrorMsgs.required.ie'));
          //   clientIEInput.style.borderColor = 'red';
          // }
        } else {
          toast.error(t('ErrorMsgs.required.cnpj'));
          clientCNPJInput.style.borderColor = 'red';
        }
      } else {
        toast.error('Informe o nome completo');
        clientNameInput.style.borderColor = 'red';
      }
    }
  };

  const handleCheck = (e) => {
    setUser({ ...user, icmsContributor: e.target.checked });
  };

  const styleLabel = {
    my:{
      '&.MuiInputLabel-root': {margin: 20}
    }
  }
  return (
    <CardData style={{ maxWidth: '1000px', margin: 'auto' }}>
      <h5>{label}</h5>
      <div className='input_row_1' style={{flexDirection: screen.width < 768 && 'column'}}>
        <InputData
          id='clientName'
          type='text'
          placeholder={t('Register.name')}
          style={{ width: '100%' }}
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        {api?.currentUser?.AccessTypes?.[0] === 'TEGG' && (
          <div style={{ width: screen.width < 768 ? '100%' : '50%' }}>
            <AsyncSelect
              // style={{ height: '100%' }}
              // styles={style}
              loadOptions={loadClientsDealers}
              placeholder={t('Register.hasResale')}
              defaultOptions
              isClearable
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (base) => ({
                  ...base,
                  border: '1px solid #00D959',
                  borderRadius: '8px',
                  height: '40px',
                  // This line disable the blue border
                  boxShadow: 'none',
                }),
              }}
              menuPosition={'fixed'}
              value={dealer}
              onChange={(e) => {
                setDealer(e);
              }}
            />
          </div>
        )}
      </div>
      <div className='input_row_3'>
        {type === 'PESSOA JURÍDICA' ? (
          <InputData
            id='clientCNPJ'
            type='text'
            placeholder={t('Register.cnpj')}
            className='input_3'
            value={user.cnpj}
            onChange={(e) => setUser({ ...user, cnpj: cnpjFormat(e) })}
          />
        ) : (
          <InputData
            id='clientCPF'
            type='text'
            placeholder={t('Register.cpf')}
            className='input_3'
            value={user.cpf}
            onChange={(e) => setUser({ ...user, cpf: cpfFormat(e) })}
          />
        )}
        {type === 'PESSOA JURÍDICA' ? (
          <InputData
            id='clientIE'
            type='number'
            placeholder={t('Register.ie')}
            className='input_3'
            value={user.ie}
            onChange={(e) => setUser({ ...user, ie: e.target.value })}
          />
        ) : (
          <InputData
            id='clientRG'
            type='text'
            placeholder={t('Register.rg')}
            className='input_3'
            value={user.rg}
            onChange={(e) => setUser({ ...user, rg: e.target.value })}
          />
        )}
        <div className='input_3'>
          <DatePicker
          className={styleLabel}
          disableFuture
            underlineStyle={{ display: 'none' }}
            size={'small'}
            label={
              type === 'PESSOA JURÍDICA' ? t('Register.fundationDate') : t('Register.birthday')
            }
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'standard',
                sx: {
                  px: 2,
                  // py: -4,
                  border: '1px solid #00D959',
                  borderRadius: '8px',
                  height: '45px',
                  svg: { marginTop: '-15px' },
                },
                InputProps: { disableUnderline: true },
                InputLabelProps:{
                  shrink: true,
                  sx: {
                    margin: '4px'
                  }
                }
              },
              label: {
                margin: '4px 3px'
              }
            }}
            value={user.date}
            onChange={(e) => {
              // console.log(e);
              setUser({ ...user, date: e });
            }}
          />
        </div>
      </div>
      <div className='input_row_2'>
        <InputData
          id='clientEmail'
          type='text'
          placeholder={t('Register.email')}
          className='input_2'
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <InputData
          id='clientSecondEmail'
          type='text'
          placeholder={t('Register.secondMail')}
          className='input_2'
          value={user.secondEmail}
          onChange={(e) => setUser({ ...user, secondEmail: e.target.value })}
        />
      </div>
      <div className='input_row_2'>
        <InputData
          id='clientPhone'
          placeholder={t('Register.phone')}
          className='input_2'
          value={user.phone}
          onChange={(e) =>
            setUser({
              ...user,
              phone: phoneFormat(e.target.value),
            })
          }
        />
        <InputData
          id='clientWhatsapp'
          placeholder={t('Register.whatsapp')}
          className='input_2'
          value={user.whatsApp}
          onChange={(e) =>
            setUser({
              ...user,
              whatsApp: phoneFormat(e.target.value),
            })
          }
        />
      </div>
      <div>
          <Checkbox
            id='agent'
            checked={user?.isAgent}
            onChange={(e) => {
              setUser({
                ...user,
                isAgent: e.target.checked,
              })
            }}
          />

          <label htmlFor='agent'>{t('Register.isAgent')}</label>
        </div>
      <div
        // className='input_3'
        style={{
          display: 'flex',
          flexDirection: screen.width < 768 && 'column',
          // alignItems: 'center',
          // justifyContent: 'space-between',
        }}
      >
        <div>
          <Checkbox
            id='legado'
            checked={hasUser}
            onChange={(e) => {
              setHasUser(e.target.checked);
              setUserLegacy();
            }}
          />

          <label htmlFor='legado'>{t('Register.haveLegacyUser')}</label>
        </div>
        {hasUser && (
          <div style={{ width: screen.width < 768 ? '100%' : '30%' }}>
            <AsyncPaginate
              defaultOptions
              isClearable
              placeholder='Selecione o usuário legado'
              // noOptionsMessage={() => 'SEM ICCIDS PARA VINCULAR'}
              value={userLegacy}
              loadOptions={loadLegacyClients}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={'fixed'}
              onChange={(e) => {
                setUserLegacy(e);
              }}
            />
          </div>
        )}
      </div>
      <div>
        {type !== 'PESSOA FISICA' && (
          <div
            className='input_3'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Checkbox
              id='icms_contributor'
              checked={user.icmsContributor}
              onChange={(e) => {
                handleCheck(e);
              }}
            />

            <label htmlFor='icms_contributor'>
            {t('Register.isIcmsContribuitor')}
            </label>
          </div>
        )}
      </div>
      <div style={{display: 'flex', justifyContent: 'end', marginTop: '1rem'}}>
        <Button invert onClick={goBackStep}>
        {t('Register.goback').toUpperCase()}
        </Button>
        <Button notHover={loading} onClick={handleNext}>
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
            t('Register.next').toUpperCase()
          ) : location.pathname === '/clients/edit' ? (
            t('Register.next').toUpperCase()
          ) : (
            t('Register.next').toUpperCase()
          )}
        </Button>
      </div>
    </CardData>
  );
};
