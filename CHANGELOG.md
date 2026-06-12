# Changelog

All notable changes to this project will be documented in this file.

Format: [Date] - [Version] - [Type]

---

## [1.0.1] - 2026-06-11

### Changed
- Moved AI model configuration to environment variables, supporting customized model overrides.
- Configured default model code to `gemini-3.1-flash-lite` for faster, cost-effective multimodal text generations.

---

## [1.0.0] - 2026-06-11

### Added
- Completed Express backend: MongoDB/Mongoose connection, private low-rating feedback logging, and Gemini 1.5 Flash AI reviews generator with robust offline templates generator fallback.
- Completed Vite + React + TypeScript frontend: Custom lightweight popstate router, dynamic SVG QR code generation with download/print functionality, star-rating customer gate, translation selection, and micro-interactive slide-in notification toast.
- Fully verified end-to-end user flow using automated browser subagent (recording attached).

---

## [0.1.0] - 2026-06-11

### Added
- Project initialization
- AI context file (`AI_CONTEXT.md`) and Changelog setup
- Backend and Frontend design specs in Implementation Plan
