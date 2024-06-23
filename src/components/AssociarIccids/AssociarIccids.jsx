/* eslint-disable react/prop-types */
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FaUsers } from "react-icons/fa";
import { BiSolidStoreAlt } from "react-icons/bi";
import { Button } from "../../../globalStyles";
import ReactLoading from "react-loading";
import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import AsyncSelect from "react-select/async";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { toast } from "react-toastify";
import { translateError } from "../../services/util";
import { useTranslation } from "react-i18next";
// import { toast } from 'react-toastify'

export const AssociarIccids = ({ showModal, setShowModal }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sinCard, setSinCard] = useState();
  const [eSim, setEsim] = useState();
  const [selectedSinCard, setSelectedSinCard] = useState([]);
  const [selectedEsim, setSelectedEsim] = useState([]);
  const [buyer, setBuyer] = useState();
  const navigate = useNavigate();
  const [steep, setSteep] = useState(0);

  const action = () => {
    if (steep === 0) {
      if (selectedEsim.length === 0 && selectedSinCard.length === 0) {
        toast.error(t("Iccids.vincIccid.iccidRequired"));
      } else {
        setSteep(1);
      }
    } else {
      if (buyer) {
        // console.log('vincular', buyer, selectedEsim, selectedSinCard );
        setLoading(true);
        const list = [];
        selectedEsim.forEach((s) => {
          list.push(s.value);
        });
        selectedSinCard.forEach((s) => {
          list.push(s.value);
        });
        api.iccid
          .link(
            buyer.type !== "client" ? buyer.value : buyer.dealerId,
            buyer.type !== "client" ? null : buyer.value,
            list
          )
          .then((res) => {
            // console.log(res);
            toast.success(res?.data?.Message);
            setBuyer();
            setSelectedEsim([]);
            setSelectedSinCard([]);
            setSteep(0);
            setShowModal(false);
          })
          .catch((err) => {
            translateError(err);
          })
          .finally(() => setLoading(false));
        // console.log({
        //   dealerId: buyer.type !== 'client' ? buyer.value : buyer.dealerId,
        //   finalClientId: buyer.type !== 'client' ? null : buyer.value,
        //   iccids: list,
        // });
      } else {
        toast.error(t("Iccids.vincIccid.userRequired"));
      }
    }
  };

  const cancelAction = () => {
    if (steep === 0) {
      setBuyer();
      setSelectedEsim([]);
      setSelectedSinCard([]);
      setShowModal(false);
    } else {
      setSteep(0);
    }
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
    const hasMore = response.data.meta.total > vlr;
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
    const hasMore = response.data.meta.total > vlr;
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

  const loadClientsDealers = async (search) => {
    if (api.currentUser.AccessTypes[0] !== "CLIENT") {
      const responseC = await api.client.getSome(1, 15, search);
      const clients = await responseC.data.finalClients;
      let responseD = [];
      let dealers = [];
      if (api.currentUser.AccessTypes[0] === "TEGG") {
        responseD = await api.dealer.getSome(1, 15, search);
        dealers = await responseD.data.dealers;
      }

      const array = [];
      if (clients.length !== 0) {
        const clientsObj = {
          label: t("Iccids.vincIccid.clients"),
          options: [],
        };
        for (const c of clients) {
          // if (c.AssociatedResaleId === null) {
          clientsObj.options.push({
            value: c.Id,
            label: c.Name,
            dealerId: c.DealerId,
            type: "client",
          });
          // }
        }
        array.push(clientsObj);
      }
      if (dealers.length !== 0) {
        const dealersObj = {
          label: t("Iccids.vincIccid.resales"),
          options: [],
        };
        for (const d of dealers) {
          dealersObj.options.push({
            value: d.Id,
            dealerId: null,
            label: d.CompanyName || d.Name,
            type: "dealer",
          });
        }
        array.push(dealersObj);
      }
      return array;
    }
  };

  const handleDeleteChip = (e) => {
    const orig = _.cloneDeep(selectedSinCard);
    const find = orig.findIndex((f) => f.value === e.value);
    if (find !== -1) {
      orig.splice(find, 1);
      setSelectedSinCard(orig);
    }
  };

  const handleDeleteEsim = (e) => {
    const orig = _.cloneDeep(selectedEsim);
    const find = orig.findIndex((f) => f.value === e.value);
    if (find !== -1) {
      orig.splice(find, 1);
      setSelectedEsim(orig);
    }
  };

  return (
    <Dialog
      open={showModal}
      onClose={() => {
        setShowModal(false);
        setSteep(0);
        setBuyer();
        setSelectedEsim([]);
        setSelectedSinCard([]);
      }}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("Iccids.vincIccid.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <>
            {steep === 0 ? (
              <>
                <div>
                  <div
                    style={{
                      display: window.innerWidth > 768 && "flex",
                      alignItems: "center",
                    }}
                  >
                    <h5 style={{ marginRight: "1rem" }}>
                      {t("Iccids.vincIccid.chip")}
                    </h5>
                  </div>

                  <div>
                    <AsyncPaginate
                      defaultOptions
                      // cacheUniqs={selectedSinCard}
                      placeholder={t("Iccids.vincIccid.selectChips")}
                      noOptionsMessage={() => t("Iccids.vincIccid.cleanChips")}
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
                          const find = selectedSinCard.findIndex(
                            (s) => s.value === e.value
                          );
                          if (find === -1) {
                            setSelectedSinCard([
                              ...selectedSinCard,
                              {
                                label: e.label,
                                value: e.value,
                                type: "sincard",
                              },
                            ]);
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
                <div style={{ marginTop: "0.5rem" }}>
                  <div
                    style={{
                      display: window.innerWidth > 768 && "flex",
                      alignItems: "center",
                    }}
                  >
                    <h5 style={{ marginRight: "1rem" }}>
                      {t("Iccids.vincIccid.esim")}
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
                      placeholder={t("Iccids.vincIccid.selectEsim")}
                      noOptionsMessage={() => t("Iccids.vincIccid.cleanEsim")}
                      value={eSim}
                      onChange={(e) => {
                        if (e !== null) {
                          setEsim(null);
                          const find = selectedEsim.findIndex(
                            (s) => s.value === e.value
                          );
                          if (find === -1) {
                            setSelectedEsim([
                              ...selectedEsim,
                              {
                                label: e?.label,
                                value: e?.value,
                                type: "esim",
                              },
                            ]);
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
              </>
            ) : (
              <div style={{ marginTop: "0.5rem" }}>
                <div
                  style={{
                    display: window.innerWidth > 768 && "flex",
                    alignItems: "center",
                  }}
                >
                  <h5 style={{ marginRight: "1rem" }}>
                    {t("Iccids.vincIccid.selectOwner")}
                  </h5>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100%" }}>
                    <AsyncSelect
                      style={{ width: "200px" }}
                      loadOptions={loadClientsDealers}
                      placeholder={t("Iccids.vincIccid.searchOwner")}
                      defaultOptions
                      isClearable
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      menuPosition={"fixed"}
                      value={buyer}
                      onChange={(e) => {
                        setBuyer(e);
                        if (e === null) {
                          // setSelectedClient("");
                          // setSelectedResaleBuying("");
                          // setFreightValue(0);
                          // setFreightCalculated(false);
                        } else {
                          if (e.type === "dealer") {
                            // setSelectedClient("");
                            // setSelectedResaleBuying(e.value);
                          } else {
                            // setSelectedClient(e.value);
                            // setSelectedResaleBuying("");
                          }
                          // getAddress(e.value, e.type);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      style={{ marginLeft: 10 }}
                      onClick={() => navigate("/salesforce/new")}
                    >
                      +
                      <BiSolidStoreAlt size={15} color="#FFF" />
                    </Button>
                  </div>
                  <div>
                    <Button
                      style={{ marginLeft: 10 }}
                      onClick={() => navigate("/clients/new")}
                    >
                      +
                      <FaUsers size={15} color="#FFF" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button invert onClick={cancelAction}>
          {steep === 0
            ? t("Iccids.vincIccid.buttonCancel")
            : t("Iccids.vincIccid.buttonGoback")}
        </Button>
        <Button notHover={loading} onClick={action} autoFocus>
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
          ) : steep === 0 ? (
            t("Iccids.vincIccid.buttonNext")
          ) : (
            t("Iccids.vincIccid.buttonRegister")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
