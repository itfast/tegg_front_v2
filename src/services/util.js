/* eslint-disable no-useless-escape */
import { toast } from "react-toastify";
import Payment from "payment";
import axios from "axios";

export const qtdChips = (plan) => {
  if (plan) {
    let filtered = plan.filter((p) => {
      return (
        p.Product?.SurfId === null &&
        p.Product?.Technology !== "NA" &&
        p.Product?.Technology !== "Streaming"
      );
    });
    console.log(filtered);
    return filtered.length;
  }
};

export const translateTypeClient = (client) => {
  switch(client){
    case 'CLIENT':
      return 'Cliente'
    case 'AGENT':
      return 'Representante'
    case 'DEALER':
    return 'Revenda'
    default: return client
  }
}

export const translateError = (err) => {
  if (err?.response?.data) {
    if (err.response.data.Problems) {
      err.response.data.Problems.forEach((e) => {
        toast.error(e.Message);
      });
    } else {
      toast.error(err.response.data.Message);
    }
  } else if (err.message) {
    if (err.message === "Network Error") {
      toast.error(
        "Erro de conexão, verifique sua conexão com a internet e tente novamente"
      );
    } else {
      toast.error(err.message);
    }
  }
};

export const UFS = [
  { label: "AC", value: "AC", code: 12 },
  { label: "AL", value: "AL", code: 27 },
  { label: "AM", value: "AM", code: 13 },
  { label: "AP", value: "AP", code: 16 },
  { label: "BA", value: "BA", code: 29 },
  { label: "CE", value: "CE", code: 23 },
  { label: "DF", value: "DF", code: 53 },
  { label: "ES", value: "ES", code: 32 },
  { label: "GO", value: "GO", code: 52 },
  { label: "MA", value: "MA", code: 21 },
  { label: "MG", value: "MG", code: 31 },
  { label: "MS", value: "MS", code: 50 },
  { label: "MT", value: "MT", code: 51 },
  { label: "PA", value: "PA", code: 15 },
  { label: "PB", value: "PB", code: 25 },
  { label: "PE", value: "PE", code: 26 },
  { label: "PI", value: "PI", code: 22 },
  { label: "PR", value: "PR", code: 41 },
  { label: "RJ", value: "RJ", code: 33 },
  { label: "RN", value: "RN", code: 24 },
  { label: "RO", value: "RO", code: 11 },
  { label: "RR", value: "RR", code: 14 },
  { label: "RS", value: "RS", code: 43 },
  { label: "SC", value: "SC", code: 42 },
  { label: "SE", value: "SE", code: 28 },
  { label: "SP", value: "SP", code: 35 },
  { label: "TO", value: "TO", code: 17 },
];

export const getCEP = async (e) => {
  e.preventDefault();
  const CEP = String(e.target.value.replace(/\D/g, ""));
  if (
    (CEP.length === 8 && CEP[5] !== "-") ||
    (CEP.length === 9 && CEP[5] === "-")
  ) {
    try {
      const { data, status } = await axios.get(
        `https://viacep.com.br/ws/${CEP}/json/`
      );

      if (status === 200) {
        return data;
      }
    } catch (err) {
      const error = err;

      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }
};

export const getCity = async (uf) => {
  // uf.preventDefault();

  try {
    const { data, status } = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );

    if (status === 200) {
      return data;
    }
  } catch (err) {
    const error = err;

    // eslint-disable-next-line no-console
    console.error(error.message);
  }
};

export const cnpjFormat = (e) => {
  const data = e.target.value.replace(/\D/g, "");
  return data
    .replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2") // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const cnpjStringFormat = (string) => {
  const data = string.replace(/\D/g, "");
  return data
    .replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2") // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const cepFormat = (value) => {
  const data = value.toString().replace(/\D/g, "");
  return data
    .replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{3})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

