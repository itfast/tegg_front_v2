import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import Select from "react-select";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import api from "../../services/api";
import Switch from "react-switch";
import { LineInfo } from "./LineInfo";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { LinesCLient } from "./LinesClient";
import { TableItens } from "../../pages/orders/new/NewOrder.styles";
import { optChipStatus } from "../../services/util";
import { InputData } from "../clients/new/NewClient.styles";
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const Lines = () => {
  const [loading, setLoading] = useState(true);
  const [lines, setLines] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [personalLines, setPersonalLines] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const [status, setStatus] = useState();
  const [iccidToFind, setIccidToFind] = useState("");
  const [searchType, setSearchType] = useState({
    label: "Iccid",
    value: "Iccid",
  });

  const getLines = () => {
    setLoading(true);
    if (
      api.currentUser.AccessTypes[0] === "CLIENT" ||
      api.currentUser.AccessTypes[0] === "AGENT" ||
      (api.currentUser.AccessTypes[0] === "DEALER" && personalLines)
    ) {
      api.line
        .myLines(pageNum, pageSize)
        .then((res) => {
          console.log(res);
          setLines(res.data.iccids);
          setMaxPages(res.data.meta.totalPages || 1);
        })
        .catch((err) => {
          console.log(err);
          // translateError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      api.line
        .getLines(
          pageNum,
          pageSize,
          "",
          iccidToFind,
          status?.value,
          searchType?.value
        )
        .then((res) => {
          console.log(res.data.iccids);
          setLines(res.data.iccids);
          setMaxPages(res.data.meta.totalPages || 1);
        })
        .catch((err) => {
          console.log(err);
          // translateError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSwitchChange = (checked) => {
    // console.log(checked);
    setPersonalLines(checked);
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
    // getLines(value, pageSize);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    // setPageNum(1);
    // getLines(1, e.target.value);
  };

  useEffect(() => {
    getLines();
  }, [pageNum, pageSize, personalLines, status]);

  // useEffect(() => {
  //   setPageNum(1);
  //   getLines(1, pageSize);
  // }, [personalLines]);

  return (
    <>
      <ContainerWeb>
        <PageLayout>
          <PageTitles title="Linhas" />
          {api.currentUser.AccessTypes[0] === "DEALER" && (
            <div
              style={{
                marginTop: 30,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <h3>Clientes</h3>
                <Switch
                  // disabled={statusSearching}
                  checked={personalLines}
                  onColor="#888"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  onChange={handleSwitchChange}
                />
                <h3>Pessoais</h3>
              </div>
            </div>
          )}
          {(!personalLines && (api.currentUser.Type !== 'CLIENT' && api.currentUser.Type !== 'AGENT')) && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: api.currentUser.Type === 'DEALER' ? 10: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: screen.width < 768 && "0.5rem",
                }}
              >
                <div style={{ width: screen.width < 768 && "25%" }}>
                  <p>Status:</p>
                </div>
                <div style={{ width: screen.width < 768 ? "100%" : 250 }}>
                  <Select
                    isClearable
                    isSearchable={false}
                    placeholder="Selecione"
                    // isDisabled={statusSearching}
                    options={optChipStatus}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: "#00D959",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: state.isFocused ? "#00D959" : "#00D959",
                        },
                      }),
                    }}
                    onChange={(e) => {
                      setStatus(e);
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: screen.width < 768 && "0.5rem",
                }}
              >
                <div style={{ width: screen.width < 768 ? "25%" : 136 }}>
                  <Select
                    isSearchable={false}
                    placeholder="Selecione"
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: "#00D959",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: state.isFocused ? "#00D959" : "#00D959",
                        },
                      }),
                    }}
                    // isDisabled={statusSearching}
                    value={searchType}
                    options={[
                      { label: "Iccid", value: "Iccid" },
                      { label: "Linha", value: "Line" },
                      { label: "Cliente", value: "FinalClient" },
                    ]}
                    // defaultValue={statusOptions[0]}
                    onChange={(e) => {
                      setSearchType(e);
                      // setStatus(e);
                    }}
                  />
                </div>
                <InputData
                  id="iccid"
                  type="text"
                  // disabled={searched}
                  // placeholder="Iccid"
                  style={{ height: "35px" }}
                  value={iccidToFind}
                  onChange={(e) => setIccidToFind(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setPageNum(1);
                    getLines();
                    // searchIccids();
                  }}
                >
                  Buscar
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading">
              <ReactLoading type={"bars"} color={"#000"} />
            </div>
          ) : lines.length > 0 ? (
            <TableItens id="customers" className="mt-30">
              <thead>
                <tr>
                  {(api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT") && (
                    <th>ICCID</th>
                  )}
                  <th>Linha</th>
                  <th>Status</th>
                  <th>Vencimento recarga</th>
                  {(api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT") &&
                    !personalLines && <th>Revenda</th>}
                  {(api.currentUser.AccessTypes[0] !== "CLIENT" && api.currentUser.AccessTypes[0] !== "AGENT") &&
                    !personalLines && <th>Cliente</th>}
                  <th>Avisar vencimento</th>
                  {/* {api.currentUser.AccessTypes[0] !== 'TEGG' && (
                      <th>Saldo</th>
                    )}
                    <th>Status SURF</th> */}
                  {/* <th>Recarga</th> */}
                  {/* {api.currentUser.AccessTypes[0] !== 'TEGG' && (
                      <th>Trocar plano</th>
                    )} */}
                  {/* {api.currentUser.AccessTypes[0] !== 'TEGG' && (
                      <th>Ativar eSIM</th>
                    )} */}
                </tr>
              </thead>
              {lines.map((line, index) => {
                if (line.IccidHistoric?.length > 0) {
                  return (
                    <LineInfo
                      key={index}
                      line={line}
                      personalLines={personalLines}
                      getLines={getLines}
                      pageNum={pageNum}
                      pageSize={pageSize}
                    />
                  );
                }
              })}
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
                Ainda não existem linhas ativas
              </h2>
            </div>
          )}
          {/* </ContainerTable> */}
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
      </ContainerWeb>
      <ContainerMobile
      // style={{
      //   background: "url('/assets/BG-guys.png')",
      //   backgroundSize: 'cover',
      //   backgroundRepeat: 'no-repeat',
      //   backgroundPosition: 'center',
      //   margin: 0,
      // }}
      >
        <PageLayout>
        <PageTitles title="Linhas" />
          {loading ? (
            <div className="loading">
              <ReactLoading type={"bars"} color={"#00D959"} />
            </div>
          ) : (
            <>
              {lines.map((line, index) => {
                if (line.IccidHistoric?.length > 0) {
                  return (
                    <LinesCLient
                      key={index}
                      getLines={getLines}
                      line={line}
                      pageNum={pageNum}
                      pageSize={pageSize}
                    />
                  );
                }
              })}
              {lines.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: 300,
                    alignItems: "center",
                  }}
                >
                  <h4 style={{ textAlign: "center" }}>
                    VOCÊ AINDA NÃO POSSUI LINHAS CADASTRADAS
                  </h4>
                </div>
              )}
            </>
          )}
          {!loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
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
      </ContainerMobile>
    </>
  );
};
