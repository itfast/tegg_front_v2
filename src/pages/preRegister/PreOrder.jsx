import { useEffect, useState } from "react";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import { TableItens } from "../clients/new/NewClient.styles";
import Select from "react-select";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from "@mui/material";
import api from "../../services/api";
import { translateError } from "../../services/util";
import { Loading } from "../../components/loading/Loading";
import AsyncSelect from "react-select/async";
import { AsyncPaginate } from "react-select-async-paginate";
import { toast } from "react-toastify";
import { PageTitles } from '../../components/PageTitle/PageTitle'
// import { toast } from "react-toastify";

export const PreOrder = () => {
  const [preOrders, setPreOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState({ label: "10", value: 10 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dealer, setDealer] = useState();
  const [finalClient, setFinalClient] = useState(
    api.currentUser?.Type === "AGENT"
      ? api?.currentUser?.MyFinalClientId
      : undefined
  );
  const [dealerSearch, setDealerSearch] = useState(
    api.currentUser?.Type === "DEALER" ? api?.currentUser?.DealerId : undefined
  );
  const [finalClientSearch, setFinalClientSearch] = useState(
    api.currentUser?.Type === "AGENT"
      ? api?.currentUser?.MyFinalClientId
      : undefined
  );
  console.log(api.currentUser);
  const [modalLink, setModalLink] = useState(false);
  const [modalLinkAgent, setModalLinkAgent] = useState(false);
  const [totalRegister, setTotalRegister] = useState(0);

  const handlePageSizeChange = (e) => {
    setLimit(e);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    setLoading(true);
    api.preOrder
      .get(page, limit?.value, dealerSearch, finalClientSearch)
      .then((res) => {
        setTotalRegister(res?.data?.meta?.total);
        setTotal(res?.data?.meta?.totalPages);
        setPreOrders(res.data?.preOrders);
      })
      .catch((err) => {
        translateError(err);
      })
      .finally(() => setLoading(false));
    // if (api.currentUser?.Type === "AGENT") {
    //   setFinalClient();
    // }
  }, [limit, page, dealerSearch, finalClientSearch]);

  const loadDealers = async (search) => {
    if (api.currentUser.AccessTypes[0] === "TEGG") {
      const response = await api.dealer.getSome(1, 15, search);
      const dealers = await response.data.dealers;
      const array = [];

      if (dealers.length !== 0) {
        for (const d of dealers) {
          array.push({
            value: d.Id,
            label: d.CompanyName || d.Name,
          });
        }
      }
      return array;
    }
  };

  const loadAgents = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const list = [];

    const response = await api.client.getSomeAgent(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );

    response.data?.finalClients?.forEach((c) => {
      list.push({
        value: c.Id,
        label: c.Name,
        type: "client",
      });
    });

    const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
    return {
      options: list,
      hasMore,
    };
  };

  const loadAgentsSearch = async (search, prevOptions) => {
    const vlr = prevOptions.length;
    const list = [];

    const response = await api.client.getSomeAgent(
      vlr / 10 === 0 ? 1 : vlr / 10 + 1,
      10,
      search
    );

    response.data?.finalClients?.forEach((c) => {
      list.push({
        value: c.Id,
        label: c.Name,
        type: "client",
      });
    });

    const hasMore = response.data.meta.total > vlr && response.data.meta.total > 10;
    return {
      options: list,
      hasMore,
    };
  };

  const loadDealersSearch = async (search) => {
    if (api.currentUser.AccessTypes[0] === "TEGG") {
      const response = await api.dealer.getSome(1, 15, search);
      const dealers = await response.data.dealers;
      const array = [];

      if (dealers.length !== 0) {
        for (const d of dealers) {
          array.push({
            value: d.Id,
            label: d.CompanyName || d.Name,
          });
        }
      }
      return array;
    }
  };

  const generateLink = async () => {
    try {
      let element = "";
      if (api?.currentUser?.Type === "TEGG") {
        element = document.querySelector("#linkPersonal");
      } else {
        element = document.querySelector("#linkPersonal1");
      }
      // Create a fake `textarea` and set the contents to the text
      // you want to copy
      const storage = document.createElement("textarea");
      storage.value = element.innerHTML;
      element.appendChild(storage);

      // Copy the text in the fake `textarea` and remove the `textarea`
      storage.select();
      storage.setSelectionRange(0, 99999);
      document.execCommand("copy");
      element.removeChild(storage);
      toast.info("Link copiado para área de transferência");
    } catch (e) {
      console.log(e);
    }
  };

  const generateLinkAgent = async () => {
    try {
      let element = "";
      if (api?.currentUser?.Type === "TEGG") {
        element = document.querySelector("#linkPersonalAgent");
      } else {
        element = document.querySelector("#linkPersonalAgent1");
      }
      // Create a fake `textarea` and set the contents to the text
      // you want to copy
      const storage = document.createElement("textarea");
      storage.value = element.innerHTML;
      element.appendChild(storage);

      // Copy the text in the fake `textarea` and remove the `textarea`
      storage.select();
      storage.setSelectionRange(0, 99999);
      document.execCommand("copy");
      element.removeChild(storage);
      toast.info("Link copiado para área de transferência");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Loading open={loading} msg={"Buscando..."} />
      <PageLayout>
        <PageTitles title="Pré cadastrados"/>
        <div
          style={{
            width: "100%",
            display: window.innerWidth > 768 && "flex",
            justifyContent: "space-between",
            marginBottom: "0.7rem",
          }}
        >
          <div>
            {/* <h4>Pré cadastrados</h4> */}
            <h4>{totalRegister} cadastros feitos</h4>
          </div>
          <div>
            <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
              {api?.currentUser?.Type === "TEGG" && (
                <div>
                  <h5>Gerar link para Revenda</h5>
                  <AsyncSelect
                    loadOptions={loadDealers}
                    placeholder="Selecione a revenda"
                    // placeholder={t("Clients.searchResalePlaceHolder")}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (base) => ({ ...base, width: 250 }),
                    }}
                    menuPosition={"fixed"}
                    defaultOptions
                    isClearable
                    onChange={(e) => {
                      // console.log(e);
                      if (e === null) {
                        setDealer();
                      } else {
                        setDealer(e.value);
                      }
                    }}
                  />
                </div>
              )}
              {api.currentUser.Type !== "AGENT" && (
                <div>
                  <h5 />
                  <Button onClick={() => setModalLink(true)}>Gerar link</Button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
              {api?.currentUser?.Type === "TEGG" && (
                <div>
                  <h5>Gerar link para Representante</h5>
                  <AsyncPaginate
                    // defaultOptions
                    isClearable
                    placeholder={"Selecione o representante"}
                    noOptionsMessage={() => "Sem representantes"}
                    // value={finalClient}
                    loadOptions={loadAgents}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPosition={"fixed"}
                    onChange={(e) => {
                      setFinalClient(e?.value);
                    }}
                  />
                </div>
              )}
              {api.currentUser.Type !== "DEALER" && (
              <div>
                <h5 />
                <Button onClick={() => setModalLinkAgent(true)}>
                  Gerar link
                </Button>
              </div>)}
            </div>
          </div>
        </div>
        {api.currentUser?.Type === "TEGG" && (
          <div style={{ display: window.innerWidth > 768 && "flex", gap: 10 }}>
            <div
              style={{
                // width: "100%",
                display: "flex",
                gap: 10,
                justifyContent: "start",
                alignItems: "center",
                marginBottom: "0.7rem",
              }}
            >
              <h5>Filtrar por Revenda</h5>
              <AsyncSelect
                loadOptions={loadDealersSearch}
                placeholder="Selecione a revenda"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({ ...base, width: 250 }),
                }}
                menuPosition={"fixed"}
                defaultOptions
                isClearable
                onChange={(e) => {
                  if (e === null) {
                    setDealerSearch("");
                  } else {
                    setDealerSearch(e.value);
                  }
                }}
              />
            </div>
            <div
              style={{
                // width: "100%",
                display: "flex",
                gap: 10,
                justifyContent: "start",
                alignItems: "center",
                marginBottom: "0.7rem",
              }}
            >
              <h5>Filtrar por Representante</h5>
              <AsyncPaginate
                // defaultOptions
                isClearable
                placeholder={"Selecione o representante"}
                noOptionsMessage={() => "Sem representantes"}
                // value={finalClient}
                loadOptions={loadAgentsSearch}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                menuPosition={"fixed"}
                onChange={(e) => {
                  setFinalClientSearch(e?.value);
                }}
              />
            </div>
          </div>
        )}
        <ContainerWeb>
          <TableItens>
            <tr>
              <th>Revenda</th>
              <th>Representante</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>WhatsApp</th>
              <th>Documento</th>
              <th>Pais</th>
              <th>Estado</th>
              <th>Cidade</th>
              <th>Rua</th>
              <th>Número</th>
              <th>Bairro</th>
              <th>CEP</th>
              <th>Complemento</th>
            </tr>
            {preOrders.map((d) => (
              <tr key={d?.Id}>
                <td>
                  {d?.DealerId
                    ? d?.Dealer?.Name
                    : d?.FinalClietId
                    ? ""
                    : "TEGG"}
                </td>
                <td>{d?.FinalClietId ? d?.FinalClient?.Name : ""}</td>
                <td>{d?.Name}</td>
                <td>{d?.Phone}</td>
                <td>{d?.WhatsApp}</td>
                <td>{`${d?.DocumentType} - ${d?.DocumentNumber}`}</td>
                <td>{d?.Country}</td>
                <td>{d?.State}</td>
                <td>{d?.City}</td>
                <td>{d?.StreetName}</td>
                <td>{d?.StreetNumber}</td>
                <td>{d?.District}</td>
                <td>{d?.PostalCode}</td>
                <td>{d?.Complement}</td>
              </tr>
            ))}
            {preOrders.length === 0 && (
              <tr>
                <td colSpan={13}>
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
        <ContainerMobile style={{ width: "100%", height: "100%" }}>
          {preOrders.map((d) => (
            <div
              key={d.Id}
              style={{
                width: "90%",
                backgroundColor: "#00D959",
                textAlign: "center",
                // color: '#3d3d3d',
                padding: "0.5rem",
                // margin: "auto",
                margin: 10,
                borderRadius: "8px",
                // marginTop: "0.2rem",
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
                {/* <IconButton
                 aria-label="more"
                 id="long-button"
                 aria-controls={open ? "long-menu" : undefined}
                 aria-expanded={open ? "true" : undefined}
                 aria-haspopup="true"
                 onClick={handleClick}
               >
                 <IoMdMore />
               </IconButton> */}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                }}
              ></div>
              <h4 style={{ padding: "0.2rem", fontWeight: "bold" }}>
                {d.Name}
              </h4>
              {api.currentUser?.Type === "TEGG" && !d?.FinalClietId && (
                <h4>
                  Revenda:{" "}
                  {d?.DealerId
                    ? d?.Dealer?.Name
                    : d?.FinalClietId
                    ? ""
                    : "TEGG"}
                </h4>
              )}
              {api.currentUser?.Type === "TEGG" && d?.FinalClietId && (
                <h4>
                  Representante: {d?.FinalClietId ? d?.FinalClient?.Name : ""}
                </h4>
              )}
              <h5>{/* {documentFormat(client.Cpf)} */}</h5>
              <h5>Tel: {d?.Phone}</h5>
              {d?.WhatsApp && <h5>WhatsApp: {d?.WhatsApp}</h5>}
              <h5>{`${d?.DocumentType} - ${d?.DocumentNumber}`}</h5>

              <h5 style={{ margin: 5, fontWeight: "bold" }}>ENDEREÇO</h5>
              {/* <h5>{d?.Country}</h5>
              <h5>{d?.State}</h5> */}
              <h5>{`${d?.Country} - ${d?.State} - ${d?.City}`}</h5>
              <h5>{`${d?.StreetName}, ${d?.StreetNumber}`}</h5>
              {/* <h5>{d?.StreetName}</h5>
              <h5>{d?.StreetNumber}</h5> */}
              <h5>{d?.District}</h5>
              <h5>{d?.Complement}</h5>
              <h5>{d?.PostalCode}</h5>
            </div>
          ))}
        </ContainerMobile>

        <div
          style={{
            display: window.innerWidth > 768 && "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 5,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>Itens por página:</p>
            <Select
              name="pages"
              id="page-select"
              options={[
                { label: "5", value: "5" },
                { label: "10", value: "10" },
                { label: "30", value: "30" },
                { label: "50", value: "50" },
              ]}
              value={limit}
              onChange={(e) => {
                handlePageSizeChange(e);
              }}
            />
          </div>
          <div
            style={{
              marginTop: window.innerWidth < 768 && "1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={total}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              size="large"
            />
          </div>
        </div>
      </PageLayout>
      <Dialog open={modalLink}>
        <DialogTitle>Link personalizado</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ wordWrap: "break-word" }}>
            {api.currentUser?.Type === "TEGG" ? (
              <>
                Esse é o link personalizado da revenda selecionada: <br />
                <span
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                  id="linkPersonal"
                  value={`https://tegg.app/subscribe/${dealer}`}
                  onClick={generateLink}
                >
                  https://tegg.app/subscribe/{dealer}
                </span>
              </>
            ) : (
              <>
                {" "}
                Esse é o seu link personalizado: <br />
                <span
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                  id="linkPersonal1"
                  value={`https://tegg.app/subscribe/${api?.currentUser?.DealerId}`}
                  onClick={generateLink}
                >
                  https://tegg.app/subscribe/{api?.currentUser?.DealerId}
                </span>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalLink(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalLinkAgent}>
        <DialogTitle>Link personalizado</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ wordWrap: "break-word" }}>
            {api.currentUser?.Type === 'TEGG' ? (
              <>
              Esse é o link personalizado do Representante selecionado: <br />
              <span
                style={{ fontWeight: "bold", cursor: "pointer" }}
                id="linkPersonalAgent"
                value={`https://tegg.app/subscribe/${finalClient}`}
                onClick={generateLinkAgent}
              >
                https://tegg.app/subscribe/client/{finalClient}
              </span>
            </>
            ):(
              <>
              Esse é o seu link personalizado <br />
              <span
                style={{ fontWeight: "bold", cursor: "pointer" }}
                id="linkPersonalAgent1"
                value={`https://tegg.app/subscribe/${finalClient}`}
                onClick={generateLinkAgent}
              >
                https://tegg.app/subscribe/client/{finalClient}
              </span>
            </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalLinkAgent(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
