import { Textarea } from "@components";
import { useState } from "react";

import { Box } from "../ui/box";

function TextareaExamples() {
  const [message, setMessage] = useState("");
  const [bio, setBio] = useState("");
  const [feedback, setFeedback] = useState("");
  const [notes, setNotes] = useState("Some initial notes...");

  const termsContent = `Terms and Conditions

1. Acceptance of Terms
By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

2. Use License
Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.

3. Disclaimer
The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied.`;

  return (
    <Box title="Textarea">
      <Textarea
        name="basic1"
        placeholder="Enter your description..."
        rows={3}
      />

      <Textarea
        name="basic2"
        label="Comments"
        placeholder="Share your thoughts..."
        rows={3}
      />

      <Textarea
        name="size_md"
        label="Medium Size (default)"
        size="md"
        variant="solid"
        placeholder="Medium textarea with solid variant"
        rows={3}
      />

      <Textarea
        name="size_lg"
        label="Large Size"
        size="lg"
        variant="outline"
        placeholder="Large textarea with outline variant"
        rows={3}
      />

      <Textarea
        name="bio_required"
        label="Biography"
        showAsterisk
        placeholder="Tell us about yourself (required)"
        rows={4}
      />

      <Textarea
        name="feedback_error"
        label="Feedback"
        errorMessage="Please provide your feedback"
        placeholder="Your feedback is important to us"
        rows={4}
      />

      <Textarea
        name="controlled_message"
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        rows={4}
        showAsterisk
      />

      <Textarea
        name="controlled_bio"
        label="Professional Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Describe your professional background..."
        maxLength={500}
        rows={4}
      />

      <Textarea
        name="limited_feedback"
        label="Product Review"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Share your experience (max 300 characters)"
        maxLength={300}
        rows={5}
        className="review-textarea"
      />

      <div style={{ position: "relative" }}>
        <Textarea
          name="notes_with_counter"
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter your notes..."
          rows={5}
          style={{ resize: "vertical" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "12px",
            fontSize: "12px",
            color: "#666",
            background: "white",
            padding: "2px 4px",
          }}
        >
          {notes.length} characters
        </div>
      </div>

      <Textarea
        name="terms_readonly"
        label="Terms and Conditions"
        value={termsContent}
        readOnly
        rows={8}
        variant="outline"
        style={{ fontSize: "14px" }}
      />

      <Textarea
        name="disabled_field"
        label="Disabled Field"
        value="This field cannot be edited"
        disabled
        placeholder="This field is disabled"
        rows={3}
      />

      <Textarea
        name="code_snippet"
        label="Code Snippet"
        placeholder="Paste your code here..."
        rows={6}
        style={{
          fontFamily: "monospace",
          fontSize: "14px",
          resize: "both",
        }}
        variant="outline"
      />

      <Textarea
        name="essay"
        label="Essay Response"
        placeholder="Write your essay response here..."
        rows={6}
        showAsterisk
        onChange={(e) => console.log("Essay length:", e.target.value.length)}
      />

      <Textarea
        name="article_content"
        label="Article Content"
        placeholder="Write your article content here..."
        rows={8}
        cols={60}
        style={{ width: "100%", resize: "vertical" }}
        onChange={(e) =>
          console.log(
            "Article updated:",
            e.target.value.split("\n").length,
            "lines"
          )
        }
      />
    </Box>
  );
}

export { TextareaExamples };
