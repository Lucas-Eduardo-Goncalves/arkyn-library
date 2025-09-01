import { Input } from "@components";
import {
  Calendar,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  Hash,
  Lock,
  Mail,
  MapPin,
  Percent,
  Phone,
  Search,
  User,
  XCircle,
} from "lucide-react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

function InputExamples() {
  return (
    <Box title="Input">
      <Row>
        <Input
          name="variant-solid"
          placeholder="Variant solid (default)"
          label="Solid variant:"
        />
        <Input
          name="variant-outline"
          placeholder="Variant outline"
          label="Outline variant:"
          variant="outline"
        />
        <Input
          name="variant-underline"
          placeholder="Variant underline"
          label="Underline variant:"
          variant="underline"
        />
      </Row>

      <Row>
        <Input
          name="size-md"
          placeholder="Size md (default)"
          label="Medium size:"
        />
        <Input
          name="size-lg"
          placeholder="Size lg"
          label="Large size:"
          size="lg"
        />
      </Row>

      <Row>
        <Input
          name="left-icon"
          placeholder="With left icon"
          label="Left icon:"
          leftIcon={Search}
        />
        <Input
          name="right-icon"
          placeholder="With right icon"
          label="Right icon:"
          rightIcon={Eye}
        />
        <Input
          name="both-icons"
          placeholder="With both icons"
          label="Both icons:"
          leftIcon={User}
          rightIcon={Lock}
        />
      </Row>

      <Row>
        <Input
          name="prefix"
          placeholder="example"
          label="With prefix:"
          prefix="https://"
        />
        <Input
          name="suffix"
          placeholder="website"
          label="With suffix:"
          suffix=".com"
        />
        <Input
          name="prefix-suffix"
          placeholder="amount"
          label="Prefix and suffix:"
          prefix={DollarSign}
          suffix=".00"
        />
      </Row>

      <Row>
        <Input
          name="loading-left"
          placeholder="Loading..."
          label="Loading (left):"
          isLoading
        />
        <Input
          name="loading-right"
          placeholder="Loading..."
          label="Loading (right):"
          rightIcon={Search}
          isLoading
        />
      </Row>

      <Row>
        <Input
          name="email"
          type="email"
          placeholder="your@email.com"
          label="Email:"
          leftIcon={Mail}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          label="Password:"
          leftIcon={Lock}
          rightIcon={EyeOff}
        />
        <Input
          name="tel"
          type="tel"
          placeholder="(11) 99999-9999"
          label="Phone:"
          leftIcon={Phone}
        />
      </Row>

      <Row>
        <Input
          name="disabled"
          placeholder="Disabled input"
          label="Disabled:"
          disabled
        />
        <Input
          name="readonly"
          placeholder="Read only input"
          label="Read only:"
          readOnly
          value="Cannot edit"
        />
      </Row>

      <Row>
        <Input
          name="required"
          placeholder="Required field"
          label="Required field:"
          showAsterisk
          required
        />
        <Input
          name="error"
          leftIcon={XCircle}
          placeholder="Field with error"
          label="With error:"
          errorMessage="This field is required"
        />
      </Row>

      <Row>
        <Input
          name="search"
          type="search"
          placeholder="Search..."
          label="Search:"
          leftIcon={Search}
        />
        <Input
          name="url"
          type="url"
          placeholder="https://example.com"
          label="Website:"
          leftIcon={Globe}
        />
        <Input
          name="number"
          type="number"
          placeholder="123"
          label="Number:"
          leftIcon={Hash}
        />
      </Row>

      <Row>
        <Input name="date" type="date" label="Date:" leftIcon={Calendar} />
        <Input name="time" type="time" label="Time:" leftIcon={Clock} />
        <Input
          name="datetime-local"
          type="datetime-local"
          label="Date and Time:"
          leftIcon={Calendar}
        />
      </Row>

      <Row>
        <Input
          name="price"
          type="number"
          placeholder="0.00"
          label="Price:"
          prefix="$"
          rightIcon={DollarSign}
          variant="outline"
          size="lg"
        />

        <Input
          name="percentage"
          type="number"
          placeholder="0"
          label="Percentage:"
          suffix="%"
          rightIcon={Percent}
          variant="underline"
        />
      </Row>

      <Row>
        <Input
          name="address"
          placeholder="Street address"
          label="Address:"
          leftIcon={MapPin}
          variant="outline"
        />
        <Input
          name="postalCode"
          placeholder="12345-678"
          label="ZIP Code:"
          leftIcon={MapPin}
          maxLength={9}
        />
      </Row>
    </Box>
  );
}

export { InputExamples };
