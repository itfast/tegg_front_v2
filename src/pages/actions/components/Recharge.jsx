import { useLocation, useNavigate } from "react-router-dom";
import { Button, PageLayout } from "../../../../globalStyles";
import { useEffect, useState } from "react";
import { formatPhone, translateError } from "../../../services/util";
import { OrderItens } from "../../recharges/newnew/OrderItens";
import { Loading } from "../../../components/loading/Loading";
import api from "../../../services/api";
import { toast } from "react-toastify";

export const RechargeAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [line, setLine] = useState();
  const [lineNumber, setLineNumber] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location?.state?.line) {
      setLine(location?.state?.line);
      setLineNumber(location?.state?.line?.IccidHistoric[0]?.SurfMsisdn);
      setName(location?.state?.client);
    }
  }, []);

  const handleCreateOrder = () => {
    setLoading(true);
    const array = [line?.Iccid];
    api.order
      .create(
        api.currentUser.AccessTypes[0] === "DEALER"
          ? api.currentUser.MyFinalClientId === line?.FinalClientId
            ? null
            : line?.FinalClientId
          : line?.FinalClientId,
        api.currentUser.AccessTypes[0] === "DEALER"
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
          console.log("adicionar item");
          api.order
            .addItem(plan.value.Id, 1, orderId, plan.value.Amount, array)
            .then(() => {
              // toast.success(res.data.Message);
              // navigate('/orders')
              api.order
                .pay(
                  orderId,
                  "UNDEFINED",
                  {
                    number: "",
                    expiry: "",
                    cvc: "",
                    name: "",
                    focus: "",
                  },
                  {
                    cep: "",
                    address: "",
                    complement: "",
                    number: "",
                    district: "",
                    city: "",
                    uf: "",
                  },
                  null
                )
                .then((res) => {
                  console.log(res);
                  window.open(res.data?.InvoiceUrl, "_black");
                  toast.success(res.data?.Message);
                  navigate("/actions");
                })
                .catch((err) => {
                  console.log(err?.response);
                  translateError(err);
                })
                .finally(() => {
                  setLoading(false);
                });
            })
            .catch((err) => {
              console.log(err);
              translateError(err);
            })
            .finally(() => setLoading(false));
        }
      })
      .catch((err) => {
        console.log(err.response);
        translateError(err);
        setLoading(false);
      });
  };

  return (
    <>
      <Loading open={loading} msg={"Criando pedido"} />
      <PageLayout>
        <Button
          style={{ marginBottom: "1rem" }}
          onClick={() => navigate("/actions")}
        >
          Voltar
        </Button>
        <h3>Recarga</h3>
        <h4>Faça um pedido de recarga com cobrança para: {name}</h4>
        <h4>Linha: {lineNumber && formatPhone(lineNumber)}</h4>
        <div style={{ marginTop: "1rem" }}>
          <OrderItens
            handleNextExt={handleCreateOrder}
            goBackStep={() => navigate("/actions")}
            selected={plan}
            setSelected={setPlan}
            isRecharge
            unicPlan={line}
          />
        </div>
      </PageLayout>
    </>
  );
};
