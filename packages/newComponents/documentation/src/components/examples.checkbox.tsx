import { Checkbox } from "@components";
import { useState } from "react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

function CheckboxExamples() {
  const [isChecked, setIsChecked] = useState(false);
  const [premiumEnabled, setPremiumEnabled] = useState(true);

  return (
    <Box title="Checkbox">
      <Row>
        <Checkbox name="basic1" label="Basic checkbox" />
        <Checkbox name="basic2" label="With custom value" value="accepted" />
        <Checkbox name="basic3" label="Default checked" defaultChecked />
        <Checkbox name="basic4" label="Disabled state" disabled />
      </Row>

      <Row>
        <Checkbox name="size1" label="Small (sm)" size="sm" />
        <Checkbox name="size2" label="Medium (md) - default" size="md" />
        <Checkbox name="size3" label="Large (lg)" size="lg" />
      </Row>

      <Row>
        <Checkbox
          name="controlled1"
          label="Controlled checkbox"
          checked={isChecked}
          onCheck={(value) => setIsChecked(!!value)}
        />
        <Checkbox
          name="controlled2"
          label="Premium features"
          checked={premiumEnabled}
          value="premium"
          onCheck={(value) => setPremiumEnabled(!!value)}
          size="lg"
        />
      </Row>

      <Row>
        <Checkbox
          name="error1"
          label="With error message"
          errorMessage={true}
        />
        <Checkbox
          name="error2"
          label="Required field"
          errorMessage={true}
          size="lg"
        />
      </Row>

      <Row>
        <Checkbox
          name="terms"
          label="I agree to the terms and conditions"
          value="terms_accepted"
          onCheck={(value) => console.log("Terms:", value)}
        />
        <Checkbox
          name="newsletter"
          label="Subscribe to newsletter"
          value="subscribed"
          defaultChecked
          size="sm"
        />
      </Row>

      <Row>
        <Checkbox
          name="notifications"
          label="Enable notifications"
          className="custom-checkbox"
          onCheck={(value) => {
            console.log("Notifications:", value);
          }}
        />
        <Checkbox
          name="remember"
          label="Remember me for 30 days"
          value="remember_user"
          size="sm"
          onCheck={(value) => console.log("Remember user:", value)}
        />
      </Row>
    </Box>
  );
}

export { CheckboxExamples };
