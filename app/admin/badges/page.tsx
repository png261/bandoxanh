'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  qrCode: string | null;
  isActive: boolean;
}

export default function BadgesAdminPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Badge | null>(null);
  const [saving, setSaving] = useState(false);
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    icon: '🏆',
    color: 'gold',
    category: 'special',
    qrCode: '',
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  async function fetchBadges() {
    try {
      const res = await fetch('/api/badges');
      const data = await res.json();
      setBadges(data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setSaving(true);
    try {
      const res = await fetch('/api/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBadge),
      });

      if (res.ok) {
        const created = await res.json();
        setBadges([created, ...badges]);
        setCreating(false);
        setNewBadge({
          name: '',
          description: '',
          icon: '🏆',
          color: 'gold',
          category: 'special',
          qrCode: '',
        });
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create badge');
      }
    } catch (error) {
      console.error('Error creating badge:', error);
      alert('Error creating badge');
    } finally {
      setSaving(false);
    }
  }

  const generateRandomQR = () => {
    return 'BADGE-' + Math.random().toString(36).substring(2, 15).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Huy hiệu
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Tạo và quản lý huy hiệu cho người dùng
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            + Tạo huy hiệu
          </button>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            ← Quay lại
          </Link>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="text-5xl mb-3 text-center">{badge.icon}</div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 text-center">
              {badge.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
              {badge.description}
            </p>
            <div className="flex gap-2 justify-center mb-3">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                {badge.category}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                {badge.color}
              </span>
            </div>
            {badge.qrCode && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-mono bg-gray-50 dark:bg-gray-900 py-1 px-2 rounded">
                {badge.qrCode}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Tạo huy hiệu mới
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên huy hiệu
                  </label>
                  <input
                    type="text"
                    value={newBadge.name}
                    onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ví dụ: Chiến binh xanh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={newBadge.description}
                    onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Mô tả huy hiệu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      value={newBadge.icon}
                      onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-3xl text-center"
                      placeholder="🏆"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Màu sắc
                    </label>
                    <select
                      value={newBadge.color}
                      onChange={(e) => setNewBadge({ ...newBadge, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gold">Vàng</option>
                      <option value="blue">Xanh dương</option>
                      <option value="green">Xanh lá</option>
                      <option value="purple">Tím</option>
                      <option value="red">Đỏ</option>
                      <option value="pink">Hồng</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={newBadge.category}
                    onChange={(e) => setNewBadge({ ...newBadge, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="recycling">Tái chế</option>
                    <option value="event">Sự kiện</option>
                    <option value="community">Cộng đồng</option>
                    <option value="special">Đặc biệt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mã QR (để quét nhận huy hiệu)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBadge.qrCode}
                      onChange={(e) => setNewBadge({ ...newBadge, qrCode: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                      placeholder="BADGE-XXXXX"
                    />
                    <button
                      onClick={() => setNewBadge({ ...newBadge, qrCode: generateRandomQR() })}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                    >
                      Tạo ngẫu nhiên
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Để trống nếu không cần quét QR
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setCreating(false)}
                  disabled={saving}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? 'Đang tạo...' : 'Tạo huy hiệu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
