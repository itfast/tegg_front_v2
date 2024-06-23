/* eslint-disable react/prop-types */
import { Button } from '../../../../globalStyles';
import { CardData, InputData } from '../../resales/Resales.styles';
import ReactLoading from 'react-loading';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import api from '../../../services/api';

export const PortRequestData = ({
  goStep,
  goBackStep,
  client,
  setClient,
  line,
  setLine,
  newNumber,
  setNewNumber,
  provider,
  setProvider,
  label,
  loading,
}) => {
  const [clientLines, setClientLines] = useState([]);

  const clientInput = document.getElementById('client');
  const oldLineInput = document.getElementById('oldLine');
  const newNumberInput = document.getElementById('newNumber');
  const providerInput = document.getElementById('provider');

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
      clientInput?.style.removeProperty('border-color');
      if (Object.keys(line).length !== 0) {
        oldLineInput?.style.removeProperty('border-color');
        if (newNumber !== '') {
          if (newNumber.length === 13) {
            newNumberInput?.style.removeProperty('border-color');
            if (provider !== '') {
              providerInput?.style.removeProperty('border-color');
              goStep();
            } else {
              toast.error('Operadora antiga é obrigatória');
              providerInput.style.borderColor = 'red';
            }
          } else {
            toast.error('Insira um número válido');
            newNumberInput.style.borderColor = 'red';
          }
        } else {
          toast.error('Novo número é obrigatório');
          newNumberInput.style.borderColor = 'red';
        }
      } else {
        toast.error('Linha é obrigatória');
        oldLineInput.style.borderColor = 'red';
      }
    } else {
      toast.error('Cliente é obrigatório');
      clientInput.style.borderColor = 'red';
    }
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
      const response = await api.line.getClientLines(1, 10, client.Id);
      // console.log("linhas", response.data);
      const lines = await response.data.iccids;
      for (const line of lines) {
        array.push({
          value: line,
          label: formatPhone(line.SurfMsisdn),
        });
      }
    }

    // console.log(array);
    setClientLines(array);
  };

  useEffect(() => {
    if (Object.keys(client).length !== 0) {
      loadLines();
    }
  }, [client]);

  return (
    <CardData>
      <h3>{label}</h3>
      <div style={{ width: '100%', margin: '1rem', display: 'flex' }}>
        <div style={{ width: '100%', marginRight: '1%' }}>
          <label>Cliente</label>
          <AsyncSelect
            id='client'
            loadOptions={loadClients}
            placeholder='Selecionar ou buscar...'
            defaultOptions
            isClearable
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            menuPosition={'fixed'}
            onChange={(e) => {
              console.log(e);
              if (e === null) {
                setClient({});
              } else {
                setClient(e.value);
              }
            }}
          />
        </div>
      </div>
      {Object.keys(client).length !== 0 && (
        <div style={{ width: '100%', margin: '1rem', display: 'flex' }}>
          <div style={{ width: '100%', marginRight: '1%' }}>
            <label>Linha</label>
            <Select
              id='oldLine'
              options={clientLines}
              placeholder='Selecionar...'
              isClearable
              onChange={(e) => {
                console.log(e);
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
      <div style={{ width: '100%', margin: '1rem', display: 'flex' }}>
        <div style={{ width: '100%', marginRight: '1%' }}>
          <label>Novo numero (com código de área e país)</label>
          <InputData
            id='newNumber'
            type='number'
            placeholder='Novo número *'
            style={{ width: '100%' }}
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
      </div>
      <div style={{ width: '100%', margin: '1rem', display: 'flex' }}>
        <div style={{ width: '100%', marginRight: '1%' }}>
          <label>Operadora antiga</label>
          <InputData
            id='provider'
            placeholder='Operadora antiga *'
            style={{ width: '100%' }}
            value={provider}
            onChange={(e) => setProvider(e.target.value.toLowerCase())}
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
