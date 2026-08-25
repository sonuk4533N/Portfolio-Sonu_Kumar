# Portfolio Remediation Report

Updated: August 25, 2026

## Status

All functional issues from the original audit have been addressed and the isolated API integration suite passes 22 of 22 checks.

## Resolved Website Issues

- Replaced hard-coded API hosts with same-origin `/api` URLs for local and hosted environments.
- Removed broken profile and project image references; initials and styled project placeholders now render without failed requests.
- Added support for real project preview images when an image URL is configured.
- Replaced the placeholder resume with a complete, rendered, and visually verified PDF.
- Added a working privacy page and connected the footer link.
- Added current-year footer rendering, social metadata, and a branded social-preview image.
- Added safe fallback content when an API collection is empty or unavailable.
- Hidden project filters that do not have matching projects.
- Added `noopener noreferrer` protection to external links.
- Removed the unused `utils.js` script and its page reference.

## Resolved Admin Issues

- Replaced persistent plaintext password storage with server-issued, HttpOnly, SameSite session cookies.
- Removed the insecure default admin password fallback.
- Added login throttling, session expiry, session verification, and logout invalidation.
- Added full edit support for projects, skills, and experience/education entries.
- Added project category and project image fields.
- Added mark-as-read and mark-as-unread controls for contact messages.
- Normalized skill category names to prevent duplicate groups.
- Migrated education and training entries to the correct `Education` type.
- Added clear loading, validation, expired-session, and server-error feedback.

## Resolved Backend and Data Issues

- Added project and experience update endpoints.
- Added skill update and contact-message read-state endpoints.
- Added bounded input validation for text, email, phone, URLs, categories, and tags.
- Added safe parsing for invalid legacy project-tag values.
- Restricted CORS to configured origins and added baseline security headers.
- Made frontend static-file serving independent of the server's working directory.
- Added repeatable SQLite migrations, targeted indexes, profile defaults, and representative portfolio projects.
- Updated environment documentation to match the keys used by the email service.
- Replaced the old state-mutating black-box suite with an isolated temporary-database test suite.

## Verification

- Homepage, admin page, privacy page, resume, scripts, styles, and social-preview image return HTTP 200.
- Anonymous protected requests return HTTP 401.
- Valid login creates a session and logout invalidates it.
- Create, read, update, and delete flows for projects, skills, and experiences pass.
- Contact validation, message persistence, message read state, content-type handling, and CORS rejection pass.
- Resume text extraction and one-page visual rendering were verified with no clipping or overlap.
