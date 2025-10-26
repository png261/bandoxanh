import React, { useEffect, useRef, useState } from 'react';
import { XIcon } from './Icons';

interface QrScannerProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number | null = null;

    const startScan = async () => {
      // @ts-ignore
      if (!('BarcodeDetector' in window) || !window.BarcodeDetector) {
        setError('Trình duyệt của bạn không hỗ trợ quét mã QR.');
        return;
      }

      try {
        // @ts-ignore
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          const scan = async () => {
            try {
              if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  onScanSuccess(barcodes[0].rawValue);
                } else {
                  animationFrameId = requestAnimationFrame(scan);
                }
              } else {
                animationFrameId = requestAnimationFrame(scan);
              }
            } catch (e) {
              console.error('Lỗi trong khi quét:', e);
              animationFrameId = requestAnimationFrame(scan);
            }
          };
          scan();
        }
      } catch (err) {
        console.error('Lỗi truy cập camera:', err);
        setError('Không thể truy cập camera. Vui lòng cấp quyền và thử lại.');
      }
    };

    startScan();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
        <video ref={videoRef} className="w-full h-auto" playsInline />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="w-full h-full border-4 border-dashed border-green-400 rounded-lg opacity-75"></div>
        </div>
         <button
            className="absolute top-4 right-4 text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors z-10"
            onClick={onClose}
            aria-label="Đóng máy quét"
        >
            <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="mt-4 text-center text-white">
        <p className="font-semibold">Hướng camera về phía mã QR để quét</p>
        {error && <p className="mt-2 text-red-400 bg-red-900/50 p-2 rounded">{error}</p>}
      </div>
    </div>
  );
};

export default QrScanner;
