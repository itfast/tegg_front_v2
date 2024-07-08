import { useLocation, useNavigate } from 'react-router-dom';
import { Button, PageLayout } from '../../../../globalStyles';
import { useEffect, useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import {
  cleanNumber,
  documentFormat,
  formatPhone,
  phoneFormat,
  translateError,
  translateStatus,
} from '../../../services/util';
import api from '../../../services/api';
import { IoWarningOutline } from 'react-icons/io5';
import Select from 'react-select';
import { InputData } from '../../resales/Resales.styles';
import { Loading } from '../../../components/loading/Loading';
import { toast } from 'react-toastify';

export const BringNumber = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [number, setNumber] = useState('');
  const [portRequests, setPortRequests] = useState();
  const [line, setLine] = useState();
  const [name, setName] = useState(api.currentUser?.Name);
  const [cpf, setCpf] = useState(
    api.currentUser?.MyDocument && documentFormat(api.currentUser?.MyDocument)
  );
  const [oldNumber, setOldNumber] = useState();
  const [operator, setOperator] = useState();
  const [loading, setLoading] = useState(false);

  const loadLines = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    console.log(search);
    if (
      api.currentUser.AccessTypes[0] === 'CLIENT' ||
      api.currentUser.AccessTypes[0] === 'AGENT' //||
      // api.currentUser.AccessTypes[0] === 'DEALER'
    ) {
      const response = await api.line.myLines(
        vlr / 10 === 0 ? 1 : vlr / 10 + 1,
        10
      );
      console.log(response);
      const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
      const lines = await response.data.iccids;
      const array = [];
      for (const line of lines) {
        if (line?.IccidHistoric?.length > 0) {
          console.log(line);
          array.push({
            value: line,
            label: formatPhone(line?.IccidHistoric[0]?.SurfMsisdn),
          });
        }
      }
      return {
        options: array,
        hasMore,
      };
    } else {
      const response = await api.line.getLines(
        vlr / 10 === 0 ? 1 : vlr / 10 + 1,
        10,
        '',
        search,
        '',
        'Line'
      );
      const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
      const lines = await response.data.iccids;
      const array = [];
      for (const line of lines) {
        if (line?.IccidHistoric?.length > 0) {
          console.log(line);
          array.push({
            value: line,
            label: formatPhone(line?.IccidHistoric[0]?.SurfMsisdn),
          });
        }
      }
      return {
        options: array,
        hasMore,
      };
    }
  };

  // const getRequests = () => {
  //   // setLoading(true);
  //   api.line
  //     .getPortRequests(1, 10, '12996023366')
  //     .then((res) => {
  //       console.log(res)
  //       setPortRequests(res.data.portRequests);
  //       // setMaxPages(res.data.meta.totalPages || 1);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       // translateError(err);
  //     });
  //   //   .finally(() => {
  //   //     setLoading(false);
  //   //   });
  // };

  const createPortRequest = (window) => {
    api.line
      .createPortRequest(
        api.currentUser.DealerId,
        api.currentUser.MyFinalClientId,
        'PENDING',
        window,
        0,
        cleanNumber(oldNumber),
        cleanNumber(line?.label),
        operator.value,
        cleanNumber(cpf)
      )
      .then((res) => {
        toast.success(res.data.Message);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNext = () => {
    if (line) {
      if (name) {
        if (cpf) {
          if (oldNumber) {
            if (operator) {
              console.log(name, cpf, oldNumber, operator, line);
              setLoading(true);
              const msisdn = `55${line?.label}`
              api.line
                .portIn(
                  Number(cleanNumber(msisdn)),
                  Number(cleanNumber(oldNumber)),
                  operator.value,
                  cleanNumber(cpf),
                  name
                )
                .then((res) => {
                  console.log(res)
                  // toast.success(res.data.Message);
                  createPortRequest(
                    'res.data.Data.properties.janelaPortabilidade.slice(0, 10)'
                  );
                })
                .catch((err) => {
                  console.log(err);
                  translateError(err);
                })
                .finally(() => {
                  setLoading(false);
                });
            } else {
              toast.error('Operadora antiga deve ser informada');
            }
          } else {
            toast.error('Número a ser portado deve ser informado');
          }
        } else {
          toast.error('Documento deve ser informado');
        }
      } else {
        toast.error('Nome completo deve ser informado');
      }
    } else {
      toast.error('Escolha uma linha para receber o seu número');
    }
  };

  return (
    <PageLayout>
      <Loading open={loading} msg={'Trazendo número...'} />

      <h4>Traga meu número</h4>
      <h4>Traga meu número de outra operadora para o meu TEGG sem custo!</h4>
      <div style={{ maxWidth: 800, margin: 'auto' }}>
        {(!portRequests || portRequests.length === 0) && (
          <>
            {/* <div className='input_row_2'> */}
            <div className='input' style={{ marginTop: '1rem' }}>
              <label>LINHA</label>
              <AsyncPaginate
                defaultOptions
                // cacheUniqs={selectedSinCard}
                placeholder='Selecione a linha'
                noOptionsMessage={() => 'SEM LINHAS'}
                value={line}
                loadOptions={loadLines}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={'fixed'}
                onChange={setLine}
              />
            </div>
            {/* </div> */}
            <div>
              <div
                style={{
                  display: window.innerWidth > 768 && 'flex',
                  alignItems: 'center',
                  // marginTop: '1rem'
                }}
              >
                <h5 style={{ marginRight: '0.2rem' }}>NOME COMPLETO</h5>
              </div>

              <div>
                <InputData
                  id='name'
                  type='text'
                  placeholder='Nome completo'
                  style={{ width: '100%' }}
                  disabled
                  // className="input_2"
                  // defaultValue={1}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: window.innerWidth > 768 && 'flex',
                  alignItems: 'center',
                }}
              >
                <h5 style={{ marginRight: '0.2rem' }}>CPF/CNPJ</h5>
              </div>

              <div>
                <InputData
                  id='document'
                  type='text'
                  placeholder='CPF/CNPJ'
                  style={{ width: '100%' }}
                  disabled
                  // className="input_2"
                  // defaultValue={1}
                  value={cpf}
                  onChange={(e) => setCpf(documentFormat(e.target.value))}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  // display: window.innerWidth > 768 && 'flex',
                  alignItems: 'center',
                }}
              >
                <h5 style={{ marginRight: '0.2rem' }}>NÚMERO A SER PORTADO</h5>
              </div>
              <div>
                <InputData
                  id='phone'
                  placeholder='Número a ser portado'
                  style={{ width: '100%' }}
                  // className="input_2"
                  // defaultValue={1}
                  value={oldNumber}
                  onChange={(e) => setOldNumber(phoneFormat(e.target.value))}
                />
              </div>
            </div>
            <div
              style={{
                // display: window.innerWidth < 768 && 'flex',
                alignItems: 'center',
              }}
            >
              <h5 style={{ marginRight: '0.2rem' }}>OPERADORA ANTIGA</h5>
              <div>
                <Select
                  options={[
                    { label: 'Algar', value: 'ALGAR' },
                    { label: 'Claro', value: 'CLARO' },
                    { label: 'Oi', value: 'OI' },
                    { label: 'Sercomtel', value: 'SERCOMTEL' },
                    { label: 'Tim', value: 'TIM' },
                    { label: 'Vivo', value: 'VIVO' },
                  ]}
                  // isMulti
                  isSearchable={false}
                  placeholder='Selecione...'
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPlacement='top'
                  value={operator}
                  onChange={setOperator}
                />
              </div>
            </div>
            <div
              style={{
                width: '100%',
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button onClick={handleNext}>Solicitar</Button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};
