import { useEffect, useState } from "react";
import { Button, PageLayout } from "../../../../globalStyles";
import { useLocation, useNavigate } from "react-router-dom";
import { translateError } from "../../../services/util";
import api from "../../../services/api";
import { RechargeCard } from "../../recharges/RechargeCard";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Loading } from "../../../components/loading/Loading";
import { toast } from "react-toastify";

export const ChangePlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planOpt, setPlanOpt] = useState([]);
  const [plan, setPlan] = useState();
  const [selected, setSelected] = useState();
  const [modal, setModal] = useState(false);
  const [line, setLine] = useState();
  const [loading, setLoading] = useState(false)
  const [tmp, setTmp] = useState();

  const loadPlans = async (myPlan) => {
    api.plans
      .getByRecharge()
      .then((res) => {
        res.data.sort((a, b) => {
          return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
        });
        const filtered = res.data.filter((d) => !d.OnlyInFirstRecharge);
        const findPlan = res.data.find(
          (p) => p?.Products[0]?.Product?.SurfId === myPlan?.toString()
        );

        if (findPlan) {
          setSelected({
            label: findPlan.Name,
            value: myPlan,
          });
        }
        setPlanOpt(filtered);
      })
      .catch((err) => {
        translateError(err);
      });
  };

  useEffect(() => {
    if (location?.state?.line) {
      setPlan(location?.state?.plan);
      setLine(location?.state?.line);
      // const planName = translatePlanType(location?.state?.plan)
      // setSelected({label: planName, value: location?.state?.plan});
      loadPlans(location?.state?.plan);
    }
  }, []);

  // const sendNewPlan = () => {
  //   setLoading(true)
  //   api.order.onlyRecharge(line, tmp?.value?.Products[0].Product?.SurfId)
  //   .then(() => {
  //     toast.success('Plano alterado com sucesso.')
  //     setSelected(tmp)
  //     setModal(false)
  //   })
  //   .catch((err) => translateError(err))
  //   .finally(() => setLoading(false))
  // };

  const handleCreateOrder = () => {
    setLoading(true);
    const array = [line?.Iccid];
    api.order
      .create(
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser.MyFinalClientId === line?.FinalClientId
            ? null
            : line?.FinalClientId
          : line?.FinalClientId,
        api.currentUser.AccessTypes[0] === 'DEALER'
          ? api.currentUser.MyFinalClientId === line?.FinalClientId
            ? api.currentUser.DealerId
            : null
          : null,
        1,
        false,
        null,
        null,
        false
      )
      .then((res) => {
        if (res.status == 201) {
          setLoading(true);
          let orderId = res.data.OrderId;
          api.order
            .addItem(tmp.value.Id, 1, orderId, tmp.value.Amount, array)
            .then(() => {
              // toast.success(res.data.Message);
              // navigate('/orders')
              // const handleQrcode = () => {
                // setMsg('Gerando fatura...')
                // setLoading(true);
                api.order
                  .pay(
                    orderId,
                    'UNDEFINED',
                    {
                      number: '',
                      expiry: '',
                      cvc: '',
                      name: '',
                      focus: '',
                    },
                    {
                      cep: '',
                      address: '',
                      complement: '',
                      number: '',
                      district: '',
                      city: '',
                      uf: '',
                    },
                    null
                  )
                  .then((res) => {
                    console.log(res)
                    window.open(res.data?.InvoiceUrl, '_black')
                    toast.success(res.data?.Message);
                    navigate('/actions')
                  })
                  .catch((err) => {
                    console.log(err?.response);
                    translateError(err);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              // };
            })
            .catch((err) => {
              console.log(err);
              translateError(err);
            })
            .finally(() => setLoading(false));
        }
      })
      .catch((err) => {
        console.log(err.response)
        translateError(err);
        setLoading(false);
      });
  };

  return (
    <>
      <PageLayout>
        <Button
          style={{ marginBottom: "1rem" }}
          onClick={() => navigate("/actions")}
        >
          Voltar
        </Button>
        <h3>Alterar plano</h3>
        <h4>Altere o plano atual da linha</h4>
        <div>
          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <div
              style={{
                marginTop: 40,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                gap: 10,
              }}
            >
              {planOpt?.map((p) => (
                <RechargeCard
                  key={p.Id}
                  disabled
                  plan={p}
                  name={p?.Name}
                  size={p?.Size}
                  internet={p?.Internet}
                  extra={p?.Extra}
                  extraPortIn={p?.ExtraPortIn}
                  free={p?.Free?.split(" ")}
                  price={p?.Amount}
                  comments={p?.Comments}
                  selected={selected?.label === p?.Name}
                  onClick={() => {
                    setTmp({ label: p?.Name, value: p });
                    setModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
      <Dialog open={modal} fullWidth size="md" onClose={() => setModal(false)}>
        <Loading open={loading} msg={"Trocando plano..."} />
        <DialogTitle id="alert-dialog-title">Alterar plano</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente alterar do plano {selected?.label} para o plano{" "}
            {tmp?.label}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModal(false)}>
            CANCELAR
          </Button>
          <Button onClick={handleCreateOrder}>ALTERAR</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
