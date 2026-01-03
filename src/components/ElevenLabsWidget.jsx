import React, { useEffect } from 'react';

const ElevenLabsWidget = () => {
  useEffect(() => {
    const existing = document.querySelector('script[data-elevenlabs-convai="1"]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    script.dataset.elevenlabsConvai = '1';
    document.body.appendChild(script);
  }, []);

  return (
    <elevenlabs-convai 
      agent-id="agent_5401kdq0smsce1h82vgekqwgbmep"
      
      // action-text="Need help?"
      // start-call-text="Start Chat"
      // end-call-text="End Call"
      // expand-text="Expand"
      // listening-text="Listening..."
      // speaking-text="Speaking..."
    ></elevenlabs-convai>
  );
};

export default ElevenLabsWidget;
