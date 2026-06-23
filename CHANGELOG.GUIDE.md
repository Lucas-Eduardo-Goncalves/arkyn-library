# Changelog Generation Guide

This guide describes the steps to generate a new changelog entry for the Arkyn ecosystem, following the conventions established in `CHANGELOG.md`.

---

## Step 1 — Identify the previous version tag

Find the commit that corresponds to the last released version so you know where to start collecting changes.

```bash
git log --oneline | grep "<previous-version>"
# Example: git log --oneline | grep "3.0.1-beta.147"
```

Copy the commit hash returned.

---

## Step 2 — List all commits since that version

Use the hash from Step 1 to list every commit between that point and `HEAD`.

```bash
git log --oneline <hash>..HEAD
```

Exclude the version-bump commit (`chore(release): bump version to ...`) — it carries no user-facing information.

---

## Step 3 — Inspect each commit in detail

For every relevant commit, retrieve its full diff and file change summary:

```bash
git show <hash> --stat   # files changed, insertions, deletions
git show <hash>          # full diff
```

Focus on:

- What props, types, or exports were added, renamed, or removed.
- What behavioral changes were made (defaults, callbacks, rendering).
- What is purely internal (refactors, style tweaks with no API impact).
- What breaks existing consumer code.

---

## Step 4 — Classify each change

Group findings into three buckets:

| Bucket | Criteria |
|---|---|
| **Changes By Package** | Any additive, behavioral, or cosmetic change visible to consumers. |
| **Breaking Changes** | Renamed/removed props, changed defaults, removed exports. Requires a migration example. |
| **Notes** | Cross-cutting observations, scope clarifications, version bump confirmation. |

---

## Step 5 — Write the entry

Follow this exact structure:

```markdown
## v<new-version>

Date: YYYY-MM-DD

Status: One-sentence summary of the release theme.

### Changes By Package

- `@arkyn/<package>`
  - **Bold title for the change** — explanation of what changed and why it matters to the consumer.

### Breaking Changes

- **`ComponentName.propName` renamed/removed/changed** — what the consumer must do.

  ```tsx
  // Before (v<previous-version>)
  <Component oldProp={...} />

  // After (v<new-version>)
  <Component newProp={...} />
  ```

### Notes

- Consistency or scope observations.
- Confirmation that no other APIs were affected.
- Version bumped across all packages (`@arkyn/components`, `@arkyn/server`, `@arkyn/shared`, `@arkyn/templates`).
```

**Rules:**

- The `Status` line is a single sentence — the release theme, not a list.
- Each bullet under **Changes By Package** starts with a **bold noun phrase** describing the change, followed by ` — ` and a plain-English explanation.
- **Breaking Changes** always include a before/after code block, even for trivial renames.
- Omit the `### Breaking Changes` section entirely if there are none.
- List only packages that actually changed under **Changes By Package**.
- The last Notes bullet always confirms the version bump across all packages.

---

## Step 6 — Prepend to CHANGELOG.md

New entries go at the **top** of the file, above the previous version. Never append.

---

## Quick reference — commands for a full run

```bash
# 1. Find the previous version hash
git log --oneline | grep "<previous-version>"

# 2. List commits since that hash
git log --oneline <hash>..HEAD

# 3. Inspect each commit
git show <commit-hash> --stat
git show <commit-hash>

# 4. Write the entry and prepend to CHANGELOG.md
```
