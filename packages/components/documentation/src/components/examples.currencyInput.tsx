import { CurrencyInput } from "@components";
import {
  Calculator,
  CreditCard,
  DollarSign,
  PiggyBank,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

function CurrencyInputExamples() {
  return (
    <Box title="CurrencyInput">
      <Row>
        <CurrencyInput
          name="variant-solid"
          locale="USD"
          label="Solid variant:"
        />
        <CurrencyInput
          name="variant-outline"
          locale="EUR"
          label="Outline variant:"
          variant="outline"
        />
        <CurrencyInput
          name="variant-underline"
          locale="BRL"
          label="Underline variant:"
          variant="underline"
        />
      </Row>

      <Row>
        <CurrencyInput name="size-md" locale="USD" label="Medium size:" />
        <CurrencyInput
          name="size-lg"
          locale="USD"
          label="Large size:"
          size="lg"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="left-icon"
          locale="USD"
          label="Left icon:"
          leftIcon={DollarSign}
        />
        <CurrencyInput
          name="right-icon"
          locale="EUR"
          label="Right icon:"
          rightIcon={Calculator}
        />
        <CurrencyInput
          name="both-icons"
          locale="BRL"
          label="Both icons:"
          leftIcon={Wallet}
          rightIcon={TrendingUp}
        />
      </Row>

      <Row>
        <CurrencyInput
          name="prefix"
          locale="USD"
          label="With prefix:"
          prefix="$"
        />
        <CurrencyInput
          name="suffix"
          locale="EUR"
          label="With suffix:"
          suffix="EUR"
        />
        <CurrencyInput
          name="prefix-suffix"
          locale="BRL"
          label="Prefix and suffix:"
          prefix="R$"
          suffix="BRL"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="loading-left"
          locale="USD"
          label="Loading (left):"
          isLoading
        />
        <CurrencyInput
          name="loading-right"
          locale="EUR"
          label="Loading (right):"
          rightIcon={Calculator}
          isLoading
        />
      </Row>

      <Row>
        <CurrencyInput
          name="salary"
          locale="USD"
          label="Salary:"
          leftIcon={DollarSign}
          prefix="$"
        />
        <CurrencyInput
          name="price"
          locale="EUR"
          label="Product Price:"
          leftIcon={Receipt}
          variant="outline"
        />
        <CurrencyInput
          name="investment"
          locale="BRL"
          label="Investment:"
          leftIcon={PiggyBank}
          variant="underline"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="disabled"
          locale="USD"
          label="Disabled:"
          disabled
          defaultValue={1500}
        />
        <CurrencyInput
          name="readonly"
          locale="EUR"
          label="Read only:"
          readOnly
          value={2500}
        />
      </Row>

      <Row>
        <CurrencyInput
          name="required"
          locale="USD"
          label="Required field:"
          showAsterisk
          required
        />
        <CurrencyInput
          name="error"
          locale="BRL"
          label="With error:"
          errorMessage="Amount must be greater than 0"
          leftIcon={DollarSign}
        />
      </Row>

      <Row>
        <CurrencyInput
          name="max-value"
          locale="USD"
          label="Max $10,000:"
          max={10000}
          leftIcon={CreditCard}
          variant="outline"
        />
        <CurrencyInput
          name="budget"
          locale="EUR"
          label="Monthly Budget:"
          leftIcon={Calculator}
          suffix="EUR"
          variant="underline"
          size="lg"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="different-locales-1"
          locale="JPY"
          label="Japanese Yen:"
          leftIcon={DollarSign}
        />
        <CurrencyInput
          name="different-locales-2"
          locale="GBP"
          label="British Pound:"
          leftIcon={DollarSign}
          prefix="£"
        />
        <CurrencyInput
          name="different-locales-3"
          locale="CAD"
          label="Canadian Dollar:"
          leftIcon={DollarSign}
          suffix="CAD"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="business-revenue"
          locale="USD"
          label="Annual Revenue:"
          leftIcon={TrendingUp}
          rightIcon={DollarSign}
          prefix="$"
          variant="outline"
        />
        <CurrencyInput
          name="savings-goal"
          locale="BRL"
          label="Savings Goal:"
          leftIcon={PiggyBank}
          variant="underline"
          max={100000}
        />
      </Row>
    </Box>
  );
}

export { CurrencyInputExamples };
