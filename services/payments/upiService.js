/**
 * UPI Payment Service
 * Handles UPI ID validation and payment initiation.
 * In production this would integrate with a payment gateway SDK.
 */

const UPI_REGEX = /^[\w.-]+@[\w]+$/;

/**
 * Validate a UPI ID format.
 * @param {string} upiId
 * @returns {boolean}
 */
export function isValidUPI(upiId) {
  return UPI_REGEX.test(upiId?.trim());
}

/**
 * Verify a UPI ID by sending a small test ping.
 * In production, replace with actual NPCI/payment gateway verification.
 * @param {string} upiId
 * @returns {Promise<{ verified: boolean, name?: string, error?: string }>}
 */
export async function verifyUPI(upiId) {
  if (!isValidUPI(upiId)) {
    return { verified: false, error: "Invalid UPI ID format" };
  }

  // Simulated verification — replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        verified: true,
        name: "Verified Account",
      });
    }, 1500);
  });
}

/**
 * Initiate a UPI transfer for a redemption.
 * @param {{ upiId: string, amount: number, redemptionId: string }} params
 * @returns {Promise<{ success: boolean, transactionId?: string, error?: string }>}
 */
export async function initiateTransfer({ upiId, amount, redemptionId }) {
  if (!isValidUPI(upiId)) {
    return { success: false, error: "Invalid UPI ID" };
  }

  if (amount <= 0) {
    return { success: false, error: "Invalid amount" };
  }

  // In production: call your backend API which talks to the payment gateway
  // The backend verifies the redemption, checks balance, and initiates UPI transfer
  console.log(`[UPI] Transfer ₹${amount / 10} to ${upiId} for redemption ${redemptionId}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `TXN_${Date.now()}_${redemptionId}`,
      });
    }, 2000);
  });
}
