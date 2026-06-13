import { useEffect, useRef, useState } from 'react';
import { WS_BASE } from '../lib/api';

/**
 * Connects to the DeskGuard backend over WebSocket and keeps desks/queue
 * state in sync in real time. Also surfaces "desk_ready" push notifications
 * (the "Next in Line" queue feature) via onDeskReady.
 */
export function useDeskSocket(studentId, onDeskReady) {
  const [desks, setDesks] = useState([]);
  const [queue, setQueue] = useState([]);
  const [connected, setConnected] = useState(false);
  const onDeskReadyRef = useRef(onDeskReady);
  onDeskReadyRef.current = onDeskReady;

  useEffect(() => {
    if (!studentId) return undefined;
    let socket;
    let reconnectTimer;
    let cancelled = false;

    const connect = () => {
      socket = new WebSocket(`${WS_BASE}/ws?studentId=${encodeURIComponent(studentId)}`);

      socket.onopen = () => setConnected(true);

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'init':
            setDesks(msg.desks);
            setQueue(msg.queue);
            break;
          case 'desks_update':
            setDesks(msg.desks);
            break;
          case 'queue_update':
            setQueue(msg.queue);
            break;
          case 'desk_ready':
            onDeskReadyRef.current?.(msg);
            break;
          default:
            break;
        }
      };

      socket.onclose = () => {
        setConnected(false);
        if (!cancelled) reconnectTimer = setTimeout(connect, 2000);
      };

      socket.onerror = () => socket.close();
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [studentId]);

  return { desks, queue, connected, setDesks };
}