export const cnpjBancFormat = (e) => {
  const data = e.replace(/\D/g, "");
  return data
    .replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2") // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const cpfFormat = (e) => {
  // console.log(e)
  const data = e.target.value.replace(/\D/g, "");
  return data
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const rgFormat = (e) => {
  // console.log(e)
  const data = e.target.value.replace(/\D/g, "");
  return data
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .replace(/(-\d{1})\d+?$/, "$1");
};

export const iccidFormat = (value) => {
  // console.log(e)
  const data = value.toString().replace(/\D/g, "");
  return data.replace(/(-\d{19})\d+?$/, "$1").slice(0, 19);
};

export const cpfBancFormat = (e) => {
  // console.log(e)
  const data = e.replace(/\D/g, "");
  return data
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

// function getCheckDigit(value) {
//   if (/[^0-9-\s]+/.test(value)) return false;

//   var nCheck = 0, nDigit = 0, bEven = true;
//   value = value.replace(/\D/g, "");

//   for (var n = value.length - 1; n >= 0; n--) {
//       var cDigit = value.charAt(n)
//           nDigit = parseInt(cDigit, 10);

//       if (bEven) {
//           if ((nDigit *= 2) > 9) nDigit -= 9;
//       }

//       nCheck += nDigit;
//       bEven = !bEven;
//   }
//   return (1000 - nCheck) % 10;
// }

export const validateIccid = (value) => {
  const data = value.replace(/\D/g, "");
  if (
    data == "0000000000000000000" ||
    data == "1111111111111111111" ||
    data == "2222222222222222222" ||
    data == "3333333333333333333" ||
    data == "4444444444444444444" ||
    data == "5555555555555555555" ||
    data == "6666666666666666666" ||
    data == "7777777777777777777" ||
    data == "8888888888888888888" ||
    data == "9999999999999999999"
  ) {
    return false;
  }

  if (
    data.substring(0, 10) !== "8955170110" &&
    data.substring(0, 10) !== "8955170220"
  ) {
    return false;
  }

  if (data.length === 19) {
    // const res = getCheckDigit(data)
    // console.log(res)
    return true;
  }
  return false;
};

export const validateName = (str) => {
  const nomeSobrenome =
    /\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi;
  if (!nomeSobrenome.test(str)) {
    // toast.error('Informe o nome completo')
    return false;
  }
  return true;
};

export function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  var er = new RegExp(
    /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?$/
  );
  if (email == "" || !er.test(email)) {
    return false;
  } else {
    return true;
  }
  // var exclude=/[^@-.w]|^[_@.-]|[._-]{2}|[@.]{2}|(@)[^@]*1/;
  // var check=/@[w-]+./;
  // var checkend=/.[a-zA-Z]{2,3}$/;
  // if(((email.search(exclude) != -1)||(email.search(check)) == -1)||(email.search(checkend) == -1)){return false;}
  // else {return true;}
}

export const validateCpf = (value) => {
  let sum = 0;
  let rest;

  const data = value.replace(/\D/g, "");
  if (data.length === 11) {
    if (!data.split("").every((c) => c === data[0])) {
      for (let i = 0; i < 9; i++) {
        sum += Number(data[i]) * (10 - i);
      }

      rest = (sum * 10) % 11;
      if (rest === 10 || rest === 11) {
        rest = 0;
      }

      if (rest === Number(data[9])) {
        sum = 0;
        for (let i = 0; i < 10; i++) {
          sum += Number(data[i]) * (11 - i);
        }

        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) {
          rest = 0;
        }

        if (rest === Number(data[10])) {
          return true;
        }
      }
    }
  }
  return false;
};

export const validateCnpj = (value) => {
  let cnpj = value.replace(/[^\d]+/g, "");

  if (cnpj == "") return false;

  if (cnpj.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999"
  )
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
};

