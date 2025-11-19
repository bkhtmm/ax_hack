import { verifyLeanInMessage, formatLeanVerification } from "./lean-compiler";

/**
 * Middleware to intercept and verify Lean code in K2-Think responses
 * This can be integrated into the existing chat flow
 */
export async function processLeanInResponse(text: string): Promise<{
  originalText: string;
  verificationMessage?: string;
  hasLeanCode: boolean;
  needsCorrection: boolean;
}> {
  // Check if Lean verification is enabled
  const isEnabled = process.env.ENABLE_LEAN_VERIFICATION === 'true';
  const compilerUrl = process.env.LEAN_COMPILER_URL;

  if (!isEnabled || !compilerUrl || compilerUrl.includes('localhost') || compilerUrl.includes('127.0.0.1') || compilerUrl.includes('ngrok')) {
    console.log('[LEAN] ⚠️  Lean verification disabled or compiler not configured - skipping');
    return {
      originalText: text,
      hasLeanCode: false,
      needsCorrection: false
    };
  }

  // Verify any Lean code in the response
  const verification = await verifyLeanInMessage(text);

  if (!verification.hasLeanCode) {
    return {
      originalText: text,
      hasLeanCode: false,
      needsCorrection: false
    };
  }

  // Format verification results
  const verificationMessage = formatLeanVerification(verification.leanVerifications);

  // Check if all verifications passed
  const allPassed = verification.leanVerifications.every(v => v.result.success);

  return {
    originalText: text,
    verificationMessage,
    hasLeanCode: true,
    needsCorrection: !allPassed
  };
}

/**
 * Creates a feedback message for K2-Think to correct errors
 */
export function createCorrectionPrompt(verificationMessage: string): string {
  return `The Lean compiler found some issues with the code. Here are the verification results:

${verificationMessage}

Please review the errors and provide corrected Lean code that will compile successfully. Make sure to:
1. Fix any syntax errors
2. Ensure all theorems and lemmas are properly proved
3. Check that all definitions are valid
4. Verify that the code follows Lean 4 syntax

Provide the corrected code in a \`\`\`lean code block.`;
}