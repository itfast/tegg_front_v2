import { useNavigate } from "react-router-dom";
// import ReactLoading from 'react-loading';
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import { InputData } from "./Resales.styles";
import { useEffect, useState } from "react";
import api from "../../services/api";
// import { CustomPagination } from '../../components/Pagination/CustomPagination';
import { ResaleInfo } from "./ResaleInfo";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { TableItens } from "../orders/clientNew/NewOrder.styles";
import { ResaleCardMobile } from "./ResaleCardMobile";
import { Loading } from "../../components/loading/Loading";
import { useTranslation } from "react-i18next";

export const Resales = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dealer, setDealer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(t("Resales.searchMsg"));
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getDealers = () => {
    setLoading(true);
    api.dealer
      .getAll(page, limit, search)
      .then((res) => {
        setTotalPages(res.data?.meta?.totalPages || 1);
        console.log(res.data.dealers);
        setDealer(res.data.dealers);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // getDealers(value, limit, search);
  };

  const handlePageSizeChange = (e) => {
    setLimit(e.target.value);
    setPage(1);
    // getDealers(1, e.target.value, search);
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
    getDealers();
  }, [page, limit, search]);

  return (
    <>
      <Loading open={loading} msg={msg} />
      <PageLayout>
        <Button
          style={{ width: screen.width < 768 && "100%" }}
          onClick={() => navigate("/salesforce/new")}
        >
          {t("Resales.buttonAdd")}
        </Button>
        {/* <ContainerTable> */}
        {/* <h2 style={{marginTop: '1rem'}}>Minhas revendas</h2> */}
        <div style={{ marginTop: "1rem" }}>
          <div
            style={{
              display: screen.width > 768 && "flex",
              flexDirection: screen.width < 768 && "column",
              alignItems: "center",
              margin: "1rem 0",
              gap: 10,
            }}
          >
            <div
              style={{
                display: screen.width > 768 && "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <h3>{t("Resales.searchResale")}</h3>
              <InputData
                id="iccid"
                type="text"
                // disabled={searched}
                placeholder={t("Resales.searchResalePlaceHolder")}
                style={{
                  width: screen.width < 768 ? "100%" : 250,
                  marginBottom: screen.width < 768 && "1rem",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {/* <div className='btn_container'>
          <Button
            onClick={() => {
              setPage(1);
              getDealers(1, limit, search);
            }}
          >
            Buscar
          </Button>
        </div> */}
        </div>
        {dealer.length > 0 ? (
          <>
            <ContainerWeb>
              <TableItens>
                <>
                  <tr>
                    <th>{t("Resales.table.name")}</th>
                    <th>Status</th>
                    <th>{t("Resales.table.document")}</th>
                    <th>{t("Resales.table.contact")}</th>
                    <th>Email de contato</th>
                    <th>Email principal (Acesso ao sistema)</th>
                  </tr>
                  {dealer.map((d, index) => (
                    <ResaleInfo
                      setLoading={setLoading}
                      loading={loading}
                      setMsg={setMsg}
                      key={index}
                      dealer={d}
                      getDealers={getDealers}
                    />
                  ))}
                </>
              </TableItens>
            </ContainerWeb>
            <ContainerMobile style={{ width: "100%", height: "100%" }}>
              {dealer.map((d) => (
                <ResaleCardMobile
                  key={d.Id}
                  resale={d}
                  setLoading={setLoading}
                  setMsg={setMsg}
                  getDealers={getDealers}
                  loading={loading}
                />
              ))}
            </ContainerMobile>
          </>
        ) : (
          !loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
              }}
            >
              <h2 style={{ color: "black", fontWeight: "bold" }}>
                {t("Resales.table.notHaveResales")}
              </h2>
            </div>
          )
        )}
        <br />
        {dealer.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Stack
              spacing={2}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
              />
              <div style={{ display: "flex", gap: 5 }}>
                <p>{t("Resales.table.itensPagination")}:</p>
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
          </div>
        )}
      </PageLayout>
    </>
  );
};
