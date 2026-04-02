---
description: manage git operations like branching, committing, and pushing using natural language prompts
---
# /git-ops

## Load Role
/ai-pos/roles/software-engineer.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Ensure all git operations (branching, commits) follow the project's repository structure.
- Maintain a clean commit history as per technical standards.

## Goal
Enable non-coding users to manage repository version control (Git) using natural language prompts. The AI agent will handle the underlying git commands based on the user's intent.

## Instructions
1. **Analyze Intent**: Determine if the user wants to check status, create a branch, commit changes, or push to a remote.
2. **Status/Check**: If the user asks "What's changed?" or "Show status", run `git status` and explain the results.
3. **Branching**: If the user wants to start a new feature, create a descriptively named branch.
4. **Committing**: if the user wants to "save" or "commit", stage the relevant changes and write a clear, descriptive commit message based on the work done.
5. **Syncing**: If the user wants to "upload" or "push", ensure the local branch is ready and push to the remote.
6. **Confirmation**: Always report back to the user what git actions were taken.

## Output Format
A brief summary of git actions performed:

# Git Operations Summary
- **Action**: [e.g., Created branch 'feat/new-ui']
- **Status**: [Success/Error]
- **Details**: [e.g., Committed 3 files with message 'Add new landing page components']
