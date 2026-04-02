---
description: evaluate and rank features or development issues based on impact, effort, and strategic alignment
---
# /prioritize-backlog

## Load Role
/ai-pos/roles/product-manager.md

## Load Context
/ai-pos/context/project-context.md

## Context Usage Rules
- Use the business goals and product principles defined in the context to weight importance.
- Consider constraints (budget/time) when evaluating feasibility.

## Goal
Rank a list of product features or technical issues from **Linear** to ensure the team is always working on the highest-value items first, and synchronize these priorities back to Linear.

## Instructions
1. **Fetch Backlog**: Retrieve active issues from Linear using `python3 scripts/linear_tool.py list --team [TeamID]`.
2. Review the current backlog or candidate features.
3. Assess each item for user impact (Problem Severity) and technical effort (Complexity).
4. Evaluate alignment with the current product direction and calculate a priority score.
5. **Update Linear**: For each prioritized item, update its priority in Linear using `python3 scripts/linear_tool.py update --id [ID] --priority [1-4]`.
   - Use 1 for Urgent, 2 for High, 3 for Medium, 4 for Low.
6. **Identify Next Top 3**: Clearly identify the top 3 most critical next tasks for immediate focus.
7. Provide a clear rationale for the ranking.

## Output Format
Create a Markdown document with the following sections:

# Backlog Prioritization: [Release/Sprint Name]

## 🚀 Next Top 3 Tasks (Immediate Focus)
1. **[Item Name]** ([ID]): [Brief reason why it's #1]
2. **[Item Name]** ([ID]): [Brief reason why it's #2]
3. **[Item Name]** ([ID]): [Brief reason why it's #3]

## Prioritized List (Full Backlog)
- [Rank 1]: [Item Name] ([Impact]/[Effort]) - *Priority Updated in Linear*
- [Rank 2]: [Item Name] ([Impact]/[Effort]) - *Priority Updated in Linear*

## Rationale
- Explanation of why top items were selected over others.

## Trade-offs
- What was postponed and why.

## Save Artifact
docs/planning/prioritization-{name-kebab-case}.md
