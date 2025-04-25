/**
 * Utility function to handle BigInt serialization
 * This is needed because JSON.stringify cannot handle BigInt values directly
 */
export function serializeUser(user: any) {
  if (!user) return null;
  
  // Create a new object to avoid mutating the original
  const serialized = { ...user };
  
  // Convert BigInt to string for any field that might be BigInt
  if (serialized.googleTokenExpiry) {
    serialized.googleTokenExpiry = serialized.googleTokenExpiry.toString();
  }
  
  return serialized;
} 