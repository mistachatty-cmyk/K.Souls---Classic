---
name: code-reviewer
description: Review code for bugs, security issues, and best practices. Use when the user wants code reviewed before committing or deploying.
---

# Code Reviewer

Review the code using these steps:

1. **Understand the context**: Read the related files to understand what the code does.
2. **Check for bugs**: Look for logic errors, edge cases, null/undefined handling.
3. **Security check**: Look for exposed secrets, SQL injection, XSS vulnerabilities.
4. **Best practices**: Check naming conventions, error handling, performance.
5. **Provide feedback**: Summarize issues found with file:line references.

## Output Format

```markdown
## Review Summary

### Issues Found
- **Severity**: [High/Medium/Low]
- **Location**: file:line
- **Description**: What the issue is
- **Suggestion**: How to fix it
```

## Rules
- Be constructive and helpful
- Prioritize security and correctness
- Suggest improvements, don't just criticize