
export interface GoogleOAuthConfig {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scope: string;
  state?: string;
}

// libs/google-oauth.ts
export const getGoogleOAuthUrl = (redirectTo?: string): string => {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  
  // Use the same redirect URI as configured in Google Cloud Console
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.pashupatinathrudraksh.com'}/api/auth/google/callback`;
  
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent'
  });

  if (redirectTo) {
    params.append('state', btoa(JSON.stringify({ redirect_to: redirectTo })));
  }

  return `${baseUrl}?${params.toString()}`;
};

export const decodeState = (state: string): any => {
  try {
    return JSON.parse(atob(state));
  } catch (err: any) {
  console.error('Error occurred:', err);
  return {}; 

  }
};