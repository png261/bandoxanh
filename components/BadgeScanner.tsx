'use client';

import React, { useState } from 'react';
import QrScanner from '@/components/QrScanner';

interface BadgeScannerProps {
  onSuccess: (badge: any) => void;
}

export default function BadgeScanner({ onSuccess }: BadgeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (qrCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/badges/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess(data.badge);
        setIsScanning(false);
      } else {
        setError(data.error || 'Failed to scan QR code');
      }
    } catch (err) {
      console.error('Error scanning badge:', err);
      setError('An error occurred while scanning');
    } finally {
      setLoading(false);
    }
  };

  if (!isScanning) {
    return (
      <button
        onClick={() => setIsScanning(true)}
        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        Quét QR để nhận huy hiệu
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quét QR Code
        </h3>
        <button
          onClick={() => {
            setIsScanning(false);
            setError(null);
          }}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <QrScanner 
          onScanSuccess={handleScan}
          onClose={() => {
            setIsScanning(false);
            setError(null);
          }}
        />
      )}

      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
        Hướng camera vào mã QR để nhận huy hiệu
      </p>
    </div>
  );
}
