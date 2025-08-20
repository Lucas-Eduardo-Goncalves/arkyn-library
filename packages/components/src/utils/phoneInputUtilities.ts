import { countries } from "@arkyn/templates";

type CountryType = {
  name: string;
  code: string;
  iso: string;
  prefix: null | string;
  flag: string;
  mask: string;
};

function clear(value: string) {
  return value && value.replace(/[^0-9]/g, "");
}

const TYPES = {
  EIGHT: "(99) 9999-9999",
  NINE: "(99) 99999-9999",
};

function applyMask(value: string, maskPattern: string) {
  let result = "";
  let digitIndex = 0;

  for (let i = 0; i < maskPattern.length; i++) {
    if (maskPattern[i] === "9") {
      if (digitIndex < value.length) {
        result += value[digitIndex];
        digitIndex++;
      } else {
        break;
      }
    } else {
      if (digitIndex < value.length) {
        result += maskPattern[i];
      } else {
        break;
      }
    }
  }

  return result;
}

function getMask(value: string): "NINE" | "EIGHT" {
  const mask = value.length > 10 ? "NINE" : "EIGHT";
  return mask;
}

const MAX_LENGTH = clear(TYPES.NINE).length;

function formatPhoneNumber(phoneNumber: string, country: CountryType) {
  if (country.code === "+55") {
    let value = clear(phoneNumber);
    const mask = getMask(value);

    let nextLength = value.length;
    if (nextLength > MAX_LENGTH) return;

    value = applyMask(value, TYPES[mask] as "EIGHT" | "NINE");
    return value;
  }

  const mask = country.mask;
  let formattedNumber = mask;

  if (country.prefix) {
    const prefixRegex = /\$+/g;
    formattedNumber = formattedNumber.replace(prefixRegex, country.prefix);
  }

  for (
    let i = 0, j = 0;
    i < formattedNumber.length && j < phoneNumber.length;
    i++
  ) {
    if (formattedNumber[i] === "_") {
      formattedNumber =
        formattedNumber.substring(0, i) +
        phoneNumber[j] +
        formattedNumber.substring(i + 1);
      j++;
    }
  }

  return formattedNumber;
}

function getCountryWithPrefixCode(countryCode: string, prefix: string) {
  const country = countries.find(
    (country) => country.code === countryCode && country.prefix === prefix
  );
  if (!country) return null;
  return country;
}

function getCountryWithoutPrefixCode(countryCode: string) {
  const country = countries.find((country) => country.code === countryCode);
  if (!country) return null;
  return country;
}

function getDefaultFormatPhoneNumber(defaultValue: string) {
  const countryCode = defaultValue.split(" ")[0].split("-")[0];
  const prefixCode = defaultValue.split(" ")[0].split("-")[1];
  const phoneNumber = defaultValue.split(" ")[1];

  if (!countryCode || !phoneNumber) {
    return { country: null, formattedNumber: "" };
  }

  if (prefixCode) {
    const country = getCountryWithPrefixCode(countryCode, prefixCode);
    if (!country) return { country: null, formattedNumber: "" };

    const formattedNumber = formatPhoneNumber(phoneNumber, country);
    const response = { country, formattedNumber };

    return response;
  }

  const country = getCountryWithoutPrefixCode(countryCode);
  if (!country) return { country: null, formattedNumber: "" };

  const formattedNumber = formatPhoneNumber(phoneNumber, country);
  const response = { country, formattedNumber };

  return response;
}

export {
  getDefaultFormatPhoneNumber,
  applyMask,
  clear,
  getMask,
  MAX_LENGTH,
  TYPES,
};
