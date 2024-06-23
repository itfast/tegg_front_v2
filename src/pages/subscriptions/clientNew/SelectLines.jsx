/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { CardData } from './NewOrder.styles';
import { Tooltip } from 'react-tooltip';

import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import { formatPhone } from '../../../services/util';
import Select from 'react-select';

// eslint-disable-next-line react/prop-types
export const SelectLines = ({ handleNextExt, goBackStep, selectedLine, setSelectedLine, dueDate, setDueDate }) => {
  // const [selected, setSelected] = useState();
  const [clientLines, setClientLines] = useState([]);
  

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
    const loadLines = async () => {
      const array = [];
      const response = await api.line.myLines(1, 10);
      const lines = await response.data.iccids;
      for (const line of lines) {
        if (line?.IccidHistoric?.length > 0) {
          array.push({
            value: line,
            label: formatPhone(line?.IccidHistoric[0]?.SurfMsisdn),
          });
        }
      }
      setClientLines(array);
    };

    loadLines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (selectedLine) {
      handleNextExt();
    } else {
      toast.error('Escolha pelo menos uma linha para continuar');
    }
  };
  return (
    <>
      <Tooltip id='add-iccid' />
      <CardData>
        <h5>ESCOLHA A LINHA</h5>

        <div style={{ marginBottom: '1rem' }}>
          <div className='input_row_2'>
            <div className='input'>
              <label>LINHA</label>
              <Select
                id='line'
                options={clientLines}
                placeholder='Selecionar...'
                value={selectedLine}
                onChange={setSelectedLine}
              />
            </div>
          </div>

          <div className='input_row_2'>
            <div className='input'>
              <label>DIA DO VENCIMENTO DA FATURA</label>
              <Select
                isSearchable={false}
                options={returnDays()}
                placeholder='Dia *'
                // menuPortalTarget={document.body}
                menuPosition='fixed'
                value={dueDate}
                onChange={setDueDate}
              />
            </div>
          </div>
        </div>
        <div className='flex end btn_invert'>
          <Button onClick={goBackStep} style={{ width: window.innerWidth < 768 && '100%' }}>
            VOLTAR
          </Button>
          <Button notHover onClick={handleNext} style={{ width: window.innerWidth < 768 &&  '100%' }}>
            PRÓXIMO
          </Button>
        </div>
      </CardData>
    </>
  );
};
