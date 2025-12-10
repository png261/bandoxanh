'use client';

import React, { useRef, useState } from 'react';
import { CameraIcon, UploadIcon, Image as ImageIcon } from 'lucide-react';

interface SmartCameraInputProps {
    onImageSelect: (file: File) => void;
    isLoading?: boolean;
    label?: string;
    subLabel?: string;
}

export default function SmartCameraInput({
    onImageSelect,
    isLoading = false,
    label = "Chạm để chụp hoặc tải ảnh",
    subLabel = "Hỗ trợ JPG, PNG"
}: SmartCameraInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={() => !isLoading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative group cursor-pointer
                    min-h-[320px] rounded-3xl
                    flex flex-col items-center justify-center text-center
                    border-4 border-dashed transition-all duration-300
                    ${isDragging
                        ? 'border-brand-green bg-brand-green/10 scale-[1.02]'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-brand-green/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <div className="p-8 space-y-6 transform transition-transform duration-300 group-hover:scale-105">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 shadow-xl flex items-center justify-center mx-auto text-brand-green dark:text-brand-green-light">
                            <CameraIcon size={48} strokeWidth={1.5} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center border-4 border-gray-50 dark:border-gray-800">
                            <UploadIcon size={18} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {label}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {subLabel}
                        </p>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
}
