export function createLawyerPanelLink(baseUrl: string): string {
    if (!process.client) return baseUrl;
    
    // Get the auth tokens from localStorage
    const authTokensJson = localStorage.getItem('auth_tokens');
    
    if (!authTokensJson) {
      // No tokens, just return the regular URL
      return baseUrl;
    }
    
    try {
      // Create a token parameter by encoding the tokens
      const tokenParam = encodeURIComponent(authTokensJson);
      
      // Return URL with the token parameter
      return `${baseUrl}?auth_transfer=${tokenParam}`;
    } catch (error) {
      console.error('Error creating lawyer panel link:', error);
      return baseUrl;
    }
  }