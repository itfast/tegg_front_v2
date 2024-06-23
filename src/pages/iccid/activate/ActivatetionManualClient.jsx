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
} from "../../../services/util";
import { InputData } from "../../resales/Resales.styles";
import { toast } from "react-toastify";
import { Loading } from "../../../components/loading/Loading";
import { NewActivateClient } from "./full/NewActivateClient";
// import { useNavigate } from 'react-router-dom';

export const ActivationManualClient = () => {
  const [loading, setLoading] = useState(false);
  const [ddd, setDdd] = useState();
  const [cpf, setCpf] = useState();
  const [iccid, setIccid] = useState("");
  const [planOpt, setPlanOpt] = useState([]);
  const [plan, setPlan] = useState();
  // const navigate = useNavigate()

  // useEffect(() => {
  //   console.log(api.currentUser.AccessTypes[0] === 'CLIENT');
  //   navigate('/')
  // }, []);

  const handleActivate = () => {
    setLoading(true);
    api.iccid
      .activate(iccid, plan?.surfId, cleanNumber(cpf), ddd)
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
  };

  useEffect(() => {
    api.plans
      .getByRecharge()
      .then((res) => {
        console.log(res);
        res.data.sort((a, b) => {
          return a.Products[0].Product.Amount - b.Products[0].Product.Amount;
        });
        const array = [];
        res.data?.forEach((p) => {
          array.push({
            value: p.Id,
            label: p.Name,
            surfId: p.Products[0]?.Product?.SurfId,
          });
        });
        // setOriginPlans(array);
        setPlanOpt(array);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <ContainerWeb>
        <Loading open={loading} msg={"Ativando..."} />
        <div style={{ width: "100%" }}>
          <NewActivateClient
            setShow={() => console.log("show")}
            iccid={""}
            search={() => console.log("")}
            canGoBack
          />
        </div>
      </ContainerWeb>
      <ContainerMobile>
        <Loading open={loading} msg={"Ativando..."} />
        <div style={{ width: "100%" }}>
          <NewActivateClient
            setShow={() => console.log("show")}
            iccid={""}
            search={() => console.log("")}
            canGoBack
          />
        </div>
      </ContainerMobile>
    </>
  );
};
