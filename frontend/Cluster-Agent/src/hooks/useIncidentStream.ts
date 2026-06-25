import { useState, useEffect } from 'react';

export function useIncidentStream() {
  const [incidentCount, setIncidentCount] = useState(0);
  const [toast, setToast] = useState<{message: string, visible: boolean} | null>(null);

  useEffect(() => {
    // 1. Fetch initial open incident count
    fetch('http://localhost:4000/incidents/open/count')
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') {
          setIncidentCount(data.count);
        }
      })
      .catch(err => console.error("Failed to fetch initial incident count:", err));

    // 2. Establish SSE Connection
    const sse = new EventSource('http://localhost:4000/incidents/stream');
    
    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'connected') {
        console.log("SSE Connected to incidents stream");
      } else if (data.resource_name) {
        // We received a new incident!
        setIncidentCount(prev => prev + 1);
        setToast({ message: `New Incident Detected: ${data.resource_name}`, visible: true });
        
        // Hide toast after 5 seconds
        setTimeout(() => {
          setToast(t => t ? { ...t, visible: false } : null);
        }, 5000);
      }
    };
    
    return () => {
      sse.close();
    };
  }, []);

  return { incidentCount, toast };
}
