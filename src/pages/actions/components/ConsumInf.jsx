/* eslint-disable no-prototype-builtins */
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, ContainerWeb, PageLayout } from '../../../../globalStyles';
import { useEffect, useState } from 'react';
import { translateError } from '../../../services/util';
import api from '../../../services/api';
import { FormControl, Radio, RadioGroup } from '@mui/joy';
import { DatePicker } from '@mui/x-date-pickers';
import { TableItens } from '../../clients/new/NewClient.styles';
import { ConsumDataTable } from './ConsumDataTable';
import { ConsumSmsTable } from './ConsumSmsTable';
import { ConsumMinuteTable } from './ConsumMinuteTable';
import { Loading } from '../../../components/loading/Loading'

export const ConsumInf = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [line, setLine] = useState();
  const [plan, setPlan] = useState();
  const [type, setType] = useState('data');
  const [date, setDate] = useState(new Date());
  const [dataConsum, setDataConsum] = useState([]);
  const [smsConsum, setSmsConsum] = useState([]);
  const [minuteConsum, setMinuteConsum] = useState([]);
  const [loading, setLoading] = useState(false)

  const getDataConsumption = () => {
    if (line && plan) {
      api.line
        .getDataConsumption(
          Number(line),
          date.getFullYear(),
          date.getMonth() + 1
        )
        .then((res) => {
          const tConsum = [];
          if (res.data.consumption.hasOwnProperty('sucesso')) {
            for (const item of res.data.consumption.resultados) {
              tConsum.push({
                day: item.dtConsumo,
                down: item.qtUsadoDownload / (1024 * 1024),
                up: item.qtUsadoUpload / (1024 * 1024),
              });
            }
            setDataConsum(tConsum);
          }
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => setLoading(false));
    }
  };

  const getSmsConsumption = () => {
    if (line && plan) {
      api.line
        .getSmsConsumption(
          Number(line),
          date.getFullYear(),
          date.getMonth() + 1
        )
        .then((res) => {
          console.log(res);
          const tConsum = [];
          if (res.data.hasOwnProperty('sucesso')) {
            for (const item of res.data.resultados) {
              tConsum.push({
                day: item.dtConsumo,
                sms: item.qtUsado,
              });
            }
            setSmsConsum(tConsum);
          }
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => setLoading(false));
    }
  };

  const getMinuteConsumption = () => {
    if (line && plan) {
      api.line
        .getCallConsumption(
          Number(line),
          date.getFullYear(),
          date.getMonth() + 1
        )
        .then((res) => {
          console.log(res);
          const tConsum = [];
          if (res.data.hasOwnProperty('sucesso')) {
            for (const item of res.data.resultados) {
              tConsum.push({
                day: item.dtConsumo,
                minute: item.qtUsado,
              });
            }
            setMinuteConsum(tConsum);
          }
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (location?.state?.line) {
      setLine(location?.state?.line);
      setPlan(location?.state?.plan);
    }
  }, []);

  const cleanVariables = () => {
    setSmsConsum([]);
    setDataConsum([])
    setMinuteConsum([])
  }

  useEffect(() => {
    if (type === 'data') {
      cleanVariables()
      setLoading(true)
      getDataConsumption();
    } else if (type === 'sms') {
      cleanVariables()
      setLoading(true)
      getSmsConsumption();
    } else if (type === 'minute') {
      cleanVariables()
      setLoading(true)
      getMinuteConsumption();
    }
  }, [line, plan, date, type]);

  return (
    <>
    <Loading open={loading} msg={'Buscando...'} />
    <PageLayout>
      <Button style={{marginBottom: '1rem'}} onClick={() => navigate('/actions')}>Voltar</Button>
      <h3>Consumo</h3>
      <h4>Visualize o consumo de dados, minutos e sms.</h4>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          marginTop: '1rem',
        }}
      >
        <div>
          <h4>Tipo</h4>
          <div style={{ display: 'flex', color: 'green' }}>
            <FormControl>
              <RadioGroup
                defaultValue='outlined'
                name='radio-buttons-group'
                orientation='horizontal'
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <Radio
                  color='success'
                  orientation='horizontal'
                  size='md'
                  variant='solid'
                  value='data'
                  label='Dados'
                />
                <Radio
                  color='success'
                  orientation='horizontal'
                  size='md'
                  variant='solid'
                  value='minute'
                  label='Minutos'
                />
                <Radio
                  color='success'
                  orientation='horizontal'
                  size='md'
                  variant='solid'
                  value='sms'
                  label='SMS'
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div>
          <DatePicker
            views={['year', 'month']}
            disableFuture
            underlineStyle={{ display: 'none' }}
            size={'small'}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'standard',
                sx: {
                  px: 2,
                  border: '1px solid #00D959',
                  borderRadius: '8px',
                },
                InputProps: { disableUnderline: true },
              },
            }}
            value={date}
            onChange={(e) => setDate(e)}
          />
        </div>
      </div>
      <div style={{ width: '100%', marginTop: '1.5rem' }}>
        <ContainerWeb>
          <TableItens>
            {type === 'data' && (
              <>
                <tr>
                  <th>Data do consumo</th>
                  <th>Download</th>
                  <th>Upload</th>
                </tr>
                {dataConsum.length > 0 ? (
                  dataConsum.map((d, idx) => (
                    <ConsumDataTable key={idx} consum={d} />
                  ))
                ) : (
                  <tr>
                    <td colSpan='3'>
                      <div style={{ width: '100%', textAlign: 'center' }}>
                        Sem registro
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
            {type === 'minute' && (
              <>
                <tr>
                  <th>Data do consumo</th>
                  <th>Minutos</th>
                </tr>
                {minuteConsum.length > 0 ? (
                  minuteConsum.map((c, idx) => (
                    <ConsumMinuteTable consum={c} key={idx} />
                  ))
                ) : (
                  <tr>
                    <td colSpan='2'>
                      <div style={{ width: '100%', textAlign: 'center' }}>
                        Sem registro
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
            {type === 'sms' && (
              <>
                <tr>
                  <th>Data do consumo</th>
                  <th>Quantidade</th>
                </tr>
                {smsConsum.length > 0 ? (
                  smsConsum.map((s, idx) => (
                    <ConsumSmsTable key={idx} consum={s} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>
                      <div style={{ width: '100%', textAlign: 'center' }}>
                        Sem registro
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </TableItens>
        </ContainerWeb>
      </div>
    </PageLayout>
    </>
  );
};
