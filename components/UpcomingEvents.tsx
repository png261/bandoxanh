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
    <div className="flex-shrink-0 w-80 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 animate-pulse">
      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="py-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          📅 Sự kiện sắp tới
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x">
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!events.length) {
    return null; // Hide if empty to keep layout clean
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          📅 Sự kiện sắp tới
          <span className="text-sm font-bold bg-brand-green text-white px-3 py-1 rounded-full">
            {events.length}
          </span>
        </h2>
      </div>

      <div className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {events.slice(0, 6).map(event => (
          <div
            key={event.id}
            className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer snap-start group"
            onClick={() => onEventClick?.(event)}
          >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  sizes="320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/fallback.png';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-5xl">
                  🌱
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold shadow-sm text-gray-900">
                {event.date}
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-brand-green transition-colors">
                {event.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-brand-green shrink-0" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-brand-green shrink-0" />
                  <span className="truncate">{event.address}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegister(event.id, 'going');
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${event.userStatus === 'going'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 hover:text-green-600'
                      }`}
                  >
                    {event.userStatus === 'going' ? 'Đã tham gia' : 'Tham gia'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShareModalData({ url: `${window.location.origin}/events/${event.id}`, title: event.name, text: event.description, type: 'event' }) }}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button>
                </div>
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
