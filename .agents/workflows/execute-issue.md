---
description: implement a specific development issue by analyzing the codebase and making required changes
---
# /execute-issue

## Load Role
/ai-pos/roles/software-engineer.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Adhere to the technical stack and environment constraints in the project context.
- Ensure the implementation aligns with the "What Good Looks Like" definition.

## Goal
Implement a development issue from the **Linear backlog** by analyzing the relevant codebase, writing the required code, and validating the changes through testing.

## Instructions
1. **Load Issue**: Fetch the issue details from Linear using `python3 scripts/linear_tool.py get --id [ISSUE-ID]`.
2. Review the specific Issue description and acceptance criteria.
3. Analyze the repository to identify affected files and modules.
4. Implement the requested changes according to established patterns.
5. Generate automated tests (unit/integration) to validate the fix/feature.
6. Verify that the implementation does not introduce regressions.

## Output Format
Create a Markdown document or commit summary:

# Implementation Report: [Issue Name/ID]

## Changes Made
- Summary of modified files and logic.

## Validation Results
- Test output showing success.
- Manual verification steps performed.

## Dependencies Updated
- Any new packages or configuration changes.

## Save Artifact
docs/engineering/implementation-{name-kebab-case}.md
