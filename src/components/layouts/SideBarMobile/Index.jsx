/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { SidebarMobileContainer } from "./styles";
import logoCompleto from "/assets/tegg-verde.png";
import { useNavigate } from "react-router-dom";
import PermissionView from "../../../routes/PermissionView";
import api from "../../../services/api";
import { useTranslation } from "react-i18next";

export const SideBarMobile = ({ open, setHas, setOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [w, setW] = useState("0px");
  const [h, setH] = useState("0px");
  const [expand, setExpand] = useState({
    order: false,
    line: false,
    profile: false,
  });

  const goExit = () => {
    api.user.logout();
    navigate("/login");
  };

  useEffect(() => {
    if (open) {
      setW(`${screen.width}px`);
      setH(`${screen.height}px`);
      setTimeout(() => {
        setHas(1);
      }, 70);

      setTimeout(() => {
        setHas(2);
      }, 120);
    } else {
      setHas(3);
      setTimeout(() => {
        setHas(4);
      }, 50);

      setTimeout(() => {
        setHas(0);
      }, 70);
    }
  }, [open]);
  return (
    <>
      <SidebarMobileContainer>
        <div
          className={`circle ${open ? "expand" : ""}`}
          style={{ zIndex: open ? 99 : 0, width: w, height: h }}
        ></div>
        <div className="menu">
          <ul>
            <div>
              {/* IMAGE */}
              <li
                className={open ? "animate" : ""}
                style={{ zIndex: open ? 101 : 0, width: w }}
              >
                {open && (
                  <img
                    src={logoCompleto}
                    style={{ width: "40%" }}
                    alt="profileImg"
                    onClick={() => {
                      navigate("/");
                      setOpen(false);
                      setExpand({ order: false, line: false, profile: false });
                    }}
                  />
                )}
              </li>
              {/* DASHBOARD */}
              <li className={open ? "animate" : ""}>
                <a>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: open ? 999 : 0,
                    }}
                    onClick={() => {
                      navigate("/");
                      setOpen(false);
                      setExpand({ order: false, line: false, profile: false });
                    }}
                  >
                    <span className="link_name">{t("Menu.dashboard")}</span>
                  </div>
                </a>
              </li>
              <PermissionView role="TEGG">
                <li className={open ? "animate" : ""}>
                  <a>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: open ? 999 : 0,
                      }}
                      onClick={() => {
                        navigate("/management/streaming");
                        setOpen(false);
                        setExpand({
                          order: false,
                          line: false,
                          profile: false,
                        });
                      }}
                    >
                      <span className="link_name">Tegg TV</span>
                    </div>
                  </a>
                </li>
              </PermissionView>
              <PermissionView role="CLIENT,AGENT">
                <li className={open ? "animate" : ""}>
                  <a>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: open ? 999 : 0,
                      }}
                      onClick={() => {
                        navigate("/streaming");
                        setOpen(false);
                        setExpand({
                          order: false,
                          line: false,
                          profile: false,
                        });
                      }}
                    >
                      <span className="link_name">{t("Menu.streaming")}</span>
                    </div>
                  </a>
                </li>
              </PermissionView>
              {/* PLANOS */}
              <PermissionView role="TEGG">
                <li className={open ? "animate" : ""}>
                  <a>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                      }}
                      onClick={() => {
                        navigate("/plans");
                        setOpen(false);
                        setExpand({
                          order: false,
                          line: false,
                          profile: false,
                        });
                      }}
                    >
                      <span className="link_name">{t("Menu.plans")}</span>
                    </div>
                  </a>
                </li>
              </PermissionView>
              {/* PRODUTOS */}
              <PermissionView role="TEGG">
                <li className={open ? "animate" : ""}>
                  <a>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                      }}
                      onClick={() => {
                        navigate("/products");
                        setOpen(false);
                        setExpand({
                          order: false,
                          line: false,
                          profile: false,
                        });
                      }}
                    >
                      <span className="link_name">{t("Menu.products")}</span>
                    </div>
                  </a>
                </li>
              </PermissionView>
              {/* ICCIDS */}
              <PermissionView role="TEGG,DEALER">
                <li className={open ? "animate" : ""}>
                  <a>
                     <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                      }}
                      onClick={() => {
                        navigate("/iccids");
                        setOpen(false);
                        setExpand({
                          order: false,
                          line: false,
                          profile: false,
                        });
                      }}
                    >
                      <span className="link_name">{t("Menu.iccids")}</span>
                    </div>
                  </a>
                </li>
              </PermissionView>
              {/* REVENDAS */}
              <PermissionView role="TEGG">
                <li className={open ? "animate" : ""}>
                  <a>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                      }}
                      onClick={() => {
                        if (api.currentUser.AccessTypes[0] === "TEGG") {
                          navigate("/salesforce");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        } else {
                          navigate("/salesforce/details");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        }
                      }}
                    >
                      <span className="link_name">
                        {api.currentUser.AccessTypes[0] === "TEGG"
                          ? t("Menu.resales")
                          : t("Menu.resale")}
                      </span>
                    </div>
                  </a>
                </li>
              </PermissionView>
              {/* CLIENTES */}
              <PermissionView role="TEGG,DEALER">
                <li className={open ? "animate" : ""}>
                  <a>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-around",
                        alignItems: "center",
                        zIndex: 999,
                      }}
                      onClick={() => {
                        navigate("/clients");
                        setOpen(false);
                        setExpand({
                          order: false,
                          line: false,
                          profile: false,
                        });
                      }}
                    >
                      <span className="link_name">{t("Menu.clients")}</span>
                    </div>
                  </a>
                </li>
              </PermissionView>
              {/* PEDIDOS */}
              <li className={open ? "animate" : ""}>
                <a>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 999,
                    }}
                    onClick={() => {
                      setExpand({
                        line: false,
                        profile: false,
                        order: !expand.order,
                      });
                    }}
                  >
                    <span className="link_name">{t("Menu.orders")}</span>
                    {expand.order ? (
                      <i className="bx bxs-chevron-up arrow" />
                    ) : (
                      <i className="bx bxs-chevron-down arrow" />
                    )}
                  </div>
                  {expand.order && (
                    <div
                      style={{
                        display: "flex",
                        margin: 10,
                        position: "relative",
                        flexDirection: "column",
                        gap: 20,
                        backgroundColor: "#1d1b31",
                        padding: 10,
                      }}
                    >
                      <span
                        className="link_name"
                        onClick={() => {
                          navigate("/orders");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        }}
                      >
                        {t("Menu.orders")}
                      </span>
                      <PermissionView role="TEGG">
                        <span
                          className="link_name"
                          onClick={() => {
                            navigate("/statement");
                            setOpen(false);
                            setExpand({
                              order: false,
                              line: false,
                              profile: false,
                            });
                          }}
                        >
                          {t("Menu.extract")}
                        </span>
                      </PermissionView>
                      <PermissionView role="TEGG,DEALER">
                        <span
                          className="link_name"
                          onClick={() => {
                            navigate("/orders/pending");
                            setOpen(false);
                            setExpand({
                              order: false,
                              line: false,
                              profile: false,
                            });
                          }}
                        >
                          {t("Menu.ordersPending")}
                        </span>
                      </PermissionView>
                      <PermissionView role="TEGG">
                        <span
                          className="link_name"
                          onClick={() => {
                            navigate("/activation");
                            setOpen(false);
                            setExpand({
                              order: false,
                              line: false,
                              profile: false,
                            });
                          }}
                        >
                          {t("Menu.activationsPending")}
                        </span>
                      </PermissionView>
                      <PermissionView role="TEGG">
                        <span
                          className="link_name"
                          onClick={() => {
                            navigate("/activation/manual");
                            setOpen(false);
                            setExpand({
                              order: false,
                              line: false,
                              profile: false,
                            });
                          }}
                        >
                          {t("Menu.activeNewLine")}
                        </span>
                      </PermissionView>
                      <span
                        className="link_name"
                        onClick={() => {
                          navigate("/nfe");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        }}
                      >
                        {t("Menu.invoices")}
                      </span>
                      <PermissionView role="TEGG,DEALER,AGENT">
                        <span
                          className="link_name"
                          onClick={() => {
                            navigate("/preorder");
                            setOpen(false);
                            setExpand({
                              order: false,
                              line: false,
                              profile: false,
                            });
                          }}
                        >
                          Pré-Cadastros
                        </span>
                      </PermissionView>
                    </div>
                  )}
                </a>
              </li>
              {/* LINHAS */}
              <li className={open ? "animate" : ""}>
                <a>
                 
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 999,
                    }}
                    onClick={() => {
                      setExpand({
                        order: false,
                        profile: false,
                        line: !expand.line,
                      });
                    }}
                  >
                    <span className="link_name">{t("Menu.lines")}</span>
                    {expand.line ? (
                      <i className="bx bxs-chevron-up arrow" />
                    ) : (
                      <i className="bx bxs-chevron-down arrow" />
                    )}
                  </div>
                  {expand.line && (
                    <div
                      style={{
                        display: "flex",
                        margin: 10,
                        position: "relative",
                        flexDirection: "column",
                        gap: 20,
                        backgroundColor: "#1d1b31",
                        padding: 10,
                      }}
                    >
                      <span
                        className="link_name"
                        onClick={() => {
                          navigate("/lines");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        }}
                      >
                        {t("Menu.lines")}
                      </span>
                      <span
                        className="link_name"
                        onClick={() => {
                          navigate("/subscriptions");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        }}
                      >
                        {t("Menu.subscriptions")}
                      </span>
                      <span
                        className="link_name"
                        onClick={() => {
                          navigate("/portRequests");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        }}
                      >
                        {t("Menu.portin")}
                      </span>
                      <span
                        className="link_name"
                        onClick={() => {
                          navigate("/recharge");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        }}
                      >
                        {t("Menu.recharge")}
                      </span>
                      <PermissionView role="TEGG">
                        <span
                          className="link_name"
                          onClick={() => {
                            navigate("/activation/manual");
                            setOpen(false);
                            setExpand({
                              order: false,
                              line: false,
                              profile: false,
                            });
                          }}
                        >
                          {t("Menu.activeNewLine")}
                        </span>
                      </PermissionView>
                      <PermissionView role="CLIENT,AGENT">
                        {/* <br/> */}
                        <span
                          className="link_name"
                          onClick={() => {
                            navigate("/activation");
                            setOpen(false);
                            setExpand({
                              order: false,
                              line: false,
                              profile: false,
                            });
                          }}
                        >
                          {t("Menu.activation")}
                        </span>
                      </PermissionView>
                      <PermissionView role="CLIENT,AGENT">
                        {/* <br/> */}
                        <span
                          className="link_name"
                          onClick={() => {
                            navigate("/activation/client/manual");
                            setOpen(false);
                            setExpand({
                              order: false,
                              line: false,
                              profile: false,
                            });
                          }}
                        >
                          {t("Menu.activeNewLine")}
                        </span>
                      </PermissionView>
                    </div>
                  )}
                </a>
              </li>
              {/* PROFILE */}
              <li className={open ? "animate" : ""}>
                <a>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 999,
                    }}
                    onClick={() => {
                      setExpand({
                        order: false,
                        line: false,
                        profile: !expand.profile,
                      });
                    }}
                  >
                    <span className="link_name">{t("Menu.profile")}</span>
                    {expand.profile ? (
                      <i className="bx bxs-chevron-up arrow" />
                    ) : (
                      <i className="bx bxs-chevron-down arrow" />
                    )}
                  </div>
                  {expand.profile && (
                    <div
                      style={{
                        display: "flex",
                        margin: 10,
                        position: "relative",
                        flexDirection: "column",
                        gap: 20,
                        backgroundColor: "#1d1b31",
                        padding: 10,
                      }}
                    >
                      <span
                        className="link_name"
                        onClick={() => {
                          navigate("/profile");
                          setOpen(false);
                          setExpand({
                            order: false,
                            line: false,
                            profile: false,
                          });
                        }}
                      >
                        {t("Menu.profile")}
                      </span>
                      <span className="link_name" onClick={goExit}>
                        {t("Menu.exit")}
                      </span>
                    </div>
                  )}
                </a>
              </li>
            </div>
          </ul>
        </div>
      </SidebarMobileContainer>
    </>
  );
};
