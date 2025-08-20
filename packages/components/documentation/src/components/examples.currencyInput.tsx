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
          placeholder="0.00"
          label="Solid variant:"
        />
        <CurrencyInput
          name="variant-outline"
          locale="EUR"
          placeholder="0,00"
          label="Outline variant:"
          variant="outline"
        />
        <CurrencyInput
          name="variant-underline"
          locale="BRL"
          placeholder="0,00"
          label="Underline variant:"
          variant="underline"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="size-md"
          locale="USD"
          placeholder="0.00"
          label="Medium size:"
        />
        <CurrencyInput
          name="size-lg"
          locale="USD"
          placeholder="0.00"
          label="Large size:"
          size="lg"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="left-icon"
          locale="USD"
          placeholder="0.00"
          label="Left icon:"
          leftIcon={DollarSign}
        />
        <CurrencyInput
          name="right-icon"
          locale="EUR"
          placeholder="0,00"
          label="Right icon:"
          rightIcon={Calculator}
        />
        <CurrencyInput
          name="both-icons"
          locale="BRL"
          placeholder="0,00"
          label="Both icons:"
          leftIcon={Wallet}
          rightIcon={TrendingUp}
        />
      </Row>

      <Row>
        <CurrencyInput
          name="prefix"
          locale="USD"
          placeholder="0.00"
          label="With prefix:"
          prefix="$"
        />
        <CurrencyInput
          name="suffix"
          locale="EUR"
          placeholder="0,00"
          label="With suffix:"
          suffix="EUR"
        />
        <CurrencyInput
          name="prefix-suffix"
          locale="BRL"
          placeholder="0,00"
          label="Prefix and suffix:"
          prefix="R$"
          suffix="BRL"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="loading-left"
          locale="USD"
          placeholder="Loading..."
          label="Loading (left):"
          isLoading
        />
        <CurrencyInput
          name="loading-right"
          locale="EUR"
          placeholder="Loading..."
          label="Loading (right):"
          rightIcon={Calculator}
          isLoading
        />
      </Row>

      <Row>
        <CurrencyInput
          name="salary"
          locale="USD"
          placeholder="0.00"
          label="Salary:"
          leftIcon={DollarSign}
          prefix="$"
        />
        <CurrencyInput
          name="price"
          locale="EUR"
          placeholder="0,00"
          label="Product Price:"
          leftIcon={Receipt}
          variant="outline"
        />
        <CurrencyInput
          name="investment"
          locale="BRL"
          placeholder="0,00"
          label="Investment:"
          leftIcon={PiggyBank}
          variant="underline"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="disabled"
          locale="USD"
          placeholder="0.00"
          label="Disabled:"
          disabled
          defaultValue={1500}
        />
        <CurrencyInput
          name="readonly"
          locale="EUR"
          placeholder="0,00"
          label="Read only:"
          readOnly
          value={2500}
        />
      </Row>

      <Row>
        <CurrencyInput
          name="required"
          locale="USD"
          placeholder="0.00"
          label="Required field:"
          showAsterisk
          required
        />
        <CurrencyInput
          name="error"
          locale="BRL"
          placeholder="0,00"
          label="With error:"
          errorMessage="Amount must be greater than 0"
          leftIcon={DollarSign}
        />
      </Row>

      <Row>
        <CurrencyInput
          name="max-value"
          locale="USD"
          placeholder="0.00"
          label="Max $10,000:"
          max={10000}
          leftIcon={CreditCard}
          variant="outline"
        />
        <CurrencyInput
          name="budget"
          locale="EUR"
          placeholder="0,00"
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
          placeholder="¥0"
          label="Japanese Yen:"
          leftIcon={DollarSign}
        />
        <CurrencyInput
          name="different-locales-2"
          locale="GBP"
          placeholder="£0.00"
          label="British Pound:"
          leftIcon={DollarSign}
          prefix="£"
        />
        <CurrencyInput
          name="different-locales-3"
          locale="CAD"
          placeholder="$0.00"
          label="Canadian Dollar:"
          leftIcon={DollarSign}
          suffix="CAD"
        />
      </Row>

      <Row>
        <CurrencyInput
          name="business-revenue"
          locale="USD"
          placeholder="0.00"
          label="Annual Revenue:"
          leftIcon={TrendingUp}
          rightIcon={DollarSign}
          prefix="$"
          variant="outline"
        />
        <CurrencyInput
          name="savings-goal"
          locale="BRL"
          placeholder="0,00"
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
