# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of AutoOpen Steam seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until we've had a chance to address it

### Please Do

1. **Report via GitHub Security Advisories**
   - Go to the [Security tab](https://github.com/SensitiveWebUser/AutoOpen-Steam/security/advisories)
   - Click "Report a vulnerability"
   - Provide detailed information about the vulnerability

2. **Include in your report:**
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We will send you regular updates about our progress (at least every 5 business days)
- **Disclosure**: Once a fix is available, we will:
  - Release a patched version
  - Publish a security advisory
  - Credit you for the discovery (unless you prefer to remain anonymous)

### Scope

The following are **in scope** for security reports:

- Cross-site scripting (XSS) vulnerabilities
- Content Security Policy bypasses
- Privilege escalation
- Data leakage or exposure
- Authentication/authorization issues
- Code injection

The following are **out of scope**:

- Vulnerabilities in dependencies (please report to the dependency maintainers)
- Social engineering attacks
- Denial of Service attacks requiring excessive resources
- Issues that require physical access to a user's device
- Issues in outdated browsers or unsupported versions

## Security Best Practices

When using AutoOpen Steam:

1. **Download from Official Sources**
   - Only download from our [GitHub Releases](https://github.com/SensitiveWebUser/AutoOpen-Steam/releases)
   - Or from the Chrome Web Store / Edge Add-ons Store [if available](TBD)
   - Verify the integrity of downloaded files

2. **Keep Updated**
   - Always use the latest version
   - Enable automatic updates if available in your browser

3. **Review Permissions**
   - The extension only requests minimal permissions (storage)
   - If asked for additional permissions, verify it's from an official update

4. **Report Suspicious Behavior**
   - If the extension behaves unexpectedly, report it immediately

## Privacy

AutoOpen Steam:
- Does not collect any personal data
- Does not track user behavior
- Does not send any data to external servers
- Only stores user preferences locally using `chrome.storage.sync`

All code is open source and can be audited in our [GitHub repository](https://github.com/SensitiveWebUser/AutoOpen-Steam).

## Contact

For any security concerns not suitable for public disclosure, you can contact the maintainers through GitHub Security Advisories.

## Recognition

We appreciate the security research community and will publicly acknowledge researchers who responsibly disclose vulnerabilities to us (unless they prefer to remain anonymous).
