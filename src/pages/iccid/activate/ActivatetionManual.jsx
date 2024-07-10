import { useEffect, useState } from 'react';
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from '../../../../globalStyles';

import Select from 'react-select';
import api from '../../../services/api';
import {
  cleanNumber,
  documentFormat,
  translateError,
  validateIccid,
} from '../../../services/util';
import { InputData } from '../../resales/Resales.styles';
import { toast } from 'react-toastify';
import { Loading } from '../../../components/loading/Loading';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageTitles } from '../../../components/PageTitle/PageTitle';

export const ActivationManual = () => {
  const [loading, setLoading] = useState(false);
  const [ddd, setDdd] = useState();
  const [cpf, setCpf] = useState();
  const [iccid, setIccid] = useState('');
  const [planOpt, setPlanOpt] = useState([]);
  const [plan, setPlan] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [msg, setMsg] = useState('Ativando...');
  const [hasPlan, setHasPlan] = useState(true);
  const [iccidPlan, setIccidPlan] = useState();
  const [canAtiv, setCanAtiv] = useState(false);
  const [line, setLine] = useState();

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] === 'CLIENT') {
      navigate('/');
    }
    if (location.state?.document) {
      setCpf(documentFormat(location.state?.document));
      setLine(location.state.line);
    }
    console.log(location.state)
    if (location?.state?.iccid) {
      setIccid(location?.state?.iccid)
      setCpf(documentFormat(location.state?.clientDocument))
      setLine({FinalClientId: location.state.finalClientId})
      console.log('location?.state?.iccid', location?.state?.iccid)
      handleSearch(location?.state?.iccid)
    }
  }, []);

  const handleActivate = () => {
    console.log('ativar', iccidPlan);
    if (iccidPlan) {
      setMsg('Ativando...');
      setLoading(true);
      api.iccid
        .activate(iccid, iccidPlan, cleanNumber(cpf), ddd)
        .then((res) => {
          toast.success(res?.data?.Message);
          // setShow(false);
          setDdd();
          setCpf();
          setPlan();
          setIccid('');
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      // const array = [line?.Iccid];
      api.iccid
        .payAndActivate(
          iccid,
          plan?.surfId,
          cleanNumber(cpf),
          ddd,
          'UNDEFINED',
          null,
          null,
          null,
          line?.FinalClientId
        )
        .then((res) => {
          window.open(res.data?.InvoiceUrl, '_black');
          toast.success(res.data?.Message);
          if(location?.state?.iccid){
            navigate('/orders');
          }else{
            navigate('/actions');
          }
          
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    api.plans
      .getByRecharge()
      .then((res) => {
        res.data.sort((a, b) => {
          return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
        });
        const array = [];
        res.data?.forEach((p) => {
          if (!p.OnlyInFirstRecharge) {
            array.push({
              value: p.Id,
              label: p.Name,
              surfId: p.Products[0]?.Product?.SurfId,
            });
          }
        });
        // setOriginPlans(array);
        setPlanOpt(array);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = (i) => {
    const myIccid = i || iccid
    console.log('validando iccid', myIccid)
    const res = validateIccid(myIccid);
    if (res) {
      setCanAtiv(false);
      setMsg('Buscando Iccid');
      setLoading(true);
      api.iccid
        .getAllTeste(1, 10, 'all', myIccid, '', '')
        .then((res) => {
          if (res.data?.iccids?.length > 0) {
            if (
              res.data?.iccids[0]?.Status !== 'NOT USED' &&
              res.data?.iccids[0]?.Status !== 'AVAILABLE'
            ) {
              toast.error('Iccid em status que não permite a ativação');
            } else {
              if (res.data?.iccids[0]?.AwardedSurfPlan) {
                if (ddd) {
                  setCanAtiv(true);
                }
                setIccidPlan(res.data?.iccids[0]?.AwardedSurfPlan);
                toast.success('Iccid já contem um plano lincado');
              } else {
                setHasPlan(false);
              }
            }
          } else {
            toast.error('Iccid não localizado em sua base');
          }
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error('Informe um ICCID válido');
    }
  };

  return (
    <>
      <ContainerWeb>
        <Loading open={loading} msg={msg} />
        <PageLayout>
          <PageTitles title='Ativar nova linha' />
          {location?.state?.document && (
            <Button
              style={{ marginBottom: '1rem' }}
              onClick={() => navigate('/actions')}
            >
              Voltar
            </Button>
          )}
          <div style={{ width: '100%' }}>
            <div
              style={{
                width: window.innerWidth > 768 && '800px',
                margin: 'auto',
              }}
            >
              <h4>Informe os dados abaixo</h4>
              <h5 style={{ marginTop: '0.5rem' }}>ICCID</h5>
              <div style={{ display: 'flex', gap: 10 }}>
                <InputData
                  id='iccid'
                  type='number'
                  style={{ width: '100%' }}
                  placeholder='ICCID'
                  pattern='\d*'
                  maxLength={19}
                  value={iccid}
                  onChange={(e) => setIccid(e.target.value)}
                />
                <Button onClick={() => handleSearch()} >Buscar</Button>
              </div>
              {!hasPlan && (
                <>
                  <h5>Plano</h5>
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <Select
                      options={planOpt}
                      placeholder='Selecione...'
                      value={plan}
                      onChange={(e) => {
                        if (ddd) {
                          setCanAtiv(true);
                        }
                        setPlan(e);
                      }}
                    />
                  </div>
                </>
              )}
              <h5 style={{ marginTop: '0.5rem' }}>DDD</h5>
              <InputData
                id='ddd'
                type='text'
                style={{ width: '100%' }}
                placeholder='DDD'
                pattern='\d*'
                maxLength={2}
                value={ddd}
                onChange={(e) => {
                  if (e.target.value?.length === 2 && (iccidPlan || plan)) {
                    setCanAtiv(true);
                  }
                  setDdd(e.target.value);
                }}
              />
              <h5>Documento</h5>
              <InputData
                id='cpf'
                style={{ width: '100%' }}
                placeholder='CPF/CNPJ'
                // style={{ width: 250 }}
                value={cpf}
                onChange={(e) => setCpf(documentFormat(e.target.value))}
              />
              <div className='flex end btn_invert'>
                <Button
                  // notHover
                  disabled={!canAtiv}
                  onClick={canAtiv && handleActivate}
                  style={{ width: window.innerWidth < 768 && '100%' }}
                >
                  ATIVAR
                </Button>
              </div>
            </div>
          </div>
        </PageLayout>
      </ContainerWeb>
      <ContainerMobile>
        <Loading open={loading} msg={'Ativando...'} />
        <PageLayout>
          <PageTitles title='Ativar nova linha' />
          {location?.state?.document && (
            <Button
              style={{ marginBottom: '1rem' }}
              onClick={() => navigate('/actions')}
            >
              Voltar
            </Button>
          )}
          <div style={{ width: '100%' }}>
            <div
              style={{
                width: window.innerWidth > 768 && '800px',
                margin: 'auto',
              }}
            >
              <h4>Informe os dados abaixo</h4>
              <h5 style={{ marginTop: '0.5rem' }}>ICCID</h5>
              <div style={{ display: 'flex', gap: 10 }}>
                <InputData
                  id='iccid'
                  type='number'
                  style={{ width: '100%' }}
                  placeholder='ICCID'
                  pattern='\d*'
                  maxLength={19}
                  value={iccid}
                  onChange={(e) => setIccid(e.target.value)}
                />
                <Button onClick={() => handleSearch()} style={{padding: 10, paddingRight: 20}}>Buscar</Button>
              </div>
              {!hasPlan && (
                <>
                  <h5>Plano</h5>
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <Select
                      options={planOpt}
                      placeholder='Selecione...'
                      value={plan}
                      onChange={(e) => {
                        if (ddd) {
                          setCanAtiv(true);
                        }
                        setPlan(e);
                      }}
                    />
                  </div>
                </>
              )}
              <h5 style={{ marginTop: '0.5rem' }}>DDD</h5>
              <InputData
                id='ddd'
                type='text'
                style={{ width: '100%' }}
                placeholder='DDD'
                pattern='\d*'
                maxLength={2}
                value={ddd}
                onChange={(e) => {
                  if (e.target.value?.length === 2 && (iccidPlan || plan)) {
                    setCanAtiv(true);
                  }
                  setDdd(e.target.value);
                }}
              />
              <h5>Documento</h5>
              <InputData
                id='cpf'
                style={{ width: '100%' }}
                placeholder='CPF/CNPJ'
                // style={{ width: 250 }}
                value={cpf}
                onChange={(e) => setCpf(documentFormat(e.target.value))}
              />
              <div className='flex end btn_invert'>
                <Button
                  // notHover
                  disabled={!canAtiv}
                  onClick={canAtiv && handleActivate}
                  style={{ width: window.innerWidth < 768 && '100%' }}
                >
                  ATIVAR
                </Button>
              </div>
            </div>
          </div>
        </PageLayout>
        {/* <PageLayout>
        <PageTitles title="Ativar nova linha" />
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: window.innerWidth > 768 && "800px",
                margin: "auto",
              }}
            >
              <h4>Informe os dados abaixo</h4>
              <h5>Plano</h5>
              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <Select
                  options={planOpt}
                  placeholder="Selecione..."
                  value={plan}
                  onChange={(e) => {
                    setPlan(e);
                  }}
                />
              </div>
              <h5 style={{ marginTop: "0.5rem" }}>ICCID</h5>
              <InputData
                id="iccid"
                type="text"
                style={{ width: "100%" }}
                placeholder="ICCID"
                pattern="\d*"
                maxLength={19}
                value={iccid}
                onChange={(e) => setIccid(e.target.value)}
              />
              <h5 style={{ marginTop: "0.5rem" }}>DDD</h5>
              <InputData
                id="ddd"
                type="text"
                style={{ width: "100%" }}
                placeholder="DDD"
                pattern="\d*"
                maxLength={2}
                value={ddd}
                onChange={(e) => setDdd(e.target.value)}
              />
              <h5>Documento</h5>
              <InputData
                id="cpf"
                style={{ width: "100%" }}
                placeholder="CPF/CNPJ"
                // style={{ width: 250 }}
                value={cpf}
                onChange={(e) => setCpf(documentFormat(e.target.value))}
              />
              <div className="flex end btn_invert">
                <Button
                  notHover
                  onClick={handleActivate}
                  style={{ width: window.innerWidth < 768 && "100%" }}
                >
                  ATIVAR
                </Button>
              </div>
            </div>
          </div>
        </PageLayout> */}
      </ContainerMobile>
    </>
  );
};
