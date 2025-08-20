import { Check } from "lucide-react";
import "./styles.css";

type CountryType = {
  name: string;
  code: string;
  iso: string;
  prefix: null | string;
  flag: string;
  mask: string;
};

type PhoneInputCountryOptionProps = {
  country: CountryType;
  size: "md" | "lg";
  isActive: boolean;
  handleChangeValue: (country: CountryType) => void;
};

function PhoneInputCountryOption(props: PhoneInputCountryOptionProps) {
  const { country, isActive, handleChangeValue, size } = props;

  const hasActive = isActive ? "active" : "";
  const className = `arkynPhoneInputCountryOption ${size} ${hasActive}`;

  return (
    <div onClick={() => handleChangeValue(country)} className={className}>
      <img src={country.flag} alt={country.name} className="flag" />
      {country.name} <span>{country.code}</span>
      <Check className="check" />
    </div>
  );
}

export { PhoneInputCountryOption };
