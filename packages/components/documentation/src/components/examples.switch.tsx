import { Switch } from "@components";
import { useState } from "react";

import { Box } from "../ui/box";
import { Row } from "../ui/row";

function SwitchExamples() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAutoSave, setIsAutoSave] = useState(false);
  const [isPremiumEnabled, setIsPremiumEnabled] = useState(true);

  return (
    <Box title="Switch">
      {/* Basic usage */}
      <Row>
        <Switch name="basic1" label="Enable notifications" />
        <Switch name="basic2" label="Marketing emails" defaultChecked />
        <Switch name="basic3" label="Auto-save documents" />
        <Switch name="basic4" label="Disabled switch" disabled />
      </Row>

      {/* Different sizes */}
      <Row>
        <Switch name="size1" label="Small (sm)" size="sm" />
        <Switch name="size2" label="Medium (md)" size="md" />
        <Switch name="size3" label="Large (lg) - default" size="lg" />
      </Row>

      {/* Controlled state examples */}
      <Row>
        <Switch
          name="controlled1"
          label="Controlled notifications"
          checked={isNotificationsEnabled}
          onCheck={(value) => setIsNotificationsEnabled(!!value)}
        />
        <Switch
          name="controlled2"
          label="Dark mode"
          checked={isDarkMode}
          value="dark"
          unCheckedValue="light"
          onCheck={(value) => setIsDarkMode(value === "dark")}
          size="md"
        />
      </Row>

      {/* Custom values */}
      <Row>
        <Switch
          name="theme"
          label="Theme preference"
          value="dark_theme"
          unCheckedValue="light_theme"
          onCheck={(value) => console.log("Theme:", value)}
        />
        <Switch
          name="subscription"
          label="Newsletter subscription"
          value="subscribed"
          unCheckedValue="unsubscribed"
          defaultChecked
          size="sm"
        />
      </Row>

      {/* Real-world examples */}
      <Row>
        <Switch
          name="autoSave"
          label="Auto-save every 5 minutes"
          checked={isAutoSave}
          onCheck={(value) => {
            setIsAutoSave(!!value);
            console.log("Auto-save:", value ? "enabled" : "disabled");
          }}
          value="enabled"
          unCheckedValue="disabled"
        />
        <Switch
          name="premium"
          label="Premium features"
          checked={isPremiumEnabled}
          onCheck={(value) => setIsPremiumEnabled(!!value)}
          className="premium-switch"
          size="lg"
        />
      </Row>

      {/* Advanced usage */}
      <Row>
        <Switch
          name="highContrast"
          label="High contrast mode"
          size="lg"
          value="high_contrast"
          unCheckedValue="normal"
          onCheck={(value) => console.log("Accessibility:", value)}
        />
        <Switch
          name="maintenance"
          label="Maintenance mode"
          value="maintenance_on"
          unCheckedValue="maintenance_off"
          disabled={!isPremiumEnabled}
          onCheck={(value) => console.log("Maintenance:", value)}
        />
      </Row>

      {/* Without labels for inline usage */}
      <Row>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Sound effects:</span>
          <Switch
            name="soundEffects"
            value="on"
            unCheckedValue="off"
            size="sm"
            onCheck={(value) => console.log("Sound:", value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Background music:</span>
          <Switch
            name="backgroundMusic"
            value="enabled"
            unCheckedValue="disabled"
            defaultChecked
            size="md"
            onCheck={(value) => console.log("Music:", value)}
          />
        </div>
      </Row>

      {/* State demonstration */}
      <Row>
        <div
          style={{
            padding: "16px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0" }}>Settings Panel</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <Switch
              name="privacy1"
              label="Public profile"
              size="sm"
              value="public"
              unCheckedValue="private"
              onCheck={(value) => console.log("Profile visibility:", value)}
            />
            <Switch
              name="privacy2"
              label="Show online status"
              size="sm"
              defaultChecked
              onCheck={(value) => console.log("Online status:", value)}
            />
            <Switch
              name="privacy3"
              label="Allow direct messages"
              size="sm"
              value="allowed"
              unCheckedValue="blocked"
              onCheck={(value) => console.log("Direct messages:", value)}
            />
          </div>
        </div>
      </Row>
    </Box>
  );
}

export { SwitchExamples };
