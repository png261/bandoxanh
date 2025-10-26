'use client';

import React, { useState, useRef, useEffect } from 'react';
import { identifyWaste } from '@/services/geminiService';
import { GptAnalysis, WasteType, Theme } from '@/types';
import { STATIONS } from '@/constants';
import { UploadIcon, CameraIcon, RecycleIcon, MapPinIcon } from '@/components/Icons';
import Header from '@/components/Header';

const wasteExamples = [
  { type: 'Nhựa', emoji: '♻️', items: 'Chai nước, túi nilon, hộp nhựa, ống hút, vỏ chai dầu gội/sữa tắm.' },
  { type: 'Giấy', emoji: '📄', items: 'Báo cũ, tạp chí, thùng carton, hộp giấy, giấy vụn, phong bì.' },
  { type: 'Kim loại', emoji: '🔩', items: 'Lon nước ngọt, lon bia, hộp sữa đặc, đồ dùng kim loại hỏng.' },
  { type: 'Thủy tinh', emoji: '🍾', items: 'Chai lọ thủy tinh (chai nước, hũ đựng thực phẩm), mảnh vỡ thủy tinh.' },
  { type: 'Hữu cơ', emoji: '🍎', items: 'Thức ăn thừa, vỏ trái cây, rau củ, bã cà phê, lá cây, cỏ.' },
  { type: 'Điện tử', emoji: '💻', items: 'Điện thoại hỏng, sạc dự phòng, tai nghe, chuột, bàn phím, đồ điện tử cũ.' },
  { type: 'Pin', emoji: '🔋', items: 'Pin tiểu (AA, AAA), pin điện thoại, pin sạc, các loại pin đã qua sử dụng.' },
  { type: 'Rác còn lại (Tổng hợp)', emoji: '🗑️', items: 'Vỏ bim bim, tã bỉm, băng vệ sinh, khẩu trang y tế, đồ gốm sứ vỡ.' }
];

