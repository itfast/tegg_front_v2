/* eslint-disable react/prop-types */
import { Button } from "../../../../globalStyles";
import { CardData } from "../../resales/Resales.styles";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useRef } from "react";
// import { IoMdDownload } from "react-icons/io";
// import { xlsx } from "xlsx";
// import xlsx from 'xlsx'
// import xlsx from "node-xlsx";
import * as XLSX from "xlsx/xlsx.mjs";

export const IccidDataSpreadsheet = ({
  goStep,
  goBackStep,
  file,
  setFile,
  label,
  loading,
}) => {
  const addSpreadsheet = useRef(null);

  // const s2ab = (s) => {
  // 	const buf = new ArrayBuffer(s.length);
  // 	const view = new Uint8Array(buf);
  // 	for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  // 	return buf;
  // };
  // const downloadExample = () => {}
  const downloadExample = () => {
    var wb = XLSX.utils.book_new();
    var buffer = [
      {
        ICCID: "8955170110318000369",
        ["LINK LPA"]: "LPA:1$sm-v4-064-a-gtm.pr.go-esim.com$9B70A4E1385D698960A0714E5AC6FE47",
        ["ESTOQUE (TEGG = 0, SPEEDFLOW =1"]: "0",
        ["CPF/CNPJ REVENDA"]: "07108881047",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(buffer);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet");
    XLSX.writeFile(wb, "Exemplo.xlsx");
  };

  const handleNext = () => {
    if (file !== null) {
      goStep();
    } else {
      toast.error("Envie ao menos um arquivo");
    }
  };

  return (
    <>
      <CardData>
        <h3>{label}</h3>

        <div style={{ width: "100%", margin: "1rem", display: "flex" }}>
          <div
            style={{
              width: "100%",
              marginRight: "1%",
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Button
              //  nothover
              onClick={downloadExample}
            >
              <div style={{ display: "flex", gap: 5 }}>
                <p>PLANILHA EXEMPLO</p>
                {/* <IoMdDownload size={20} /> */}
              </div>
            </Button>

            <Button
              //  nothover
              onClick={() => addSpreadsheet.current.click()}
            >
              {file ? "TROCAR ARQUIVO" : "ESCOLHER ARQUIVO"}
            </Button>
            <p>{file ? file.name : "Escolha um arquivo..."}</p>
          </div>
        </div>
        <br />
        <br />

        <div className="flex end">
          <div className="btn_container btn_invert">
            <Button invert onClick={goBackStep}>
              VOLTAR
            </Button>
            <Button
              //  nothover
              onClick={handleNext}
            >
              {loading ? (
                <div className="loading">
                  <ReactLoading type={"bars"} color={"#fff"} />
                </div>
              ) : (
                "CADASTRAR"
              )}
            </Button>
          </div>
        </div>
      </CardData>
      <input
        ref={addSpreadsheet}
        type="file"
        style={{ opacity: 0 }}
        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={() => {
          console.log(addSpreadsheet.current.files[0]);
          setFile(addSpreadsheet.current.files[0]);
        }}
        className="form-control"
        //id="inputNumSerie"
        placeholder="Planilha de ICCIDs"
        name="Planilha de ICCIDs"
      />
    </>
  );
};
