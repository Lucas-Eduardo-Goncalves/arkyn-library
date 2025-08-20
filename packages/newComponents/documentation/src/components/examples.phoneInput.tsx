import { PhoneInput } from "@components";
import { useState } from "react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

function PhoneInputExamples() {
  const [contactPhone, setContactPhone] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  return (
    <Box title="PhoneInput">
      <Row>
        <PhoneInput name="basic" />
        <PhoneInput name="with-label" label="Phone Number" />
      </Row>

      <Row>
        <PhoneInput
          name="size-md"
          label="Medium Size (default)"
          size="md"
          variant="solid"
        />
        <PhoneInput
          name="size-lg"
          label="Large Size"
          size="lg"
          variant="outline"
        />
      </Row>

      <Row>
        <PhoneInput name="us-phone" label="US Phone" defaultCountry="US" />
        <PhoneInput name="br-phone" label="Brasil Phone" defaultCountry="BR" />
        <PhoneInput name="uk-phone" label="UK Phone" defaultCountry="GB" />
      </Row>

      <Row>
        <PhoneInput
          name="us-default"
          label="US Number with Default"
          defaultCountry="US"
          defaultValue="+1 (555) 123-4567"
        />
        <PhoneInput
          name="br-default"
          label="BR Number with Default"
          defaultCountry="BR"
          defaultValue="+55 11 99999-9999"
        />
      </Row>

      <Row>
        <PhoneInput
          name="required-phone"
          label="Contact Phone"
          showAsterisk
          defaultCountry="US"
        />
        <PhoneInput
          name="error-phone"
          label="Phone with Error"
          errorMessage="Please enter a valid phone number"
          defaultCountry="CA"
        />
      </Row>

      <Row>
        <PhoneInput
          name="controlled-contact"
          label="Contact Phone"
          onChange={(value) => {
            setContactPhone(value);
            console.log("Contact phone:", value);
          }}
          defaultCountry="US"
          showAsterisk
        />
        <PhoneInput
          name="controlled-business"
          label="Business Phone"
          onChange={(value) => {
            setBusinessPhone(value);
            console.log("Business phone:", value);
          }}
          defaultCountry="BR"
          size="lg"
        />
      </Row>

      <Row>
        <PhoneInput
          name="custom-text-en"
          label="Phone (English)"
          searchCountryPlaceholder="Search country..."
          notFoundCountryText="Country not found"
          defaultCountry="GB"
        />
        <PhoneInput
          name="custom-text-pt"
          label="Telefone (Português)"
          searchCountryPlaceholder="Pesquisar país..."
          notFoundCountryText="Nenhum país encontrado"
          defaultCountry="BR"
        />
      </Row>

      <Row>
        <PhoneInput
          name="disabled-phone"
          label="Disabled Phone"
          defaultValue="+1 (555) 987-6543"
          defaultCountry="US"
          disabled
        />
        <PhoneInput
          name="readonly-phone"
          label="Read Only Phone"
          defaultValue="+55 21 98765-4321"
          defaultCountry="BR"
          readOnly
        />
      </Row>

      <Row>
        <PhoneInput
          name="loading-phone"
          label="Loading Phone"
          isLoading
          defaultCountry="CA"
        />
        <PhoneInput
          name="loading-large"
          label="Loading Large"
          isLoading
          size="lg"
          variant="outline"
          defaultCountry="AU"
        />
      </Row>

      <Row>
        <PhoneInput
          name="france-phone"
          label="France Phone"
          defaultCountry="FR"
          variant="outline"
        />
        <PhoneInput
          name="japan-phone"
          label="Japan Phone"
          defaultCountry="JP"
          variant="outline"
        />
        <PhoneInput
          name="germany-phone"
          label="Germany Phone"
          defaultCountry="DE"
          variant="outline"
        />
      </Row>

      <Row>
        <div
          style={{
            padding: "20px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          <h4 style={{ margin: "0 0 16px 0" }}>Contact Information</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <PhoneInput
              name="primary-phone"
              label="Primary Phone"
              showAsterisk
              defaultCountry="US"
              onChange={(value) => console.log("Primary:", value)}
            />
            <PhoneInput
              name="secondary-phone"
              label="Secondary Phone (Optional)"
              defaultCountry="US"
              onChange={(value) => console.log("Secondary:", value)}
            />
            <PhoneInput
              name="emergency-contact"
              label="Emergency Contact"
              showAsterisk
              defaultCountry="US"
              onChange={(value) => {
                setEmergencyPhone(value);
                console.log("Emergency:", value);
              }}
              size="lg"
            />
          </div>
        </div>
      </Row>

      <Row>
        <PhoneInput
          name="customer-service"
          label="Customer Service"
          defaultValue="+1 (800) 123-4567"
          defaultCountry="US"
          readOnly
          variant="outline"
        />
        <PhoneInput
          name="sales-team"
          label="Sales Team"
          defaultCountry="US"
          searchCountryPlaceholder="Find country..."
          className="sales-phone"
        />
      </Row>

      <Row>
        <PhoneInput
          name="mobile-number"
          label="Mobile Number"
          defaultCountry="BR"
          showAsterisk
          onChange={(value) => console.log("Mobile:", value)}
        />
        <PhoneInput
          name="whatsapp-number"
          label="WhatsApp Number"
          defaultCountry="BR"
          variant="outline"
          onChange={(value) => console.log("WhatsApp:", value)}
        />
      </Row>

      <Row>
        <PhoneInput
          name="asia-phone"
          label="Asia Pacific"
          defaultCountry="SG"
        />
        <PhoneInput
          name="europe-phone"
          label="European Union"
          defaultCountry="IT"
        />
        <PhoneInput
          name="americas-phone"
          label="Americas"
          defaultCountry="MX"
        />
      </Row>
    </Box>
  );
}

export { PhoneInputExamples };
