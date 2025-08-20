import { ChevronDown } from "lucide-react";

import { Divider } from "../../divider";
import "./styles.css";

type CountryType = {
  name: string;
  code: string;
  iso: string;
  prefix: null | string;
  flag: string;
  mask: string;
};

type PhoneInputCountrySelectorProps = {
  size: "md" | "lg";
  currentCountry: CountryType;
  onClick: () => void;
};

function PhoneInputCountrySelector(props: PhoneInputCountrySelectorProps) {
  const { currentCountry, onClick } = props;

  return (
    <div className="phoneInputSelectCountry" onClick={onClick}>
      <img
        className="flag"
        src={currentCountry.flag}
        alt={currentCountry.name}
      />
      <ChevronDown className="chevronDown" strokeWidth={2.5} />
      <Divider orientation="vertical" />
    </div>
  );
}

export { PhoneInputCountrySelector };
