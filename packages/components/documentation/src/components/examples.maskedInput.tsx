import { MaskedInput } from "@components";
import {
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Hash,
  IdCard,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

function MaskedInputExamples() {
  return (
    <Box title="MaskedInput">
      <Row>
        <MaskedInput
          name="variant-solid"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Solid variant (default):"
        />
        <MaskedInput
          name="variant-outline"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Outline variant:"
          variant="outline"
        />
        <MaskedInput
          name="variant-underline"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Underline variant:"
          variant="underline"
        />
      </Row>

      <Row>
        <MaskedInput
          name="size-md"
          mask="(__)_____-____"
          replacement={{ _: /\d/ }}
          placeholder="(11)99999-9999"
          label="Medium size (default):"
        />
        <MaskedInput
          name="size-lg"
          mask="(__)_____-____"
          replacement={{ _: /\d/ }}
          placeholder="(11)99999-9999"
          label="Large size:"
          size="lg"
        />
      </Row>

      <Row>
        <MaskedInput
          name="cpf"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="CPF:"
          leftIcon={User}
        />
        <MaskedInput
          name="cnpj"
          mask="__.___.___/____-__"
          replacement={{ _: /\d/ }}
          placeholder="00.000.000/0000-00"
          label="CNPJ:"
          leftIcon={FileText}
        />
        <MaskedInput
          name="rg"
          mask="__.___.__-_"
          replacement={{ _: /\d/ }}
          placeholder="00.000.00-0"
          label="RG:"
          leftIcon={IdCard}
        />
      </Row>

      <Row>
        <MaskedInput
          name="phone"
          mask="(__)_____-____"
          replacement={{ _: /\d/ }}
          placeholder="(11)99999-9999"
          label="Telefone:"
          leftIcon={Phone}
        />
        <MaskedInput
          name="cep"
          mask="_____-___"
          replacement={{ _: /\d/ }}
          placeholder="00000-000"
          label="CEP:"
          leftIcon={MapPin}
        />
        <MaskedInput
          name="credit-card"
          mask="____ ____ ____ ____"
          replacement={{ _: /\d/ }}
          placeholder="0000 0000 0000 0000"
          label="Cartão de Crédito:"
          leftIcon={CreditCard}
        />
      </Row>

      <Row>
        <MaskedInput
          name="date"
          mask="__/__/____"
          replacement={{ _: /\d/ }}
          placeholder="dd/mm/yyyy"
          label="Data:"
          leftIcon={Calendar}
        />
        <MaskedInput
          name="time"
          mask="__:__"
          replacement={{ _: /\d/ }}
          placeholder="00:00"
          label="Horário:"
          leftIcon={Clock}
        />
        <MaskedInput
          name="currency"
          mask="R$ ___.__,__"
          replacement={{ _: /\d/ }}
          placeholder="R$ 000.00,00"
          label="Moeda:"
          prefix="R$"
        />
      </Row>

      <Row>
        <MaskedInput
          name="prefix-suffix"
          mask="_____-___"
          replacement={{ _: /\d/ }}
          placeholder="00000-000"
          label="Prefix e Suffix:"
          prefix="CEP:"
          suffix="-BR"
        />
        <MaskedInput
          name="show-mask"
          mask="(__)_____-____"
          replacement={{ _: /\d/ }}
          placeholder="(11)99999-9999"
          label="Show mask:"
          showMask
          leftIcon={Phone}
        />
      </Row>

      <Row>
        <MaskedInput
          name="loading"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Loading:"
          isLoading
        />
        <MaskedInput
          name="loading-right"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Loading (right icon):"
          rightIcon={Hash}
          isLoading
        />
      </Row>

      <Row>
        <MaskedInput
          name="disabled"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Disabled:"
          disabled
        />
        <MaskedInput
          name="readonly"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Read only:"
          readOnly
          defaultValue="123.456.789-00"
        />
      </Row>

      <Row>
        <MaskedInput
          name="required"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Required field:"
          showAsterisk
          required
        />
        <MaskedInput
          name="error"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="With error:"
          leftIcon={XCircle}
          errorMessage="CPF inválido"
        />
      </Row>

      <Row>
        <MaskedInput
          name="separate"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="Separate:"
          separate
          leftIcon={User}
        />
        <MaskedInput
          name="custom-pattern"
          mask="___-###-___"
          replacement={{ _: /\d/, "#": /[A-Z]/ }}
          placeholder="000-ABC-000"
          label="Custom pattern:"
          leftIcon={Hash}
        />
      </Row>

      <Row>
        <MaskedInput
          name="advanced-cpf"
          mask="___.___.___-__"
          replacement={{ _: /\d/ }}
          placeholder="000.000.000-00"
          label="CPF completo:"
          leftIcon={User}
          variant="outline"
          size="lg"
          showMask
        />
        <MaskedInput
          name="advanced-phone"
          mask="(__)_____-____"
          replacement={{ _: /\d/ }}
          placeholder="(11)99999-9999"
          label="Telefone completo:"
          leftIcon={Phone}
          variant="underline"
        />
      </Row>
    </Box>
  );
}

export { MaskedInputExamples };
