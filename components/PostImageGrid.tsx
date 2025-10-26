import React from 'react';

interface PostImageGridProps {
  images: string[];
  onImageClick: (index: number) => void;
}

const PostImageGrid: React.FC<PostImageGridProps> = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return null;
  }

  const ImageComponent = ({ src, index, className = '' }: { src: string; index: number; className?: string }) => (
    <div 
        className={`relative overflow-hidden cursor-pointer aspect-w-1 aspect-h-1 ${className}`} 
        onClick={() => onImageClick(index)}
        style={{ background: '#e5e7eb' }} // gray-200
    >
      <img src={src} alt={`Post image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" loading="lazy" />
    </div>
  );

  const baseClasses = "grid gap-1";
  
  if (images.length === 1) {
    return <ImageComponent src={images[0]} index={0} className="max-h-[500px] rounded-lg" />;
  }

  if (images.length === 2) {
    return (
      <div className={`${baseClasses} grid-cols-2 max-h-[400px]`}>
        <ImageComponent src={images[0]} index={0} className="rounded-l-lg" />
        <ImageComponent src={images[1]} index={1} className="rounded-r-lg" />
      </div>
    );
  }
  
  if (images.length === 3) {
    return (
      <div className={`${baseClasses} grid-cols-2 grid-rows-2 max-h-[500px]`}>
        <ImageComponent src={images[0]} index={0} className="row-span-2 rounded-l-lg" />
        <ImageComponent src={images[1]} index={1} className="rounded-tr-lg" />
        <ImageComponent src={images[2]} index={2} className="rounded-br-lg" />
      </div>
    );
  }

  if (images.length === 4) {
    return (
      <div className={`${baseClasses} grid-cols-2 grid-rows-2 max-h-[500px]`}>
        <ImageComponent src={images[0]} index={0} className="rounded-tl-lg" />
        <ImageComponent src={images[1]} index={1} className="rounded-tr-lg" />
        <ImageComponent src={images[2]} index={2} className="rounded-bl-lg" />
        <ImageComponent src={images[3]} index={3} className="rounded-br-lg" />
      </div>
    );
  }

  return (
    <div className={`${baseClasses} grid-cols-2 max-h-[500px]`}>
      <ImageComponent src={images[0]} index={0} className="rounded-l-lg" />
      <div className="grid grid-rows-2 gap-1">
        <ImageComponent src={images[1]} index={1} className="rounded-tr-lg" />
        <div className="relative">
          <ImageComponent src={images[2]} index={2} className="rounded-br-lg" />
          {images.length > 3 && (
            <div 
              onClick={() => onImageClick(3)} 
              className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold rounded-br-lg"
            >
              +{images.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostImageGrid;
