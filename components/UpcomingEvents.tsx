'use client';

import React, { useState, useEffect } from 'react';
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon } from './Icons';

interface RecyclingEvent {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  organizer: string;
  description: string;
  image: string;
  interestedCount?: number;
  goingCount?: number;
  userStatus?: 'interested' | 'going' | null;
}

interface UpcomingEventsProps {
  onEventClick?: (event: RecyclingEvent) => void;
}

export default function UpcomingEvents({ onEventClick }: UpcomingEventsProps) {
  const [events, setEvents] = useState<RecyclingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events/upcoming');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: number, status: 'interested' | 'going') => {
    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, status }),
      });

      if (response.ok) {
        // Update local state
        setEvents(events.map(event => {
          if (event.id === eventId) {
            const wasInterested = event.userStatus === 'interested';
            const wasGoing = event.userStatus === 'going';
            
            return {
              ...event,
              userStatus: event.userStatus === status ? null : status,
              interestedCount: status === 'interested'
                ? (event.userStatus === 'interested' ? (event.interestedCount || 0) - 1 : (event.interestedCount || 0) + 1)
                : wasInterested ? (event.interestedCount || 0) - 1 : event.interestedCount,
              goingCount: status === 'going'
                ? (event.userStatus === 'going' ? (event.goingCount || 0) - 1 : (event.goingCount || 0) + 1)
                : wasGoing ? (event.goingCount || 0) - 1 : event.goingCount,
            };
          }
          return event;
        }));
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📅 Sự kiện sắp diễn ra
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white dark:bg-brand-gray-dark rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📅 Sự kiện sắp diễn ra
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Chưa có sự kiện nào sắp diễn ra
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-brand-gray-dark rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        📅 Sự kiện sắp diễn ra
        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
          ({events.length})
        </span>
      </h2>

      <div className="space-y-3">
        {events.slice(0, 3).map(event => (
          <div
            key={event.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onEventClick?.(event)}
          >
            {/* Event Image */}
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-32 rounded-lg object-cover mb-2"
              loading="lazy"
            />

            {/* Event Info */}
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2 line-clamp-2">
                {event.name}
              </h3>
              
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate line-clamp-1">{event.address}</span>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegister(event.id, 'going');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                    event.userStatus === 'going'
                      ? 'bg-brand-green text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {event.userStatus === 'going' ? '✓ Tham gia' : 'Tham gia'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegister(event.id, 'interested');
                  }}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
                    event.userStatus === 'interested'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {event.userStatus === 'interested' ? '★' : '☆'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length > 3 && (
        <button 
          className="w-full mt-3 py-2 text-sm font-medium text-brand-green hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Xem thêm
        </button>
      )}
    </div>
  );
}
