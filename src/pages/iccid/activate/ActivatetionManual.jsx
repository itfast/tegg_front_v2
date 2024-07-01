import { useEffect, useState } from "react";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../../globalStyles";

import Select from "react-select";
import api from "../../../services/api";
import {
  cleanNumber,
  documentFormat,
  translateError,
  validateIccid,
} from "../../../services/util";
import { InputData } from "../../resales/Resales.styles";
import { toast } from "react-toastify";
import { Loading } from "../../../components/loading/Loading";
import { useNavigate, useLocation } from "react-router-dom";
import { PageTitles } from '../../../components/PageTitle/PageTitle'

export const ActivationManual = () => {
  const [loading, setLoading] = useState(false);
  const [ddd, setDdd] = useState();
  const [cpf, setCpf] = useState();
  const [iccid, setIccid] = useState("");
  const [planOpt, setPlanOpt] = useState([]);
  const [plan, setPlan] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [msg, setMsg] = useState("Ativando...");
  const [hasPlan, setHasPlan] = useState(true);
  const [iccidPlan, setIccidPlan] = useState();
  const [canAtiv, setCanAtiv] = useState(false);
  const [line, setLine] = useState();

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] === "CLIENT") {
      navigate("/");
    }
    if (location.state?.document) {
      setCpf(documentFormat(location.state?.document));
      setLine(location.state.line);
    }
  }, []);

  const handleActivate = () => {
    if (iccidPlan) {
      setMsg("Ativando...");
      setLoading(true);
      api.iccid
        .activate(iccid, iccidPlan, cleanNumber(cpf), ddd)
        .then((res) => {
          toast.success(res?.data?.Message);
          // setShow(false);
          setDdd();
          setCpf();
          setPlan();
          setIccid("");
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
          "UNDEFINED",
          null,
          null,
          null,
          line?.FinalClientId
        )
        .then((res) => {
          window.open(res.data?.InvoiceUrl, "_black");
          toast.success(res.data?.Message);
          navigate("/actions");
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
          if(!p.OnlyInFirstRecharge){
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

  const handleSearch = () => {
    const res = validateIccid(iccid);
    if (res) {
      setCanAtiv(false);
      setMsg("Buscando Iccid");
      setLoading(true);
      api.iccid
        .getAllTeste(1, 10, "all", iccid, "", "")
        .then((res) => {
          if (res.data?.iccids?.length > 0) {
            if (
              res.data?.iccids[0]?.Status !== "NOT USED" &&
              res.data?.iccids[0]?.Status !== "AVAILABLE"
            ) {
              toast.error("Iccid em status que não permite a ativação");
            } else {
              if (res.data?.iccids[0]?.AwardedSurfPlan) {
                if (ddd) {
                  setCanAtiv(true);
                }
                setIccidPlan(res.data?.iccids[0]?.AwardedSurfPlan);
                toast.success("Iccid já contem um plano lincado");
              } else {
                setHasPlan(false);
              }
            }
          } else {
            toast.error("Iccid não localizado em sua base");
          }
        })
        .catch((err) => translateError(err))
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.error("Informe um ICCID válido");
    }
  };

  return (
    <>
      <ContainerWeb>
        <Loading open={loading} msg={msg} />
        <PageLayout>
          <PageTitles title="Ativar nova linha" />
          {location?.state?.document && (
            <Button
              style={{ marginBottom: "1rem" }}
              onClick={() => navigate("/actions")}
            >
              Voltar
            </Button>
          )}
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: window.innerWidth > 768 && "800px",
                margin: "auto",
              }}
            >
              <h4>Informe os dados abaixo</h4>
              <h5 style={{ marginTop: "0.5rem" }}>ICCID</h5>
              <div style={{ display: "flex", gap: 10 }}>
                <InputData
                  id="iccid"
                  type="number"
                  style={{ width: "100%" }}
                  placeholder="ICCID"
                  pattern="\d*"
                  maxLength={19}
                  value={iccid}
                  onChange={(e) => setIccid(e.target.value)}
                />
                <Button onClick={handleSearch}>Buscar</Button>
              </div>
              {!hasPlan && (
                <>
                  <h5>Plano</h5>
                  <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <Select
                      options={planOpt}
                      placeholder="Selecione..."
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
              <h5 style={{ marginTop: "0.5rem" }}>DDD</h5>
              <InputData
                id="ddd"
                type="text"
                style={{ width: "100%" }}
                placeholder="DDD"
                pattern="\d*"
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
                id="cpf"
                style={{ width: "100%" }}
                placeholder="CPF/CNPJ"
                // style={{ width: 250 }}
                value={cpf}
                onChange={(e) => setCpf(documentFormat(e.target.value))}
              />
              <div className="flex end btn_invert">
                {/* <Button
                // onClick={goBack}
                style={{ width: window.innerWidth < 768 && '100%' }}
              >
                VOLTAR
              </Button> */}
                <Button
                  // notHover
                  disabled={!canAtiv}
                  onClick={canAtiv && handleActivate}
                  style={{ width: window.innerWidth < 768 && "100%" }}
                >
                  ATIVAR
                </Button>
              </div>
            </div>
            {/* <NewActivateClient
              setShow={setShow}
              iccid={''}
              search={search}
              tmpActivate={tmpActivate}
            /> */}
          </div>
          {/* {api.currentUser.AccessTypes[0] === 'TEGG' && (
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'end',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3>ICCID:</h3>
                <InputData
                  id='iccid'
                  type='text'
                  placeholder='Iccid'
                  value={iccid}
                  onChange={(e) => setIccid(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setPageNum(1);
                    search();
                  }}
                >
                  Buscar
                </Button>
              </div>
            </div>
          )} */}
          {/* <TableActivation activations={activations} search={search} />
          {!loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <Stack
                spacing={2}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Pagination
                  count={maxPages}
                  page={pageNum}
                  onChange={handlePageChange}
                  variant='outlined'
                  shape='rounded'
                />
                <div style={{ display: 'flex', gap: 5 }}>
                  <p>Itens por página:</p>
                  <select
                    name='pages'
                    id='page-select'
                    value={pageSize}
                    onChange={(e) => {
                      handlePageSizeChange(e);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </Stack>
            </div>
          )} */}
        </PageLayout>
      </ContainerWeb>
      <ContainerMobile>
        <Loading open={loading} msg={"Ativando..."} />
        <PageLayout>
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
                {/* <Button
                // onClick={goBack}
                style={{ width: window.innerWidth < 768 && '100%' }}
              >
                VOLTAR
              </Button> */}
                <Button
                  notHover
                  onClick={handleActivate}
                  style={{ width: window.innerWidth < 768 && "100%" }}
                >
                  ATIVAR
                </Button>
              </div>
            </div>
            {/* <NewActivateClient
              setShow={setShow}
              iccid={''}
              search={search}
              tmpActivate={tmpActivate}
            /> */}
          </div>
          {/* {api.currentUser.AccessTypes[0] === 'TEGG' && (
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'end',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3>ICCID:</h3>
                <InputData
                  id='iccid'
                  type='text'
                  placeholder='Iccid'
                  value={iccid}
                  onChange={(e) => setIccid(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setPageNum(1);
                    search();
                  }}
                >
                  Buscar
                </Button>
              </div>
            </div>
          )} */}
          {/* <TableActivation activations={activations} search={search} />
          {!loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <Stack
                spacing={2}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Pagination
                  count={maxPages}
                  page={pageNum}
                  onChange={handlePageChange}
                  variant='outlined'
                  shape='rounded'
                />
                <div style={{ display: 'flex', gap: 5 }}>
                  <p>Itens por página:</p>
                  <select
                    name='pages'
                    id='page-select'
                    value={pageSize}
                    onChange={(e) => {
                      handlePageSizeChange(e);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </Stack>
            </div>
          )} */}
        </PageLayout>
      </ContainerMobile>
    </>
  );
};
