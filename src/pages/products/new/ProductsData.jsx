/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { CardData, InputData, SelectUfs } from "../../resales/Resales.styles";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import CurrencyInput from "react-currency-input-field";
// import { useEffect } from 'react';

export const ProductsData = ({
  goStep,
  info,
  goBackStep,
  product,
  setProduct,
  label,
  loading,
}) => {
  const { t } = useTranslation();
  const location = useLocation();

  const nameInput = document.getElementById("productName");
  const descInput = document.getElementById("productDesc");
  const techInput = document.getElementById("productTech");
  const versionInput = document.getElementById("productVersion");
  const valueInput = document.getElementById("productValue");
  const cfopInput = document.getElementById("cfop");
  const ncmInput = document.getElementById("ncm");
  const cestInput = document.getElementById("cest");

  // const translateValue = (value) => {
  // 	let converted = new Intl.NumberFormat("pt-BR", {
  // 		style: "currency",
  // 		currency: "BRL",
  // 	}).format(Number(value));
  // 	return converted;
  // };

  const handleNext = () => {
    if (product.Name !== "") {
      nameInput?.style.removeProperty("border-color");
      if (product.Amount !== "") {
        valueInput?.style.removeProperty("border-color");
        if (product.Description !== "") {
          descInput?.style.removeProperty("border-color");
          if (product.Technology !== "") {
            techInput?.style.removeProperty("border-color");
            if (product.Version !== "") {
              versionInput?.style.removeProperty("border-color");
              if (product.CFOP !== "") {
                cfopInput?.style.removeProperty("border-color");
                if (product.NCM !== "") {
                  ncmInput?.style.removeProperty("border-color");
                  if (product.CEST !== "") {
                    cestInput?.style.removeProperty("border-color");
                    if (product.ICMSCst !== "" && product.ICMSAliquot !== "") {
                      if (
                        product.IPICst !== "" &&
                        product.IPIEnqCode !== "" &&
                        product.IPIAliquot !== ""
                      ) {
                        if (
                          product.PISCst !== "" &&
                          product.PISAliquot !== ""
                        ) {
                          if (
                            product.COFINSCst !== "" &&
                            product.COFINSAliquot !== ""
                          ) {
                            goStep();
                          } else {
                            toast.error(t("Products.errorMsg.cofins"));
                          }
                        } else {
                          toast.error(t("Products.errorMsg.pis"));
                        }
                      } else {
                        toast.error(t("Products.errorMsg.ipi"));
                      }
                    } else {
                      toast.error(t("Products.errorMsg.icms"));
                    }
                  } else {
                    toast.error(t("Products.errorMsg.cest"));
                    cestInput.style.borderColor = "red";
                  }
                } else {
                  toast.error(t("Products.errorMsg.ncm"));
                  ncmInput.style.borderColor = "red";
                }
              } else {
                toast.error(t("Products.errorMsg.cfop"));
                cfopInput.style.borderColor = "red";
              }
            } else {
              toast.error(t("Products.errorMsg.version"));
              versionInput.style.borderColor = "red";
            }
          } else {
            toast.error(t("Products.errorMsg.technology"));
            techInput.style.borderColor = "red";
          }
        } else {
          toast.error(t("Products.errorMsg.description"));
          descInput.style.borderColor = "red";
        }
      } else {
        toast.error(t("Products.errorMsg.value"));
        valueInput.style.borderColor = "red";
      }
    } else {
      toast.error(t("Products.errorMsg.name"));
      nameInput.style.borderColor = "red";
    }
  };

  const handleChange = (key, value) => {
    const onlyNumbers = new RegExp(/[^.0123456789]/g);
    if (!onlyNumbers.test(value)) {
      setProduct({ ...product, [key]: value });
    }
  };

  return (
    <CardData style={{ maxWidth: "1000px", margin: "auto" }}>
      <h3>{label}</h3>
      <div className="input_row_3">
        <div className="input_3">
          <label>{t("Products.name")}</label>
          <InputData
            id="productName"
            type="text"
            disabled={info}
            placeholder={`${t('Products.nameRequired')}`}
            style={{ width: "100%" }}
            value={product.Name}
            onChange={(e) =>
              setProduct({ ...product, Name: e.target.value.slice(0, 20) })
            }
          />
        </div>
        <div className="input_66">
          <label>{t("Products.description")}</label>
          <InputData
            id="productDesc"
            type="text"
            disabled={info}
            placeholder={`${t('Products.descriptionRequired')}`}
            style={{ width: "100%" }}
            value={product.Description}
            onChange={(e) =>
              setProduct({
                ...product,
                Description: e.target.value.slice(0, 50),
              })
            }
          />
        </div>
      </div>
      <div className="input_row_3">
        <div className="input_3">
          <label>{t("Products.technology")}</label>
          <SelectUfs
            id="productTech"
            name="UF"
            style={{ width: "100%" }}
            placeholder="Tecnologia *"
            value={product.Technology}
            onChange={(e) =>
              setProduct({ ...product, Technology: e.target.value })
            }
            className="input_3"
          >
            <option disabled selected value={""}>
              {t("Products.technologyRequired")}
            </option>
            <option value={"Físico"}>
              {t("Products.technologyOptions.fisic")}
            </option>
            <option value={"e-SIM"}>
              {t("Products.technologyOptions.esim")}
            </option>
            <option value={"NA"}>
              {t("Products.technologyOptions.notApplicable")}
            </option>
            <option value={"Streaming"}>
              {t("Products.technologyOptions.streaming")}
            </option>
          </SelectUfs>
        </div>
        <div className="input_3">
          <label>{t("Products.version")}</label>
          <InputData
            id="productVersion"
            // type="number"
            disabled={info}
            placeholder={t("Products.versionRequired")}
            style={{ minWidth: "100%", marginRight: "1%" }}
            value={product.Version}
            onChange={(e) => handleChange("Version", e.target.value)}
          />
        </div>
        <div className="input_3">
          <label>{t("Products.value")}</label>
          <InputData
            id="productValue"
            type="number"
            min={0.1}
            disabled={info}
            // prefix="R$"
            placeholder={t("Products.valueRequired")}
            style={{ minWidth: "100%" }}
            value={product.Amount}
            onChange={(e) => {
              handleChange("Amount", e.target.value);
            }}
          />
        </div>
      </div>
      <div className="input_row_3">
        <div className="input_3">
          {product.Technology === "Streaming" ? (
            <>
              <label>{t("Products.idPlayHub")}</label>
              <InputData
                // type="number"
                placeholder={t("Products.placeHolderPlayHub")}
                disabled={info}
                style={{ width: "100%" }}
                value={product.PlayHubId}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    PlayHubId: e.target.value,
                  })
                }
              />
            </>
          ) : (
            <>
              <label>{t("Products.idSurf")}</label>
              <InputData
                // type="number"
                placeholder={t("Products.idSurf")}
                disabled={info}
                style={{ width: "100%" }}
                value={product.SurfId}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    SurfId: e.target.value.replace(/\D/g, "").slice(0, 4),
                  })
                }
              />
            </>
          )}
        </div>
        <div className="input_3">
          <label>{t("Products.cfop")}</label>
          <InputData
            id="cfop"
            disabled={info}
            // type="number"
            placeholder={t("Products.cfopRequired")}
            style={{ width: "100%" }}
            value={product.CFOP}
            onChange={(e) =>
              setProduct({
                ...product,
                CFOP: e.target.value.replace(/\D/g, "").slice(0, 4),
              })
            }
          />
        </div>
        <div className="input_3">
          <label>{t("Products.ean")}</label>
          <InputData
            // type="number"
            disabled={info}
            placeholder={t("Products.ean")}
            style={{ width: "100%" }}
            value={product.EAN}
            onChange={(e) =>
              setProduct({
                ...product,
                EAN: e.target.value.replace(/\D/g, "").slice(0, 13),
              })
            }
          />
        </div>
      </div>
      <div className="input_row_2">
        <div className="input_2">
          <label>{t("Products.ncm")}</label>
          <InputData
            id="ncm"
            // type="number"
            placeholder={t("Products.ncmRequired")}
            disabled={info}
            style={{ width: "100%" }}
            value={product.NCM}
            onChange={(e) =>
              setProduct({
                ...product,
                NCM: e.target.value.replace(/\D/g, "").slice(0, 8),
              })
            }
          />
        </div>
        <div className="input_2">
          <label>{t("Products.cest")}</label>
          <InputData
            id="cest"
            // type="number"
            disabled={info}
            placeholder={t("Products.cestRequired")}
            style={{ width: "100%" }}
            value={product.CEST}
            onChange={(e) =>
              setProduct({
                ...product,
                CEST: e.target.value.replace(/\D/g, "").slice(0, 7),
              })
            }
          />
        </div>
      </div>
      <br />
      <h3>{t("Products.icms")}</h3>
      <div className="input_row_2">
        <div className="input_2">
          <label>{t("Products.tribution")}</label>
          <InputData
            // type="number"
            placeholder="CST*"
            disabled={info}
            style={{ width: "100%" }}
            value={product.ICMSCst}
            onChange={(e) =>
              setProduct({
                ...product,
                ICMSCst: e.target.value.replace(/\D/g, "").slice(0, 3),
              })
            }
          />
        </div>
        <div className="input_2">
          <label>{t("Products.aliquot")} (%)</label>
          <InputData
            type="number"
            min={0.1}
            disabled={info}
            placeholder={`${t("Products.aliquot")} (%)*`}
            style={{ width: "100%" }}
            value={product.ICMSAliquot}
            onChange={(e) =>
              setProduct({
                ...product,
                ICMSAliquot: e.target.value,
              })
            }
          />
        </div>
      </div>
      <br />
      <h3>{t("Products.ipi")}</h3>
      <div className="input_row_3">
        <div className="input_3">
          <label>{t("Products.tribution")}</label>
          <InputData
            // type="number"
            placeholder="CST*"
            disabled={info}
            style={{ width: "100%" }}
            value={product.IPICst}
            onChange={(e) =>
              setProduct({
                ...product,
                IPICst: e.target.value.replace(/\D/g, "").slice(0, 3),
              })
            }
          />
        </div>
        <div className="input_3">
          <label>{t("Products.legislation")}</label>
          <InputData
            // type="number"
            placeholder={t("Products.legislationPlaceHolder")}
            disabled={info}
            style={{ width: "100%" }}
            value={product.IPIEnqCode}
            onChange={(e) =>
              setProduct({
                ...product,
                IPIEnqCode: e.target.value.replace(/\D/g, "").slice(0, 3),
              })
            }
          />
        </div>
        <div className="input_3">
          <label>{t("Products.aliquot")} (%)</label>
          <InputData
            type="number"
            min={0.1}
            disabled={info}
            placeholder={`${t("Products.idSurf")} (%)*`}
            style={{ width: "100%" }}
            value={product.IPIAliquot}
            onChange={(e) =>
              setProduct({ ...product, IPIAliquot: e.target.value })
            }
          />
        </div>
      </div>
      <br />
      <h3>{t("Products.pis")}</h3>
      <div className="input_row_2">
        <div className="input_2">
          <label>{t("Products.tribution")}</label>
          <InputData
            // type="number"
            placeholder={t("Products.cstRequired")}
            disabled={info}
            style={{ width: "100%" }}
            value={product.PISCst}
            onChange={(e) =>
              setProduct({
                ...product,
                PISCst: e.target.value.replace(/\D/g, "").slice(0, 2),
              })
            }
          />
        </div>
        <div className="input_2">
          <label>{t("Products.aliquot")} (%)</label>
          <InputData
            type="number"
            min={0.1}
            disabled={info}
            placeholder={`${t("Products.aliquot")} (%)*}`}
            style={{ width: "100%" }}
            value={product.PISAliquot}
            onChange={(e) =>
              setProduct({ ...product, PISAliquot: e.target.value })
            }
          />
        </div>
      </div>
      <br />
      <h3>{t("Products.cofins")}</h3>
      <div className="input_row_2">
        <div className="input_2">
          <label>{t("Products.tribution")}</label>
          <InputData
            disabled={info}
            // type="number"
            placeholder={t("Products.cstRequired")}
            style={{ width: "100%" }}
            value={product.COFINSCst}
            onChange={(e) =>
              setProduct({
                ...product,
                COFINSCst: e.target.value.replace(/\D/g, "").slice(0, 2),
              })
            }
          />
        </div>
        <div className="input_2">
          <label>{t("Products.aliquot")} (%)</label>
          <InputData
            type="number"
            disabled={info}
            min={0.1}
            placeholder={`${t("Products.aliquot")} (%)*}`}
            style={{ width: "100%" }}
            value={product.COFINSAliquot}
            onChange={(e) =>
              setProduct({ ...product, COFINSAliquot: e.target.value })
            }
          />
        </div>
      </div>
      <div style={{ width: "100%", margin: "1rem" }}></div>
      <div
        style={{ display: "flex", justifyContent: "end", marginTop: "1rem" }}
      >
        <Button invert onClick={goBackStep}>
          {t("Products.buttonGoback")}
        </Button>
        {location.pathname !== "/products/info" && (
          <Button notHover onClick={handleNext}>
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
            ) : location.pathname === "/products/new" ? (
              t("Products.buttonRegister")
            ) : location.pathname === "/products/edit" ? (
              t("Products.buttonUpdate")
            ) : (
              t("Products.buttonNext")
            )}
          </Button>
        )}
      </div>
    </CardData>
  );
};
