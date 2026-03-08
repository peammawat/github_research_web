// lib/security.ts

const FORBIDDEN_KEYWORDS = [
  // Pornography / 18+
  "porn", "pussy", "dick", "sex", "hentai", "xxx", "naked", "nude", "เย็ด", "ควย", "หี", "เงี่ยน",
  // Illegal / Harmful
  "bomb", "weapon", "terrorism", "terrorist", "crack", "hack", "bypass", "malware", "virus", "trojan",
  "ระเบิด", "ยาเสพติด", "อาวุธ", "ฆ่า", "ตาย", "พนัน", "casino", "gambling", "slot", "เว็บพนัน"
];

/**
 * Checks if a string contains any forbidden keywords.
 * Returns the keyword found, or null if clean.
 */
export function containsForbiddenKeywords(text: string): string | null {
  const lowerText = text.toLowerCase();
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return keyword;
    }
  }
  return null;
}
