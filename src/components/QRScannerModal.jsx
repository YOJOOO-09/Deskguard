import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, QrCode } from 'lucide-react';
import jsQR from 'jsqr';
import Modal from './Modal';

export default function QRScannerModal({ onClose, onResult }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera access is not supported in this browser.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        tick();
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access was denied. Allow camera permissions to scan a desk QR code.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera was found on this device.');
        } else {
          setError('Could not access the camera.');
        }
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          setScanning(false);
          onResult?.(code.data);
          return;
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [onResult]);

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold uppercase text-ink">Scan Desk QR Code</h2>
      <p className="mt-1 text-sm text-body">Point your camera at the QR code on the desk.</p>

      <div className="mt-4 aspect-square overflow-hidden rounded-none border border-hairline bg-surface-soft">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertTriangle size={28} className="text-yellow-400" />
            <p className="text-sm text-body">{error}</p>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {scanning && (
              <div className="pointer-events-none absolute inset-8 border-2 border-primary/70" />
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <QrCode size={14} />
        Each desk has a unique QR code near its power outlet.
      </div>
    </Modal>
  );
}
