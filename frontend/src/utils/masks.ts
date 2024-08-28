export const normalizePhoneNumber = (value: string | undefined) => {
  if (!value) return "";

  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})(\d+?)/, "$1");
};

export const normalizeCpf = (value: string | undefined) => {
  if (!value) return "";

  return value
    .replace(/[\D]/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .replace(/(-\d{2})(\d+?)/, "$1");
};


export const normalizeData = (value: string | undefined) => {
  if (!value) return "";

  var data = new Date(value);

  var dia = data.getDate();
  var mes = data.getMonth() + 1; 
  var ano = data.getFullYear();

  var dataFormatada = dia + '/' + mes + '/' + ano;

  return dataFormatada
};

export const normalizeMonetaryValue = (value: string | undefined) => {
  if (!value) value = "";
  value = value.replace(/^0+/, "");
  if (value.length < 4) {
    value = "0".repeat(4 - value.length) + value;
  }

  const num = value.replace(/[\D]/g, "").replace(/[,.]/g, "");

  return (
    num.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
    "," +
    num.slice(-2)
  );
};