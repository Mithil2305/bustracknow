import { auth } from './firebaseConfig';

/**
 * Helper functions to handle permissions and error mapping 
 * related to the rigid Security Rules mentioned in the PDF.
 */
export const SecurityHelpers = {
  
  /**
   * Map raw Firebase permission errors to user-friendly messages.
   * Specifically handles the "Ban" cases.
   */
  getFriendlyErrorMessage: (error) => {
    if (!error) return "Unknown error occurred.";
    
    const code = error.code || error.message;

    if (code.includes('permission-denied')) {
      return "Access denied. You may be banned or lack admin privileges.";
    }
    if (code.includes('network-request-failed')) {
      return "Network error. Please check your connection.";
    }
    
    return error.message;
  },

  /**
   * Checks if current user is the owner of a broadcast session.
   * This mimics the security rule: data.child('contributor_id').val() === auth.uid
   */
  isSessionOwner: (sessionData) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !sessionData) return false;
    return sessionData.contributor_id === currentUser.uid;
  },

  /**
   * Client-side pre-check for Admin privileges.
   * (Real security is in Firestore Rules, this is just for UI toggling)
   */
  isAdmin: async (userRole) => {
    return userRole === 'admin' || userRole === 'superuser';
  }
};