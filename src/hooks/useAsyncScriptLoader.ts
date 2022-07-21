import { useEffect } from 'react';

function useAsyncScriptLoaded(url: string, callback: () => void) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  }, [url]);
}

export default useAsyncScriptLoaded;
