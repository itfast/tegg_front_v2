/* eslint-disable react/prop-types */
// import { useTranslation } from "react-i18next";
import { PortInClient } from "./PortinClient";
import { Stepper } from "../../../components/stepper/Stepper";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { Button } from "../../../../globalStyles";
import { OrderItensByPortIn } from "./OrderItensByPortIn";
import { Pgto } from "./Pgto";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { cleanNumber, translateError } from "../../../services/util";
import { Loading } from "../../../components/loading/Loading";
import { AddressData } from "./AddressData";

const stepperAddress = [
  { name: "Linha", status: "current" },
  { name: "Endereço", status: "" },
  { name: "Plano", status: "" },
  { name: "Pagamento", status: "" },
];

const stepperNoAddress = [
  { name: "Linha", status: "current" },
  { name: "Plano", status: "" },
  { name: "Pagamento", status: "" },
];
export const PortInSteep = ({ openModal }) => {
  const [stepperClient, setStepperClient] = useState(stepperNoAddress);
  const [loading, setLoading] = useState(false);
  const [isEsim, setEsim] = useState(true);
  const [name, setName] = useState();
  const [cpf, setCpf] = useState();
  const [oldNumber, setOldNumber] = useState();
  const [operator, setOperator] = useState();
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState();
  const [otherAddress, setOtherAddress] = useState(false);
  const cepInput = useRef(0);
  const addressInput = document.getElementById("address");
  const numberInput = document.getElementById("number");
  const districtInput = document.getElementById("district");
  const cityInput = document.getElementById("city");
  const ufInput = document.getElementById("uf");
  const [address, setAddress] = useState({
    cep: "",
    address: "",
    complement: "",
    number: "",
    district: "",
    city: "",
    uf: "",
  });
  useEffect(() => {
    console.log("mudar", isEsim);
    if (isEsim) {
      setStepperClient(stepperNoAddress);
    } else {
      setStepperClient(stepperAddress);
    }
  }, [isEsim]);

  const [orderId, setOrderId] = useState();
  const goNext = () => {
    const orig = _.cloneDeep(stepperClient);
    orig[step].status = "completed";
    orig[step + 1].status = "current";
    setStepperClient(orig);
    setStep(step + 1);
  };

  const checkAddress = () => {
    if (
      address.cep !== "" &&
      address.cep.replace(".", "").replace("-", "").length === 8
    ) {
      // cepInput?.style.removeProperty('border-color');
      // cepInput.current.style.borderColor = "";
      if (address.address !== "" && address.address.trim().length > 0) {
        addressInput?.style.removeProperty("border-color");
        if (address.number !== "" && Number(address.number) > 0) {
          numberInput?.style.removeProperty("border-color");
          if (address.district !== "" && address.district.trim().length > 0) {
            districtInput?.style.removeProperty("border-color");
            if (address.city !== "" && address.city.trim().length > 0) {
              cityInput?.style.removeProperty("border-color");
              if (address.uf !== "") {
                ufInput?.style.removeProperty("border-color");
                // goStep();
                goNext();
              } else {
                ufInput.style.borderColor = "red";
                toast.error("UF é obrigatório");
              }
            } else {
              cityInput.style.borderColor = "red";
              toast.error("Cidade é obrigatório");
            }
          } else {
            districtInput.style.borderColor = "red";
            toast.error("Bairro é obrigatório");
          }
        } else {
          numberInput.style.borderColor = "red";
          toast.error("Número é obrigatório");
        }
      } else {
        addressInput.style.borderColor = "red";
        toast.error("Endereço é obrigatório");
      }
    } else {
      console.log(cepInput.current.borderColor);
      cepInput.current.style.borderColor = "red";
      // cepInput.style.borderColor = 'red';
      toast.error("Insira um CEP válido");
    }
  };

  useEffect(() => {
    console.log(plan);
  }, [plan]);

  const handleCreateOrder = () => {
    setLoading(true);
    api.order
      .create(
        api.currentUser.MyFinalClientId,
        api.currentUser.AccessTypes[0] === "DEALER"
          ? api.currentUser?.DealerId
          : null,
        0,
        false,
        0,
        isEsim && address,
        true
      )
      .then((res) => {
        setLoading(true);
        if (res.status == 201) {
          let orderId = res.data.OrderId;
          console.log('Adicionar item')
          setOrderId(orderId);
          api.order
            .addItem(
              plan?.value?.Id,
              1,
              orderId,
              plan?.value?.Amount,
              [],
              isEsim ? 1 : 0,
              isEsim ? 0 : 1,
              true,
              api.currentUser.MyFinalClientId,
              null,
              null,
              null,
              cleanNumber(oldNumber),
              operator.value,
              cleanNumber(cpf),
              name
            )
            .then(() => {
              toast.success("Item adicionado com sucesso");
              // handleNext();
              goNext();
            })
            .catch((err) => {
              translateError(err);
            })
            .finally(() => setLoading(false));
        }
      })
      .catch((err) => {
        translateError(err);
        setLoading(false);
      });
  };

  const handleNext = () => {
    if (step === 0) {
      if (oldNumber) {
        if (operator) {
          goNext();
        } else {
          toast.error("Informe a operadora que está saindo");
        }
      } else {
        toast.error("Informe o número a ser portado");
      }
    } else if (step === 1) {
      if (stepperClient.length === 4) {
        checkAddress();
      } else {
        if (plan) {
          
          handleCreateOrder()
        } else {
          toast.error("Selecione um plano para continuar");
        }
      }
    } else {
      const orig = _.cloneDeep(stepperClient);
      orig[step].status = "completed";
      orig[step + 1].status = "current";
      setStepperClient(orig);
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step === 1) {
      setStep(step - 1);
    } else if (step === 0) {
      openModal(false);
    } else {
      const orig = _.cloneDeep(stepperClient);
      orig[step - 1].status = "current";
      orig[step].status = "";
      setStepperClient(orig);
      setStep(step - 1);
    }
  };

  useEffect(() => {
    api.client
      .getById(api.currentUser.MyFinalClientId)
      .then((res) => {
        setAddress({
          cep: res.PostalCode,
          address: res.StreetName,
          complement: res.Complement,
          number: res.Number,
          district: res.District,
          city: res.City,
          uf: res.State,
        });
      })
      .catch((err) => translateError(err));
  }, []);

  const returnStep = () => {
    switch (step) {
      case 0:
        return (
          <PortInClient
            setCpf={setCpf}
            setName={setName}
            setOldNumber={setOldNumber}
            oldNumber={oldNumber}
            setOperator={setOperator}
            operator={operator}
            isEsim={isEsim}
            setEsim={setEsim}
          />
        );
      case 1:
        if (stepperClient.length === 4) {
          return (
            <AddressData
              goStep={handleNext}
              goBackStep={goBack}
              address={address}
              setAddress={setAddress}
              otherAddress={otherAddress}
              setOtherAddress={setOtherAddress}
            />
          );
        }
        return (
          <OrderItensByPortIn
            handleNextExt={handleNext}
            goBackStep={goBack}
            selected={plan}
            setSelected={setPlan}
          />
        );
      case 2:
        if (stepperClient.length === 4) {
          return (
            <OrderItensByPortIn
              handleNextExt={handleNext}
              goBackStep={goBack}
              selected={plan}
              setSelected={setPlan}
            />
          );
        }
        return (
          <Pgto
            plan={plan}
            line={123123}
            dueDate={null}
            goBackStep={goBack}
            orderId={orderId}
            openModal={openModal}
          />
        );
      case 3:
        return (
          <Pgto
            plan={plan}
            line={123123}
            dueDate={null}
            goBackStep={goBack}
            orderId={orderId}
            openModal={openModal}
          />
        );
    }
  };

  return (
    <>
      <Loading open={loading} msg={"Criando pedido ..."} />
      <DialogContent>
        <DialogContentText>
          {/* <PortInSteep openModal={setPortinModal} /> */}
          <Stepper style={{ maxWidth: "1000px" }} typeStepper={stepperClient} />
          {returnStep()}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {step == 0 ? (
          <Button onClick={() => openModal(false)}>Cancelar</Button>
        ) : (
          <Button onClick={goBack}>Voltar</Button>
        )}
        {console.log(stepperClient.length === 3 && step < 2)}
        {((stepperClient.length === 3 && step < 2) || (stepperClient.length === 4 && step < 3)) && <Button onClick={handleNext}>Próximo</Button>}
      </DialogActions>
    </>
  );
};