export const validateDocument = (value) => {
  let sum = 0;
  let rest;

  const data = value.replace(/\D/g, "");
  if (data.length === 11) {
    if (!data.split("").every((c) => c === data[0])) {
      for (let i = 0; i < 9; i++) {
        sum += Number(data[i]) * (10 - i);
      }

      rest = (sum * 10) % 11;
      if (rest === 10 || rest === 11) {
        rest = 0;
      }

      if (rest === Number(data[9])) {
        sum = 0;
        for (let i = 0; i < 10; i++) {
          sum += Number(data[i]) * (11 - i);
        }

        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) {
          rest = 0;
        }

        if (rest === Number(data[10])) {
          return true;
        }
      }
    }
  }

  console.log("aqui");

  // CNPJ
  if (data == "") return false;

  if (data.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    data == "00000000000000" ||
    data == "11111111111111" ||
    data == "22222222222222" ||
    data == "33333333333333" ||
    data == "44444444444444" ||
    data == "55555555555555" ||
    data == "66666666666666" ||
    data == "77777777777777" ||
    data == "88888888888888" ||
    data == "99999999999999"
  )
    return false;

  console.log("la");

  // Valida DVs
  let tamanho = data.length - 2;
  let numeros = data.substring(0, tamanho);
  const digitos = data.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    const mySoma = Number(numeros.charAt(tamanho - i)) * pos--;
    soma += mySoma;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado?.toString() != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = data.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    const mySoma = Number(numeros.charAt(tamanho - i)) * pos--;
    soma += mySoma;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado?.toString() != digitos.charAt(1)) return false;

  return true;
  // return false;
};

export const phoneFormat = (value) => {
  if (value) {
    const data = value.replace(/\D/g, "");
    if (data.length <= 10) {
      return data
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    } else {
      return data
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    }
  }
};

export const cleanNumber = (value) => {
  const tmp = value.replace(/[/().\s-]+/g, "");
  return tmp;
};

