/* eslint-disable react/prop-types */
import { CardData } from "../../resales/Resales.styles";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../../../services/api";
import {
  CardDataCard,
  InputDataCard,
  TableItens,
} from "../clientNew/NewOrder.styles";
import { ImagePay, PayCardContainer } from "./PayOrder.styles";
import {
  documentFormat,
  formatCVC,
  formatCreditCardNumber,
  formatExpirationDate,
  phoneFormat,
  translateError,
} from "../../../services/util";
import Cards from "react-credit-cards-2";
import { CardAddress } from "./CardAddress";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
} from "../../../../globalStyles";
import ReactCardFlip from "react-card-flip";

import "react-credit-cards-2/dist/es/styles-compiled.css";
import { SavedCards } from "../../../components/savedCards/SavedCards";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const PayOrderData = ({ order }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState();
  const [orderInfo, setOrderInfo] = useState({});
  // const [plans, setPlans] = useState([]);
  const [plansInfo, setPlansInfo] = useState([]);
  // const [paymentMethod, setPaymentMethod] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [clientName, setClientName] = useState("-");
  const [flipped, setFlipped] = useState(false);
  const [qrcode, setQrcode] = useState();
  const nameCardRef = useRef(null);

  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [phone, setPhone] = useState('');
  // const [cpf, setCpf] = useState('');

  const [msg, setMsg] = useState("GERANDO QRCODE-PIX");
  const [payId, setPayId] = useState();

  const [status, setStatus] = useState("");
  const [count, setCount] = useState(0);

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
    mobile: "",
    document: "",
    name: "",
    email: "",
  });
  const [savedCard, setSavedCard] = useState({
    brand: "",
    nuumber: "",
    token: "",
    has: false,
  });
  // const [count, setCount] = useState(0);
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
  }, []);

  const translateValue = (value) => {
    let converted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
    return converted;
  };

  const getStatus = async () => {
    await new Promise((r) => setTimeout(r, 5000));
    let num = count;
    num++;
    if (num > 60) {
      toast.info(
        "Pagamento ainda não foi confirmado, por favor realize o pagamento para confirmar o seu pedido"
      );
      // navigate("/orders");
    }
    api.order
      .getStatus(order)
      .then((res) => {
        setCount(num);
        if (res.data.Status === "CONFIRMED" || res.data.Status === "RECEIVED") {
          toast.success("Pagamento confirmado");
          navigate("/orders");
        } else {
          setStatus(`res.data.Status${num}`);
        }
      })
      .catch(() => {
        getStatus();
      });
  };

  useEffect(() => {
    if (status !== "") {
      getStatus();
    }
  }, [status]);

  const handleFlipp = () => {
    setFlipped(!flipped);
  };

  const handleInputChange = (evt) => {
    // const { name, value } = evt.target;
    if (evt.target.name === "number") {
      // console.log(formatCreditCardNumber(evt.target.value))
      evt.target.value = formatCreditCardNumber(evt.target.value);
    } else if (evt.target.name === "expiry") {
      evt.target.value = formatExpirationDate(evt.target.value);
    } else if (evt.target.name === "cvc") {
      evt.target.value = formatCVC(evt.target.value);
    }
    const { name, value } = evt.target;
    console.log(value);
    setState((prev) => ({ ...prev, [name]: value }));
    if (name === "number") {
      if (value.length === 16) {
        nameCardRef.current.focus();
      }
    }
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const getOrder = () => {
    api.order
      .getInfo(order)
      .then((res) => {
        setOrderInfo(res.data[0]);
        res.data[0].FinalClientId != null
          ? setClientName(res.data[0].FinalClient.Name)
          : setClientName(res.data[0].DealerPayer.Name);
      })
      .catch((err) => console.log(err));
  };

  const getPlans = () => {
    setPlansInfo(orderInfo.OrderItems);
    let newVal = 0;
    orderInfo.OrderItems.forEach((item) => {
      newVal += Number(item.Amount);
    });
    if (orderInfo.FreightAmount) {
      newVal += orderInfo.FreightAmount;
    }
    setTotalValue(newVal);
  };

  // const handleCopy = async () => {
  //   try {
  //     if ('clipboard' in navigator) {
  //       await navigator.clipboard.writeText(qrcode?.copyPaste);
  //       toast.info('Pix copia e cola copiado para área de transferência');
  //     } else {
  //       document.execCommand('copy', true, qrcode?.copyPaste);
  //       toast.info('Pix copia e cola copiado para área de transferência');
  //     }
  //     // toast.info('Pix copia e cola copiado para área de transferência');
  //   } catch (e) {
  //     toast.error('Erro ao copiar');
  //     console.log(e);
  //   }
  // };

  const handleNext = () => {
    setLoading(true);
    api.order
      .payCredit(
        orderInfo.Id,
        totalValue,
        state.name,
        state.number,
        state.expiry?.slice(0, 2),
        state.expiry?.slice(3, 7),
        state.cvc,
        cardAddres?.name,
        cardAddres?.email,
        cardAddres?.document.replace(/\D+/g, ""),
        cardAddres.cep?.replace(/\D+/g, ""),
        cardAddres.number,
        cardAddres.complement,
        cardAddres?.mobile.replace(/\D+/g, ""),
        cardAddres?.mobile.replace(/\D+/g, ""),
        savedCard?.has ? savedCard?.token : null
      )
      .then(() => {
        navigate("/orders");
        toast.success(
          "Pagamento efetuado com sucesso, aguarde o recebimento do pagamento com a confirmação"
        );
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    if (Object.keys(orderInfo) != 0) {
      getPlans();
    }
  }, [orderInfo]);

  const qtdFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(it.Quantity);
    });
    return qt;
  };

  const priceFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + it.Amount;
    });
    return translateValue(qt);
  };

  // const getStatus = async () => {
  //   await new Promise((r) => setTimeout(r, 5000));
  //   let num = count;
  //   num++;
  //   if (num > 60) {
  //     toast.info(
  //       'Pagamento ainda não foi confirmado, por favor realize o pagamento para confirmar o seu pedido'
  //     );
  //     navigate('/orders');
  //   }
  //   api.purchaseorder
  //     .getStatus(orderInfo.Id)
  //     .then((res) => {
  //       console.log(res);
  //       setCount(num);
  //       if (res.data.Status === 'AWAITINGPROCESSING') {
  //         toast.success('Pagamento confirmado');
  //         navigate('/orders');
  //       } else {
  //         getStatus();
  //         console.log(`res.data.Status${num}`);
  //       }
  //     })
  //     .catch((err) => {
  //       translateError(err);
  //       getStatus();
  //     });
  // };

  const handleQrcode = (type) => {
    setLoading(true);
    if (type === "PIX") {
      api.order
        .payPix(orderInfo.Id, totalValue)
        .then((res) => {
          console.log(res);
          setPayId(res.data?.PaymentId);
          let url = `data:image/png;base64,${res.data.QrCodePix.encodedImage}`;
          setQrcode({ qrcode: url, copyPaste: res.data.QrCodePix.payload });
          getStatus();
        })
        .catch((err) => {
          translateError(err);
          setSelected();
          setQrcode();
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (type === "BOLETO") {
      api.order
        .payBoleto(orderInfo.Id, totalValue)
        .then((res) => {
          console.log(res.data);
          toast.success(res.data?.Message);
          window.open(
            res.data?.BankSlipUrl,
            "_blank",
            "location=yes,height=570,width=520,scrollbars=yes,status=yes"
          );
          // window.open(res.data?.BankSlipUrl, '_black');
          // navigate('/orders');
          // console.log(res);
          setPayId(res.data?.PaymentId);
          // let url = `data:image/png;base64,${res.data.QrCodePix.encodedImage}`;
          // setQrcode({ qrcode: url, copyPaste: res.data.QrCodePix.payload });
          // getStatus();
        })
        .catch((err) => {
          translateError(err);
          setSelected();
          setQrcode();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteAction = (message) => {
    setMsg(message);
    setLoading(true);
    api.order
      .deletePaymentExtern(payId)
      .then(() => {
        // toast.success(res.data.Message);
        setSelected();
        setQrcode();
        setPayId();
        // setModalDelete(false);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <ContainerWeb style={{ width: "100%" }}>
        <CardData
          style={{
            maxWidth: "1000px",
            minWidth: "800px",
            margin: "auto",
            backgroundColor: "#fff",
            opacity: "0.98",
          }}
        >
          {!selected && (
            <div>
              <h3 style={{ textAlign: "center", marginBottom: 10 }}>
                DETALHES DO PEDIDO
              </h3>

              <div>
                <p>Cliente: {clientName}</p>
              </div>

              <TableItens style={{ marginTop: 10 }}>
                <tr>
                  <th>Item</th>
                  {window.innerWidth > 768 && <th>Preço UN</th>}
                  {window.innerWidth > 768 && <th>Quantidade itens</th>}
                  <th>Total</th>
                </tr>
                {plansInfo.length === 0 && (
                  <tr>
                    {window.innerWidth > 768 && <td />}
                    {window.innerWidth > 768 && <td />}
                    {window.innerWidth > 768 && <td />}
                    <td />
                    <td />
                  </tr>
                )}
                {plansInfo.map((m, i) => (
                  <tr key={i}>
                    <td>{m?.Plan?.Name}</td>
                    {window.innerWidth > 768 && (
                      <td>{translateValue(m.UnitAmount)}</td>
                    )}
                    {window.innerWidth > 768 && <td>{m.Quantity}</td>}
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>{translateValue(m.Amount)}</p>
                      </div>
                    </td>
                  </tr>
                ))}
                {plansInfo.length > 0 && (
                  <>
                    <tr>
                      <td />
                      {window.innerWidth > 768 && <td />}
                      {/* <td /> */}
                      {/* <td/> */}
                      <td>{qtdFinal(plansInfo)}</td>
                      {/* { window.innerWidth > 768 &&<td>{qtdIccids(plansInfo.OrderItems)}</td>} */}
                      <td>{priceFinal(plansInfo)}</td>
                    </tr>
                  </>
                )}
              </TableItens>
              <h5
                style={{ textAlign: "center", marginTop: 20 }}
                className="bold"
              >
                ESCOLHA A FORMA DE PAGAMENTO
              </h5>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "itens",
                    textAlign: "center",
                  }}
                >
                  <CardData
                    style={{
                      width: "200px",
                      margin: 0,
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setMsg("GERANDO QRCODE-PIX");
                      setSelected("PIX");
                      handleQrcode("PIX");
                    }}
                  >
                    <ImagePay
                      src={"/assets/pix.png"}
                      style={{ maxWidth: "11rem" }}
                      alt="pix"
                    />
                    <h5 style={{ marginTop: 10 }}>
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
                    </h5>
                  </CardData>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardData
                    style={{
                      width: "200px",
                      margin: 0,
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelected("CREDITO")}
                  >
                    <ImagePay
                      src={"/assets/cartoes.png"}
                      style={{ maxWidth: "6rem" }}
                      alt="pix"
                    />
                    <h5 style={{ marginTop: 10 }}>CRÉDITO</h5>
                  </CardData>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardData
                    style={{
                      width: "200px",
                      margin: 0,
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setMsg("GERANDO BOLETO");
                      setSelected("BOLETO");
                      handleQrcode("BOLETO");
                    }}
                  >
                    <ImagePay
                      src={"/assets/boleto2.png"}
                      style={{ maxWidth: "7rem" }}
                      alt="pix"
                    />
                    <h5 style={{ marginTop: 0 }}>
                      {loading && selected === "BOLETO" ? (
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
                        "BOLETO"
                      )}
                    </h5>
                  </CardData>
                </div>
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
                  <img src={qrcode?.qrcode} alt="" />
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
                        <span
                          style={{ textAlign: "center", wordWrap: "anywhere" }}
                        >
                          {qrcode?.copyPaste}
                        </span>
                      </CopyToClipboard>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "2.5rem",
                  }}
                >
                  <Button
                    invert
                    onClick={() => deleteAction("DELETANDO CÓDIGO PIX")}
                    style={{ width: "15%", color: "red" }}
                  >
                    CANCELAR
                  </Button>
                  <div style={{ width: "15%" }} />
                </div>
              </div>
            </>
          )}
          {(selected === "PIX" || selected === "BOLETO") && loading && (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ReactLoading type={"bars"} color={"#00D959"} />
              </div>
              <div style={{ width: "100%" }}>
                <h5 style={{ textAlign: "center" }}>{msg}</h5>
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
                  <SavedCards
                    brand={savedCard?.brand}
                    number={savedCard?.number}
                  />
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
                <div className="flex_center">
                  <Cards
                    number={state.number}
                    expiry={state.expiry}
                    cvc={state.cvc}
                    name={state.name}
                    focused={state.focus}
                    placeholders={{ name: "SEU NOME AQUI" }}
                    locale={{ valid: "VALIDADE" }}
                  />
                  <ReactCardFlip isFlipped={flipped}>
                    <CardDataCard
                      style={{ width: window.innerWidth > 768 ? 650 : "100%" }}
                    >
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
                        style={{ width: "100%", display: "flex", marginTop: 5 }}
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
                        <div style={{ marginLeft: 5, width: "100%" }}>
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
                        <div style={{ marginLeft: 5, width: "100%" }}>
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
                          invert
                          style={{ color: "red" }}
                          onClick={() => {
                            if (savedCard?.token !== "") {
                              setSelected();
                              setSavedCard({ ...savedCard, has: true });
                            } else {
                              setSelected();
                              setSavedCard({ ...savedCard, has: false });
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button notHover onClick={handleFlipp}>
                          Endereço cartão
                        </Button>
                      </div>
                    </CardDataCard>
                    <CardDataCard>
                      <CardAddress
                        loading={loading}
                        goStep={handleNext}
                        goBackStep={handleFlipp}
                        address={cardAddres}
                        setAddress={setCardAddress}
                        // setSavedCard={setSavedCard}
                      />
                    </CardDataCard>
                  </ReactCardFlip>
                </div>
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
                        textAlign: "center",
                      }}
                    >
                      {loading
                        ? "Gerando boleto..."
                        : "Boleto aberto em nova janela"}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2.5rem",
                  }}
                >
                  <Button
                    onClick={() => deleteAction("DELETANDO BOLETO")}
                    style={{ width: "15rem", backgroundColor: "red" }}
                  >
                    CANCELAR
                  </Button>
                  <Button
                    onClick={() => navigate("/orders")}
                    style={{ width: "15rem", marginTop: "1rem" }}
                  >
                    Finalizar
                  </Button>
                </div>
              </CardData>
            </>
          )}
        </CardData>
      </ContainerWeb>
      <ContainerMobile>
        <CardData
          style={{
            width: "90%",
            margin: "auto",
            backgroundColor: "#fff",
            opacity: "0.98",
          }}
        >
          {!selected && (
            <div>
              <h3 style={{ textAlign: "center", marginBottom: 10 }}>
                DETALHES DO PEDIDO
              </h3>
              <h5
                style={{ textAlign: "center", marginTop: 20 }}
                className="bold"
              >
                Cliente: {clientName}
              </h5>
              {plansInfo.map((o) => (
                <div
                  key={o.value}
                  style={{
                    width: "90%",
                    backgroundColor: "#00D959",
                    textAlign: "center",
                    color: "white",
                    padding: "0.5rem",
                    margin: "auto",
                    borderRadius: "8px",
                    marginTop: "0.2rem",
                    position: "relative",
                  }}
                >
                  <h3 style={{ padding: "0.2rem", fontWeight: "bold" }}>
                    {o?.Plan?.Name}
                  </h3>
                  <h5>{`Preço UN: ${translateValue(o.UnitAmount)}`}</h5>
                  <h5>{`Quantidade: ${o.Quantity}`}</h5>
                  <h4 style={{ marginTop: "0.2rem" }}>{`Total: ${translateValue(
                    o.Amount
                  )}`}</h4>
                </div>
              ))}
              {plansInfo.length > 0 && (
                <>
                  <div
                    style={{
                      width: "90%",
                      backgroundColor: "#00D959",
                      textAlign: "center",
                      color: "white",
                      padding: "0.5rem",
                      margin: "auto",
                      borderRadius: "8px",
                      marginTop: "0.2rem",
                      position: "relative",
                    }}
                  >
                    <h5>{`Total items: ${qtdFinal(plansInfo)}`}</h5>
                    <h4 style={{ marginTop: "0.2rem" }}>{`Total: ${priceFinal(
                      plansInfo
                    )}`}</h4>
                  </div>
                </>
              )}
              {/* FIM ITEM */}
              <h5
                style={{ textAlign: "center", marginTop: 20 }}
                className="bold"
              >
                ESCOLHA A FORMA DE PAGAMENTO
              </h5>
              <div
                style={{
                  // display: 'flex',
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "itens",
                    textAlign: "center",
                  }}
                >
                  <CardData
                    style={{
                      width: "100%",
                      margin: 0,
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setMsg("GERANDO QRCODE-PIX");
                      setSelected("PIX");
                      handleQrcode("PIX");
                    }}
                  >
                    <ImagePay
                      src={"/assets/pix.png"}
                      style={{ maxWidth: "10rem" }}
                      alt="pix"
                    />
                    <h5 style={{ marginTop: 10 }}>
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
                    </h5>
                  </CardData>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "2rem",
                  }}
                >
                  <CardData
                    style={{
                      width: "100%",
                      margin: 0,
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelected("CREDITO")}
                  >
                    <ImagePay
                      src={"/assets/cartoes.png"}
                      style={{ maxWidth: "5rem" }}
                      alt="pix"
                    />
                    <h5 style={{ marginTop: 10 }}>CRÉDITO</h5>
                  </CardData>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    marginTop: "2rem",
                  }}
                >
                  <CardData
                    style={{
                      width: "100%",
                      margin: 0,
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setMsg("GERANDO BOLETO");
                      setSelected("BOLETO");
                      handleQrcode("BOLETO");
                    }}
                  >
                    <ImagePay
                      src={"/assets/boleto2.png"}
                      style={{ maxWidth: "7rem" }}
                      alt="pix"
                    />
                    <h5 style={{ marginTop: 0 }}>
                      {loading && selected === "BOLETO" ? (
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
                        "BOLETO"
                      )}
                    </h5>
                  </CardData>
                </div>
              </div>
            </div>
          )}
          <ContainerMobile style={{ height: "inherit", maxWidth: "100%" }}>
            {selected === "PIX" && qrcode && (
              <>
                {/* <div className='flex_center'> */}
                {/* <div className='flex_center'> */}
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
                    <img
                      src={qrcode?.qrcode}
                      alt=""
                      style={{ maxWidth: "60%" }}
                    />
                  </div>
                </div>
                {/* </div> */}
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
                        <span
                          style={{ textAlign: "center", wordWrap: "anywhere" }}
                        >
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
                      marginTop: "2.5rem",
                    }}
                  >
                    <Button
                      onClick={() => deleteAction("DELETANDO CÓDIGO PIX")}
                      style={{ width: "15rem", backgroundColor: "red" }}
                    >
                      CANCELAR
                    </Button>
                  </div>
                </div>
                {/* </div> */}
              </>
            )}
          </ContainerMobile>

          {selected === "PIX" && loading && (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ReactLoading type={"bars"} color={"#00D959"} />
              </div>
              <div style={{ width: "100%" }}>
                <h5 style={{ textAlign: "center" }}>{msg}</h5>
              </div>
            </>
          )}
          {selected === "CREDITO" && (
            <>
              {/* <div> */}
              {/* className='rccs__card rccs__card--unknown' */}
              {/* <div className='rccs__card rccs__card--unknown' style={{ width: '70vw', height: '20vh', marginBottom: '1rem' }}> */}
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
                {/* <CardDataCard> */}
                <div style={{ marginTop: "1rem" }}>
                  <h6>NOME DO DONO DO CARTÃO</h6>
                  <InputDataCard
                    style={{ width: "100%" }}
                    name="dono"
                    autoFocus
                    placeholder="Dono do cartão"
                    value={cardAddres?.name}
                    onChange={(e) =>
                      setCardAddress({ ...cardAddres, name: e.target.value })
                    }
                    // onChange={(e) => setName(e.target.value)}
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
                            mobile: e.target.value,
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
                  <div style={{ width: "100%", display: "flex", marginTop: 5 }}>
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
                </div>
                {/* </CardDataCard> */}
                {/* <CardDataCard> */}
                <CardAddress
                  loading={loading}
                  goStep={handleNext}
                  goBackStep={handleFlipp}
                  address={cardAddres}
                  setAddress={setCardAddress}
                />
                {/* </CardDataCard> */}
              </ReactCardFlip>
              {/* </div> */}
            </>
          )}
        </CardData>
      </ContainerMobile>
    </>
  );
};
