import dns from "node:dns";

function isValidBasicFormat(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email);
}

function isValidLocalPart(localPart: string): boolean {
  if (localPart.length === 0 || localPart.length > 64) return false;
  if (localPart.startsWith(".") || localPart.endsWith(".")) return false;
  if (localPart.includes("..")) return false;

  const validLocalRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  if (!validLocalRegex.test(localPart)) return false;

  return true;
}

function isValidDomainLabel(label: string): boolean {
  if (label.length === 0 || label.length > 63) return false;
  if (label.startsWith("-") || label.endsWith("-")) return false;
  if (!/^[a-zA-Z0-9-]+$/.test(label)) return false;
  return true;
}

function isValidDomainPart(domainPart: string): boolean {
  if (domainPart.length === 0 || domainPart.length > 253) return false;

  if (
    domainPart.startsWith(".") ||
    domainPart.endsWith(".") ||
    domainPart.startsWith("-") ||
    domainPart.endsWith("-")
  ) {
    return false;
  }

  const labels = domainPart.split(".");
  if (labels.length < 2) return false;

  for (const label of labels) if (!isValidDomainLabel(label)) return false;

  const tld = labels[labels.length - 1];
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;

  return true;
}

function isValidAdvancedSyntax(email: string): boolean {
  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [localPart, domainPart] = parts;

  if (!isValidLocalPart(localPart)) return false;
  if (!isValidDomainPart(domainPart)) return false;
  return true;
}

function extractDomain(email: string): string | null {
  const parts = email.split("@");
  return parts.length === 2 ? parts[1].toLowerCase() : null;
}

const DNS_RECORD_TYPES = ["MX", "A", "AAAA"] as const;

async function tryResolveDnsRecord(
  domain: string,
  recordType: string,
): Promise<boolean> {
  try {
    await dns?.promises?.resolve(domain, recordType);
    return true;
  } catch {
    return false;
  }
}

async function isValidDns(domain: string): Promise<boolean> {
  for (const recordType of DNS_RECORD_TYPES) {
    const hasRecord = await tryResolveDnsRecord(domain, recordType);
    if (hasRecord) return true;
  }
  return false;
}

/**
 * Validates if an email address is valid in all possible ways, including DNS validation.
 *
 * This function performs comprehensive email validation by:
 * - Checking basic email format and syntax
 * - Validating advanced RFC 5322 compliance rules
 * - Verifying that the domain has valid MX or A records in DNS
 *
 * @param rawEmail - The email address to validate.
 * @returns `true` if the email passes format checks and its domain resolves in DNS, otherwise `false`.
 *
 * @example
 * ```typescript
 * await validateEmail("user@gmail.com"); // true
 * await validateEmail("user@gmil.com"); // false (invalid domain)
 * await validateEmail("invalid-email"); // false (invalid format)
 * ```
 */

async function validateEmail(rawEmail: string): Promise<boolean> {
  if (!rawEmail || typeof rawEmail !== "string") return false;
  const email = rawEmail.trim();

  if (!isValidBasicFormat(email)) return false;
  if (!isValidAdvancedSyntax(email)) return false;

  const domain = extractDomain(email);
  if (!domain) return false;

  return await isValidDns(domain);
}

export { validateEmail };
