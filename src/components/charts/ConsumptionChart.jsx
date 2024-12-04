/* eslint-disable no-prototype-builtins */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../../services/api";
import { translateError } from "../../services/util";
import { Line, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ReactLoading from "react-loading";
import Select from "react-select";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";
import prettyBytes from 'pretty-bytes';

import "./consumption_chart.css";
import moment from 'moment'

const formatBalance = (str) => {
  if (str !== undefined) {
    const val = Math.floor(str);
    return val / 1000;
  }
};

export const ConsumptionChart = ({ lineMetrics }) => {
  const today = new Date();
  const [date, setDate] = useState({
    Year: today.getFullYear(),
    Month: today.getMonth() + 1,
  });

  const [selection, setSelection] = useState("data");
  const selectionOptions = [
    {
      value: "data",
      label: "Dados",
    },
    {
      value: "sms",
      label: "SMS",
    },
    {
      value: "call",
      label: "Chamadas",
    },
  ];
  const [monthOptions, setMonthOptions] = useState([
    {
      value: 1,
      label: "Janeiro",
      disabled: true,
    },
    {
      value: 2,
      label: "Fevereiro",
      disabled: true,
    },
    {
      value: 3,
      label: "Março",
      disabled: true,
    },
    {
      value: 4,
      label: "Abril",
      disabled: true,
    },
    {
      value: 5,
      label: "Maio",
      disabled: true,
    },
    {
      value: 6,
      label: "Junho",
      disabled: true,
    },
    {
      value: 7,
      label: "Julho",
      disabled: true,
    },
    {
      value: 8,
      label: "Agosto",
      disabled: true,
    },
    {
      value: 9,
      label: "Setembro",
      disabled: true,
    },
    {
      value: 10,
      label: "Outubro",
      disabled: true,
    },
    {
      value: 11,
      label: "Novembro",
      disabled: true,
    },
    {
      value: 12,
      label: "Dezembro",
      disabled: true,
    },
  ]);

  const [gettingData, setGettingData] = useState(true);
  const [labels, setLabels] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [smsData, setSmsData] = useState([]);
  const [callData, setCallData] = useState([]);

  const [dataTotal, setDataTotal] = useState([]);
  // const [dataRefer, setDataRefer] = useState([]);
  const [smsTotal, setSmsTotal] = useState([]);
  const [callTotal, setCallTotal] = useState([]);

  const [lines, setLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState({});

  const [balance, setBalance] = useState(0);

  const formatPhone = (str) => {
    if (str != undefined) {
      const fullNumber = str.toString();
      const country = fullNumber.slice(0, 2);
      const area = fullNumber.slice(2, 4);
      const number1 = fullNumber.slice(4, 9);
      const number2 = fullNumber.slice(9);
      // console.log(fullNumber, country, area, number1, number2);
      return `+${country} (${area}) ${number1}-${number2}`;
    }
  };

  const setMonths = () => {
    let array = [...monthOptions];
    for (let i = 0; i < date.Month; i++) {
      array[i].disabled = false;
    }
    setMonthOptions(array);
  };

  const getDays = () => {
    const d = new Date(date.Year, date.Month, 0);
    const array = [];
    for (let i = 1; i <= d.getDate(); i++) {
      array.push(
        `${i.toString().padStart(2, "0")}/${date.Month.toString().padStart(
          2,
          "0"
        )}`
      );
    }
    // console.log(array);
    setLabels(array);
  };

  



  const getDataConsumption = () => {
    if (
      uploadData.length === 0 ||
      downloadData.length === 0 ||
      dataTotal.length === 0
    ) {
      // console.log(uploadData, downloadData, dataTotal);
      const d = new Date(date.Year, date.Month, 0);
      setGettingData(true);
      api.line
        .getDataConsumption(Number(selectedLine.value), date.Year, date.Month)
        .then((res) => {
          console.log(res)
          let uArray = [];
          let dArray = [];
          let sum = 0;
          let total = 0;
          res.data?.recharge?.resultados?.forEach((r) => {
            total += r.qtDado;
          });
          if (res.data.consumption.hasOwnProperty("sucesso")) {
            for (let i = 1; i <= d.getDate(); i++) {
              uArray.push(0);
              dArray.push(0);
            }
            for (const item of res.data.consumption.resultados) {
              // sum += item.qtUsadoUpload + item.qtUsadoDownload;
              sum += item.qtUsadoDownload;
              const day = Number(item.dtConsumo.slice(8, 10)) - 1;
              uArray[day] = item.qtUsadoUpload / (1024 * 1024);
              dArray[day] = item.qtUsadoDownload / (1024 * 1024);
            }
            
            setUploadData(uArray);
            setDownloadData(dArray);
            const veryLargeNumber = 1.0e+06
            const result = total === 0 ? 0 : (total * veryLargeNumber)-sum
            setDataTotal([result, sum]);
            setBalance(res.data?.balance?.resultado?.qtDadoRestante);
          }
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => {
          // console.log("chamou sms");
          getSmsConsumption();
        });
    }
  };

  const getSmsConsumption = () => {
    if (smsData.length === 0 || smsTotal.length === 0) {
      const d = new Date(date.Year, date.Month, 0);
      api.line
        .getSmsConsumption(Number(selectedLine.value), date.Year, date.Month)
        .then((res) => {
          // console.log(res.data.resultados);
          let array = [];
          let sum = 0;

          if (res.data.hasOwnProperty("sucesso")) {
            for (let i = 1; i <= d.getDate(); i++) {
              array.push(0);
            }
            for (const item of res.data.resultados) {
              const day = Number(item.dtConsumo.slice(8, 10)) - 1;
              sum += item.qtUsado;
              array[day] = item.qtUsado;
            }
            setSmsData(array);
            setSmsTotal([100 - sum, sum]);
          }
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => {
          getCallConsumption();
        });
    }
  };

  const getCallConsumption = () => {
    if (callData.length === 0 || callTotal.length === 0) {
      const d = new Date(date.Year, date.Month, 0);
      api.line
        .getCallConsumption(Number(selectedLine.value), date.Year, date.Month)
        .then((res) => {
          // console.log(res.data.resultados);
          let array = [];
          let sum = 0;

          if (res.data.hasOwnProperty("sucesso")) {
            for (let i = 1; i <= labels.length; i++) {
              for (let i = 1; i <= d.getDate(); i++) {
                array.push(0);
              }
              for (const item of res.data.resultados) {
                const day = Number(item.dtConsumo.slice(8, 10)) - 1;
                sum += item.qtUsado;
                array[day] = item.qtUsado;
              }
            }
            setCallData(array);
            setCallTotal([1000 - sum, sum]);
          }
        })
        .catch((err) => {
          console.log(err);
          translateError(err);
        })
        .finally(() => {
          setGettingData(false);
        });
    }
  };

  const getLines = () => {
    api.line
      .myLines(1, 500)
      .then((res) => {
        // console.log(res.data);
        const array = [];
        for (const line of res.data.iccids) {
          if (line.IccidHistoric[0]?.SurfMsisdn) {
            array.push({
              label: formatPhone(line.IccidHistoric[0]?.SurfMsisdn),
              value: line.IccidHistoric[0]?.SurfMsisdn,
              plan: line.IccidHistoric[0]?.SurfNuPlano,
              Iccid: line.IccidHistoric[0]?.Iccid,
              expiry: line.IccidHistoric[0]?.SurfDtPlanoExpira,
            });
          }
        }
        if (array.length > 0) {
          setLines(array);
          setSelectedLine(array[0]);
        } else {
          setGettingData(false);
        }
      })
      .catch((err) => {
        console.log(err);
        translateError(err);
      });
  };

  useEffect(() => {
    getDays();
    setMonths();
    getLines();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedLine).length !== 0) {
      getDataConsumption();
    }
  }, [selectedLine]);

  useEffect(() => {
    if (Object.keys(selectedLine).length !== 0) {
      getDays();
    }
  }, [date]);

  useEffect(() => {
    if (Object.keys(selectedLine).length !== 0) {
      getDataConsumption();
    }
  }, [labels]);

  // let customLabels = labels.map((label, index) => `${label}: MB`);

  return (
    <div className="card2" style={{ minHeight: 50, margin: "1rem" }}>
      <div className="card_title">
        <h4>CONSUMO DA LINHA</h4>
      </div>
      <div className="consumption_chart_selects">
        {lines.length > 0 && (
          <>
            <div
              className="input_3"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label>Linha:</label>
              <Select
                isSearchable={false}
                isClearable={false}
                options={lines}
                placeholder="Linha"
                defaultValue={lines[0]}
                menuPosition="fixed"
                onChange={(e) => {
                  if (e !== selectedLine) {
                    setUploadData([]);
                    setDownloadData([]);
                    setDataTotal([]);
                    setSmsData([]);
                    setSmsTotal([]);
                    setCallData([]);
                    setCallTotal([]);
                    setSelectedLine(e);
                    lineMetrics(e?.Iccid);
                  }
                }}
              />
            </div>
            <div
              className="input_3"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label>Consumo:</label>
              <Select
                isSearchable={false}
                isClearable={false}
                options={selectionOptions}
                placeholder="Plano"
                defaultValue={selectionOptions[0]}
                menuPosition="fixed"
                onChange={(e) => {
                  // console.log(e.value);
                  setSelection(e.value);
                }}
              />
            </div>
            <div
              className="input_3"
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <label>Mês:</label>
              <Select
                isSearchable={false}
                isClearable={false}
                options={monthOptions}
                isOptionDisabled={(option) => option.disabled}
                placeholder="Mês"
                defaultValue={monthOptions[date.Month - 1]}
                menuPosition="fixed"
                onChange={(e) => {
                  setUploadData([]);
                  setDownloadData([]);
                  setDataTotal([]);
                  setSmsData([]);
                  setSmsTotal([]);
                  setCallData([]);
                  setCallTotal([]);
                  setDate({
                    ...date,
                    Month: e.value,
                  });
                }}
              />
            </div>
          </>
        )}
      </div>
      <div style={{marginLeft: 30}}>
        {selectedLine?.expiry &&<h5 style={{color: 'red'}}>Vencimento: {moment(selectedLine?.expiry).format('DD/MM/YYYY')}</h5>}
      </div>
      {!gettingData ? (
        // <div className='big_consumption_container'>
        // <div className='small_consumption_container'>
        <div style={{ width: "100%" }}>
          <div>
            {selection === "data" ? (
              <div
                style={{
                  height: "15rem",
                  display: "flex",
                  justifyContent: "center",
                  padding: "2rem",
                }}
              >
                <Line
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: "Upload / dia",
                        data: uploadData,
                        fill: false,
                        borderColor: "#00d959",
                        tension: 0.3,
                      },
                      {
                        label: "Download / dia",
                        data: downloadData,
                        fill: false,
                        borderColor: "#8884d8",
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            let label =
                              context.dataset.label +
                              ": " +
                              context.formattedValue +
                              " MB";
                            return label;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            ) : selection === "sms" ? (
              <div>
                <Line
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: "SMSs usados / dia",
                        data: smsData,
                        fill: false,
                        borderColor: "#8884d8",
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div>
                <Line
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: "Minutos usados / dia",
                        data: callData,
                        fill: false,
                        borderColor: "#8884d8",
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
          <br />
          {/* <div className='small_consumption_container'> */}
          <div
            style={{
              display: "flex",
              flexDirection: window.innerWidth > 768 ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "2em",
              margin: window.innerWidth > 768 && "auto",
            }}
          >
            {Object.keys(selectedLine) !== 0 && (
              <>
                 <div style={{ maxHeight: window.innerWidth > 768 && "25vh" }}>
                  <Pie
                    data={{
                      labels: [
                        "Total de dados (GB) / mês",
                        "Dados gastos (GB) / mês",
                      ],
                      datasets: [
                        {
                          label: "Dados",
                          data: dataTotal,
                          backgroundColor: ["#00d959", "#8884d8"],
                        },
                      ],
                    }}
                    plugins={[ChartDataLabels]}
                    options={{
                      plugins: {
                        datalabels: {
                          //RETIRAR DISPLAY CASO QUEIRA MOSTRAR TODOS OS VALORES
                          // display: (ctx) => {
                          //   return ctx.dataset.data[ctx.dataIndex] > 10;
                          // },
                          // Math.round(value*100)
                          formatter: function (value, context) {
                            if(value){
                              if(context.dataIndex === 0){
                                return prettyBytes(value) +' - Disponível'
                              }else{
                                return prettyBytes(value) + ' - Consumidos'
                              }
                            }else{
                              return ''
                            }
                          },
                          labels: {
                            title: {
                              color: "black",
                            },
                          },
                        },
                      },
                    }}
                  />
                  <h4>
                    Total acumulado restante:{" "}
                    {formatBalance(balance)?.toFixed(2)}GB
                  </h4>
                </div>
                <div style={{ maxHeight: window.innerWidth > 768 && "25vh" }}>
                  <Pie
                    data={{
                      labels: ["Total de SMS / mês", "SMS gastos / mês"],
                      datasets: [
                        {
                          label: "SMS",
                          data: smsTotal,
                          backgroundColor: ["#00d959", "#8884d8"],
                        },
                      ],
                    }}
                    plugins={[ChartDataLabels]}
                    options={{
                      plugins: {
                        datalabels: {
                          //RETIRAR DISPLAY CASO QUEIRA MOSTRAR TODOS OS VALORES
                          display: (ctx) => {
                            return ctx.dataset.data[ctx.dataIndex] > 10;
                          },
                          labels: {
                            title: {
                              color: "black",
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div style={{ maxHeight: window.innerWidth > 768 && "25vh" }}>
                  <Pie
                    data={{
                      labels: [
                        "Total de minutos / mês",
                        "Minutos gastos / mês",
                      ],
                      datasets: [
                        {
                          label: "Chamadas",
                          data: callTotal,
                          backgroundColor: ["#00d959", "#8884d8"],
                        },
                      ],
                    }}
                    plugins={[ChartDataLabels]}
                    options={{
                      plugins: {
                        datalabels: {
                          //RETIRAR DISPLAY CASO QUEIRA MOSTRAR TODOS OS VALORES
                          display: (ctx) => {
                            return ctx.dataset.data[ctx.dataIndex] > 10;
                          },
                          labels: {
                            title: {
                              color: "black",
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="loading">
          <ReactLoading type={"bars"} color={"#000"} />
        </div>
      )}
    </div>
  );
};
