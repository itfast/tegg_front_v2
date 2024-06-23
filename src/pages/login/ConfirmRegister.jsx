import { useLocation, useNavigate, useParams } from "react-router-dom";
import { NewClientExtern } from "../clients/new/NewClientExtern";
import { ContainerBodyLogin, ContainerLogin } from "./Login.styles";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { translateError } from "../../services/util";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export const ConfirmRegister = () => {
  const { id } = useParams();
  const query = useQuery();
  const [data, setData] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const token = query.get("token");

    if (id && token) {
      api.client.getPreregistrationIdExtern(id, token)
      .then((res)=> {
        setData(res?.data)
      })
      .catch((err)=> translateError(err))
    }
  }, [query, id]);

  return (
    <ContainerBodyLogin>
      <img
        src={"/assets/tegg-branco.png"}
        style={{
          width: "15%",
          marginTop: 10,
          marginBottom: 10,
        }}
      />
      <ContainerLogin style={{ maxWidth: "1000px", height: "550px" }}>
        <div
          style={{
            backgroundColor: "white",
            margin: "auto",
            width: "100%",
            padding: "0.5rem",
          }}
        >
          {/* <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            Cadastre-se
          </h2> */}
          <NewClientExtern setSingUp={() => navigate('/login')} data={data} />
        </div>
      </ContainerLogin>

      <h4
        className="copyright-text"
        style={{
          margin: 10,
          textAlign: "center",
          color: "white",
        }}
      >
        Copyright © 2024 TEGG TECHNOLOGY LTDA – CNPJ: 45.435.783/0001-74 | Todos
        Direitos Reservados
      </h4>
    </ContainerBodyLogin>
  );
};
