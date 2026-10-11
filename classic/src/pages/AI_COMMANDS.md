# AI Code Assist Protocols

This document catalogs custom system commands established during development to instruct the AI on handling specific maintenance tasks, ensuring stability, and avoiding regressions.

## `CheckOverlaps`
**Description:** Triggers a rigorous syntax and duplication scan.
**Action:** 
When the developer types `"CheckOverlaps"`, the AI will pause feature development and fully scan the current file context for unclosed brackets, duplicate loops, misaligned diff artifacts, and malformed state declarations. It will then generate a surgically precise diff to remove the corruption and restore compiler functionality.
**Why it exists:** Introduced to prevent cascading syntax failures caused by complex overlapping edits across the massive 3000+ line physics loop and UI handlers.