export const documentFormat = (e) => {
  try {
    const data = e.replace(/\D/g, "");
    if (data.length > 11) {
      return data
        .replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
        .replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2") // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    } else if (data.length > 3) {
      return data
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
  } catch (e) {
    console.log(e);
  }
};

export const translateValue = (value) => {
  let converted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
  return converted;
};

export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const linkPixFake =
  "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";

// CAR UTILS
function clearNumber(value = "") {
  return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`;
      break;
    case "dinersclub":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
      break;
  }
  return nextValue.replace(/\s/g, "");
}

export function formatCVC(value, prevValue, allValues = {}) {
  const clearValue = clearNumber(value);
  let maxLength = 4;

  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "amex" ? 4 : 3;
  }

  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}

export function formatFormData(data) {
  return Object.keys(data).map((d) => `${d}: ${data[d]}`);
}

export const invertDate = (data) => {
  const year = data.substring(0, data.indexOf("-"));
  const month = data.substring(data.indexOf("-") + 1, data.indexOf("-") + 3);
  const day = data.substring(data.length, data.length - 2);
  return `${day}/${month}/${year}`;
};

export const translatePaymentType = (type) => {
  switch (type) {
    case "CREDIT_CARD":
      return "Cartão de crédito";
    case "PIX":
      return "Pix";
    default:
      return type;
  }
};

export const translateStatus = (status) => {
  switch (status) {
    case "Created":
      return "Pedido criado";
    case "AWAITING_RISK_ANALYSIS":
      return "Pagamento aguardando análise de risco";
    case "APPROVED_BY_RISK_ANALYSIS":
      return "Pagamento aprovado pela análise de risco";
    case "REPROVED_BY_RISK_ANALYSIS":
      return "Pagamento reprovado pela análise de risco";
    case "PENDING":
      return "Pagamento pendente";
    case "PORTIN_PENDING":
      return "Portabilidade pendente";
    case "UPDATED":
      return "Pagamento atualizado";
    case "CONFIRMED":
      return "Pagamento confirmado";
    case "RECEIVED":
      return "Pagamento recebido";
    case "ANTICIPATED":
      return "Pagamento antecipado";
    case "OVERDUE":
      return "Pagamento vencido";
    case "REFUNDED":
      return "Pagamento estornado";
    case "REFUND_IN_PROGRESS":
      return "Estorno de pagamento em processamento";
    case "RECEIVED_IN_CASH_UNDONE":
      return "Recebimento em dinheiro desfeito";
    case "CHARGEBACK_REQUESTED":
      return "Chargeback recebido";
    case "CHARGEBACK_DISPUTE":
      return "Em disputa de chargeback";
    case "AWAITING_CHARGEBACK_REVERSAL":
      return "Aguardando repasse do adquirente";
    case "DUNNING_RECEIVED":
      return "Negativação recebida";
    case "DUNNING_REQUESTED":
      return "Negativação requisitada";
    case "BANK_SLIP_VIEWED":
      return "Boleto de cobrança visualizado pelo cliente";
    case "CHECKOUT_VIEWED":
      return "Fatura de cobrança visualizado pelo cliente";
    case "CANCELED":
      return "Cancelado";
    case "RECEIVED_IN_CASH":
      return "Recebido em dinheiro";
    case "CREATED":
      return "Criado";
    case "AWAITINGPROCESSING":
      return "Aguardando pela revenda";
    case "PROCESSED":
      return "Finalizado";
    case "PROCESSING":
      return "Em processamento";
    case "ACTIVE":
      return "Ativo";
    case "DELETED":
      return "Deletada";
    case "AWAITING_PAYMENT":
      return "Aguardando pagamento";
    case "Active":
      return "Ativo";
    case "Blocked":
      return "Desativado";
    default:
      return status;
  }
};

export const formatDate = (str) => {
  return str?.slice(0, 10)?.replaceAll("-", "/");
};

export const handleCopy = async (pixInf) => {
  try {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(pixInf?.payload);
    } else {
      document.execCommand("copy", true, pixInf?.payload);
    }
    toast.info("Pix copia e cola copiado para área de transferência");
  } catch (e) {
    console.log(e);
  }
};

export const formatPhone = (str) => {
  if (str != undefined) {
    const fullNumber = str.toString();
    // const country = fullNumber?.slice(0, 2);
    const area = fullNumber?.slice(2, 4);
    const number1 = fullNumber?.slice(4, 9);
    const number2 = fullNumber?.slice(9);
    // console.log(fullNumber, country, area, number1, number2);
    return ` (${area}) ${number1}-${number2}`;
  }
};

export const translateChipStatus = (str) => {
  switch (str) {
    case "ACTIVE":
      return "Ativado";
    case "CREATED":
      return "Aguardando status SURF";
    case "NOT USED":
      return "Não ativo na SURF";
    case "SENT":
      return "Enviado";
    case "GRACE1":
      return "Recarga atrasada 5 dias";
    case "GRACE2":
      return "Recarga atrasada 45 dias";
    case "GRACE3":
      return "Recarga atrasada 75 dias";
    case "EX":
      return "EX";
    case "PORTOUT":
      return "Portado";
    case "INVALID":
      return "Inválido";
    case "AVAILABLE":
      return "Disponível para venda";
    default:
      return str;
  }
};

export const optChipStatus = [
  { label: "Ativado", value: "ACTIVE" },
  // {label: 'Aguardando status SURF', value: 'CREATED'},
  // {label: 'Não ativo na SURF', value: 'NOT USED'},
  // {label: 'Enviado', value: 'SENT'},
  { label: "Recarga atrasada 5 dias", value: "GRACE1" },
  { label: "Recarga atrasada 45 dias", value: "GRACE2" },
  { label: "Recarga atrasada 75 dias", value: "GRACE3" },
  { label: "Cancelado", value: "CANCELED" },
  { label: "EX", value: "EX" },
  { label: "Portado", value: "PORTOUT" },
  { label: "Inválido", value: "INVALID" },
  // {label: 'Disponível para venda', value: 'AVAILABLE'},
];

export const translatePlanType = (planType) => {
  switch (planType) {
    case "4533":
      return "Plano 4GB";
    case "4534":
      return "Basic 7GB";
    case "4535":
      return "Start 13GB";
    case "4536":
      return "Gold 21GB";
    case "4537":
      return "Plus 44GB";
    case "4511":
      return "Family 80GB";
    case "4512":
      return "Ultra 100GB";
    default:
      return planType;
  }
};

export const formatBalance = (str) => {
  if (str !== undefined) {
    const val = Math.floor(str);
    return val / 1000;
  }
};
