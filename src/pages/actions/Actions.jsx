import { useNavigate } from "react-router-dom";
import { Button, ContainerWeb, PageLayout } from "../../../globalStyles";
import { InputData } from "../resales/Resales.styles";
import { useEffect, useState } from "react";
// import AsyncSelect from "react-select/async";
import api from "../../services/api";
import { Loading } from "../../components/loading/Loading";
// import { translateError } from "../../services/util";
import { TableItens } from "../clients/new/NewClient.styles";
import { ActionsTable } from "./ActionsTable";
// import { Tooltip } from "react-tooltip";
import { Pagination, Stack } from "@mui/material";
import { translateError } from "../../services/util";

export const Actions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // const [dealer, setDealer] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("Buscando...");

  // const [users, setUsers] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [lines, setLines] = useState([]);

  const handlePageChange = (event, value) => {
    setPageNum(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
  };

  const getLines = () => {
    if (api.currentUser?.Type === "TEGG") {
      setLoading(true);
      api.line
        .getLinesRoot(pageNum, pageSize, search)
        .then((res) => {
          setLines(res.data.iccids);
          setMaxPages(res.data.meta.totalPages || 1);
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      // api.currentUser?.DealerId
      api.line
        .getLinesRoot(pageNum, pageSize, search, api.currentUser?.DealerId)
        .then((res) => {
          setLines(res.data.iccids);
          setMaxPages(res.data.meta.totalPages || 1);
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => {
          setLoading(false);
        });
      // api.line
      //   .getLines(pageNum, pageSize, api.currentUser?.DealerId, search, null, null)
      //   .then((res) => {
      //     setLines(res.data.iccids);
      //     setMaxPages(res.data.meta.totalPages || 1);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     translateError(err);
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //   });
    }
  };

  // const loadDealers = async (search) => {
  //   const response = await api.dealer.getSome(1, 15, search);
  //   const dealers = await response.data.dealers;
  //   const array = [];

  //   if (dealers.length !== 0) {
  //     for (const d of dealers) {
  //       array.push({
  //         value: d.Id,
  //         label: d.CompanyName || d.Name,
  //       });
  //     }
  //   }
  //   return array;
  // };

  useEffect(() => {
    getLines();
  }, [search, pageNum, pageSize]);

  return (
    <>
      <Loading open={loading} msg={msg} />
      <PageLayout>
        <Button
          style={{ width: screen.width < 768 && "100%" }}
          onClick={() => navigate("/clients/new")}
        >
          + CLIENTE
        </Button>
        <div style={{ marginTop: "1rem" }}>
          <h4>Visualize e altere as informações das linhas de seus clientes</h4>
          <h4>
            Pesquise um cliente por: Nome, CPF, CNPJ, MSISDN, ICCID ou Revenda.
          </h4>
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
              <h3>Buscar</h3>
              <InputData
                id="iccid"
                type="text"
                // disabled={searched}
                placeholder=""
                style={{
                  width: screen.width < 768 ? "100%" : 250,
                  marginBottom: screen.width < 768 && "1rem",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* <AsyncSelect
              style={{ width: 250 }}
              loadOptions={loadDealers}
              placeholder="Selecionar ou buscar revenda..."
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition={"fixed"}
              defaultOptions
              isClearable
              onChange={(e) => {
                // console.log(e);
                if (e === null) {
                  setDealer("");
                } else {
                  setDealer(e.value);
                }
              }}
            /> */}
          </div>
        </div>
        <ContainerWeb>
          <TableItens>
            <tr>
              <th>Revenda</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>CNPJ/CPF</th>
              <th>ICCID</th>
              {/* <th>Email</th> */}
              <th>Linha</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
            {lines.map((d) => (
              <ActionsTable
                key={d.Id}
                line={d}
                setLoading={setLoading}
                setMsg={setMsg}
              />
            ))}
            {lines.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Sem registros
                  </div>
                </td>
              </tr>
            )}
          </TableItens>
        </ContainerWeb>
        <br />
        {!loading && (
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
                count={maxPages}
                page={pageNum}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
              />
              <div style={{ display: "flex", gap: 5 }}>
                <p>Itens por página:</p>
                <select
                  name="pages"
                  id="page-select"
                  value={pageSize}
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
