/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { CardData, InputData, TableItens } from "./NewOrder.styles";
import { Tooltip } from "react-tooltip";
import Select from "react-select";
import { AiFillDelete } from "react-icons/ai";
import { FaSimCard } from "react-icons/fa6";

import { Button } from "../../../../globalStyles";
import { toast } from "react-toastify";
import {
  documentFormat,
  phoneFormat,
  qtdChips,
  translateValue,
} from "../../../services/util";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import _ from "lodash";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

export const OrderItens = ({
  handleNextExt,
  goBackStep,
  mustIccid,
  orderItems,
  setOrderItems,
  setSelectedEsim,
  selectedSinCard,
  setSelectedSinCard,
  clientRequest,
}) => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState();
  const [qtdSinCard, setQtdSinCard] = useState("");
  const [qtdEsim, setQtdEsim] = useState("");

  const [planOpt, setPlanOpt] = useState([]);
  // const [originPlans, setOriginPlans] = useState([]);
  const [showModalQtd, setShowModalQtd] = useState(false);
  const [showAddIccid, setShowAddIccid] = useState(false);
  const [tmpItem, setTmpItem] = useState();
  const [qtdItens, setQtdItens] = useState(1);

  const [isPortIn, setIsPortIn] = useState(clientRequest || false);
  const [isSimcard, setIsSimcard] = useState(false);
  const [isESim, setIsESim] = useState(false);
  const [name, setName] = useState();
  const [cpf, setCpf] = useState();
  const [oldNumber, setOldNumber] = useState();
  const [operator, setOperator] = useState();
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    api.plans
      .getByBuy("client", null)
      .then((res) => {
        const array = [];
        res.data?.forEach((p) => {
          array.push({
            value: p.Id,
            label: p.Name,
            Amount: p.Amount,
            Products: p.Products,
            CanUse: p.CanUse,
          });
        });
        setPlanOpt(array);
      })
      .catch((err) => console.log(err));
  }, []);

  const addPlans = (plan) => {
    if (plan !== null) {
      setIsChange(false);
      setSelectedPlan(plan || {});

      const openQtd = plan?.Products?.some(
        (p) =>
          p.Product?.Technology === "NA" ||
          p.Product?.Technology === "Streaming"
      );
      const isTV = plan?.label?.includes("Streaming");

      const array = [...orderItems];
      plan.id =
        array.length === 0 ? 1 : Number(array[array.length - 1]?.id) + 1;
      if (openQtd && isTV) {
        setShowModalQtd(true);
        // plan.qtdItens = 1;
        // plan.finalPrice = plan.Amount;
        // plan.iccids = {};
        // plan.portIn = {};
        // array.push(plan);
        // setOrderItems(array);
      } else if (openQtd) {
        setShowModalQtd(true);
      } else {
        plan.qtdItens = 0;
        plan.finalPrice = 0;
        plan.iccids = {};
        plan.portIn = {};
        array.push(plan);
        setOrderItems(array);
        setTmpItem(plan);

        if (mustIccid) {
          setShowAddIccid(true);
        } else {
          setSelectedPlan(null);
        }
      }
    } else {
      // setPlanOpt(originPlans);
    }
  };

  const cleanAll = () => {
    setTmpItem();
    setQtdEsim("");
    setQtdSinCard("");
    setName();
    setIsPortIn(false);
    setCpf();
    setOldNumber();
    setOperator();
    setIsESim(false);
    setIsSimcard(false);
  };

  const handleNext = () => {
    if (orderItems.length > 0) {
      if (!canAddGlobal()) {
        handleNextExt();
      } else {
        toast.error(t("Order.new.itens.mustIccidMsg"));
      }
    } else {
      toast.error(t("Order.new.itens.mustItem"));
    }
  };

  const handleAdd = () => {
    let openIccid = false;
    if (qtdItens > 0) {
      if (Object.keys(selectedPlan).length !== 0) {
        const array = [...orderItems];
        selectedPlan.qtdItens = qtdItens;
        selectedPlan.finalPrice = qtdItens * selectedPlan.Amount;
        selectedPlan.iccids = {};
        selectedPlan.portIn = {};
        array.push(selectedPlan);
        setOrderItems(array);

        // const orig = _.cloneDeep(planOpt);
        // const find = orig.findIndex((f) => f.value === selectedPlan.value);
        // orig.splice(find, 1);
        // setPlanOpt(orig);
        setTmpItem(selectedPlan);
        openIccid = selectedPlan?.Products?.some(
          (p) =>
            p.Product?.Technology === "Físico" ||
            p.Product?.Technology === "e-Sim"
        );

        if (mustIccid) setSelectedPlan(null);
      } else {
        toast.error(t('Order.new.itens.mustPlan'));
      }
      setQtdItens(1);
      setShowModalQtd(false);
      if (mustIccid && openIccid) setShowAddIccid(true);
    } else {
      toast.error(t('Order.new.itens.minimalQuantity'));
    }
  };

  const completOrder = () => {
    const orig = _.cloneDeep(orderItems);
    const find = orig.find((o) => o.id === tmpItem.id);
    find.iccids = { qtdEsim: qtdEsim, qtdSinCard: qtdSinCard };
    // INICIO
    find.qtdItens =
      Number(qtdEsim !== "" ? qtdEsim : 0) +
      Number(qtdSinCard !== "" ? qtdSinCard : 0);
    find.finalPrice =
      (Number(qtdEsim !== "" ? qtdEsim : 0) +
        Number(qtdSinCard !== "" ? qtdSinCard : 0)) *
      find.Amount;
    // FIM
    find.portIn = {
      portIn: isPortIn,
      name,
      cpf,
      operator: operator?.value,
      oldNumber,
    };
    // if(qtdSinCard){
    if (selectedSinCard.length === 0) {
      if ((qtdSinCard !== "" || qtdSinCard !== "0") && qtdSinCard) {
        setSelectedSinCard([
          ...selectedSinCard,
          { orderId: tmpItem.value, sinCard: qtdSinCard },
        ]);
      }
    } else {
      const orig = _.cloneDeep(selectedSinCard);
      const has = orig.findIndex((s) => s.orderId === tmpItem.value);
      if (has > -1) {
        if (qtdSinCard === "" || qtdSinCard === "0") {
          orig.splice(has, 1);
        } else {
          orig[has].sinCard = qtdSinCard;
        }
        setSelectedSinCard(orig);
      } else {
        if ((qtdSinCard !== "" || qtdSinCard !== "0") && qtdSinCard) {
          setSelectedSinCard([
            ...selectedSinCard,
            { orderId: tmpItem.value, sinCard: qtdSinCard },
          ]);
        }
      }
    }
    // }
    setOrderItems(orig);
    setTmpItem();
    setQtdEsim("");
    setQtdSinCard("");
    setName();
    setIsPortIn(false);
    setCpf();
    setOldNumber();
    setOperator();
    setShowAddIccid(false);
    setIsESim(false);
    setIsSimcard(false);
    setSelectedPlan(null);
  };

  const handleAddIccid = () => {
    // if (
    //   qtdChips(tmpItem?.Products) * Number(tmpItem?.qtdItens) ===
    //   Number(qtdEsim) + Number(qtdSinCard)
    // ) {
    if (isPortIn) {
      if (name !== "") {
        if (cpf.length === 14 || cpf.length === 16) {
          if (oldNumber.length > 12) {
            if (operator) {
              completOrder();
            } else {
              toast.error(t('Order.new.itens.mustOperator'));
            }
          } else {
            toast.error(t('Order.new.itens.mustNumberPortIn'));
          }
        } else {
          toast.error(t('Order.new.itens.mustDocument'));
        }
      } else {
        toast.error(t('Order.new.itens.mustCompletName'));
      }
    } else {
      if (qtdEsim !== "" || qtdSinCard !== "") {
        completOrder();
      } else {
        if (isSimcard && !isESim) {
          toast.error(t('Order.new.itens.informQuantitySinCard'));
        } else if (isESim && !isSimcard) {
          toast.error(t('Order.new.itens.informQuantityEsim'));
        } else if (isESim && isSimcard) {
          toast.error(t('Order.new.itens.informQuantitySinCardAndEsim'));
        } else {
          toast.error(t('Order.new.itens.mustSinCardOrEsim'));
        }
      }
    }
  };

  const handleDelete = (index) => {
    const array = [...orderItems];
    const id = array[index];

    array.splice(index, 1);
    setOrderItems(array);
    if (array.length === 0) {
      setSelectedEsim([]);
      setSelectedSinCard([]);
    } else {
      const sim = _.cloneDeep(selectedSinCard);
      const find = sim.findIndex((s) => s.orderId === id.value);
      if (find > -1) {
        sim.splice(find, 1);
        setSelectedSinCard(sim);
      }
    }
  };

  const qtdFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(it.qtdItens);
    });
    return qt;
  };

  const qtdIccids = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt =
        qt +
        Number(it.iccids?.qtdEsim ? it.iccids?.qtdEsim : 0) +
        Number(it.iccids?.qtdSinCard ? it.iccids?.qtdSinCard : 0);
    });
    return qt;
  };

  const priceFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + it.finalPrice;
    });
    return translateValue(qt);
  };

  const canAddGlobal = () => {
    let qtdIccid = 0;
    orderItems.forEach((o) => {
      qtdIccid += qtdChips(o.Products) * Number(o.qtdItens);
    });
    if (qtdIccids(orderItems) === qtdIccid) {
      return false;
    }
    return true;
  };

  const handleAddChip = (type, value) => {
    console.log(type, value);

    if (Number(value) > 10) {
      toast.error(t('Order.new.itens.itensLimit'));
      return;
    }

    if (!Number.isInteger(Number(value))) {
      toast.error(t('Order.new.itens.mustInteger'));
      return;
    }
    // const must = qtdChips(tmpItem?.Products) * Number(tmpItem?.qtdItens);
    if (type === "sincard") {
      // if (Number(qtdEsim) + Number(qtdSinCard) === must && value !== '') {
      //   toast.error('Você não pode adicionar mais e-Sim ou SimCard');
      // } else if (Number(qtdEsim) + Number(qtdSinCard) + Number(value) > must) {
      //   toast.error(
      //     `Você só pode adicionar ${must > 1 ? 'mais' : ''} ${
      //       must - (Number(qtdEsim) + Number(qtdSinCard))
      //     } e-Sim ou SimCard`
      //   );
      // } else {
      setQtdSinCard(value);
      // }
    } else {
      // if (Number(qtdEsim) + Number(qtdSinCard) === must && value !== '') {
      //   toast.error('Você não pode adicionar mais e-Sim ou SimCard');
      // } else if (Number(qtdEsim) + Number(qtdSinCard) + Number(value) > must) {
      //   toast.error(
      //     `Você só pode adicionar ${must > 1 ? 'mais' : ''}  ${
      //       must - (Number(qtdEsim) + Number(qtdSinCard))
      //     } e-Sim ou SimCard`
      //   );
      // } else {
      setQtdEsim(value);
      // }
    }
  };

  const qtdSinCards = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt =
        qt +
        Number(
          it?.iccids?.qtdSinCard !== ""
            ? it.iccids?.qtdSinCard
              ? it.iccids?.qtdSinCard
              : 0
            : 0
        );
    });
    return qt;
  };
  const qtdESims = (itens) => {
    console.log(itens);
    let qt = 0;
    itens?.forEach((it) => {
      qt =
        qt +
        Number(
          it?.iccids?.qtdEsim !== ""
            ? it.iccids?.qtdEsim
              ? it.iccids?.qtdEsim
              : 0
            : 0
        );
    });
    return qt;
  };

  return (
    <>
      <Tooltip id="add-iccid" />
      <CardData>
        <h5>{t('Order.new.itens.title')}</h5>
        <div>
          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <Select
              options={planOpt}
              placeholder={t('Order.new.itens.selectPlaceHolder')}
              value={selectedPlan}
              onChange={(e) => {
                addPlans(e);
              }}
            />
          </div>

          {window.innerWidth < 769 ? (
            <>
              <h5>{t('Order.new.itens.itensForOrder')}</h5>
              {orderItems.length === 0 ? (
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#00D959",
                    textAlign: "center",
                    color: "white",
                    marginTop: "0.2rem",
                    minHeight: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h5>{t('Order.new.itens.notHaveItens')}</h5>
                </div>
              ) : (
                orderItems.map((o, i) => (
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
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "16px",
                      }}
                    >
                      <AiFillDelete
                        data-tooltip-id="add-iccid"
                        data-tooltip-content={t('Order.new.itens.tooltip.delete')}
                        data-tooltip-place="top"
                        size={25}
                        style={{
                          cursor: "pointer",
                          color: "red",
                          marginLeft: 5,
                        }}
                        onClick={() => {
                          handleDelete(i);
                        }}
                      />
                    </div>
                    <div
                      style={{ position: "absolute", top: "8px", left: "16px" }}
                    >
                      {mustIccid &&
                        o?.Products?.some(
                          (p) =>
                            p.Product?.Technology === "Físico" ||
                            p.Product?.Technology === "e-Sim"
                        ) && (
                          <FaSimCard
                            data-tooltip-id="add-iccid"
                            data-tooltip-content={t('Order.new.itens.tooltip.technology')}
                            data-tooltip-place="right"
                            size={25}
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => {
                              setIsChange(true);
                              setIsESim(o?.iccids?.qtdEsim !== "");
                              setIsSimcard(o?.iccids?.qtdSinCard !== "");
                              setQtdEsim(o?.iccids?.qtdEsim);
                              setQtdSinCard(o?.iccids?.qtdSinCard);
                              setTmpItem(o);
                              setIsPortIn(o.portIn?.portIn ? true : false);
                              setName(o?.portIn?.name);
                              setCpf(o?.portIn?.cpf);
                              setOldNumber(o?.portIn?.oldNumber);
                              setOperator({
                                label: o?.portIn?.operator,
                                value: o?.portIn?.operator,
                              });
                              setShowAddIccid(true);
                            }}
                          />
                        )}
                    </div>
                    <h3 style={{ padding: "0.2rem", fontWeight: "bold" }}>
                      {o.label}
                    </h3>
                    <h5>{`${t('Order.new.itens.price')}: ${translateValue(o.Amount)}`}</h5>
                    <h5>{`${t('Order.new.itens.quantity')}: ${o.qtdItens}`}</h5>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <h5>{`${t('Order.new.itens.sinCard')}: ${
                        o.iccids?.qtdSinCard === "" || !o.iccids?.qtdSinCard
                          ? "0"
                          : o.iccids?.qtdSinCard
                      }`}</h5>
                      <h5>{`${t('Order.new.itens.esim')}: ${
                        o.iccids?.qtdEsim === "" || !o.iccids?.qtdEsim
                          ? "0"
                          : o.iccids?.qtdEsim
                      }`}</h5>
                    </div>
                    {/* INICIO */}
                    {o?.portIn?.portIn && (
                      <div style={{ width: "100%" }}>
                        <h4>{t('Order.new.itens.portIn')}</h4>
                        <h5>{t('Order.new.itens.name')}: {o?.portIn?.name}</h5>
                        <h5>{t('Order.new.itens.document')}: {o?.portIn?.cpf}</h5>
                        <h5>{t('Order.new.itens.line')}: {o?.portIn?.oldNumber}</h5>
                        <h5>{t('Order.new.itens.operator')}: {o?.portIn?.operator}</h5>
                      </div>
                    )}
                    {/* FIM */}
                    <h4
                      style={{ marginTop: "0.2rem" }}
                    >{`${t('Order.new.itens.table.total')}: ${translateValue(o.finalPrice)}`}</h4>
                  </div>
                ))
              )}
            </>
          ) : (
            <div style={{ overflowX: window.innerWidth < 768 && "scroll" }}>
              <TableItens>
                <tr>
                  <th>{t('Order.new.itens.table.item')}</th>
                  <th>{t('Order.new.itens.table.price')}</th>
                  <th>{t('Order.new.itens.table.quantity')}</th>
                  <th>{t('Order.new.itens.table.chips')}</th>
                  <th>{t('Order.new.itens.table.total')}</th>
                </tr>
                {orderItems.length === 0 && (
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                )}
                {orderItems.map((m, i) => (
                  <>
                    <tr key={i}>
                      <td>{m.label}</td>
                      <td>{translateValue(m.Amount)}</td>
                      <td>{m.qtdItens}</td>
                      <td>
                        <div>
                          {m?.iccids?.qtdEsim && (
                            <p>{`${t('Order.new.itens.esim')}: ${m?.iccids?.qtdEsim}`}</p>
                          )}
                          {m?.iccids?.qtdSinCard && (
                            <p>{`${t('Order.new.itens.sinCard')}: ${m?.iccids?.qtdSinCard}`}</p>
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>{translateValue(m.finalPrice)}</p>
                          <div style={{ display: "flex" }}>
                            {mustIccid &&
                              m?.Products?.some(
                                (p) =>
                                  p.Product?.Technology === "Físico" ||
                                  p.Product?.Technology === "e-Sim"
                              ) && (
                                <FaSimCard
                                  data-tooltip-id="add-iccid"
                                  data-tooltip-content={t('Order.new.itens.tooltip.technology')}
                                  data-tooltip-place="right"
                                  size={25}
                                  style={{ cursor: "pointer", color: "blue" }}
                                  onClick={() => {
                                    setIsChange(true);
                                    setIsESim(m?.iccids?.qtdEsim !== "");
                                    setIsSimcard(m?.iccids?.qtdSinCard !== "");
                                    setQtdEsim(m?.iccids?.qtdEsim);
                                    setQtdSinCard(m?.iccids?.qtdSinCard);
                                    setTmpItem(m);
                                    setIsPortIn(
                                      m.portIn?.portIn ? true : false
                                    );
                                    setName(m?.portIn?.name);
                                    setCpf(m?.portIn?.cpf);
                                    setOldNumber(m?.portIn?.oldNumber);
                                    setOperator({
                                      label: m?.portIn?.operator,
                                      value: m?.portIn?.operator,
                                    });
                                    setShowAddIccid(true);
                                  }}
                                />
                              )}
                            <AiFillDelete
                              data-tooltip-id="add-iccid"
                              data-tooltip-content={t('Order.new.itens.tooltip.deleteItem')}
                              data-tooltip-place="top"
                              size={25}
                              style={{
                                cursor: "pointer",
                                color: "red",
                                marginLeft: 5,
                              }}
                              onClick={() => {
                                handleDelete(i);
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5">
                        <div
                          style={{
                            marginLeft: 10,
                            color: "black",
                            display: "grid",
                            gridTemplateColumns: "auto auto",
                          }}
                        >
                          <div style={{ width: "100%" }}>
                          {t('Order.new.itens.products')}
                            {m?.Products?.map((c) => (
                              <div key={c}>
                                <span key={c.Id}>
                                  {c?.Product?.Name} -{" "}
                                  {translateValue(c?.Product?.Amount)}
                                </span>
                                <br />
                              </div>
                            ))}
                          </div>
                          {m?.portIn?.portIn && (
                            <div style={{ width: "100%" }}>
                               {t('Order.new.itens.portIn')}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  gap: 10,
                                }}
                              >
                                <div> {t('Order.new.itens.name')}: {m?.portIn?.name}</div>
                                <div> {t('Order.new.itens.document')}: {m?.portIn?.cpf}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  gap: 10,
                                }}
                              >
                                <div> {t('Order.new.itens.line')}: {m?.portIn?.oldNumber}</div>
                                <div> {t('Order.new.itens.operator')}: {m?.portIn?.operator}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* </div> */}
                      </td>
                    </tr>
                  </>
                ))}
                {orderItems.length > 0 && (
                  <>
                    <tr>
                      <td />
                      <td />
                      <td>{qtdFinal(orderItems)}</td>
                      <td>
                        <div>
                          {qtdSinCards(orderItems) > 0 && (
                            <div> {t('Order.new.itens.sinCard')}: {qtdSinCards(orderItems)}</div>
                          )}
                          {qtdESims(orderItems) > 0 && (
                            <div> {t('Order.new.itens.esim')}: {qtdESims(orderItems)}</div>
                          )}
                        </div>
                      </td>
                      <td>{priceFinal(orderItems)}</td>
                    </tr>
                  </>
                )}
              </TableItens>
            </div>
          )}
        </div>
        <div className="flex end btn_invert">
          <Button
            onClick={goBackStep}
            style={{ width: window.innerWidth < 768 && "100%" }}
          >
             {t('Order.new.itens.buttonGoback')}
          </Button>
          <Button
            notHover
            onClick={handleNext}
            style={{ width: window.innerWidth < 768 && "100%" }}
          >
             {t('Order.new.itens.buttonNext')}
          </Button>
        </div>
      </CardData>

      <Dialog
        open={showModalQtd}
        onClose={() => setShowModalQtd(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"> {t('Order.new.itens.modalQtd.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {t('Order.new.itens.modalQtd.msg1')} {selectedPlan?.label} {t('Order.new.itens.modalQtd.msg2')}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
            >
              <InputData
                id="qtd"
                type="number"
                placeholder={t('Order.new.itens.modalQtd.quantityItens')}
                style={{ width: "100%" }}
                autoFocus
                // className="input_2"
                // defaultValue={1}
                value={qtdItens}
                onChange={(e) => setQtdItens(e.target.value)}
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setShowModalQtd(false)}>
            {t('Order.new.itens.modalQtd.buttonCancel')}
          </Button>
          <Button onClick={handleAdd}>{t('Order.new.itens.modalQtd.buttonAdd')}</Button>
        </DialogActions>
      </Dialog>

      {/* ICCIDS ao pedido */}
      <Dialog
        open={showAddIccid}
        // onClose={() => setShowAddIccid(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{t('Order.new.itens.modalIccids.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${t('Order.new.itens.modalIccids.msgTechnology')} ${
              qtdChips(tmpItem?.Products) * Number(tmpItem?.qtdItens) > 1
                ? t('Order.new.itens.modalIccids.msgTechnology1')
                : t('Order.new.itens.modalIccids.msgTechnology2')
            } ${
              qtdChips(tmpItem?.Products) * Number(tmpItem?.qtdItens) > 1
                ? qtdChips(tmpItem?.Products) * Number(tmpItem?.qtdItens)
                : ""
            } ${
              qtdChips(tmpItem?.Products) * Number(tmpItem?.qtdItens) > 1
                ? t('Order.new.itens.modalIccids.msgTechnology3')
                : t('Order.new.itens.modalIccids.msgTechnology4')
            } ${t('Order.new.itens.modalIccids.msgTechnology5')} ${tmpItem?.label}`}
            {mustIccid && orderItems.length > 0 && (
              <>
                <FormGroup
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        // disabled={tmpItem?.qtdItens > 1}
                        sx={{
                          "&.Mui-checked": {
                            color: "green",
                          },
                        }}
                        checked={isSimcard}
                        onChange={(e) => {
                          setIsSimcard(e.target.checked);
                          if (!e.target.checked) {
                            setQtdSinCard("");
                          }
                        }}
                      />
                    }
                    label={t('Order.new.itens.modalIccids.sinCard')}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        // disabled={tmpItem?.qtdItens > 1}
                        sx={{
                          "&.Mui-checked": {
                            color: "green",
                          },
                        }}
                        checked={isESim}
                        onChange={(e) => {
                          setIsESim(e.target.checked);
                          if (!e.target.checked) {
                            setQtdEsim("");
                          }
                        }}
                      />
                    }
                    label={t('Order.new.itens.modalIccids.esim')}
                  />
                </FormGroup>
                {isSimcard && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <div
                      style={{
                        display: window.innerWidth > 768 && "flex",
                        alignItems: "center",
                      }}
                    >
                      <h5 style={{ marginRight: "1rem" }}>
                      {t('Order.new.itens.modalIccids.howManySinCard')}
                      </h5>
                    </div>

                    <div>
                      <InputData
                        id="qtd"
                        // disabled={disabledSincard}
                        type="number"
                        placeholder={t('Order.new.itens.modalIccids.howManySinCardPlaceHolder')}
                        style={{ width: "100%" }}
                        // className="input_2"
                        // defaultValue={1}
                        value={qtdSinCard}
                        onChange={(e) => {
                          handleAddChip("sincard", e.target.value);
                          // setQtdSinCard(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                )}
                {isESim && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <div
                      style={{
                        display: window.innerWidth > 768 && "flex",
                        alignItems: "center",
                      }}
                    >
                      <h5 style={{ marginRight: "1rem" }}>
                      {t('Order.new.itens.modalIccids.howManyEsim')}
                      </h5>
                    </div>
                    <div>
                      <InputData
                        id="qtd1"
                        type="number"
                        placeholder={t('Order.new.itens.modalIccids.howManyEsimPlaceHolder')}
                        style={{ width: "100%" }}
                        value={qtdEsim}
                        onChange={(e) => {
                          handleAddChip("esim", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                )}

                {tmpItem?.qtdItens > 1 && <Tooltip id="check-portin" />}
                {(isSimcard || isESim) && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={
                            tmpItem?.qtdItens > 1 ||
                            Number(qtdEsim) > 1 ||
                            Number(qtdSinCard) > 1 ||
                            Number(qtdEsim) + Number(qtdSinCard) > 1
                          }
                          data-tooltip-id="check-portin"
                          data-tooltip-content={t('Order.new.itens.tooltip.onePortIn')}
                          //  data-tooltip-place='right'
                          sx={{
                            // color: pink[800],
                            "&.Mui-checked": {
                              color: "green",
                            },
                          }}
                          checked={isPortIn}
                          onChange={(e) => setIsPortIn(e.target.checked)}
                        />
                      }
                      label={t('Order.new.itens.portIn')}
                    />
                  </FormGroup>
                )}
                {isPortIn && (
                  <>
                    <div>
                      <div
                        style={{
                          display: window.innerWidth > 768 && "flex",
                          alignItems: "center",
                        }}
                      >
                        <h5 style={{ marginRight: "0.2rem" }}>{t('Order.new.itens.portInItens.name')}</h5>
                      </div>

                      <div>
                        <InputData
                          id="name"
                          type="text"
                          placeholder={t('Order.new.itens.portInItens.namePlaceHolder')}
                          style={{ width: "100%" }}
                          // className="input_2"
                          // defaultValue={1}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          display: window.innerWidth > 768 && "flex",
                          alignItems: "center",
                        }}
                      >
                        <h5 style={{ marginRight: "0.2rem" }}>{t('Order.new.itens.portInItens.document')}</h5>
                      </div>

                      <div>
                        <InputData
                          id="document"
                          type="text"
                          placeholder={t('Order.new.itens.portInItens.document')}
                          style={{ width: "100%" }}
                          // className="input_2"
                          // defaultValue={1}
                          value={cpf}
                          onChange={(e) =>
                            setCpf(documentFormat(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    {/*  */}
                    <div>
                      <div
                        style={{
                          // display: window.innerWidth > 768 && 'flex',
                          alignItems: "center",
                        }}
                      >
                        <h5 style={{ marginRight: "0.2rem" }}>
                        {t('Order.new.itens.portInItens.line')}
                        </h5>
                      </div>

                      <div>
                        <InputData
                          id="phone"
                          placeholder={t('Order.new.itens.portInItens.linePlaceHolder')}
                          style={{ width: "100%" }}
                          // className="input_2"
                          // defaultValue={1}
                          value={oldNumber}
                          onChange={(e) =>
                            setOldNumber(phoneFormat(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        // display: window.innerWidth < 768 && 'flex',
                        alignItems: "center",
                      }}
                    >
                      <h5 style={{ marginRight: "0.2rem" }}>
                      {t('Order.new.itens.portInItens.operatorOld')}
                      </h5>
                      <div>
                        <Select
                          options={[
                            { label: "Algar", value: "ALGAR" },
                            { label: "Claro", value: "CLARO" },
                            { label: "Oi", value: "OI" },
                            { label: "Sercomtel", value: "SERCOMTEL" },
                            { label: "Tim", value: "TIM" },
                            { label: "Vivo", value: "VIVO" },
                          ]}
                          // isMulti
                          isSearchable={false}
                          placeholder="Selecione..."
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPlacement="top"
                          value={operator}
                          onChange={setOperator}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              !isChange && handleDelete(orderItems.length - 1);
              cleanAll();
              setShowAddIccid(false);
            }}
          >
             {t('Order.new.itens.portInItens.buttonCancel')}
          </Button>
          <Button onClick={handleAddIccid}> {t('Order.new.itens.portInItens.buttonAdd')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
