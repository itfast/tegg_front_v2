/* eslint-disable react/prop-types */
// import { Button } from "../../../../globalStyles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { UFS, getCEP, cepFormat, cleanNumber } from "../../../services/util";
// import { toast } from "react-toastify";
import {
  // CardData,
  InputData,
  SelectUfs,
} from "../../orders/clientNew/NewOrder.styles";
import { useEffect, useRef } from "react";
import api from "../../../services/api";
// import { CardData } from '/NewOrder.styles';

export const AddressData = ({
  // goStep,
  // goBackStep,
  address,
  setAddress,
  otherAddress,
  setOtherAddress,
}) => {
  // const cepInput = document.getElementById('cep');
  // const [otherAddress, setOtherAddress] = useState(false);
  const cepInput = useRef(0);
  const getAddress = (id) => {
    api.client.getAddress1(id).then((res) => {
      setAddress({
        ...address,
        cep: cepFormat(res.data.PostalCode),
        uf: res.data.State || "",
        district: res.data.District || "",
        city: res.data.City || "",
        address: res.data.StreetName || "",
        number: res.data.Number,
        complement: res.data.Complement,
        mobile: res.data.Mobile && cleanNumber(res.data.Mobile),
        document: res.data.Cpf || res.data.Cnpj,
        name: res.data.Name,
        email: res.data.Email,
      });
    });
    // .catch((err) => {
    //   translateError(err);
    // });
  };

  useEffect(() => {
    if (!otherAddress) {
      getAddress(api.currentUser.MyFinalClientId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherAddress]);

  

  const handleCep = async (e) => {
    setAddress({ ...address, cep: cepFormat(e.target.value) });

    const res = await getCEP(e);
    // console.log(res);
    if (res) {
      setAddress({
        ...address,
        cep: cepFormat(e.target.value),
        uf: res.uf || "",
        district: res.bairro || "",
        city: res.localidade || "",
        address: res.logradouro || "",
        number: "",
        complement: "",
      });
    }
  };

  return (
    <>
      {/* // <CardData>
    //   <h5>ENDEREÇO DE ENTREGA</h5> */}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={otherAddress}
              sx={{
                // color: pink[800],
                "&.Mui-checked": {
                  color: "green",
                },
              }}
              onChange={(e) => setOtherAddress(e.target.checked)}
            />
          }
          label="Entregar em outro endereço"
        />
      </FormGroup>
      <div className="input_row_2">
        <InputData
          ref={cepInput}
          disabled={!otherAddress}
          type="text"
          id="cep"
          name="cep"
          placeholder="CEP*"
          value={address.cep}
          onChange={handleCep}
          className="input_20"
        />
        <InputData
          type="text"
          id="address"
          disabled={!otherAddress}
          placeholder="ENDEREÇO*"
          value={address.address}
          onChange={(e) => setAddress({ ...address, address: e.target.value })}
          className="input_80"
        />
      </div>
      <div className="input_row_2">
        <InputData
          type="text"
          disabled={!otherAddress}
          placeholder="COMPLEMENTO"
          value={address.complement}
          onChange={(e) =>
            setAddress({ ...address, complement: e.target.value })
          }
          className="input_80"
        />
        <InputData
          type="number"
          id="number"
          disabled={!otherAddress}
          placeholder="NÚMERO*"
          className="input_20"
          value={address.number}
          onChange={(e) => setAddress({ ...address, number: e.target.value })}
        />
      </div>
      <div className="input_row_3">
        <InputData
          type="text"
          id="district"
          disabled={!otherAddress}
          placeholder="BAIRRO*"
          value={address.district}
          onChange={(e) => setAddress({ ...address, district: e.target.value })}
          className="input_3"
        />
        <InputData
          type="text"
          id="city"
          disabled={!otherAddress}
          placeholder="CIDADE*"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          className="input_3"
        />
        <SelectUfs
          name="UF"
          id="uf"
          disabled={!otherAddress}
          placeholder="UF*"
          value={address.uf}
          onChange={(e) => setAddress({ ...address, uf: e.target.value })}
          className="input_3"
          defaultValue={""}
        >
          <option disabled value={""}>
            UFs
          </option>
          {UFS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </SelectUfs>
      </div>
      {/* <div className='flex end btn_invert'>
        <Button onClick={goBackStep} style={{width: window.innerWidth < 768 && '100%'}}>VOLTAR</Button>
        <Button notHover onClick={handleNext} style={{width: window.innerWidth < 768 && '100%'}}>
          PRÓXIMO
        </Button>
      </div> */}
    </>
    // {/* </CardData> */}
  );
};
