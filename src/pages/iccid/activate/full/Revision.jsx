import { toast } from "react-toastify";
// import { Button } from '../../../../globalStyles';
// import api from '../../../services/api';
import { translateError } from "../../../../services/util";
import { CardData } from "./NewOrder.styles";
import { useState } from "react";
import ReactLoading from "react-loading";
import { RechargeCard } from "../../../recharges/RechargeCard";
import api from "../../../../services/api";
import { Button } from "../../../../../globalStyles";
// import { RechargeCard } from '../RechargeCard';
/* eslint-disable react/prop-types */
export const Revision = ({
  goBackStep,
  handleNext,
  tmpActivate,
  plan,
  ddd,
  cpf,
  iccid,
  setOrderId,
  orderId,
}) => {
  const [loading, setLoading] = useState(false);
  console.log(iccid);
  const handleCreateOrder = () => {
    handleNext();
    // setLoading(true);
    // toast.info("Aguarde enquanto é gerado um pedido...");
    // const array = [line?.value?.Iccid];
    // const array = [iccid];

    // console.log(plan.value.Id, 1, "orderId", plan.value.Amount, array);

    // if (orderId) {
    //   setLoading(true);
    //   api.order
    //     .addItem(plan.value.Id, 1, orderId, plan.value.Amount, array)
    //     .then((res) => {
    //       toast.success(res.data.Message);
    //       handleNext();
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       translateError(err);
    //       translateError(err);
    //     })
    //     .finally(() => setLoading(false));
    // } else {
    //   api.order
    //     .create(
    //       api.currentUser.MyFinalClientId,
    //       api.currentUser.MyDealerId,
    //       1,
    //       false,
    //       0,
    //       0,
    //       false
    //     )
    //     .then((res) => {
    //       if (res.status == 201) {
    //         setLoading(true);
    //         let orderId = res.data.OrderId;
    //         setOrderId(res.data.OrderId);
    //         api.order
    //           .addItem(plan.value.Id, 1, orderId, plan.value.Amount, array)
    //           .then((res) => {
    //             toast.success(res.data.Message);
    //             handleNext();
    //           })
    //           .catch((err) => {
    //             console.log(err);
    //             translateError(err);
    //             translateError(err);
    //           })
    //           .finally(() => setLoading(false));
    //       } else {
    //         toast.error(
    //           "Não foi possível gerar o pedido, tente novamente em alguns instantes"
    //         );
    //       }
    //     })
    //     .catch((err) => {
    //       translateError(err);
    //       setLoading(false);
    //     });
    // }
  };

  return (
    <CardData style={{ width: window.innerWidth > 768 && "800px" }}>
      {/* <h5>REVISE SEU PEDIDO</h5> */}
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h4>DOCUMENTO</h4>
          <h5>{cpf}</h5>
          {iccid && (
            <>
              <h4>ICCID</h4>
              <h5>{iccid}</h5>
            </>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h4>TIPO</h4>
            <h5>Ativação</h5>
          </div>
          <div>
            <h4>DDD</h4>
            <h5>{ddd}</h5>
          </div>
        </div>
        {/* <h4 style={{ marginTop: '0.5rem' }}>PLANO</h4> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          {/* {returnCard(plan)} */}
          <RechargeCard
            disabled
            plan={plan?.value}
            name={plan?.value?.Name}
            size={plan?.value?.Size}
            internet={plan?.value?.Internet}
            extra={plan?.value?.Extra}
            extraPortIn={plan?.value?.ExtraPortIn}
            free={plan?.value?.Free?.split(" ")}
            price={plan?.value?.Amount}
            comments={plan?.value?.Comments}
          />
        </div>
      </div>
      <div className="flex end btn_invert">
        <Button
          onClick={goBackStep}
          style={{ width: window.innerWidth < 768 && "100%" }}
        >
          VOLTAR
        </Button>
        <Button
          notHover
          style={{ width: window.innerWidth < 768 && "100%" }}
          onClick={() => {
            // setLoading(true)
            handleCreateOrder();
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 15,
              }}
            >
              <ReactLoading type={"bars"} color={"#fff"} />
            </div>
          ) : (
            "PRÓXIMO"
          )}
        </Button>
      </div>
    </CardData>
  );
};
