
import { INITIAL_PINCODES } from "../prisma/seed.ts";

export interface PincodeCheckResult {
  pincode: string;
  isServiceable: boolean;
  isCodAvailable: boolean;
  estimatedDays: number;
  city?: string;
  state?: string;
  message: string;
}

export async function checkPincode(
  pincode: string,
): Promise<PincodeCheckResult> {
  const cleanPin = pincode.trim();

  // Validate format (6 digits, starting 1-9)
  if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
    return {
      pincode: cleanPin,
      isServiceable: false,
      isCodAvailable: false,
      estimatedDays: 0,
      message: "Please enter a valid 6-digit Indian PIN code.",
    };
  }

  // Lookup in pre-seeded logistics registry
  const match = INITIAL_PINCODES.find((p) => p.pincode === cleanPin);

  if (match) {
    return {
      pincode: cleanPin,
      isServiceable: true,
      isCodAvailable: match.isCodAvailable,
      estimatedDays: match.estimatedDays,
      city: match.city,
      state: match.state,
      message: `⚡ Express Delivery in ${match.estimatedDays} business days to ${match.city}. Cash on Delivery (COD) available!`,
    };
  }

  // State heuristics for general Indian pincodes based on the first digit
  const firstDigit = cleanPin[0];
  let estimatedDays = 3;
  let regionHint = "India Metro / Tier-1";

  switch (firstDigit) {
    case "7":
      // West Bengal, Odisha, Northeast (Siliguri Fulfillment Hub)
      estimatedDays = 2;
      regionHint = "Eastern India (Siliguri Fast Track)";
      break;
    case "1":
    case "2":
      // North India (Delhi, Haryana, UP, Punjab)
      estimatedDays = 4;
      regionHint = "Northern India";
      break;
    case "4":
      // Maharashtra, Goa
      estimatedDays = 4;
      regionHint = "Western India";
      break;
    case "5":
    case "6":
      // South India (Karnataka, AP, TN, Kerala)
      estimatedDays = 5;
      regionHint = "Southern India";
      break;
    case "3":
      // Gujarat, Rajasthan
      estimatedDays = 4;
      regionHint = "Western India";
      break;
    case "8":
      // Bihar, Jharkhand
      estimatedDays = 3;
      regionHint = "Eastern India";
      break;
    default:
      estimatedDays = 5;
      regionHint = "Pan-India";
  }

  return {
    pincode: cleanPin,
    isServiceable: true,
    isCodAvailable: true,
    estimatedDays,
    city: regionHint,
    state: "India",
    message: `⚡ Dispatches within 24h from Siliguri hub. Delivery in ${estimatedDays}–${estimatedDays + 1} days. COD Available!`,
  };
}
