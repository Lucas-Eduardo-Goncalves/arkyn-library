import { RadioBox, RadioGroup } from "@components";
import { useState } from "react";

import { Box } from "../ui/box";

function RadioExamples() {
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [selectedTheme, setSelectedTheme] = useState("light");

  return (
    <Box title="Radio">
      <RadioGroup name="gender1" label="Gender">
        <RadioBox value="male">Male</RadioBox>
        <RadioBox value="female">Female</RadioBox>
        <RadioBox value="other">Other</RadioBox>
      </RadioGroup>

      <RadioGroup name="newsletter" label="Newsletter Subscription">
        <RadioBox value="yes">Yes, send me updates</RadioBox>
        <RadioBox value="no">No, thank you</RadioBox>
      </RadioGroup>

      <RadioGroup name="size_sm" label="Small Size" size="sm">
        <RadioBox value="option1">Option 1</RadioBox>
        <RadioBox value="option2">Option 2</RadioBox>
      </RadioGroup>

      <RadioGroup name="size_md" label="Medium Size (default)" size="md">
        <RadioBox value="option1">Option 1</RadioBox>
        <RadioBox value="option2">Option 2</RadioBox>
      </RadioGroup>

      <RadioGroup name="size_lg" label="Large Size" size="lg">
        <RadioBox value="option1">Option 1</RadioBox>
        <RadioBox value="option2">Option 2</RadioBox>
      </RadioGroup>

      <RadioGroup
        name="controlled_gender"
        label="Controlled Gender Selection"
        value={selectedGender}
        onChange={(value) => setSelectedGender(value)}
      >
        <RadioBox value="male">Male</RadioBox>
        <RadioBox value="female">Female</RadioBox>
        <RadioBox value="other">Other</RadioBox>
      </RadioGroup>

      <RadioGroup
        name="controlled_plan"
        label="Subscription Plan"
        value={selectedPlan}
        onChange={(value) => setSelectedPlan(value)}
        showAsterisk
      >
        <RadioBox value="basic">Basic ($9.99/month)</RadioBox>
        <RadioBox value="premium">Premium ($19.99/month)</RadioBox>
        <RadioBox value="enterprise">Enterprise ($49.99/month)</RadioBox>
      </RadioGroup>

      <RadioGroup name="language" label="Preferred Language" defaultValue="en">
        <RadioBox value="en">English</RadioBox>
        <RadioBox value="es">Spanish</RadioBox>
        <RadioBox value="fr">French</RadioBox>
        <RadioBox value="pt">Portuguese</RadioBox>
      </RadioGroup>

      <RadioGroup
        name="priority_error"
        label="Priority Level"
        errorMessage="Please select a priority level"
        showAsterisk
      >
        <RadioBox value="low">Low Priority</RadioBox>
        <RadioBox value="medium">Medium Priority</RadioBox>
        <RadioBox value="high">High Priority</RadioBox>
      </RadioGroup>

      <RadioGroup
        name="theme_selection"
        label="Theme Selection"
        value={selectedTheme}
        onChange={(value) => setSelectedTheme(value)}
      >
        <RadioBox value="light">
          <div>
            <strong>🌞 Light Theme</strong>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
              Clean and bright interface
            </p>
          </div>
        </RadioBox>
        <RadioBox value="dark">
          <div>
            <strong>🌙 Dark Theme</strong>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
              Easy on the eyes
            </p>
          </div>
        </RadioBox>
        <RadioBox value="auto">
          <div>
            <strong>🔄 Auto Theme</strong>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
              Follows system preference
            </p>
          </div>
        </RadioBox>
      </RadioGroup>

      <RadioGroup name="availability" label="Availability Status">
        <RadioBox value="available">Available</RadioBox>
        <RadioBox value="busy">Busy</RadioBox>
        <RadioBox value="offline" disabled>
          Offline (Maintenance)
        </RadioBox>
      </RadioGroup>

      <RadioGroup name="notification_type" label="Notification Preferences">
        <RadioBox value="all" size="lg">
          All Notifications
        </RadioBox>
        <RadioBox value="important">Important Only</RadioBox>
        <RadioBox value="none" size="sm">
          None
        </RadioBox>
      </RadioGroup>

      <RadioGroup
        name="difficulty"
        label="Game Difficulty"
        onChange={(value) => console.log("Selected difficulty:", value)}
      >
        <RadioBox value="easy">
          <span style={{ color: "#22c55e" }}>🟢 Easy</span>
        </RadioBox>
        <RadioBox value="medium">
          <span style={{ color: "#f59e0b" }}>🟡 Medium</span>
        </RadioBox>
        <RadioBox value="hard">
          <span style={{ color: "#ef4444" }}>🔴 Hard</span>
        </RadioBox>
      </RadioGroup>
    </Box>
  );
}

export { RadioExamples };
