import { useEffect, useState } from "react";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { translateError } from "../../services/util";
import { ProductInfo } from "./ProductInfo";
import { TableItens } from "../orders/new/NewOrder.styles";
import { Loading } from "../../components/loading/Loading";
import { CardProducts } from "./CardProducts";
import { useTranslation } from "react-i18next";

export const Products = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);

  const searchProducts = () => {
    setLoadingPage(true);
    api.product
      .getAll()
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
      })
      .catch((err) => translateError(err))
      .finally(() => setLoadingPage(false));
  };

  useEffect(() => {
    if (api.currentUser.AccessTypes[0] !== "TEGG") {
      api.user
        .logout()
        .then(() => {
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    searchProducts();
  }, []);

  return (
    <>
      <PageLayout>
        <Button
          style={{ width: screen.width < 768 && "100%" }}
          onClick={() => navigate("/products/new")}
        >
          {t("Products.labelNew")}
        </Button>
        {products.length > 0 ? (
          <>
            <ContainerWeb>
              <TableItens style={{ marginTop: "1rem" }}>
                <thead>
                  <tr>
                    <th>{t("Products.table.name")}</th>
                    <th>{t("Products.table.description")}</th>
                    <th>{t("Products.table.technology")}</th>
                    <th>{t("Products.table.version")}</th>
                    <th>{t("Products.table.value")}</th>
                  </tr>
                </thead>
                {products.map((prod, index) => (
                  <ProductInfo
                    key={index}
                    product={prod}
                    search={searchProducts}
                  />
                ))}
              </TableItens>
            </ContainerWeb>
            <ContainerMobile style={{ width: "100%", height: "100%" }}>
              {products.map((prod, index) => (
                <CardProducts key={index} prod={prod} search={searchProducts} />
              ))}
            </ContainerMobile>
          </>
        ) : (
          loadingPage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
              }}
            >
              <h2 style={{ color: "black", fontWeight: "bold" }}>
                {t("Products.table.notHave")}
              </h2>
            </div>
          )
        )}
        <Loading open={loadingPage} msg={t('Products.search')} />
      </PageLayout>
    </>
  );
};
