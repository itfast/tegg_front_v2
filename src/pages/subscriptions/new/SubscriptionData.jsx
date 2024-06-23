/* eslint-disable react/prop-types */
import { Button } from '../../../../globalStyles';
import {
  CardData,
  FooterButton,
  InputData,
  SelectUfs,
} from '../../resales/Resales.styles';
import ReactLoading from 'react-loading';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import {
  translateError,
  getCEP,
  cepFormat,
  phoneFormat,
} from '../../../services/util';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

export const SubscriptionData = ({
  goStep,
  goBackStep,
  client,
  setClient,
  line,
  setLine,
  plan,
  setPlan,
  dueDate,
  setDueDate,
  ccInfo,
  setCcInfo,
  cchInfo,
  setCchInfo,
  label,
  loading,
}) => {
  const location = useLocation();

  const [clientLines, setClientLines] = useState([]);

  const [focus, setFocus] = useState('');

  const cardNameInput = document.getElementById('cardName');
  const cardNumberInput = document.getElementById('cardNumber');
  const expireInput = document.getElementById('expire');
  const cardCcvInput = document.getElementById('cardCcv');
  const ownerNameInput = document.getElementById('ownerName');
  const ownerEmailInput = document.getElementById('ownerEmail');
  const ownerDocInput = document.getElementById('ownerDoc');
  const ownerCepInput = document.getElementById('ownerCep');
  const ownerNumberInput = document.getElementById('ownerNumber');
  const ownerTelInput = document.getElementById('ownerTel');
  const ownerCelInput = document.getElementById('ownerCel');

  const formatPhone = (str) => {
    if (str != undefined) {
      const fullNumber = str.toString();
      const country = fullNumber.slice(0, 2);
      const area = fullNumber.slice(2, 4);
      const number1 = fullNumber.slice(4, 9);
      const number2 = fullNumber.slice(9);
      // console.log(fullNumber, country, area, number1, number2);
      return `+${country} (${area}) ${number1}-${number2}`;
    }
  };

  const handleNext = () => {
    if (Object.keys(client).length !== 0) {
      if (Object.keys(line).length !== 0) {
        if (dueDate !== '') {
          if (ccInfo.HolderName !== '') {
            cardNameInput?.style.removeProperty('border-color');
            if (ccInfo.Number !== '') {
              if (ccInfo.Number.length === 16) {
                cardNumberInput?.style.removeProperty('border-color');
                if (ccInfo.Expiry !== '') {
                  if (ccInfo.Expiry.length === 7) {
                    expireInput?.style.removeProperty('border-color');
                    if (ccInfo.Ccv !== '') {
                      if (ccInfo.Ccv.length === 3) {
                        cardCcvInput?.style.removeProperty('border-color');
                        if (cchInfo.Name !== '') {
                          ownerNameInput?.style.removeProperty('border-color');
                          if (cchInfo.Email !== '') {
                            ownerEmailInput?.style.removeProperty(
                              'border-color'
                            );
                            if (cchInfo.Doc !== '') {
                              if (
                                cchInfo.Doc.length === 11 ||
                                cchInfo.Doc.length === 14
                              ) {
                                ownerDocInput?.style.removeProperty(
                                  'border-color'
                                );
                                if (cchInfo.PostalCode !== '') {
                                  ownerCepInput?.style.removeProperty(
                                    'border-color'
                                  );
                                  if (cchInfo.AddressNumber !== '') {
                                    ownerNumberInput?.style.removeProperty(
                                      'border-color'
                                    );
                                    if (cchInfo.Phone !== '') {
                                      ownerTelInput?.style.removeProperty(
                                        'border-color'
                                      );
                                      if (cchInfo.MobilePhone !== '') {
                                        ownerCelInput?.style.removeProperty(
                                          'border-color'
                                        );
                                        if (Object.keys(plan).length !== 0) {
                                          goStep();
                                        } else {
                                          toast.error(
                                            'As informações do plano da sua linha não foram coletadas corretamente, recarregue a página e tente novamente'
                                          );
                                        }
                                      } else {
                                        toast.error('Celular é obrigatório');
                                        ownerCelInput.style.borderColor = 'red';
                                      }
                                    } else {
                                      toast.error('Telefone é obrigatório');
                                      ownerTelInput.style.borderColor = 'red';
                                    }
                                  } else {
                                    toast.error(
                                      'Número do endereço é obrigatório'
                                    );
                                    ownerNumberInput.style.borderColor = 'red';
                                  }
                                } else {
                                  toast.error('CEP é obrigatório');
                                  ownerCepInput.style.borderColor = 'red';
                                }
                              } else {
                                toast.error('Insira um CPF/CNPJ válido');
                                ownerDocInput.style.borderColor = 'red';
                              }
                            } else {
                              toast.error('CPF/CNPJ é obrigatório');
                              ownerDocInput.style.borderColor = 'red';
                            }
                          } else {
                            toast.error('Email é obrigatório');
                            ownerEmailInput.style.borderColor = 'red';
                          }
                        } else {
                          toast.error('Nome é obrigatório');
                          ownerNameInput.style.borderColor = 'red';
                        }
                      } else {
                        toast.error('Insira um ccv válido');
                        cardCcvInput.style.borderColor = 'red';
                      }
                    } else {
                      toast.error('Ccv é obrigatório');
                      cardCcvInput.style.borderColor = 'red';
                    }
                  } else {
                    toast.error(
                      'Data de validade inválida, siga o padrão (MM/AAAA)'
                    );
                    expireInput.style.borderColor = 'red';
                  }
                } else {
                  toast.error('Data de validade é obrigatória');
                  expireInput.style.borderColor = 'red';
                }
              } else {
                toast.error('Insira um número de cartão válido');
                cardNumberInput.style.borderColor = 'red';
              }
            } else {
              toast.error('Número do cartão é obrigatório');
              cardNumberInput.style.borderColor = 'red';
            }
          } else {
            toast.error('Nome do dono é obrigatório');
            cardNameInput.style.borderColor = 'red';
          }
        } else {
          toast.error('Escolha um dia para o vencimento da fatura');
        }
      } else {
        toast.error('Linha é obrigatória');
      }
    } else {
      toast.error('Cliente é obrigatório');
    }
  };

  const handleCpf = (e) => {
    // console.log(e)
    const data = e.target.value.replace(/\D/g, '');
    return data
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})(\d)/, '$1');
  };

  const handleCnpj = (e) => {
    const data = e.target.value.replace(/\D/g, '');
    return data
      .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
      .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const loadClients = async (search) => {
    const response = await api.client.getAll(1, 10);
    // console.log(response.data.meta);
    const clients = await response.data.finalClients;
    const array = [];
    for (const client of clients) {
      array.push({
        value: client,
        label: client.Name,
      });
    }
    // console.log(array);
    return array;
  };

  const loadLines = async () => {
    const array = [];
    if (Object.keys(client).length !== 0) {
      let response;
      if (api.currentUser.AccessTypes[0] !== 'CLIENT') {
        response = await api.line.getClientLines(1, 10, client.Id);
      } else {
        response = await api.line.myLines(1, 10);
      }

      const lines = await response.data.iccids;
      for (const line of lines) {
        if (line?.IccidHistoric?.length > 0) {
          array.push({
            value: line,
            label: formatPhone(line?.IccidHistoric[0]?.SurfMsisdn),
          });
        }
      }
    }

    // console.log(array);
    setClientLines(array);
  };

  const getPlan = async () => {
    const res = await api.plans.get();

    const plan = res.data.filter(
      (p) =>
        p.Products.length === 1 &&
        p.Products[0].Product.SurfId === line.SurfNuPlano
    );
    // console.log(plan);
    if (plan.length > 0) {
      setPlan(plan[0]);
    } else {
      toast.error(
        'Não foi possível coletar as informações do plano da linha, tente novamente mais tarde'
      );
    }
  };

  const handleInputFocus = (e) => {
    setFocus(e.target.name);
  };

  const handleCardNumber = (string) => {
    const data = string.replace(/\D/g, '').replace(/(\d{16})\d+?$/, '$1');
    return data;
  };

  const handleExpiry = (string) => {
    const data = string
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
    return data;
  };

  const handleCvv = (string) => {
    const data = string.replace(/\D/g, '').replace(/(\d{3})\d+?$/, '$1');
    return data;
  };

  const handleCep = async (e) => {
    // console.log(e);
    setCchInfo((obj) => {
      const newObj = { ...obj, PostalCode: cepFormat(e.target.value) };
      return newObj;
    });

    const res = await getCEP(e);
    if (res) {
      setCchInfo((obj) => {
        const newObj = {
          ...obj,
          Uf: res.uf,
          City: res.localidade,
          District: res.bairro,
          Address: res.logradouro,
        };
        return newObj;
      });
    }
  };

  const returnDays = () => {
    const date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month > 12) {
      month = 1;
      year++;
    }

    const array = [];
    const date2 = new Date(year, month, 0);
    for (let i = 1; i <= date2.getDate(); i++) {
      array.push({
        label: i,
        value: i.toString(),
      });
    }
    return array;
  };

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] === 'CLIENT') {
      setClient({
        Id: api.currentUser.MyFinalClientId,
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(client).length !== 0) {
      loadLines();
    }
  }, [client]);

  useEffect(() => {
    if (Object.keys(line).length !== 0) {
      getPlan();
    }
  }, [line]);

  return (
    <CardData>
      <h3>{label}</h3>
      {api.currentUser.AccessTypes[0] !== 'CLIENT' && (
        <div className='input_row_2'>
          <div className='input'>
            <label>CLIENTE</label>
            <AsyncSelect
              id='client'
              loadOptions={loadClients}
              placeholder='Selecionar ou buscar...'
              defaultOptions
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={'fixed'}
              isClearable
              onChange={(e) => {
                if (e === null) {
                  setClient({});
                } else {
                  setClient(e.value);
                }
              }}
            />
          </div>
        </div>
      )}
      {Object.keys(client).length !== 0 && (
        <div className='input_row_2'>
          <div className='input'>
            <label>LINHA</label>
            <Select
              id='line'
              options={clientLines}
              placeholder='Selecionar...'
              isClearable
              onChange={(e) => {
                if (e === null) {
                  setLine({});
                } else {
                  setLine(e.value);
                }
              }}
            />
          </div>
        </div>
      )}
      <div className='input_row_2'>
        <div className='input'>
          <label>DIA DO VENCIMENTO DA FATURA</label>
          <Select
            isSearchable={false}
            options={returnDays()}
            placeholder='Dia *'
            // menuPortalTarget={document.body}
            menuPosition='fixed'
            onChange={(e) => {
              setDueDate(e.value);
            }}
          />
        </div>
      </div>
      <br />
      <br />
      <h4>Informações do cartão</h4>
      <br />
      <Cards
        d
        focused={focus}
        cvc={ccInfo.Ccv}
        expiry={ccInfo.Expiry}
        name={ccInfo.HolderName}
        number={ccInfo.Number}
        placeholders={{ name: 'SEU NOME AQUI' }}
        locale={{ valid: 'VALIDADE' }}
      />
      <br />
      <div className='input_row_2'>
        <div className='input_2'>
          <label>NOME DONO</label>
          <InputData
            id='cardName'
            name='name'
            placeholder='Nome dono *'
            style={{ width: '100%' }}
            value={ccInfo.HolderName}
            onChange={(e) => {
              setCcInfo({
                ...ccInfo,
                HolderName: e.target.value,
              });
            }}
            onFocus={handleInputFocus}
          />
        </div>
        <div className='input_2'>
          <label>NÚMERO CARTÃO</label>
          <InputData
            id='cardNumber'
            name='number'
            placeholder='Número cartão *'
            style={{ width: '100%' }}
            value={ccInfo.Number}
            onChange={(e) =>
              setCcInfo({
                ...ccInfo,
                Number: handleCardNumber(e.target.value),
              })
            }
            onFocus={handleInputFocus}
          />
        </div>
      </div>
      <div className='input_row_2'>
        <div className='input_2'>
          <label>VALIDADE (MM/AAAA)</label>
          <InputData
            id='expire'
            name='expiry'
            placeholder='Validade *'
            style={{ width: '100%' }}
            value={ccInfo.Expiry}
            onChange={(e) =>
              setCcInfo({
                ...ccInfo,
                Expiry: handleExpiry(e.target.value),
              })
            }
            onFocus={handleInputFocus}
          />
        </div>
        <div className='input_2'>
          <label>CCV</label>
          <InputData
            id='cardCcv'
            name='cvc'
            placeholder='Ccv *'
            style={{ width: '100%' }}
            value={ccInfo.Ccv}
            onChange={(e) =>
              setCcInfo({
                ...ccInfo,
                Ccv: handleCvv(e.target.value),
              })
            }
            onFocus={handleInputFocus}
          />
        </div>
      </div>
      <br />
      <br />
      <h4>Informações do dono do cartão</h4>
      <div className='input_row_2'>
        <div className='input_2'>
          <label>NOME</label>
          <InputData
            id='ownerName'
            type='text'
            placeholder='Nome *'
            style={{ width: '100%' }}
            value={cchInfo.Name}
            onChange={(e) =>
              setCchInfo({
                ...cchInfo,
                Name: e.target.value,
              })
            }
          />
        </div>
        <div className='input_2'>
          <label>EMAIL</label>
          <InputData
            id='ownerEmail'
            type='text'
            placeholder='E-mail *'
            style={{ width: '100%' }}
            value={cchInfo.Email}
            onChange={(e) =>
              setCchInfo({
                ...cchInfo,
                Email: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className='input_row_2'>
        <div className='input_2'>
          <label>CPF/CNPJ</label>
          <InputData
            id='ownerDoc'
            type='text'
            placeholder='CPF/CNPJ *'
            style={{ width: '100%' }}
            value={cchInfo.Doc}
            onChange={(e) => {
              if (e.target.value.replace(/\D+/g, '').length <= 11) {
                setCchInfo({
                  ...cchInfo,
                  Doc: handleCpf(e),
                });
              } else {
                setCchInfo({
                  ...cchInfo,
                  Doc: handleCnpj(e),
                });
              }
            }}
          />
        </div>
        <div className='input_2'>
          <label>CEP</label>
          <InputData
            id='ownerCep'
            type='text'
            placeholder='CEP *'
            style={{ width: '100%' }}
            value={cchInfo.PostalCode}
            onChange={handleCep}
          />
        </div>
      </div>
      <div className='input_row_2'>
        <div className='input_2'>
          <label>ESTADO</label>
          <InputData
            type='text'
            disabled={true}
            placeholder='Estado'
            style={{ width: '100%' }}
            value={cchInfo.Uf}
          />
        </div>
        <div className='input_2'>
          <label>CIDADE</label>
          <InputData
            type='text'
            disabled={true}
            placeholder='Cidade'
            style={{ width: '100%' }}
            value={cchInfo.City}
          />
        </div>
      </div>
      <div className='input_row_2'>
        <div className='input_2'>
          <label>BAIRRO</label>
          <InputData
            type='text'
            disabled={true}
            placeholder='Bairro'
            style={{ width: '100%' }}
            value={cchInfo.District}
          />
        </div>
        <div className='input_2'>
          <label>ENDEREÇO</label>
          <InputData
            type='text'
            disabled={true}
            placeholder='Endereço'
            style={{ width: '100%' }}
            value={cchInfo.Address}
          />
        </div>
      </div>
      <div className='input_row_2'>
        <div className='input_2'>
          <label>NÚMERO</label>
          <InputData
            id='ownerNumber'
            type='text'
            placeholder='Número *'
            style={{ width: '100%' }}
            value={cchInfo.AddressNumber}
            onChange={(e) =>
              setCchInfo({
                ...cchInfo,
                AddressNumber: e.target.value,
              })
            }
          />
        </div>
        <div className='input_2'>
          <label>COMLEMENTO</label>
          <InputData
            type='text'
            placeholder='Complemento'
            style={{ width: '100%' }}
            value={cchInfo.AddressComplement}
            onChange={(e) =>
              setCchInfo({
                ...cchInfo,
                AddressComplement: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className='input_row_2'>
        <div className='input_2'>
          <label>TELEFONE</label>
          <InputData
            type='text'
            id='ownerTel'
            placeholder='Telefone *'
            style={{ width: '100%' }}
            value={cchInfo.Phone}
            onChange={(e) =>
              setCchInfo({
                ...cchInfo,
                Phone: phoneFormat(e.target.value),
              })
            }
          />
        </div>
        <div className='input_2'>
          <label>CELULAR</label>
          <InputData
            id='ownerCel'
            type='text'
            placeholder='Celular *'
            style={{ width: '100%' }}
            value={cchInfo.MobilePhone}
            onChange={(e) =>
              setCchInfo({
                ...cchInfo,
                MobilePhone: phoneFormat(e.target.value),
              })
            }
          />
        </div>
      </div>
      <div className='flex end'>
        <div className='btn_container btn_invert'>
          <Button invert onClick={goBackStep}>
            VOLTAR
          </Button>
          <Button
            //  notHover
            onClick={handleNext}
          >
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
            ) : (
              'CRIAR'
            )}
          </Button>
        </div>
      </div>
    </CardData>
  );
};
