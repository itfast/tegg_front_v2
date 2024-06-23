/* eslint-disable react/prop-types */
// import api from '../../../services/api';
// import { CardData, CardDataCard, InputDataCard } from './NewOrder.styles';
import ReactCardFlip from "react-card-flip";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  cleanNumber,
  documentFormat,
  formatCVC,
  formatCreditCardNumber,
  formatExpirationDate,
  phoneFormat,
  translateError,
} from "../../services/util";
import Cards from "react-credit-cards-2";
import { CardAddress } from "../orders/clientNew/CardAddress";
import { PayCardContainer } from "../orders/payment/PayOrder.styles";
import { SavedCards } from "../../components/savedCards/SavedCards";
import api from "../../services/api";
import { Button } from "../../../globalStyles";
import {
  CardData,
  CardDataCard,
  InputDataCard,
} from "../orders/clientNew/NewOrder.styles";

import { Loading } from "../../components/loading/Loading";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import { formatValue } from "react-currency-input-field";

export const Pgto = ({ email, products, changeModal }) => {
  const interval = useRef(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const [cardAddres, setCardAddress] = useState({
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
  const [selected, setSelected] = useState();
  const [flipped, setFlipped] = useState(false);
  const [qrcode, setQrcode] = useState();
  const nameCardRef = useRef(null);
  const [plan, setPlan] = useState();
  const [orderId, setOrderId] = useState();
  const [assinatura, setAssinatura] = useState(false);

  useEffect(() => {
    api.plans
      .getByBuy("client", null)
      .then((res) => {
        // const filtered = res?.data.filter((f) => f.Name?.includes("TV"));
        const filtered = [];
        res?.data?.forEach((f) => {
          f.Products.forEach((p) => {
            if (p.Product.PlayHubId === "Q") {
              filtered.push(f);
            }
          });
        });
        res?.data?.forEach((f) => {
          f.Products.forEach((p) => {
            if (p.Product.PlayHubId === "P") {
              filtered.push(f);
            }
          });
        });
        if (filtered) {
          setPlan(filtered);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFlipp = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    handleQrcode("CREDITO");
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

  const getStatus = async (myOrder) => {
    api.order.getStatus(myOrder).then((res) => {
      if (res.data.Status === "AWAITINGPROCESSING") {
        // toast.success(
        //   `Pagamento confirmado. Seu acesso foi enviado para ${email}`
        // );
        // navigate("/subscriptions", {
        //   state: { type: "tv" },
        // });
        setQrcode();
        setSelected("FINISHED");
        // changeModal();
      }
    });
  };

  useEffect(() => {
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
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  const createOrder = async () => {
    try {
      let premium;
      let standard;
      if (products.standard > 0) {
        standard = { plan: plan[0], qtd: products.standard };
      }
      if (products.premium > 0) {
        premium = { plan: plan[1], qtd: products.premium };
      }

      const res = await api.order.create(
        api.currentUser.MyFinalClientId,
        api.currentUser.AccessTypes[0] === "DEALER"
          ? api.currentUser?.DealerId
          : null,
        0,
        false,
        0,
        null,
        false
      );

      let myOrderId = res.data.OrderId;
      setOrderId(res.data.OrderId);

      if (premium) {
        await api.order.addItem(
          premium?.plan?.Id,
          premium?.qtd,
          myOrderId,
          premium?.plan?.Amount,
          [],
          0,
          0,
          null,
          api.currentUser.MyFinalClientId,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );
      }
      if (standard) {
        await api.order.addItem(
          standard?.plan?.Id,
          standard?.qtd,
          myOrderId,
          standard?.plan?.Amount,
          [],
          0,
          0,
          null,
          api.currentUser.MyFinalClientId,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );
      }

      return myOrderId;
    } catch (err) {
      translateError(err);
    }
  };

  const handleQrcode = async (type) => {
    setLoading(true);
    let myOrderId = orderId;
    if (!myOrderId && !assinatura) {
      myOrderId = await createOrder();
    }
    if (assinatura) {
      let premium;
      let standard;
      if (products.standard > 0) {
        standard = { plan: plan[0], qtd: products.standard, id: plan[0]?.Id };
      }
      if (products.premium > 0) {
        premium = { plan: plan[1], qtd: products.premium, id: plan[1]?.Id };
      }
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
      let value = 0;
      const playHubPlans = [];
      if (standard?.qtd > 0) {
        value += standard?.qtd * standard?.plan?.Amount;
        playHubPlans.push({ qtd: standard?.qtd, id: standard.id });
      }
      if (premium?.qtd > 0) {
        value += premium?.qtd * premium?.plan?.Amount;
        playHubPlans.push({ qtd: premium?.qtd, id: premium.id });
      }

      console.log("Standard", standard);
      console.log("Premium", premium);
      console.log("Value", value);

      api.iccid
        .createSubscriptionTv(
          api.currentUser.MyFinalClientId,
          value,
          moment(new Date()).format("DD"),
          CreditCard,
          CreditCardHolderInfo,
          playHubPlans
        )
        .then((res) => {
          toast.success(res.data.Message);
          setSelected("FINISHED");
        })
        .catch((err) => {
          translateError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      api.order
        .pay(
          myOrderId,
          type,
          state,
          cardAddres,
          savedCard?.has ? savedCard?.token : null
        )
        .then((res) => {
          if (type === "PIX") {
            let url = `data:image/png;base64,${res.data.QrCodePix.encodedImage}`;
            setQrcode({ qrcode: url, copyPaste: res.data.QrCodePix.payload });
            interval.current = setInterval(getStatus, 5000, myOrderId);
          } else if (type === "BOLETO") {
            toast.success(res?.data?.Message);
            window.open(
              res.data?.BankSlipUrl,
              "_blank",
              "location=yes,height=570,width=520,scrollbars=yes,status=yes"
            );
          } else {
            setSelected("FINISHED");

            toast.success(
              `${res.data?.Message}. Seu acesso foi enviado para ${email}`
            );
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

  return (
    <>
      <Loading open={loading} msg={"Contratando..."} />
      {/* <h5>COMO DESEJA PAGAR</h5> */}
      {/* <div className="select_type_container"> */}
      {selected !== "FINISHED" && (
        <div>
          <div
            style={{
              display: "flex",
              width: screen.width < 768 && "100%",
              flexDirection: screen.width < 768 && "column",
              justifyContent: screen.width > 768 && "space-around",
              gap: 15,
              marginTop: "1rem",
            }}
          >
            <Button
              // disabled={selected === 'CREDITO' || selected === 'BOLETO'}
              onClick={() => {
                setSelected("PIX");
                handleQrcode("PIX");
              }}
              style={{ minWidth: 200 }}
              notHover
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
                "PIX"
              )}
            </Button>
            <Button
              // disabled={selected === 'PIX' || selected === 'BOLETO'}
              notHover
              onClick={() => {
                setSelected("CREDITO");
                // handleQrcode('CREDITO');
                setQrcode();
                clearInterval(interval.current);
              }}
              style={{ minWidth: 200 }}
            >
              CARTÃO DE CRÉDITO
            </Button>
          </div>
        </div>
      )}
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
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={qrcode?.qrcode} alt="" style={{ maxWidth: "60%" }} />
              </div>
            </div>
          </div>
          <div className="flex_center">
            <div>
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
                  onClick={handleNext}
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
              <div
                className="flex_center"
                style={{ margin: window.innerWidth < 768 && "1rem 0rem" }}
              >
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
                        boxShadow: window.innerWidth < 768 && "none",
                        padding: window.innerWidth < 768 && 0,
                      }}
                    >
                      {/* AQUI */}
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{
                                // color: pink[800],
                                "&.Mui-checked": {
                                  color: "green",
                                },
                              }}
                              onChange={(e) => {
                                setAssinatura(e.target.checked);
                                // if (!e.target.checked) {
                                //   setDueDate();
                                // }
                              }}
                            />
                          }
                          label="Gerar assinatura"
                        />
                      </FormGroup>
                      <h6>NOME DO DONO DO CARTÃO</h6>
                      <InputDataCard
                        style={{ width: "100%" }}
                        name="dono"
                        autoFocus
                        placeholder="Dono do cartão"
                        value={cardAddres?.name}
                        onChange={(e) =>
                          setCardAddress({
                            ...cardAddres,
                            name: e.target.value,
                          })
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
                            value={cardAddres?.email}
                            onChange={(e) =>
                              setCardAddress({
                                ...cardAddres,
                                email: e.target.value,
                              })
                            }
                            // onChange={(e) => setEmail(e.target.value)}
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
                            id="cpf"
                            name="cpf"
                            placeholder="Telefone *"
                            style={{ width: "100%" }}
                            value={cardAddres.mobile}
                            onChange={(e) =>
                              setCardAddress({
                                ...cardAddres,
                                mobile: phoneFormat(e.target.value),
                              })
                            }
                            // onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div
                          style={{
                            marginLeft: window.innerWidth > 768 && 5,
                            width: "100%",
                          }}
                        >
                          <h6>CPF/CNPJ</h6>
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
                            // onChange={(e) => setCpf(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* FIM */}
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
                        <Button notHover onClick={handleFlipp}>
                          Endereço cartão
                        </Button>
                      </div>
                    </CardDataCard>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CardDataCard
                      style={{
                        boxShadow: window.innerWidth < 768 && "none",
                        padding: window.innerWidth < 768 && 0,
                      }}
                    >
                      <CardAddress
                        loading={loading}
                        goStep={handleNext}
                        goBackStep={handleFlipp}
                        address={cardAddres}
                        setAddress={setCardAddress}
                      />
                    </CardDataCard>
                  </div>
                </ReactCardFlip>
              </div>
            </>
          )}
        </>
      )}
      {selected === "BOLETO" && !loading && (
        <>
          <CardData style={{ marginTop: "2rem" }}>
            <div className="flex_center">
              <div>
                <p
                  style={{
                    fontSize: 20,
                    // fontWeight: 'bold',
                    textAlign: "center",
                  }}
                >
                  {loading
                    ? "Gerando boleto..."
                    : "Boleto aberto em nova janela"}
                </p>
              </div>
            </div>
            <div className="flex_center">
              <Button onClick={() => navigate("/orders")}>
                Finalizar pedido
              </Button>
            </div>
          </CardData>
        </>
      )}
      {selected === "FINISHED" && !loading && (
        <>
          {/* <CardData style={{ marginTop: "2rem" }}> */}
          <CardData
            style={{
              marginTop: "2rem",
              width: window.innerWidth > 768 ? 650 : "100%",
              boxShadow: window.innerWidth < 768 && "none",
              padding: window.innerWidth < 768 && 0,
            }}
          >
            <div className="flex_center">
              {/* <div> */}
              <p>
                Informações de acesso e login foram enviados para o e-mail:{" "}
                <span style={{ fontWeight: "bold" }}>{email}</span>
              </p>
              <br />
              <p>
                Seu e-mail de acesso aos serviços contratados é:
                <span style={{ fontWeight: "bold" }}> {email}</span>
              </p>
              <br />
              <p>Sua senha é: duXS0Tq7ws</p>
              <br />
              <p>
                Link para o acesso ao serviço:{" "}
                <a href="http://portaldoassinante.com/tegg">
                  http://portaldoassinante.com/tegg
                </a>
              </p>
              <p>
                Em caso de dúvidas de como acessar o serviço contratado, acesse:
              </p>
              <a href="https://comologar.com.br/">https://comologar.com.br/</a>
              {/* </div> */}
            </div>
            <div className="flex_center">
              <Button onClick={() => changeModal()}>Fechar</Button>
            </div>
          </CardData>
        </>
      )}
    </>
  );
};
