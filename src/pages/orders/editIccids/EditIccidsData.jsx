/* eslint-disable react/prop-types */
import { Button } from '../../../../globalStyles';
import { CardData } from '../../resales/Resales.styles';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { translateError } from '../../../services/util';
import AsyncSelect from 'react-select/async';

export const EditIccidsData = ({ order, goBackStep, label }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState({});
  const [checked, setChecked] = useState([]);
  const [iccidsToSend, setIccidsToSend] = useState([]);

  const getOrderInfo = (id) => {
    api.order
      .getInfo(id)
      .then((res) => {
        // console.log(res.data[0]);
        const array = [];
        const checkedArray = [];
        res.data[0].OrderItems.forEach((oI) => {
          const array2 = [];
          const checkedArray2 = [];
          oI.ICCID.forEach((id) => {
            array2.push({
              value: id.Iccid,
              label: id.Iccid,
            });
            checkedArray2.push(true);
          });
          array.push(array2);
          checkedArray.push(checkedArray2);
        });
        // console.log(checkedArray);
        setIccidsToSend(array);
        setChecked(checkedArray);
        setOrderInfo(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
        // err.data.Problems;
      });
  };

  const loadIccids = async (search) => {
    // console.log(loadedOptions);
    const response = await api.iccid.getSome(1, 10, search);
    // console.log(response.data.meta);
    const ids = await response.data.iccids;
    const array = [];
    for (const id of ids) {
      if (
        (api.currentUser.AccessTypes[0] === 'TEGG' && id.DealerId === null) ||
        (api.currentUser.AccessTypes[0] === 'DEALER' &&
          id.Status === 'NOT USED')
      ) {
        array.push({
          value: id.Iccid,
          label: id.Iccid,
        });
      }
    }
    // console.log(array);

    return array;
  };

  const handleIccidChange = (oIndex, index, newValue) => {
    // console.log(newValue);
    let updatedValues = [...iccidsToSend];
    let updatedChecked = [...checked];
    updatedValues[oIndex][index] = newValue;
    updatedChecked[oIndex][index] = false;
    // console.log(updatedValues);
    // console.log(updatedChecked);
    setIccidsToSend(updatedValues);
    setChecked(updatedChecked);
  };

  const checkIccid = (oIndex, index) => {
    let exists = false;
    for (let i = 0; i < iccidsToSend.length; i++) {
      for (let j = 0; j < iccidsToSend[i].length; j++) {
        if (i !== oIndex && j !== index) {
          if (iccidsToSend[oIndex][index] === iccidsToSend[i][j]) {
            exists = true;
            break;
          }
        }
      }
    }
    if (exists) {
      toast.error('Esse ICCID já foi selecionado, escolha outro.');
    } else {
      toast.success('ICCID validado com sucesso');
      let updatedChecked = [...checked];
      // console.log(updatedChecked);
      updatedChecked[oIndex][index] = true;
      // console.log(updatedChecked);
      // console.log(iccidsToSend);
      setChecked(updatedChecked);
    }
  };

  const handleSendIccids = async () => {
    toast.info(
      'Aguarde enquanto os ICCIDS do pedido são atualizados, isso pode levar um tempo.'
    );
    setLoading(true);
    for (let i = 0; i < orderInfo.OrderItems.length; i++) {
      // console.log(orderInfo.OrderItems[i].Id, iccidsToSend[i]);
      const array = [];
      iccidsToSend[i].forEach((item) => {
        array.push(item.value);
      });
      try {
        await api.iccid.updateOrderItem(orderInfo.OrderItems[i].Id, array);
      } catch (err) {
        translateError(err);
        console.log(err);
      }
    }
    setLoading(false);
    toast.info('Iccids atualizados com sucesso.');
    navigate('/orders');
  };

  useEffect(() => {
    // console.log(order);
    // getFree(order);
    getOrderInfo(order);
  }, []);

  return (
    <CardData>
      <h3>{label}</h3>
      <br />
      {orderInfo.OrderItems?.map((oI, oIndex) => (
        <>
          {/* <h4>Item {oIndex + 1}</h4> */}
          {oI.ICCID.map((i, index) => (
            <div key={index} className='input_row_2'>
              <div style={{ width: '100%', display: 'flex' }}>
                <div className='input_80 mr' style={{ width: '86%' }}>
                  <AsyncSelect
                    // isClearable
                    value={iccidsToSend[oIndex][index]}
                    loadOptions={loadIccids}
                    defaultOptions
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPosition={'fixed'}
                    onChange={(e) => {
                      // console.log(e);
                      if (e !== null) {
                        handleIccidChange(oIndex, index, e);
                      } else {
                        handleIccidChange(oIndex, index, {
                          value: '',
                          label: '',
                        });
                      }
                    }}
                  />
                </div>
                <Button
                  // style={{ marginLeft: 10 }}
                  disabled={checked[oIndex][index]}
                  invert={checked[oIndex][index]}
                  onClick={() => checkIccid(oIndex, index)}
                >
                  {!checked[oIndex][index] ? 'CHECAR' : 'VALIDADO'}
                </Button>
              </div>
            </div>
          ))}
        </>
      ))}
      <div style={{ width: '100%', margin: '2rem' }}></div>
      <div className='flex end btn_invert'>
        <Button invert onClick={goBackStep}>
          VOLTAR
        </Button>
        <Button
          notHover
          onClick={() => {
            handleSendIccids();
          }}
        >
          {loading ? (
            <div className='loading'>
              <ReactLoading type={'bars'} color={'#fff'} />
            </div>
          ) : (
            'ENVIAR'
          )}
        </Button>
      </div>
    </CardData>
  );
};
