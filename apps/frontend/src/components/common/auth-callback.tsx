import { useEffect } from 'react';

const AuthCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log('code', code);

    if (code && window.opener) {
      window.opener.postMessage({ type: 'oauth-code', code }, window.location.origin);
      window.close();
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h3>Connecting your account...</h3>
    </div>
  );
};

export default AuthCallback;
