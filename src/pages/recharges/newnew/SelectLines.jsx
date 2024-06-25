/* eslint-disable react/prop-types */
import { CardData } from './NewOrder.styles';
import { Tooltip } from 'react-tooltip';

import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';

// eslint-disable-next-line react/prop-types
export const SelectLines = ({
  handleNextExt,
  goBackStep,
  selectedLine,
  setSelectedLine,
  dueDate,
  setDueDate,
  optLines,
}) => {
  // const [selected, setSelected] = useState();
  // const [clientLines, setClientLines] = useState([]);
  const [assinatura, setAssinatura] = useState(false);

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

  const handleNext = () => {
    if (selectedLine) {
      if (assinatura) {
        if (dueDate) {
          handleNextExt();
        } else {
          toast.error('Informe um dia de venciamento para gerar a assinatura.');
        }
      } else {
        handleNextExt();
      }
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
              <AsyncPaginate
                defaultOptions
                // cacheUniqs={selectedSinCard}
                placeholder='Selecione a linha'
                noOptionsMessage={() => 'SEM LINHAS PARA RECARREGAR'}
                value={selectedLine}
                loadOptions={optLines}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={'fixed'}
                onChange={setSelectedLine}
              />
            </div>
          </div>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    // color: pink[800],
                    '&.Mui-checked': {
                      color: 'green',
                    },
                  }}
                  onChange={(e) => {
                    setAssinatura(e.target.checked);
                    if (!e.target.checked) {
                      setDueDate();
                    }
                  }}
                />
              }
              label='Gerar assinatura'
            />
          </FormGroup>

          {assinatura && (
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
          )}
        </div>
        <div className='flex end btn_invert'>
          <Button
            onClick={goBackStep}
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
      </CardData>
    </>
  );
};
