# Changelog

All notable changes to this project will be documented in this file.

This project adheres to **[Semantic
Versioning](https://semver.org/spec/v2.0.0.html)**.

## 1.3.0 - 2020-12-04

### Changed

- Data: Merge documentation for v1.0.6.

## 1.2.1 - 2020-11-28

### Fixed

- Data: Fix `avm.exportAVAX` specs.
- Data: Remove unwanted \`\`\`go line from some method signatures.
- UI: Submit request on `[ENTER]` (Firefox).
- UI: Fix navigation menu alignment (Firefox).
- UI: Scroll to response on request submission (Chrome).

## 1.2.0 - 2020-11-25

### Added

- UI: Add avax.\* methods for the 'Contract' API.

### Changed

- Data: Merge latest documentation. (Notably adds `info.getNodeIP`)
- UI: Improve method parameters sharing. Those parameters are synced across all
  methods (e.g: `username`, `node`, ...), or in some cases across methods of the
  same API (e.g: `changeAddr`, `subnetID`, ...).

### Fixed

- UI: Fix default 'chain' parameter.

## 1.1.0 - 2020-11-21

### Added

- UI: Snippets live editing.
- UI: Add support for custom node URL.
- UI: Add support for subnet's exchange chains.

### Changed

- Data: Update to documentation v1.0.5.

### Fixed

- UI: Work around AdBlock hiding Share button.

## 1.0.0 - 2020-11-17

Initial release.
