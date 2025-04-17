# Software Bill of Materials (SBOM)

This directory contains a Software Bill of Materials (SBOM) for the project in CycloneDX format.

## What is an SBOM?

An SBOM is a formal, machine-readable inventory of software components and dependencies, information about those components, and their hierarchical relationships. SBOMs are designed to be shared across organizations and are particularly valuable in managing security vulnerabilities.

## Files

- `sbom.json`: CycloneDX SBOM in JSON format

## How to Use

The SBOM can be used with various security tools to:

1. Identify vulnerabilities in dependencies
2. Track license compliance
3. Manage component inventory
4. Support security audits

## CycloneDX Format

This SBOM follows the [CycloneDX](https://cyclonedx.org/) specification (v1.4), which is a lightweight SBOM standard designed for use in application security contexts and supply chain component analysis.

## Generating Updated SBOMs

To generate an updated SBOM for this project, you can use tools like:

- [CycloneDX Node.js Module](https://github.com/CycloneDX/cyclonedx-node-module)
- [OWASP Dependency-Track](https://dependencytrack.org/)

Example command using CycloneDX:

```bash
pnpm install -g @cyclonedx/cdxgen

cdxgen -o sbom.json
``` 