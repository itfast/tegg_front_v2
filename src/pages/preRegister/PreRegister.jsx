// import { PageLayout } from "../../../globalStyles";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { ContainerBodyLogin } from "../login/Login.styles";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import { InputData, SelectUfs } from "../clients/new/NewClient.styles";
import { Button } from "../../../globalStyles";
import { toast } from "react-toastify";
import { Loading } from "../../components/loading/Loading";
import { translateError } from "../../services/util";
import { useLocation, useParams } from "react-router-dom";

export const PreRegister = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const { id } = useParams();
  const [isClient, setIsClient] = useState(false)
  const location = useLocation()

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [district, setDistric] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [complement, setComplement] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(location){
      const resLocation = location?.pathname?.includes('/client/')
      setIsClient(resLocation)
    }
  },[location])

  const cleanVariables = () => {
    setName("");
    setPhone("");
    setWhatsapp("");
    setDocumentType("");
    setDocumentNumber("");
    setCountry("");
    setCity("");
    setStreet("");
    setNumber("");
    setDistric("");
    setPostalCode("");
    setComplement("");
    setState("");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const userLocale = navigator?.languages?.length
    ? navigator.languages[0]
    : navigator.language;
  useEffect(() => {
    // setLanguage('pt');
    // api.language.set('pt');
    api.language
      .get()
      .then((l) => {
        if (l) {
          setLanguage(l);
        } else if (userLocale) {
          api.language.set(userLocale.substring(0, 2));
          setLanguage(userLocale.substring(0, 2));
          window.location.reload();
        } else {
          setLanguage("pt");
        }
      })
      .catch(() => {
        setLanguage("pt");
      });
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguage = (lng) => {
    api.language.set(lng);
    // i18n.changeLanguage(lng);
    window.location.reload();
    handleClose();
  };

  const sendRegister = () => {
    if (name !== "") {
      if (phone !== "") {
        if (documentType !== "") {
          if (documentNumber !== "") {
            if (country !== "") {
              if (state !== "") {
                if (city !== "") {
                  if (street !== "") {
                    if (number !== "") {
                      if (district !== "") {
                        if (postalCode !== "") {
                          setLoading(true);
                          api.preOrder
                            .add(
                              isClient,
                              id,
                              name,
                              phone,
                              whatsapp,
                              documentType,
                              documentNumber,
                              country,
                              city,
                              street,
                              number,
                              district,
                              postalCode,
                              complement,
                              state
                            )
                            .then((res) => {
                              console.log(res);
                              toast.success(t("Subscribe.success"));
                              cleanVariables();
                            })
                            .catch((err) => {
                              translateError(err);
                            })
                            .finally(() => setLoading(false));
                        } else {
                          toast.error(t("Subscribe.required.postalCode"));
                        }
                      } else {
                        toast.error(t("Subscribe.required.neighborhood"));
                      }
                    } else {
                      toast.error(t("Subscribe.required.number"));
                    }
                  } else {
                    toast.error(t("Subscribe.required.street"));
                  }
                } else {
                  toast.error(t("Subscribe.required.city"));
                }
              } else {
                toast.error(t("Subscribe.required.state"));
              }
            } else {
              toast.error(t("Subscribe.required.country"));
            }
          } else {
            toast.error(t("Subscribe.required.documentNumber"));
          }
        } else {
          toast.error(t("Subscribe.required.documentType"));
        }
      } else {
        toast.error(t("Subscribe.required.phone"));
      }
    } else {
      toast.error(t("Subscribe.required.name"));
    }
  };

  return (
    <>
      <Loading open={loading} msg="Cadastrando..." />
      <ContainerBodyLogin
        style={{
          justifyContent: "start",
          backgroundImage: 'url("/assets/precadastro.jpg")',
        }}
      >
        <div style={{ width: "100%", marginLeft: "1rem" }}>
          {/* <img
            src={"/assets/tegg-verde.png"}
            style={{
              width: window.innerWidth > 768 ? "15%" : "40%",
              marginTop: 10,
              // marginBottom: -100,
            }}
          /> */}
        </div>
        <div style={{ width: "100%" }}>
          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              marginBottom: window.innerWidth > 768 ? "9rem" : "0rem",
            }}
          >
            {/* <h3>{t("Subscribe.msg1")}</h3>
            <h3>{t("Subscribe.msg2")}</h3> */}
          </div>
          <div
            style={{
              maxWidth: "1000px",
              margin: "auto",
              padding: "1rem",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "8px",
              marginTop: "2rem",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <div style={{ width: "100%" }}>
                <img
                  src={"/assets/tegg-verde.png"}
                  style={{
                    width: window.innerWidth > 768 ? "20%" : "40%",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              </div>
              <h3>{t("Subscribe.msg1")}</h3>
              <h3>{t("Subscribe.msg2")}</h3>
            </div>
            <div
              style={{ width: "100%", display: "flex", justifyContent: "end" }}
            >
              {/* <div> */}

              {/* </div> */}
              {language === "en" && (
                <Avatar
                  alt="Remy Sharp"
                  src="/eua.png"
                  style={{ marginTop: 10, marginRight: 10 }}
                  onClick={handleMenu}
                />
              )}
              {language === "es" && (
                <Avatar
                  alt="Remy Sharp"
                  src="/espanha.png"
                  style={{ marginTop: 10, marginRight: 10 }}
                  onClick={handleMenu}
                />
              )}
              {language === "pt" && (
                <Avatar
                  alt="Remy Sharp"
                  src="/brasil.png"
                  style={{ marginTop: 10, marginRight: 10 }}
                  onClick={handleMenu}
                />
              )}
              {!language && (
                <Avatar
                  alt="Remy Sharp"
                  src="/brasil.png"
                  style={{ marginTop: 10, marginRight: 10 }}
                  onClick={handleMenu}
                />
              )}
            </div>
            <div style={{ textAlign: "center", marginTop: "-2rem" }}>
              {t("Subscribe.data")}
            </div>
            <div
              style={{
                width: "100%",
                marginTop: "0.5rem",
                flexDirection: window.innerWidth < 768 ? "column" : "row",
              }}
            >
              {t("Subscribe.name")}
              <InputData
                id="companyName"
                type="text"
                placeholder={t("Subscribe.name")}
                style={{ width: "100%" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                flexDirection: window.innerWidth < 768 ? "column" : "row",
              }}
            >
              <div style={{ width: "100%" }}>
                <h4>{t("Subscribe.phone")}</h4>
                <InputData
                  type="text"
                  placeholder={t("Subscribe.phone")}
                  style={{ width: "100%" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div style={{ width: "100%" }}>
                <h4>{t("Subscribe.whatsapp")}</h4>
                <InputData
                  // type="number"
                  placeholder={t("Subscribe.whatsapp")}
                  style={{ width: "100%" }}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                marginBottom: "0.5rem",
                flexDirection: window.innerWidth < 768 ? "column" : "row",
              }}
            >
              <div style={{ width: window.innerWidth < 768 ? "100%" : "35%" }}>
                <h4>{t("Subscribe.documentType")}</h4>
                <SelectUfs
                  style={{ height: "48px", width: "100%" }}
                  placeholder={t("Subscribe.documentType")}
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  //   value={company.uf}
                  //   onChange={(e) => setCompany({ ...company, uf: e.target.value })}
                  defaultValue={""}
                >
                  <option disabled value={""}>
                    {t("Subscribe.documentType")}*
                  </option>
                  <option value={t("Subscribe.document.id")}>
                    {t("Subscribe.document.id")}
                  </option>
                  <option value={t("Subscribe.document.cnh")}>
                    {t("Subscribe.document.cnh")}
                  </option>
                  <option value={t("Subscribe.document.cpf")}>
                    {t("Subscribe.document.cpf")}
                  </option>
                  <option value={t("Subscribe.document.passport")}>
                    {t("Subscribe.document.passport")}
                  </option>
                  <option value={t("Subscribe.document.rg")}>
                    {t("Subscribe.document.rg")}
                  </option>
                </SelectUfs>
              </div>
              <div style={{ width: "100%" }}>
                <h4>{t("Subscribe.documentNumber")}</h4>
                <InputData
                  // type="number"
                  placeholder={t("Subscribe.documentNumber")}
                  style={{ width: "100%" }}
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  // value={company.ie}
                  // onChange={(e) => setCompany({ ...company, ie: e.target.value })}
                />
              </div>
            </div>
            <div style={{ textAlign: "center" }}>{t("Subscribe.address")}</div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                flexDirection: window.innerWidth < 768 ? "column" : "row",
              }}
            >
              <div style={{ width: "100%" }}>
                <h4>{t("Subscribe.country")}</h4>
                <InputData
                  type="text"
                  placeholder={t("Subscribe.country")}
                  style={{ width: "100%" }}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div style={{ width: "100%" }}>
                <h4>{t("Subscribe.state")}</h4>
                <InputData
                  placeholder={t("Subscribe.state")}
                  style={{ width: "100%" }}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div style={{ width: "100%" }}>
                <h4>{t("Subscribe.city")}</h4>
                <InputData
                  placeholder={t("Subscribe.city")}
                  style={{ width: "100%" }}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                flexDirection: window.innerWidth < 768 ? "column" : "row",
              }}
            >
              <div style={{ width: "100%" }}>
                <h4>{t("Subscribe.street")}</h4>
                <InputData
                  type="text"
                  placeholder={t("Subscribe.street")}
                  style={{ width: "100%" }}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div style={{ width: window.innerWidth < 768 ? "100%" : "35%" }}>
                <h4>{t("Subscribe.number")}</h4>
                <InputData
                  placeholder={t("Subscribe.number")}
                  style={{ width: "100%" }}
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
                flexDirection: window.innerWidth < 768 ? "column" : "row",
              }}
            >
              <div style={{ width: window.innerWidth < 768 ? "100%" : "20%" }}>
                <h4>{t("Subscribe.neighborhood")}</h4>
                <InputData
                  placeholder={t("Subscribe.neighborhood")}
                  style={{ width: "100%" }}
                  value={district}
                  onChange={(e) => setDistric(e.target.value)}
                />
              </div>
              <div style={{ width: window.innerWidth < 768 ? "100%" : "20%" }}>
                <h4>{t("Subscribe.postalCode")}</h4>
                <InputData
                  placeholder={t("Subscribe.postalCode")}
                  style={{ width: "100%" }}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div style={{ width: "100%" }}>
                <h4>{t("Subscribe.complement")}</h4>
                <InputData
                  placeholder={t("Subscribe.complement")}
                  style={{ width: "100%" }}
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                marginTop: "1rem",
              }}
            >
              <Button onClick={sendRegister}>
                {t("Subscribe.buttonRegister")}
              </Button>
            </div>
          </div>
        </div>
        <div style={{ height: 20, margin: 20 }}></div>
      </ContainerBodyLogin>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {language !== "en" && (
          <MenuItem
            // className={classes.textNotification}
            onClick={() => handleLanguage("en")}
          >
            <Avatar
              alt="English"
              src="/eua.png"
              style={{ width: 30, height: 30, marginRight: 15 }}
            />
            English
          </MenuItem>
        )}

        {language !== "pt" && (
          <MenuItem
            // className={classes.textNotification}
            onClick={() => handleLanguage("pt")}
          >
            <Avatar
              alt="Portugues"
              src="/brasil.png"
              style={{ width: 30, height: 30, marginRight: 15 }}
            />
            Português
          </MenuItem>
        )}

        {language !== "es" && (
          <MenuItem
            // className={classes.textNotification}
            onClick={() => handleLanguage("es")}
          >
            <Avatar
              alt="Spanish"
              src="/espanha.png"
              style={{ width: 30, height: 30, marginRight: 15 }}
            />
            Spanish
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
