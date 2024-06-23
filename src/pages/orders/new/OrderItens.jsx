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
  validateCnpj,
  validateCpf,
} from "../../../services/util";
import { AsyncPaginate } from "react-select-async-paginate";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { MdExpandMore } from "react-icons/md";
import Chip from "@mui/material/Chip";
import _ from "lodash";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

export const OrderItens = ({
  linkIccid,
  handleNextExt,
  buyer,
  goBackStep,
  mustIccid,
  orderItems,
  setOrderItems,
  selectedEsim,
  setSelectedEsim,
  selectedSinCard,
  setSelectedSinCard,
  stoke,
  isPortIn,
  setIsPortIn,
}) => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState();
  const [planOpt, setPlanOpt] = useState([]);
  const [showModalQtd, setShowModalQtd] = useState(false);
  const [showAddIccid, setShowAddIccid] = useState(false);
  const [tmpItem, setTmpItem] = useState();
  const [qtdItens, setQtdItens] = useState(1);
  const [sinCard, setSinCard] = useState();
  const [eSim, setEsim] = useState();
  const [isChange, setIsChange] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [automatic, setAutomatic] = useState(false);

  const [isSimcard, setIsSimcard] = useState(false);
  const [isESim, setIsESim] = useState(false);
  const [name, setName] = useState();
  const [cpf, setCpf] = useState();
  const [oldNumber, setOldNumber] = useState();
  const [operator, setOperator] = useState();
  const [ddd, setDdd] = useState();

  const [qtdSinCard, setQtdSinCard] = useState("");
  const [qtdEsim, setQtdEsim] = useState("");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const loadIccids = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const response = await api.iccid.getSome1(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search,
      "simcard",
      "AVAILABLE"
    );
    const hasMore =
      response.data.meta.total > vlr + response.data.iccids.length;
    const ids = await response.data.iccids;
    const array = [];
    for (const id of ids) {
      array.push({
        value: id.Iccid,
        label: id.Iccid,
      });
    }
    return {
      options: array,
      hasMore,
    };
  };

  const loadIccidsEsim = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const response = await api.iccid.getSome1(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search,
      "esim",
      "AVAILABLE"
    );

    const hasMore =
      response.data.meta.total > vlr + response.data.iccids.length;
    const ids = await response.data.iccids;
    const array = [];
    for (const id of ids) {
      array.push({
        value: id.Iccid,
        label: id.Iccid,
      });
    }
    return {
      options: array,
      hasMore,
    };
  };

  useEffect(() => {
    api.plans
      .getByBuy(buyer.type, buyer.type === "dealer" && buyer.value)
      .then((res) => {
        const array = [];

        const filtered =
          stoke === "Transportadora"
            ? res?.data?.filter((p) =>
                p?.Products?.some((o) => o?.Product?.Technology !== "NA")
              )
            : res?.data;

        filtered?.forEach((p) => {
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

  useEffect(() => {
    if (!isPortIn) {
      setName();
      setCpf();
      setOperator();
      setOldNumber();
    }
  }, [isPortIn]);

  const addPlans = (plan) => {
    if (plan !== null) {
      setIsChange(false);
      setSelectedPlan(plan || {});
      const openQtd = plan?.Products?.some(
        (p) => p.Product?.Technology === "NA"
      );
      const array = [...orderItems];
      plan.id =
        array.length === 0 ? 1 : Number(array[array.length - 1]?.id) + 1;
      if (openQtd || stoke === "Transportadora") {
        setShowModalQtd(true);
      } else {
        plan.qtdItens = 0;
        plan.finalPrice = 0;
        plan.iccids = [];
        plan.portIn = {};
        plan.automatic = {};
        array.push(plan);
        setOrderItems(array);
        if (mustIccid) setShowAddIccid(true);
      }
      setTmpItem(plan);
    } else {
      // setPlanOpt(originPlans);
    }
  };

  const handleNext = () => {
    if (orderItems.length > 0) {
      if (
        mustIccid &&
        orderItems.some((o) =>
          o.Products?.some(
            (p) =>
              p.Product?.Technology === "Físico" ||
              p.Product?.Technology === "e-Sim"
          )
        )
      ) {
        if (!canAddGlobal()) {
          handleNextExt();
        } else {
          toast.error(t("Order.new.itens.mustIccidMsg"));
        }
      } else {
        handleNextExt();
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
        selectedPlan.iccids = [];
        array.push(selectedPlan);
        setOrderItems(array);
        setTmpItem(selectedPlan);
        openIccid = selectedPlan?.Products?.some(
          (p) =>
            p.Product?.Technology === "Físico" ||
            p.Product?.Technology === "e-Sim"
        );
        if (mustIccid) setSelectedPlan(null);
      } else {
        toast.error(t("Order.new.itens.mustPlan"));
      }
      setQtdItens(1);
      setShowModalQtd(false);
      if (mustIccid && openIccid) {
        setShowAddIccid(true);
      } else {
        setSelectedPlan(null);
      }
    } else {
      toast.error(t("Order.new.itens.minimalQuantity"));
    }
  };

  const completeAdd = () => {
    const orig = _.cloneDeep(orderItems);
    const find = orig.find((o) => o.id === tmpItem.id);
    if (linkIccid === "manual") {
      find.qtdItens =
        Number(selectedSinCard.length) + Number(selectedEsim.length);
      find.finalPrice =
        (Number(selectedSinCard.length) + Number(selectedEsim.length)) *
        find.Amount;
      const array = selectedSinCard.concat(selectedEsim);
      find.iccids = array;
    } else {
      find.qtdItens = Number(qtdEsim || 0) + Number(qtdSinCard || 0);
      find.finalPrice =
        (Number(qtdEsim || 0) + Number(qtdSinCard || 0)) * find.Amount;
      const array = [];
      find.iccids = array;
    }

    if (linkIccid === "manual") {
      find.qtdSinCard = selectedSinCard.length;
      find.qtdEsim = selectedEsim.length;
    } else {
      find.qtdSinCard = qtdSinCard;
      find.qtdEsim = qtdEsim;
    }

    find.portIn = {
      portIn: isPortIn,
      name,
      cpf,
      operator: operator?.value,
      oldNumber,
    };

    find.automatic = {
      isAutomatic: automatic,
      ddd,
      cpf,
    };

    setOrderItems(orig);
    setTmpItem();
    setSelectedEsim([]);
    setSelectedSinCard([]);
    setShowAddIccid(false);
    setIsESim(false);
    setIsSimcard(false);
    setSelectedPlan(null);
    setQtdEsim();
    setQtdSinCard();
    setIsPortIn(false);
    setAutomatic(false);
    setDdd();
    setCpf();
  };

  const handleAddIccid = () => {
    if (
      (linkIccid === "manual" &&
        selectedSinCard?.length + selectedEsim?.length === 0) ||
      (linkIccid === "automatic" &&
        Number(qtdSinCard || 0) + Number(qtdEsim || 0) === 0)
    ) {
      toast.error(t("Order.new.itens.mustIccid"));
    } else {
      if (automatic) {
        if (ddd && ddd !== "") {
          if (cpf && cpf !== "") {
            if (
              (cpf.length === 14 && validateCpf(cpf)) ||
              (cpf.length > 14 && validateCnpj(cpf))
            ) {
              completeAdd();
            } else {
              toast.error(t("Order.new.itens.validDocument"));
            }
          } else {
            toast.error(t("Order.new.itens.mustDocument"));
          }
        } else {
          toast.error(t("Order.new.itens.mustDdd"));
        }
      } else if (isPortIn) {
        if (name !== "" && name?.trim()?.length > 0) {
          if (cpf && cpf !== "") {
            if (
              (cpf?.length === 14 && validateCpf(cpf)) ||
              (cpf?.length > 14 && validateCnpj(cpf))
            ) {
              if (oldNumber?.trim()?.length > 12) {
                if (operator) {
                  completeAdd();
                } else {
                  toast.error(t("Order.new.itens.mustOperator"));
                }
              } else {
                toast.error(t("Order.new.itens.mustNumberPortIn"));
              }
            } else {
              toast.error(t("Order.new.itens.validDocument"));
            }
          } else {
            toast.error(t("Order.new.itens.mustDocument"));
          }
        } else {
          toast.error(t("Order.new.itens.mustCompletName"));
        }
      } else {
        completeAdd();
      }
    }
  };

  const handleDelete = (index) => {
    const array = [...orderItems];
    array.splice(index, 1);
    setOrderItems(array);
    if (array.length === 0) {
      setSelectedEsim([]);
      setSelectedSinCard([]);
    }
  };

  const qtdFinal = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(it.qtdItens);
    });
    return qt;
  };
  const qtdSinCards = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt =
        qt +
        Number(it?.qtdSinCard !== "" ? (it.qtdSinCard ? it.qtdSinCard : 0) : 0);
    });
    return qt;
  };
  const qtdESims = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(it?.qtdEsim !== "" ? (it.qtdEsim ? it.qtdEsim : 0) : 0);
    });
    return qt;
  };

  const qtdIccids = (itens) => {
    let qt = 0;
    itens?.forEach((it) => {
      qt = qt + Number(qtdChips(it?.Products)) * it?.qtdItens;
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

  const handleDeleteChip = (itens) => {
    const orig = _.cloneDeep(selectedSinCard);
    const find = orig.findIndex((o) => o.value === itens.value);
    orig.splice(find, 1);
    setSelectedSinCard(orig);

    let globalFind = -1;
    for (let i = 0; i < orderItems.length; i++) {
      globalFind = orderItems[i].iccids.findIndex(
        (ic) => ic.value === itens.value
      );
      if (globalFind !== -1) {
        orderItems[i].iccids.splice(globalFind, 1);
        break;
      }
    }
  };

  const handleDeleteChipForPlan = (idx, iccid) => {
    const orig = _.cloneDeep(orderItems);
    if (orig[idx].iccids.length === 1) {
      handleDelete(idx);
    } else {
      const find = orig[idx].iccids.findIndex((f) => f.value === iccid.value);
      orig[idx].iccids.splice(find, 1);
      orig[idx].qtdItens = orig[idx].qtdItens - 1;
      orig[idx].finalPrice = orig[idx].qtdItens * orig[idx].Amount;

      setOrderItems(orig);
    }
  };

  const handleDeleteEsim = (itens) => {
    const orig = _.cloneDeep(selectedEsim);
    const find = orig.findIndex((o) => o.value === itens.value);
    orig.splice(find, 1);
    setSelectedEsim(orig);
    let globalFind = -1;
    for (let i = 0; i < orderItems.length; i++) {
      globalFind = orderItems[i].iccids.findIndex(
        (ic) => ic.value === itens.value
      );
      if (globalFind !== -1) {
        orderItems[i].iccids.splice(globalFind, 1);
        break;
      }
    }
  };

  const canAddGlobal = () => {
    if (linkIccid === "automatic") {
      return false;
    }
    let qtdIccid = 0;
    orderItems.forEach((o) => {
      qtdIccid += o.iccids.length;
    });
    if (qtdIccids(orderItems) === qtdIccid) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Tooltip id="add-iccid" />
      <CardData>
        <h5>{t("Order.new.itens.title")}</h5>
        <div>
          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <Select
              options={planOpt}
              placeholder={t("Order.new.itens.selectPlaceHolder")}
              isOptionDisabled={(d) => d.CanUse === false}
              value={selectedPlan}
              onChange={(e) => {
                addPlans(e);
              }}
            />
          </div>
          {window.innerWidth < 769 ? (
            <>
              <h5>{t("Order.new.itens.itensForOrder")}</h5>
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
                  <h5>{t("Order.new.itens.notHaveItens")}</h5>
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
                        data-tooltip-content={t(
                          "Order.new.itens.tooltip.delete"
                        )}
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
                            data-tooltip-content={t(
                              "Order.new.itens.tooltip.technology"
                            )}
                            data-tooltip-place="right"
                            size={25}
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => {
                              setIsChange(true);
                              const listSincard = [];
                              const listEsim = [];
                              if (linkIccid === "manual") {
                                o?.iccids?.forEach((i) => {
                                  if (i.type === "sincard") {
                                    listSincard.push(i);
                                  } else {
                                    listEsim.push(i);
                                  }
                                });
                                setIsESim(listEsim.length > 0 ? true : false);
                                setIsSimcard(
                                  listSincard.length > 0 ? true : false
                                );
                                setSelectedSinCard(listSincard);
                                setSelectedEsim(listEsim);
                              } else {
                                setIsESim(o?.qtdEsim > 0 ? true : false);
                                setIsSimcard(o?.qtdSinCard > 0 ? true : false);
                                setSelectedSinCard([]);
                                setSelectedEsim([]);
                                setQtdEsim(o?.qtdEsim);
                                setQtdSinCard(o?.qtdSinCard);
                              }

                              setIsPortIn(o?.portIn?.portIn);
                              setName(o?.portIn?.name);
                              setCpf(o?.portIn?.cpf);
                              setOldNumber(o?.portIn?.oldNumber);
                              setOperator({
                                label: o?.portIn?.operator,
                                value: o?.portIn?.operator,
                              });
                              setDdd(o?.automatic?.ddd);
                              setAutomatic(o?.automatic?.isAutomatic);
                              setTmpItem(o);
                              setShowAddIccid(true);
                            }}
                          />
                        )}
                    </div>
                    <h3 style={{ padding: "0.2rem", fontWeight: "bold" }}>
                      {o.label}
                    </h3>
                    <h5>{`${t("Order.new.itens.price")}: ${translateValue(
                      o.Amount
                    )}`}</h5>
                    <h5>{`${t("Order.new.itens.quantity")}: ${o.qtdItens}`}</h5>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <h5>{`${t("Order.new.itens.sinCard")}: ${
                        o?.qtdSinCard === "" || !o?.qtdSinCard
                          ? "0"
                          : o?.qtdSinCard
                      }`}</h5>
                      <h5>{`${t("Order.new.itens.esim")}: ${
                        o?.qtdEsim === "" || !o?.qtdEsim ? "0" : o?.qtdEsim
                      }`}</h5>
                    </div>
                    {o?.portIn?.portIn && (
                      <div style={{ width: "100%" }}>
                        <h4>{t("Order.new.itens.portIn")}</h4>
                        <h5>
                          {t("Order.new.itens.name")}: {o?.portIn?.name}
                        </h5>
                        <h5>
                          {t("Order.new.itens.document")}: {o?.portIn?.cpf}
                        </h5>
                        <h5>
                          {t("Order.new.itens.line")}: {o?.portIn?.oldNumber}
                        </h5>
                        <h5>
                          {t("Order.new.itens.operator")}: {o?.portIn?.operator}
                        </h5>
                      </div>
                    )}
                    {o?.automatic?.isAutomatic && (
                      <div style={{ width: "100%" }}>
                        <h4>{t("Order.new.itens.preActivation")}</h4>
                        <h5>
                          {t("Order.new.itens.ddd")}: {o?.automatic?.ddd}
                        </h5>
                        <h5>
                          {t("Order.new.itens.document")}: {o?.automatic?.cpf}
                        </h5>
                      </div>
                    )}
                    {o?.iccids?.map((i) => (
                      <h5 key={i.label}>{i?.label}</h5>
                    ))}
                    <h4
                      style={{ marginTop: "0.2rem" }}
                    >{`Total: ${translateValue(o.finalPrice)}`}</h4>
                  </div>
                ))
              )}
            </>
          ) : (
            <div style={{ overflowX: window.innerWidth < 768 && "scroll" }}>
              <TableItens>
                <tr>
                  <th>{t("Order.new.itens.table.item")}</th>
                  <th>{t("Order.new.itens.table.price")}</th>
                  <th>{t("Order.new.itens.table.quantity")}</th>
                  <th>{t("Order.new.itens.table.quantityIccid")}</th>
                  <th>{t("Order.new.itens.table.total")}</th>
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
                          {Number(m?.qtdSinCard) > 0 && (
                            <div>
                              {t("Order.new.itens.sinCard")}: {m?.qtdSinCard}
                            </div>
                          )}
                          {Number(m?.qtdEsim) > 0 && (
                            <div>
                              {t("Order.new.itens.esim")}: {m?.qtdEsim}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                                  data-tooltip-content={t(
                                    "Order.new.itens.tooltip.add"
                                  )}
                                  data-tooltip-place="right"
                                  style={{ cursor: "pointer", color: "blue" }}
                                  size={25}
                                  onClick={() => {
                                    setIsChange(true);
                                    const listSincard = [];
                                    const listEsim = [];
                                    if (linkIccid === "manual") {
                                      m?.iccids?.forEach((i) => {
                                        if (i.type === "sincard") {
                                          listSincard.push(i);
                                        } else {
                                          listEsim.push(i);
                                        }
                                      });
                                      setIsESim(
                                        listEsim.length > 0 ? true : false
                                      );
                                      setIsSimcard(
                                        listSincard.length > 0 ? true : false
                                      );
                                      setSelectedSinCard(listSincard);
                                      setSelectedEsim(listEsim);
                                    } else {
                                      setIsESim(m?.qtdEsim > 0 ? true : false);
                                      setIsSimcard(
                                        m?.qtdSinCard > 0 ? true : false
                                      );
                                      setSelectedSinCard([]);
                                      setSelectedEsim([]);
                                      setQtdEsim(m?.qtdEsim);
                                      setQtdSinCard(m?.qtdSinCard);
                                    }

                                    setIsPortIn(m?.portIn?.portIn);
                                    setName(m?.portIn?.name);
                                    setCpf(m?.portIn?.cpf);
                                    setOldNumber(m?.portIn?.oldNumber);
                                    setOperator({
                                      label: m?.portIn?.operator,
                                      value: m?.portIn?.operator,
                                    });
                                    setDdd(m?.automatic?.ddd);
                                    setAutomatic(m?.automatic?.isAutomatic);
                                    setTmpItem(m);
                                    setShowAddIccid(true);
                                  }}
                                />
                              )}
                            <AiFillDelete
                              data-tooltip-id="add-iccid"
                              data-tooltip-content={t(
                                "Order.new.itens.tooltip.deleteItem"
                              )}
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
                            {t("Order.new.itens.products")}
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
                          {m?.automatic?.isAutomatic && (
                            <div style={{ width: "100%" }}>
                              {t('Order.new.itens.preActivation')}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  gap: 10,
                                  width: "100%",
                                }}
                              >
                                <div>{t('Order.new.itens.ddd')}: {m?.automatic?.ddd}</div>
                                <div>{t('Order.new.itens.document')}: {m?.automatic?.cpf}</div>
                              </div>
                            </div>
                          )}
                          {m?.portIn?.portIn && (
                            <div style={{ width: "100%" }}>
                              {t('Order.new.itens.porIn')}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  gap: 10,
                                }}
                              >
                                <div>{t('Order.new.itens.name')}: {m?.portIn?.name}</div>
                                <div>{t('Order.new.itens.document')}: {m?.portIn?.cpf}</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "start",
                                  gap: 10,
                                }}
                              >
                                <div>{t('Order.new.itens.line')}: {m?.portIn?.oldNumber}</div>
                                <div>{t('Order.new.itens.operator')}: {m?.portIn?.operator}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        {m.iccids?.length > 0 && (
                          <div style={{ width: "100%", columnSpan: "2" }}>
                            <Accordion
                              sx={{
                                "& .MuiAccordion-root": {
                                  height: 5,
                                },
                              }}
                              expanded={expanded === `panel${i}`}
                              onChange={handleChange(`panel${i}`)}
                            >
                              <AccordionSummary
                                expandIcon={<MdExpandMore />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                              >
                                <Typography
                                  sx={{ width: "33%", flexShrink: 0 }}
                                >
                                  {t('Order.new.itens.iccidsVinc')}: ({m.iccids?.length})
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div style={{ margin: 2 }}>
                                  {m.iccids.map((iccid) => (
                                    <Chip
                                      sx={{
                                        margin: "1px",
                                        backgroundColor: "#00D959",
                                        color: "#fff",
                                        "& .MuiChip-deleteIcon": {
                                          color: "red",
                                          backgroundColor: "white",
                                          borderRadius: "50%",
                                        },
                                      }}
                                      key={iccid.value}
                                      label={iccid.label}
                                      onDelete={() =>
                                        handleDeleteChipForPlan(i, iccid)
                                      }
                                    />
                                  ))}
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        )}
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
                            <div>{t('Order.new.itens.sinCard')}: {qtdSinCards(orderItems)}</div>
                          )}
                          {qtdESims(orderItems) > 0 && (
                            <div>{t('Order.new.itens.esim')}: {qtdESims(orderItems)}</div>
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
        <DialogTitle id="alert-dialog-title">{t('Order.new.itens.modalQtd.title')}</DialogTitle>
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{t('Order.new.itens.modalIccids.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${t('Order.new.itens.modalIccids.msg')} ${tmpItem?.label}`}
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
                {isSimcard && linkIccid === "manual" ? (
                  <>
                    <div style={{ marginTop: "1.5rem" }}>
                      <div
                        style={{
                          display: window.innerWidth > 768 && "flex",
                          alignItems: "center",
                        }}
                      >
                        <h5 style={{ marginRight: "1rem" }}>
                        {t('Order.new.itens.modalIccids.vincSincard')}
                        </h5>
                      </div>

                      <div>
                        <AsyncPaginate
                          defaultOptions
                          cacheUniqs={selectedSinCard}
                          placeholder={t('Order.new.itens.modalIccids.selectSinCards')}
                          noOptionsMessage={() => t('Order.new.itens.modalIccids.notHaveSinCards')}
                          value={sinCard}
                          loadOptions={loadIccids}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          menuPosition={"fixed"}
                          onChange={(e) => {
                            setSinCard(null);
                            if (e !== null) {
                              if (
                                !isPortIn ||
                                selectedEsim.length + selectedSinCard.length ===
                                  0
                              ) {
                                const find = selectedSinCard.findIndex(
                                  (s) => s.value === e.value
                                );
                                let globalFind = -1;
                                for (let i = 0; i < orderItems.length; i++) {
                                  globalFind = orderItems[i].iccids.findIndex(
                                    (ic) => ic.value === e.value
                                  );
                                  if (globalFind !== -1) {
                                    break;
                                  }
                                }
                                if (find === -1 && globalFind === -1) {
                                  setSelectedSinCard([
                                    ...selectedSinCard,
                                    {
                                      label: e.label,
                                      value: e.value,
                                      type: "sincard",
                                    },
                                  ]);
                                } else {
                                  toast.error(
                                    t('Order.new.itens.modalIccids.sinCardUsed')
                                  );
                                }
                              } else {
                                toast.error(
                                  t('Order.new.itens.modalIccids.onePortIn')
                                );
                              }
                            }
                          }}
                        />
                      </div>
                      <div
                        style={{
                          marginTop: "0.5rem",
                          maxHeight: "200px",
                          overflowY: "scroll",
                        }}
                      >
                        {selectedSinCard.map((i) => (
                          <Chip
                            sx={{
                              margin: "1px",
                              backgroundColor: "#00D959",
                              color: "#fff",
                              "& .MuiChip-deleteIcon": {
                                color: "red",
                                backgroundColor: "white",
                                borderRadius: "50%",
                              },
                            }}
                            key={i}
                            label={i.value}
                            onDelete={() => handleDeleteChip(i)}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  isSimcard &&
                  linkIccid === "automatic" && (
                    <>
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
                            type="number"
                            placeholder={t('Order.new.itens.modalIccids.howManySinCardPlaceHolder')}
                            style={{ width: "100%" }}
                            value={qtdSinCard}
                            onChange={(e) => {
                              if (
                                Number(qtdEsim) +
                                  Number(qtdSinCard) +
                                  Number(e.target.value) >
                                  1 &&
                                isPortIn
                              ) {
                                toast.error(
                                  t('Order.new.itens.modalIccids.onePortIn')
                                );
                              } else {
                                setQtdSinCard(e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )
                )}
                {isESim && linkIccid === "manual" ? (
                  <div style={{ marginTop: "1.5rem" }}>
                    <div
                      style={{
                        display: window.innerWidth > 768 && "flex",
                        alignItems: "center",
                      }}
                    >
                      <h5 style={{ marginRight: "1rem" }}>
                      {t('Order.new.itens.modalIccids.vincEsim')}
                      </h5>
                    </div>
                    <div>
                      <AsyncPaginate
                        defaultOptions
                        cacheUniqs={selectedEsim}
                        loadOptions={loadIccidsEsim}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPosition={"fixed"}
                        placeholder={t('Order.new.itens.modalIccids.selectEsims')}
                        noOptionsMessage={() => t('Order.new.itens.modalIccids.notHaveEsims')}
                        value={eSim}
                        onChange={(e) => {
                          if (e !== null) {
                            if (
                              !isPortIn ||
                              selectedEsim.length + selectedSinCard.length === 0
                            ) {
                              setEsim(null);
                              const find = selectedEsim.findIndex(
                                (s) => s.value === e.value
                              );
                              let globalFind = -1;
                              for (let i = 0; i < orderItems.length; i++) {
                                globalFind = orderItems[i].iccids.findIndex(
                                  (ic) => ic.value === e.value
                                );
                                if (globalFind !== -1) {
                                  break;
                                }
                              }
                              if (find === -1 && globalFind === -1) {
                                setSelectedEsim([
                                  ...selectedEsim,
                                  {
                                    label: e?.label,
                                    value: e?.value,
                                    type: "esim",
                                  },
                                ]);
                              } else {
                                toast.error(
                                  t('Order.new.itens.modalIccids.sinCardUsed')
                                );
                              }
                            } else {
                              toast.error(
                                t('Order.new.itens.modalIccids.onePortIn')
                              );
                            }
                          }
                        }}
                      />
                    </div>
                    <div
                      style={{
                        marginTop: "0.5rem",
                        maxHeight: "200px",
                        overflowY: "scroll",
                      }}
                    >
                      {selectedEsim.map((i) => (
                        <Chip
                          sx={{
                            margin: "1px",
                            backgroundColor: "#00D959",
                            color: "#fff",
                            "& .MuiChip-deleteIcon": {
                              color: "red",
                              backgroundColor: "white",
                              borderRadius: "50%",
                            },
                          }}
                          key={i}
                          label={i.value}
                          onDelete={() => handleDeleteEsim(i)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  isESim &&
                  linkIccid === "automatic" && (
                    <>
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
                              if (
                                Number(qtdEsim) +
                                  Number(qtdSinCard) +
                                  Number(e.target.value) >
                                  1 &&
                                isPortIn
                              ) {
                                toast.error(
                                  t('Order.new.itens.modalIccids.onePortIn')
                                );
                              } else {
                                setQtdEsim(e.target.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )
                )}
              </>
            )}
            {tmpItem?.qtdItens > 1 && <Tooltip id="check-portin" />}
            {(isSimcard || isESim) && (
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={isPortIn}
                      data-tooltip-id="check-portin"
                      data-tooltip-content={t('Order.new.itens.tooltip.onePortIn')}
                      sx={{
                        "&.Mui-checked": {
                          color: "green",
                        },
                      }}
                      checked={automatic}
                      onChange={(e) => setAutomatic(e.target.checked)}
                    />
                  }
                  label={t('Order.new.itens.preActivation')}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={
                        tmpItem?.qtdItens > 1 ||
                        Number(qtdEsim) > 1 ||
                        Number(qtdSinCard) > 1 ||
                        Number(qtdEsim) + Number(qtdSinCard) > 1 ||
                        selectedEsim.length > 1 ||
                        selectedSinCard.length > 1 ||
                        selectedEsim.length + selectedSinCard.length > 1 ||
                        automatic
                      }
                      data-tooltip-id="check-portin"
                      data-tooltip-content={t('Order.new.itens.tooltip.onePortIn')}
                      sx={{
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
                      value={cpf}
                      onChange={(e) => setCpf(documentFormat(e.target.value))}
                    />
                  </div>
                </div>
                {/*  */}
                <div>
                  <div
                    style={{
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
                      value={oldNumber}
                      onChange={(e) =>
                        setOldNumber(phoneFormat(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    alignItems: "center",
                  }}
                >
                  <h5 style={{ marginRight: "0.2rem" }}>{t('Order.new.itens.portInItens.operator')}</h5>
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
                      isSearchable={false}
                      placeholder={t('Order.new.itens.portInItens.operatorPlaceHolder')}
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
            {automatic && (
              <>
                <div>
                  <div
                    style={{
                      display: window.innerWidth > 768 && "flex",
                      alignItems: "center",
                    }}
                  >
                    <h5 style={{ marginRight: "0.2rem" }}>{t('Order.new.itens.portInItens.ddd')}</h5>
                  </div>

                  <div>
                    <InputData
                      id="name"
                      type="text"
                      placeholder={t('Order.new.itens.portInItens.ddd')}
                      style={{ width: "100%" }}
                      pattern="\d*"
                      maxLength={2}
                      value={ddd}
                      onChange={(e) => setDdd(e.target.value)}
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
                      value={cpf}
                      onChange={(e) => setCpf(documentFormat(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            invert
            onClick={() => {
              if (!isChange) {
                const array = _.cloneDeep(orderItems);
                array.splice(array.length - 1, 1);
                setOrderItems(array);
                setIsESim(false);
                setIsSimcard(false);
                setSelectedEsim([]);
                setSelectedSinCard([]);
                setTmpItem(null);
                setQtdEsim();
                setQtdSinCard();
                setIsPortIn(false);
              }
              setShowAddIccid(false);
            }}
          >
            {t('Order.new.itens.portInItens.buttonCancel')}
          </Button>
          <Button onClick={handleAddIccid}>{t('Order.new.itens.portInItens.buttonAdd')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