function IdentifyPageContent() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<GptAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
    }
  };

  const handleIdentifyClick = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const resultString = await identifyWaste(image);
      const resultJson = JSON.parse(resultString);
      if (resultJson.error) {
        setError(resultJson.error);
      } else {
        setAnalysis(resultJson);
      }
    } catch (err) {
      setError('Không thể phân tích kết quả. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const findSuitableStation = (wasteType: string) => {
    const normalizedWasteType = wasteType.toLowerCase();
    const wasteTypeMap: { [key: string]: WasteType } = {
        'nhựa': WasteType.Plastic,
        'giấy': WasteType.Paper,
        'kim loại': WasteType.Metal,
        'thủy tinh': WasteType.Glass,
        'hữu cơ': WasteType.Organic,
        'điện tử': WasteType.Electronic,
        'pin': WasteType.Battery,
    };
    const matchedType = Object.keys(wasteTypeMap).find(key => normalizedWasteType.includes(key));
    if (matchedType) {
        return STATIONS.find(station => station.wasteTypes.includes(wasteTypeMap[matchedType]));
    }
    return STATIONS.find(station => station.wasteTypes.includes(WasteType.General));
  };
  
  const suitableStation = analysis ? findSuitableStation(analysis.wasteType) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-lg shadow-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <div className="w-full h-72 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                  <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 font-semibold text-sm">Xem trước hình ảnh</p>
                  <p className="text-xs">Tải ảnh lên hoặc chụp ảnh mới để bắt đầu</p>
                </div>
              )}
            </div>
            <button
              onClick={handleIdentifyClick}
              disabled={!image || isLoading}
              className="mt-3 w-full bg-brand-green text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-brand-green-dark hover:shadow-md transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang phân tích...
                </>
              ) : (
                <>
                  <RecycleIcon className="h-5 w-5" /> Phân loại ngay
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 bg-gray-100 dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 font-semibold py-5 px-3 rounded-lg hover:border-brand-green dark:hover:border-brand-green hover:shadow-sm transition-all h-full text-sm"
              >
                <UploadIcon className="h-7 w-7 text-brand-green" /> Tải ảnh
              </button>
               <button
                 onClick={() => fileInputRef.current?.click()}
                 className="flex flex-col items-center justify-center gap-2 bg-gray-100 dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 font-semibold py-5 px-3 rounded-lg hover:border-brand-green dark:hover:border-brand-green hover:shadow-sm transition-all h-full text-sm"
               >
                <CameraIcon className="h-7 w-7 text-brand-green" /> Chụp ảnh
               </button>
            </div>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="mt-3 flex-grow flex flex-col">
              {error && <p className="text-center text-red-600 bg-red-100 dark:bg-red-900/30 p-3 rounded-md border border-red-200 dark:border-red-800 text-sm">{error}</p>}
              
              {analysis ? (
                <div className="p-4 bg-brand-green-light/30 dark:bg-brand-green/10 border border-brand-green/30 rounded-lg flex-grow">
                  <h3 className="font-bold text-base text-brand-green-dark dark:text-brand-green-light">Kết quả phân tích:</h3>
                  <p className="mt-2 text-sm"><strong>Loại rác:</strong> <span className="font-semibold text-brand-green">{analysis.wasteType}</span></p>
                  <p className="mt-2 text-sm"><strong>Gợi ý xử lý:</strong> {analysis.recyclingSuggestion}</p>
                  {suitableStation && (
                    <div className="mt-3 pt-3 border-t border-brand-green/30">
                      <h4 className="font-bold text-sm text-brand-green-dark dark:text-brand-green-light">Trạm thu gom phù hợp:</h4>
                      <div className="mt-2 p-2.5 bg-white dark:bg-gray-700/50 rounded-md border dark:border-gray-600">
                        <p className="font-semibold text-sm">{suitableStation.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 flex items-start mt-1">
                          <MapPinIcon className="w-3.5 h-3.5 mr-1 mt-0.5 flex-shrink-0" />
                          {suitableStation.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : !isLoading && !error && (
                <div className="flex-grow flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-gray-500 text-sm">
                  <p>Kết quả phân tích sẽ hiển thị tại đây.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-brand-green-dark dark:text-brand-green-light mb-5 text-center">
            Hướng dẫn phân loại rác
        </h2>

        <div className="mb-6 border-b dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-brand-gray-dark dark:text-gray-200 mb-2.5">
                Cách sử dụng công cụ:
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-brand-gray-DEFAULT dark:text-gray-400">
                <li>Nhấn nút <strong>"Tải ảnh"</strong> hoặc <strong>"Chụp ảnh"</strong> để chọn hình ảnh rác thải bạn muốn phân loại.</li>
                <li>Hình ảnh sẽ được hiển thị ở khung xem trước.</li>
                <li>Nhấn nút <strong>"Phân loại ngay"</strong> để hệ thống AI của chúng tôi bắt đầu phân tích.</li>
                <li>Kết quả sẽ hiển thị ngay bên cạnh, bao gồm loại rác, gợi ý xử lý và trạm thu gom phù hợp (nếu có).</li>
            </ol>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-brand-gray-dark dark:text-gray-200 mb-3">
                Ví dụ về các loại rác phổ biến:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wasteExamples.map((category) => (
                  <div key={category.type} className="bg-gray-50 dark:bg-brand-gray-dark p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-sm text-brand-green-dark dark:text-brand-green-light">
                      {category.emoji} {category.type}
                    </h4>
                    <p className="text-xs text-brand-gray-DEFAULT dark:text-gray-400 mt-1">{category.items}</p>
                  </div>
                ))}
            </div>
        </div>
    </div>
    </div>
  );
}

export default function Identify() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="bg-brand-gray-light dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <main className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
          <IdentifyPageContent />
        </main>
      </div>
    </div>
  );
}
