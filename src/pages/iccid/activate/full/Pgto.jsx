/* eslint-disable react/prop-types */
// import api from '../../../services/api';
import {
  CardData,
  CardDataCard,
  InputDataCard,
  TypeContainer,
} from "./NewOrder.styles";
import ReactCardFlip from "react-card-flip";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { useEffect, useRef, useState } from "react";
import {
  cleanNumber,
  documentFormat,
  formatCVC,
  formatCreditCardNumber,
  formatExpirationDate,
  phoneFormat,
  translateError,
} from "../../../../services/util";
import Cards from "react-credit-cards-2";
import { CardAddress } from "./CardAddress";
import api from "../../../../services/api";
import { Button } from "../../../../../globalStyles";
import { PayCardContainer } from "../../../orders/payment/PayOrder.styles";
import { SavedCards } from "../../../../components/savedCards/SavedCards";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const Pgto = ({
  goBackStep,
  plan,
  dueDate,
  iccid,
  cpf,
  ddd,
  setShow,
  search,
  canGoBack,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const [cardAddres, setCardAddress] = useState({
    name: "",
    document: "",
    email: "",
    mobile: "",
    cep: "",
    address: "",
    complement: "",
    number: "",
    district: "",
    city: "",
    uf: "",
  });
  const [savedCard, setSavedCard] = useState({
    brand: "",
    nuumber: "",
    token: "",
    has: false,
  });
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const nameCardRef = useRef(null);
  const [selected, setSelected] = useState();
  const [qrcode, setQrcode] = useState();

  useEffect(() => {
    if (dueDate) {
      setSelected("CREDITO");
    }
    if (
      api?.currentUser?.MyFinalClientId &&
      api.currentUser.AccessTypes[0] === "CLIENT"
    ) {
      api.iccid
        .getSubscriptions(1, 100)
        .then((res) => {
          if (res.data.subscriptions?.length > 0) {
            setSavedCard({
              brand: res.data.subscriptions[0]?.CreditCardBrand,
              number: res.data.subscriptions[0]?.CreditCardNumber,
              token: res.data.subscriptions[0]?.CreditCardToken,
              has: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dueDate]);

  const handleFlipp = () => {
    setFlipped(!flipped);
  };

  // const handleCopy = async () => {
  //   try {
  //     if ("clipboard" in navigator) {
  //       await navigator.clipboard.writeText(qrcode?.copyPaste);
  //     } else {
  //       document.execCommand("copy", true, qrcode?.copyPaste);
  //     }
  //     toast.info("Pix copia e cola copiado para área de transferência");
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const handleQrcode = (type) => {
    setLoading(true);
    const CreditCard = {
      holderName: state.name,
      number: state.number,
      expiryMonth: state?.expiry?.slice(0, 2),
      expiryYear: state?.expiry?.slice(3, 7),
      ccv: state.cvc,
    };

    const CreditCardHolderInfo = {
      name: cardAddres.name,
      email: cardAddres.email,
      cpfCnpj: cardAddres?.document && cleanNumber(cardAddres.document),
      postalCode: cardAddres?.cep && cleanNumber(cardAddres.cep),
      addressNumber: cardAddres?.number,
      addressComplement: cardAddres?.complement,
      phone: cardAddres?.mobile && cleanNumber(cardAddres?.mobile),
      mobilePhone: cardAddres?.mobile && cleanNumber(cardAddres?.mobile),
    };

    api.iccid
      .payAndActivate(
        iccid,
        plan?.value?.Products[0]?.Product?.SurfId,
        cleanNumber(cpf),
        ddd,
        type,
        CreditCard,
        CreditCardHolderInfo,
        savedCard?.has ? savedCard?.token : null
      )
      .then((res) => {
        if (type === "PIX") {
          let url = `data:image/png;base64,${res.data.QrCodePix.encodedImage}`;
          setQrcode({ qrcode: url, copyPaste: res.data.QrCodePix.payload });
        } else {
          toast.success(res.data?.Message);
          setShow(false);
          if (canGoBack) {
            navigate("/orders");
          }
          search();
        }
      })
      .catch((err) => {
        console.log(err.response);
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (evt) => {
    if (evt.target.name === "number") {
      evt.target.value = formatCreditCardNumber(evt.target.value);
    } else if (evt.target.name === "expiry") {
      evt.target.value = formatExpirationDate(evt.target.value);
    } else if (evt.target.name === "cvc") {
      evt.target.value = formatCVC(evt.target.value);
    }
    const { name, value } = evt.target;

    setState((prev) => ({ ...prev, [name]: value }));

    if (name === "expiry") {
      if (value.length === 5) {
        handleFlipp();
      }
    }
    if (name === "number") {
      if (value.length === 16) {
        nameCardRef.current.focus();
      }
    }
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <CardData
      style={{
        padding: window.innerWidth < 769 && "1rem",
        width: window.innerWidth > 768 && "800px",
      }}
    >
      <h5>COMO DESEJA PAGAR</h5>
      <div className="select_type_container">
        <TypeContainer
          style={{ width: "30%" }}
          selected={selected === "PIX"}
          disabled={selected === "CREDITO"}
          onClick={() => {
            // if(!selected){
            setSelected("PIX");
            handleQrcode("PIX");
            // }else{
            //   console.log('não deixo clicar')
            // }
          }}
        >
          {loading && selected === "PIX" ? (
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
            <h5 style={{ textAlign: "center" }}>PIX</h5>
          )}
        </TypeContainer>
        <TypeContainer
          style={{ width: "30%" }}
          selected={selected === "CREDITO"}
          disabled={selected === "PIX"}
          onClick={() => setSelected("CREDITO")}
        >
          <h5 style={{ textAlign: "center" }}>CARTÃO DE CRÉDITO</h5>
        </TypeContainer>
      </div>
      <div className="flex end btn_invert">
        {canGoBack && !selected && (
          <Button notHover onClick={goBackStep}>
            Voltar
          </Button>
        )}
      </div>
      {selected === "PIX" && qrcode && (
        <>
          <div className="flex_center">
            <div>
              <p
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                QRCode para pagamento
              </p>
              {/* <img src={qrcode?.qrcode} alt='' /> */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={qrcode?.qrcode} alt="" style={{ maxWidth: "60%" }} />
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "100%" }}>
            <p
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Pix copia e cola
            </p>
            <h4
              style={{
                fontWeight: "bold",
                color: "#00D959",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              Clique no texto abaixo para copiar
            </h4>
            <div style={{ wordWrap: "" }}>
              {qrcode?.copyPaste && (
                <CopyToClipboard
                  text={qrcode?.copyPaste}
                  onCopy={() =>
                    toast.info(
                      "Pix copia e cola copiado para área de transferência"
                    )
                  }
                >
                  <span style={{ textAlign: "center", wordWrap: "anywhere" }}>
                    {qrcode?.copyPaste}
                  </span>
                </CopyToClipboard>
              )}
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <Button
                onClick={() => navigate("/activation")}
                style={{ width: "15rem", marginTop: "0.5rem" }}
              >
                SAIR
              </Button>
            </div>
          </div>
        </>
      )}
      {selected === "CREDITO" && (
        <>
          {savedCard?.has ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                margin: "auto",
              }}
            >
              <h5 style={{ marginBottom: "1rem" }}>
                Utilizar cartão cadastrado
              </h5>
              <SavedCards brand={savedCard?.brand} number={savedCard?.number} />
              <div
                style={{
                  marginTop: "1rem",
                  justifyContent: "space-evenly",
                  display: "flex",
                  width: "100%",
                }}
              >
                <Button
                  // invert
                  style={{ width: "120px" }}
                  onClick={() => setSavedCard({ ...savedCard, has: false })}
                >
                  Usar outro
                </Button>
                <Button
                  style={{ width: "120px" }}
                  notHover
                  onClick={() => handleQrcode("CREDITO")}
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
                    "PAGAR"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <PayCardContainer>
                <Cards
                  number={state.number}
                  expiry={state.expiry}
                  cvc={state.cvc}
                  name={state.name}
                  focused={state.focus}
                  placeholders={{ name: "SEU NOME AQUI" }}
                  locale={{ valid: "VALIDADE" }}
                />
              </PayCardContainer>
              <ReactCardFlip isFlipped={flipped}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CardDataCard
                    style={{
                      width: window.innerWidth > 768 ? 650 : "100%",
                      padding: window.innerWidth < 769 && "1rem",
                    }}
                  >
                    <h6>NOME DO DONO DO CARTÃO</h6>
                    <InputDataCard
                      style={{ width: "100%" }}
                      name="dono"
                      autoFocus
                      placeholder="Dono do cartão"
                      value={cardAddres.name}
                      onChange={(e) =>
                        setCardAddress({ ...cardAddres, name: e.target.value })
                      }
                    />
                    <div
                      style={{
                        width: "100%",
                        display: window.innerWidth > 768 && "flex",
                        marginTop: 5,
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <h6>E-MAIL</h6>
                        <InputDataCard
                          style={{ width: "100%" }}
                          type="text"
                          name="email"
                          placeholder="E-mail *"
                          value={cardAddres.email}
                          onChange={(e) =>
                            setCardAddress({
                              ...cardAddres,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: window.innerWidth > 768 && 5,
                          width: "100%",
                        }}
                      >
                        <h6>TELEFONE</h6>
                        <InputDataCard
                          id="mobile"
                          name="mobile"
                          placeholder="Telefone *"
                          style={{ width: "100%" }}
                          value={cardAddres.mobile}
                          onChange={(e) =>
                            setCardAddress({
                              ...cardAddres,
                              mobile: phoneFormat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: window.innerWidth > 768 && 5,
                          width: "100%",
                        }}
                      >
                        <h6>CPF</h6>
                        <InputDataCard
                          id="cpf"
                          name="cpf"
                          placeholder="CPF *"
                          style={{ width: "100%" }}
                          value={cardAddres.document}
                          onChange={(e) =>
                            setCardAddress({
                              ...cardAddres,
                              document: documentFormat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <h6>NÚMERO DO CARTÃO</h6>
                    <InputDataCard
                      style={{ width: "100%" }}
                      type="number"
                      name="number"
                      placeholder="Número do cartão"
                      value={state.number}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                    <h6 style={{ marginTop: 5 }}>NOME COMO NO CARTÃO</h6>
                    <InputDataCard
                      style={{ width: "100%" }}
                      type="text"
                      name="name"
                      ref={nameCardRef}
                      placeholder="Nome como no cartão"
                      value={state.name}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                    <div
                      style={{ width: "100%", display: "flex", marginTop: 5 }}
                    >
                      <div style={{ width: "100%" }}>
                        <h6>CVC</h6>
                        <InputDataCard
                          style={{ width: "100%" }}
                          type="text"
                          name="cvc"
                          placeholder="CVC"
                          value={state.cvc}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                        />
                      </div>
                      <div style={{ marginLeft: 5, width: "100%" }}>
                        <h6>VALIDADE</h6>
                        <InputDataCard
                          id="expire"
                          name="expiry"
                          placeholder="Validade *"
                          style={{ width: "100%" }}
                          value={state.expiry}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                        />
                      </div>
                    </div>
                    <div className="flex end btn_invert">
                      <Button
                        notHover
                        onClick={goBackStep}
                        style={{ width: "100%" }}
                      >
                        Voltar
                      </Button>
                      <Button
                        notHover
                        onClick={handleFlipp}
                        style={{ width: "100%" }}
                      >
                        Endereço cartão
                      </Button>
                    </div>
                  </CardDataCard>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CardDataCard
                    style={{
                      width: window.innerWidth > 768 ? 650 : "100%",
                      padding: window.innerWidth < 769 && "1rem",
                      // margin: 0
                    }}
                  >
                    <CardAddress
                      loading={loading}
                      goStep={() => handleQrcode("CREDITO")}
                      goBackStep={handleFlipp}
                      address={cardAddres}
                      setAddress={setCardAddress}
                    />
                  </CardDataCard>
                </div>
              </ReactCardFlip>
              {/* </div> */}
            </>
          )}
        </>
      )}
      <div
        style={{ width: "100%", display: "flex", justifyContent: "start" }}
      ></div>
    </CardData>
  );
};
