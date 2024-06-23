/* eslint-disable react/prop-types */
import api from '../../../services/api';
import { CardData } from './NewOrder.styles';
import AsyncSelect from 'react-select/async';
import Radio from '@mui/joy/Radio';
import FormControl from '@mui/joy/FormControl';

import RadioGroup from '@mui/joy/RadioGroup';
import { Button } from '../../../../globalStyles';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const Buyer = ({
  handleNextExt,
  stoke,
  setStoke,
  buyer,
  setBuyer,
  otherSend,
  setOtherSend,
}) => {
  // const [value, setValue] = useState('local');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setStoke(event.target.value);
  };
  // {
  //   console.log(api.currentUser);
  // }
  const loadClientsDealers = async (search) => {
    if (api.currentUser.AccessTypes[0] !== 'CLIENT') {
      const responseC = await api.client.getSome(1, 15, search);
      const clients = await responseC.data.finalClients;
      let responseD = [];
      let dealers = [];
      if (api.currentUser.AccessTypes[0] === 'TEGG') {
        responseD = await api.dealer.getSome(1, 15, search);
        dealers = await responseD.data.dealers;
      }
      // console.log("Clients", responseC.data);
      // console.log("Dealers", responseD.data);

      const array = [];
      if (clients.length !== 0) {
        const clientsObj = {
          label: 'Clientes',
          options: [],
        };
        for (const c of clients) {
          if (c.AssociatedResaleId === null) {
            clientsObj.options.push({
              value: c.Id,
              label: c.Name,
              type: 'client',
            });
          }
        }
        array.push(clientsObj);
      }
      if (dealers.length !== 0) {
        const dealersObj = {
          label: 'Revendas',
          options: [],
        };
        for (const d of dealers) {
          dealersObj.options.push({
            value: d.Id,
            label: d.CompanyName || d.Name,
            type: 'dealer',
          });
        }
        array.push(dealersObj);
      }

      // if (api.currentUser.AccessTypes[0] === 'DEALER') {
      //   const myObj = {
      //     label: 'Para mim',
      //     options: [],
      //   };
      //   myObj.options.push({
      //     value: api.currentUser.UserId,
      //     label: api.currentUser.Name,
      //     type: 'dealer',
      //   });

      //   array.push(myObj);
      // }
      return array;
    }
  };

  const handleNext = () => {
    if (buyer) {
      handleNextExt();
    } else {
      toast.error('Informe um comprador');
    }
  };

  return (
    <CardData>
      <h5>SELECIONE O COMPRADOR</h5>
      <div style={{ display: 'flex', marginBottom: '2rem' }}>
        <div style={{ width: '100%' }}>
          <AsyncSelect
            style={{ width: '200px' }}
            loadOptions={loadClientsDealers}
            placeholder='Selecionar ou buscar...'
            defaultOptions
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            menuPosition={'fixed'}
            isClearable
            value={buyer}
            onChange={(e) => {
              setBuyer(e);
              if (e === null) {
                // setSelectedClient("");
                // setSelectedResaleBuying("");
                // setFreightValue(0);
                // setFreightCalculated(false);
              } else {
                if (e.type === 'dealer') {
                  // setSelectedClient("");
                  // setSelectedResaleBuying(e.value);
                } else {
                  // setSelectedClient(e.value);
                  // setSelectedResaleBuying("");
                }
                // getAddress(e.value, e.type);
              }
            }}
          />
        </div>
        <div>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => navigate('/clients/new')}
          >
            +
          </Button>
        </div>
      </div>
      {api.currentUser.AccessTypes[0] !== 'DEALER' && (
        <>
          <h5>Selecione o local de onde os itens serão enviados</h5>
          <FormControl>
            <RadioGroup
              defaultValue='outlined'
              name='radio-buttons-group'
              orientation='horizontal'
              value={stoke}
              onChange={handleChange}
            >
              <Radio
                color='success'
                orientation='horizontal'
                size='md'
                variant='solid'
                value='local'
                label='Estoque local'
              />
              <Radio
                color='success'
                orientation='horizontal'
                size='md'
                variant='solid'
                value='Transportadora'
                label='Transportadora'
              />
            </RadioGroup>
          </FormControl>
          {/*  */}
          {stoke === 'local' && (
            <>
              <h5 style={{ marginTop: '0.5rem' }}>Tipo de envio</h5>
              <FormControl>
                <RadioGroup
                  defaultValue='outlined'
                  name='radio-buttons-group'
                  orientation='horizontal'
                  value={otherSend}
                  onChange={(event) => setOtherSend(event.target.value)}
                >
                  <Radio
                    color='success'
                    orientation='horizontal'
                    size='md'
                    variant='solid'
                    value='mãos'
                    label='Entrega em mãos'
                  />
                  <Radio
                    color='success'
                    orientation='horizontal'
                    size='md'
                    variant='solid'
                    value='outros'
                    label='Outros'
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}
        </>
      )}

      {/*  */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
        <Button onClick={handleNext}>Próximo</Button>
      </div>
    </CardData>
  );
};
