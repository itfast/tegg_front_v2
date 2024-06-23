/* eslint-disable react/prop-types */
import { Button } from '../../../../globalStyles';
import { CardData } from '../../resales/Resales.styles';
import ReactLoading from 'react-loading';
import AsyncSelect from 'react-select/async';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { translateError } from '../../../services/util';

export const RechargeData = ({ plan, goBackStep, label }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedIccid, setSelectedIccid] = useState('');
  const [clientId, setClientId] = useState('');

  const translateValue = (value) => {
    let converted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));
    return converted;
  };

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

  const loadLines = async (search) => {
    const array = [];
    console.log(api.currentUser);
    if (api.currentUser.AccessTypes[0] === 'CLIENT') {
      const response = await api.line.myLines(1, 20);
      // console.log(response.data);
      const lines = await response.data.iccids;
      if (lines.length !== 0) {
        for (const l of lines) {
          if (l.IccidHistoric[0]?.SurfMsisdn) {
            array.push({
              value: l?.IccidHistoric?.[0]?.SurfMsisdn,
              label: formatPhone(l?.IccidHistoric?.[0]?.SurfMsisdn),
              client: l.FinalClientId,
              iccid: l.Iccid,
            });
          }
        }
      }
    } else if (api.currentUser.AccessTypes[0] === 'TEGG') {
      const response = await api.line.getLines(1, 20, '', search);
      const lines = await response.data.iccids;
      console.log(lines);
      if (lines.length !== 0) {
        for (const l of lines) {
          array.push({
            value: l?.IccidHistoric?.[0]?.SurfMsisdn,
            label: formatPhone(l?.IccidHistoric?.[0]?.SurfMsisdn),
            client: l.FinalClientId,
            iccid: l.Iccid,
          });
        }
      }
    } else if (api.currentUser.AccessTypes[0] === 'DEALER') {
      const response = await api.line.getLines(
        1,
        20,
        api.currentUser.DealerId,
        search
      );
      const response2 = await api.line.myLines(1, 20);
      const lines = await response.data.iccids;
      const lines2 = await response2.data.iccids;
      const clientsLines = {
        label: 'Linhas clientes',
        options: [],
      };
      const personalLines = {
        label: 'Linhas pessoais',
        options: [],
      };
      if (lines.length !== 0) {
        for (const l of lines) {
          clientsLines.options.push({
            value: l.SurfMsisdn,
            label: formatPhone(l.SurfMsisdn),
            client: l.FinalClientId,
            iccid: l.Iccid,
          });
        }
        array.push(clientsLines);
      }
      if (lines2.length !== 0) {
        for (const l of lines2) {
          personalLines.options.push({
            value: l.SurfMsisdn,
            label: formatPhone(l.SurfMsisdn),
            client: l.FinalClientId,
            iccid: l.Iccid,
          });
        }
        array.push(personalLines);
      }
    }
    return array;
  };

  console.log(api.currentUser);

  const createOrder = () => {
    toast.info('Aguarde enquanto é gerado um pedido de recarga...');
    const array = [selectedIccid];
    api.order
      .create(
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser.MyFinalClientId === clientId
            ? null
            : clientId
          : clientId,
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser.MyFinalClientId === clientId
            ? api.currentUser.DealerId
            : null
          : null,
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser.MyFinalClientId === clientId
            ? null
            : api.currentUser.DealerId
          : api.currentUser.AccessTypes[0] === 'CLIENT'
          ? api.currentUser.MyDealerId || null
          : null,
        api.currentUser.Type === 'TEGG' ? 2 : 1,
        false,
        0
      )
      .then((res) => {
        if (res.status == 201) {
          setLoading(true);
          let orderId = res.data.OrderId;
          console.log(plan);
          console.log('plano');
          api.order
            .addItem(plan.Id, 1, orderId, plan.Amount, array)
            .then((res) => {
              toast.success(res.data.Message);
              if (
                (api.currentUser.AccessTypes[0] === 'DEALER' &&
                  api.currentUser.MyFinalClientId === clientId) ||
                api.currentUser.AccessTypes[0] === 'CLIENT'
              ) {
                navigate(`/recharge/pay/${orderId}`);
              } else {
                navigate(`/orders`);
              }
            })
            .catch((err) => {
              console.log(err);
              translateError(err);
              translateError(err);
            })
            .finally(() => setLoading(false));
        } else {
          toast.error(
            'Não foi possível gerar o pedido de recarga, tente novamente em alguns instantes'
          );
        }
      })
      .catch((err) => {
        toast.error(
          'Não foi possível gerar o pedido de recarga, tente novamente em alguns instantes'
        );
        translateError(err);
        setLoading(false);
      });
  };

  const handleNext = () => {
    // console.log(selectedClient === "" && selectedResaleBuying === "");
    if (selectedLine !== '') {
      createOrder();
    } else {
      toast.error('Escolha uma linha para realizar a recarga');
    }
  };

  useEffect(() => {
    // console.log(plan);
    // console.log(api.currentUser);
  }, []);

  return (
    <CardData>
      <h2>{label}</h2>
      <br />
      <div className='input_container'>
        <div className='input'>
          <>
            <label className='bold' style={{ fontSize: '1em' }}>
              LINHA
            </label>
            <AsyncSelect
              loadOptions={loadLines}
              placeholder='Selecionar...'
              defaultOptions
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={'fixed'}
              isClearable
              onChange={(e) => {
                // console.log(e);
                if (e === null) {
                  setSelectedLine('');
                  setClientId('');
                  setSelectedIccid('');
                } else {
                  setSelectedLine(e.value);
                  setClientId(e.client);
                  setSelectedIccid(e.iccid);
                }
              }}
            />
          </>
        </div>
      </div>
      {Object.keys(plan).length !== 0 && (
        <div className='input_container'>
          <div className='tb mr'>
            <label className='bold' style={{ fontSize: '1em' }}>
              DETALHES DO PLANO
            </label>
            <table>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
              </tr>
              <tr>
                <td>{plan.Name}</td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p>{translateValue(plan.Products[0].Product.Amount)}</p>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      )}
      <div className='flex end btn_invert'>
        <Button invert onClick={goBackStep}>
          VOLTAR
        </Button>
        <Button notHover onClick={handleNext}>
          {loading ? (
            <div className='loading'>
              <ReactLoading type={'bars'} color={'#fff'} />
            </div>
          ) : (
            'CRIAR'
          )}
        </Button>
      </div>
    </CardData>
  );
};
