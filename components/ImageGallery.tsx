'use client';

import React from 'react';

interface ImageGalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
}

export default function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  // Facebook-style layout logic
  const getGridLayout = () => {
    const count = images.length;

    if (count === 1) {
      return (
        <div className="relative w-full max-h-[500px] rounded-lg overflow-hidden">
          <img
            src={images[0]}
            alt="Post image 1"
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onImageClick(0)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden max-h-[400px]">
          {images.map((img, idx) => (
            <div key={idx} className="relative h-[400px] bg-gray-100 dark:bg-gray-800">
              <img
                src={img}
                alt={`Post image ${idx + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => onImageClick(idx)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden max-h-[400px]">
          <div className="relative row-span-2 h-[400px] bg-gray-100 dark:bg-gray-800">
            <img
              src={images[0]}
              alt="Post image 1"
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(0)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="relative h-[199px] bg-gray-100 dark:bg-gray-800">
            <img
              src={images[1]}
              alt="Post image 2"
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(1)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="relative h-[199px] bg-gray-100 dark:bg-gray-800">
            <img
              src={images[2]}
              alt="Post image 3"
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(2)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden max-h-[400px]">
          {images.map((img, idx) => (
            <div key={idx} className="relative h-[199px] bg-gray-100 dark:bg-gray-800">
              <img
                src={img}
                alt={`Post image ${idx + 1}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => onImageClick(idx)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    // 5 or more images
    return (
      <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden max-h-[400px]">
        <div className="relative row-span-2 h-[400px] bg-gray-100 dark:bg-gray-800">
          <img
            src={images[0]}
            alt="Post image 1"
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onImageClick(0)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <div className="relative h-[199px] bg-gray-100 dark:bg-gray-800">
          <img
            src={images[1]}
            alt="Post image 2"
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onImageClick(1)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <div className="relative h-[199px] bg-gray-100 dark:bg-gray-800">
          <img
            src={images[2]}
            alt="Post image 3"
            className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onImageClick(2)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {count > 3 && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-opacity"
              onClick={() => onImageClick(2)}
            >
              <span className="text-white text-4xl font-bold">+{count - 3}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return <div className="my-3">{getGridLayout()}</div>;
}
