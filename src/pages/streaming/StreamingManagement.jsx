import { Button, ContainerMobile, ContainerWeb, PageLayout } from "../../../globalStyles";

import {
  // Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  // FormControlLabel,
  // FormGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Loading } from "../../components/loading/Loading";
import { InputData, TableItens } from "../orders/clientNew/NewOrder.styles";
import {
  cleanNumber,
  documentFormat,
  phoneFormat,
  translateError,
} from "../../services/util";
import { InputPassSignUp } from "../resetPassword/ResetPassword.styles";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";
import api from "../../services/api";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
// import { StreamingManagementTable } from "./StreamingManagementTable";
import { StreamingManagementMobile } from "./StreamingManagementMobile";
import {StreamingManagementTableHomolog} from "./StreamingManagementTableHomolog";
// import _ from "lodash";
import { useTranslation } from "react-i18next";
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const StreamingManagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(t("StreamingManager.msgCreation"));
  const [password, setPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [typePassR, setTypePassR] = useState("password");
  const [typePass, setTypePass] = useState("password");

  const [qtdStandard, setQtdStandard] = useState();
  const [qtdPremium, setQtdPremium] = useState();

  const [document, setDocument] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [user, setUser] = useState();
  const [phone, setPhone] = useState();
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState();
  // const [page, setPage] = useState(1)
  // const [limit, setLimit] = useState(200)
  const page = 1
  const limit = 200
  // const [maxPages, setMaxPages] = useState(1);

  const [streamers, setStreamers] = useState([1]);
  const [search, setSearch] = useState("");
  // const [planOptAdd, setPlanOptAdd] = useState([]);

  const handleTypePass = () => {
    setTypePass(typePass === "password" ? "text" : "password");
  };

  const handleTypePassR = () => {
    setTypePassR(typePassR === "password" ? "text" : "password");
  };

  const searchStreamers = () => {
    setMsg(t("StreamingManager.msgSearchUsers"));
    setLoading(true);
    api.streaming
      .getAll(search, page, limit)
      .then((res) => {
        // setMaxPages(res.data?.meta?.totalPages || 1);
        setStreamers(res.data);
      })
      .catch((err) => translateError(err))
      .finally(() => setLoading(false));
  };

  const searchProducts = () => {
    api.plans
      .getByBuy("client", null)
      .then((res) => {
        const filtered = res?.data.filter((f) =>
          f.Products.every((p) => p.Product.Technology === "Streaming")
        );
        if (filtered) {
          const list = [];
          filtered.forEach((f) => {
            f.Products.forEach((p) => {
              if (p.Product.PlayHubId === "Q") {
                list.push({
                  label: p.Product.Name,
                  value: p.Product.PlayHubId,
                  selected: false,
                });
              }
            });
          });
          filtered.forEach((f) => {
            f.Products.forEach((p) => {
              if (p.Product.PlayHubId === "P") {
                list.push({
                  label: p.Product.Name,
                  value: p.Product.PlayHubId,
                  selected: false,
                });
              }
            });
          });

          // setPlanOptAdd(list);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    searchStreamers();
    searchProducts();
  }, [search, page, limit]);

  const loadClientsDealers = async (search) => {
    if (api.currentUser.AccessTypes[0] !== "CLIENT") {
      const responseC = await api.client.getSome(1, 15, search);
      const clients = await responseC.data.finalClients;

      const array = [];
      if (clients.length !== 0) {
        for (const c of clients) {
          array.push({
            value: c.Id,
            label: `${c.Name} - ${documentFormat(c.Cpf || c.Cnpj)}`,
            dealerId: c.DealerId,
            type: "client",
            all: c,
          });
        }
      }

      return array;
    }
  };

  const handleCreate = () => {
    if (user) {
      if (phone) {
        if (password) {
          if (repeatPass) {
            if (password === repeatPass) {
              // const hasProduct = planOptAdd.some((p) => p.selected);
              if (qtdStandard || qtdPremium) {
                setMsg(t("StreamingManager.msgAddUser"));
                setLoading(true);
                api.streaming
                  .newUser(
                    user,
                    cleanNumber(document),
                    password,
                    name,
                    email,
                    cleanNumber(phone),
                    client.Id
                  )
                  .then(async () => {
                    setMsg(t("StreamingManager.msgAddNewProducts"));
                    setLoading(true);
                    if (qtdStandard) {
                      if (qtdStandard > 0) {
                        let qtdFinal = 0;
                        if (qtdStandard < 10) {
                          qtdFinal = `0${qtdStandard}`;
                        } else {
                          qtdFinal = `${qtdStandard}`;
                        }
                        await api.streaming.addPlan(user, `Q${qtdFinal}`);
                      }
                    }
                    if (qtdPremium) {
                      if (qtdPremium > 0) {
                        let qtdFinal = 0;
                        if (qtdPremium < 10) {
                          qtdFinal = `0${qtdPremium}`;
                        } else {
                          qtdFinal = `${qtdPremium}`;
                        }
                        await api.streaming.addPlan(user, `P${qtdFinal}`);
                      }
                    }
                    toast.success(t("StreamingManager.msgAddNewProducts"));
                    setOpen(false);
                    setUser();
                    setPassword();
                    setRepeatPass();
                    setTypePass("password");
                    setTypePassR("password");
                    searchStreamers();
                  })
                  .catch((err) => {
                    translateError(err);
                  })
                  .finally(() => setLoading(false));
              } else {
                toast.error(t("StreamingManager.error.requiredProduct"));
              }
            } else {
              toast.error(t("StreamingManager.error.passwordNotMatch"));
            }
          } else {
            toast.error(t("StreamingManager.error.passwordConfirm"));
          }
        } else {
          toast.error(t("StreamingManager.error.password"));
        }
      } else {
        toast.error(t("StreamingManager.error.phone"));
      }
    } else {
      toast.error(t("StreamingManager.error.selectUser"));
    }
  };

  const setQuantity = (quantity, type) => {
    const value = quantity.replace(/[/().\s-]+/g, "");
    if (type === 'Standard' && (value < 11 && value >= 0)) {
      setQtdStandard(value);
    }
    if (type === 'Premium' && value < 6 && value >= 0) {
      setQtdPremium(value);
    }
  };

  // const handlePageChange = (event, value) => {
  //   setPage(value);
  //   // getClients();
  // };

  // const handlePageSizeChange = (e) => {
  //   setLimit(e.target.value);
  //   // setPageNum(1);
  //   // getClients(1, search, dealer, e.target.value);
  // };

  return (
    <>
      <Loading open={loading} msg={msg} />
      <PageLayout>
      <PageTitles title='Tegg TV' />
        <div className="btn_container">
          <Button onClick={() => setOpen(true)}>
            {t("StreamingManager.newUser")}
          </Button>
        </div>
        <div
          style={{
            display: screen.width > 768 && "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <h3>{t("StreamingManager.searchClient")}</h3>
          <InputData
            id="searchClient"
            type="text"
            // disabled={searched}
            placeholder={t("StreamingManager.conditionSearch")}
            style={{
              width: screen.width < 768 ? "100%" : 250,
              marginBottom: screen.width < 768 && "1rem",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ContainerWeb>
        {streamers.length > 0 ? (
          <TableItens style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>{t("StreamingManager.user")}</th>
                <th>{t("StreamingManager.login")}</th>
                <th>{t("StreamingManager.document")}</th>
                <th>{t("StreamingManager.plan")}</th>
                <th>{t("StreamingManager.dateContract")}</th>
                <th>{t("StreamingManager.validity")}</th>
              </tr>
            </thead>
            {streamers.map((stream, index) => (
              <StreamingManagementTableHomolog
                key={index}
                stream={stream}
                setLoading={setLoading}
                setMsg={setMsg}
                search={searchStreamers}
              />
            ))}
            {/* {streamers.map((stream, index) => (
              <StreamingManagementTable key={index} stream={stream} setLoading={setLoading} setMsg={setMsg} />
            ))} */}
          </TableItens>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 150,
            }}
          >
            <h2 style={{ color: "black", fontWeight: "bold" }}>
              {t("StreamingManager.notHaveClient")}
            </h2>
          </div>
        )}
        </ContainerWeb>
        <ContainerMobile style={{ width: "100%", height: "100%" }}>
              {streamers.map((stream, index) => (
                <StreamingManagementMobile
                key={index}
                stream={stream}
                setLoading={setLoading}
                setMsg={setMsg}
                search={searchStreamers}
                />
              ))}
            </ContainerMobile>
        {/* <div style={{ display: "flex", justifyContent: "center", marginTop: '1rem' }}>
            <Stack
              spacing={2}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Pagination
                count={maxPages}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
              />
              <div style={{ display: "flex", gap: 5 }}>
                <p>{t("Clients.table.itensForPage")}:</p>
                <select
                  name="pages"
                  id="page-select"
                  value={limit}
                  onChange={(e) => {
                    handlePageSizeChange(e);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </Stack>
          </div> */}
      </PageLayout>

      <Dialog open={open} fullWidth>
        <DialogTitle>{t("StreamingManager.titleAccess")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <h5>{t("StreamingManager.selectClient")}</h5>
            <AsyncSelect
              // style={{ width: "200px" }}
              loadOptions={loadClientsDealers}
              placeholder={t("StreamingManager.selectOrSearch")}
              defaultOptions
              isClearable
              // menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={"fixed"}
              value={client}
              onChange={(e) => {
                setClient(e);
                setUser(e?.all?.Email);
                setEmail(e?.all?.Email);
                setDocument(e?.all?.Cpf || e?.all?.Cnpj);
                setPhone(e?.all?.Mobile);
                setName(e?.all?.Name);
                if (!e) {
                  setUser("");
                  setPhone("");
                  setClient();
                  setEmail();
                  setDocument();
                  setName();
                }
              }}
            />
            <div style={{ width: "100%", display: window.innerWidth > 768 && 'flex', gap: 10 }}>
              <div style={{ width: "100%" }}>
                <h5>{t("StreamingManager.userInput")}</h5>
                <InputData
                  disabled
                  value={user}
                  style={{ width: "100%" }}
                  onChange={(e) => setUser(e.target.value)}
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>{t("StreamingManager.phoneInput")}</h5>
                <InputData
                  value={phone}
                  style={{ width: "100%" }}
                  onChange={(e) => setPhone(phoneFormat(e.target.value))}
                />
              </div>
            </div>

            <div style={{ width: "100%", display: window.innerWidth > 768 && 'flex', gap: 10 }}>
              <div style={{ width: "100%" }}>
                <h5>{t("StreamingManager.passwordInput")}</h5>
                <InputPassSignUp style={{ margin: "0px" }}>
                  <input
                    style={{
                      border: "1px solid #00D959",
                      background: "transparent",
                      fontSize: "14px",
                    }}
                    type={typePass}
                    placeholder=""
                    value={password}
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password &&
                    (typePass === "password" ? (
                      <LiaEyeSolid
                        className="eyes"
                        onClick={handleTypePass}
                        size={25}
                      />
                    ) : (
                      <LiaEyeSlash
                        className="eyes"
                        onClick={handleTypePass}
                        size={25}
                      />
                    ))}
                </InputPassSignUp>
              </div>
              <div style={{ width: "100%" }}>
                <h5>{t("StreamingManager.repeatPassword")}</h5>
                <InputPassSignUp style={{ margin: "0px" }}>
                  <input
                    style={{
                      border: "1px solid #00D959",
                      background: "transparent",
                      fontSize: "14px",
                    }}
                    type={typePassR}
                    placeholder=""
                    value={repeatPass}
                    id="passwordr"
                    name="password"
                    onChange={(e) => setRepeatPass(e.target.value)}
                  />
                  {repeatPass &&
                    (typePassR === "password" ? (
                      <LiaEyeSolid
                        className="eyes"
                        onClick={handleTypePassR}
                        size={25}
                      />
                    ) : (
                      <LiaEyeSlash
                        className="eyes"
                        onClick={handleTypePassR}
                        size={25}
                      />
                    ))}
                </InputPassSignUp>
              </div>
            </div>

            <div style={{ width: "100%", display: window.innerWidth > 768 && 'flex', gap: 10 }}>
              <div style={{ width: "100%" }}>
                <h5>{t("StreamingManager.quantityStandard")}</h5>
                <InputData
                  type="number"
                  value={qtdStandard}
                  style={{ width: "100%" }}
                  onChange={(e) => setQuantity(e.target.value, 'Standard')}
                />
              </div>
              <div style={{ width: "100%" }}>
                <h5>{t("StreamingManager.quantityPremium")}</h5>
                <InputData
                  type="number"
                  value={qtdPremium}
                  style={{ width: "100%" }}
                  onChange={(e) => setQuantity(e.target.value, 'Premium')}
                />
              </div>
            </div>
            {/* </div> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setOpen(false)}>
            {t("StreamingManager.buttonCancel")}
          </Button>
          <Button
            onClick={handleCreate}
            style={{ color: "#000", minWidth: 140 }}
          >
            {t("StreamingManager.buttonCreate")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
