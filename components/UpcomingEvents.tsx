'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, ShareIcon } from './Icons';
import ShareModal from './ShareModal';

interface RecyclingEvent {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  description: string;
  image: string;
  userStatus?: 'interested' | 'going' | null;
}

interface UpcomingEventsProps {
  onEventClick?: (event: RecyclingEvent) => void;
}

export default function UpcomingEvents({ onEventClick }: UpcomingEventsProps) {
  const [events, setEvents] = useState<RecyclingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalData, setShareModalData] = useState<{
    url: string;
    title: string;
    text: string;
    type: 'event';
  } | null>(null);

  useEffect(() => {
    fetch('/api/events/upcoming')
      .then(res => res.json())
      .then(setEvents)
      .catch(err => console.error('Error fetching events:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (eventId: number, status: 'interested' | 'going') => {
    try {
      await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, status }),
      });

      setEvents(events.map(event =>
        event.id === eventId
          ? { ...event, userStatus: event.userStatus === status ? null : status }
          : event
      ));
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const SkeletonCard = () => (
    <div className="flex-shrink-0 w-64 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 animate-pulse">
      <div className="w-full h-32 bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="flex justify-between mt-3">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📅 Sự kiện sắp diễn ra</h2>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📅 Sự kiện sắp diễn ra</h2>
        <p className="text-gray-500 dark:text-gray-400">Hiện chưa có sự kiện nào</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        📅 Sự kiện sắp diễn ra
        <span className="text-xs text-gray-500 dark:text-gray-400">({events.length})</span>
      </h2>

      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {events.slice(0, 6).map(event => (
          <div
            key={event.id}
            className="flex-shrink-0 w-64 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:shadow transition-all cursor-pointer"
            onClick={() => onEventClick?.(event)}
          >
            {event.image ? (
              <div className="relative w-full h-32">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  sizes="100%"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/fallback.png';
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl text-white">
                🌱
              </div>
            )}

            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
                {event.name}
              </h3>

              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{event.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 text-gray-500 dark:text-gray-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegister(event.id, 'going');
                  }}
                  className={`p-1.5 rounded-md transition-all ${
                    event.userStatus === 'going'
                      ? 'bg-green-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Tham gia"
                >
                  ✓
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegister(event.id, 'interested');
                  }}
                  className={`p-1.5 rounded-md transition-all ${
                    event.userStatus === 'interested'
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Quan tâm"
                >
                  ★
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalData({
                      url: `${window.location.origin}/map?lat=${event.latitude}&lng=${event.longitude}`,
                      title: event.name,
                      text: `${event.description}\n📅 ${event.date} • ${event.time}\n📍 ${event.address}`,
                      type: 'event',
                    });
                  }}
                  className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Chia sẻ"
                >
                  <ShareIcon className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shareModalData && (
        <ShareModal {...shareModalData} onClose={() => setShareModalData(null)} />
      )}
    </div>
  );
}
