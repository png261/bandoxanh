'use client';

import React from 'react';

// Material UI Icons - Main exports
export { default as LeafIcon } from '@mui/icons-material/LocalFloristOutlined';
export { default as RecycleIcon } from '@mui/icons-material/RecyclingOutlined';
export { default as CameraIcon } from '@mui/icons-material/PhotoCameraOutlined';
export { default as UploadIcon } from '@mui/icons-material/CloudUploadOutlined';
export { default as MapPinIcon } from '@mui/icons-material/LocationOnOutlined';
export { default as CommunityIcon } from '@mui/icons-material/GroupsOutlined';
export { default as MenuIcon } from '@mui/icons-material/Menu';
export { default as XIcon } from '@mui/icons-material/Close';
export { default as HeartIcon } from '@mui/icons-material/FavoriteBorderOutlined';
export { default as ChatBubbleIcon } from '@mui/icons-material/ChatBubbleOutlineOutlined';
export { default as ArrowRightIcon } from '@mui/icons-material/ArrowForwardOutlined';
export { default as ArrowLeftIcon } from '@mui/icons-material/ArrowBackOutlined';
export { default as QuoteIcon } from '@mui/icons-material/FormatQuoteOutlined';
export { default as MailIcon } from '@mui/icons-material/MailOutlineOutlined';
export { default as CalendarIcon } from '@mui/icons-material/CalendarMonthOutlined';
export { default as ImageIcon } from '@mui/icons-material/ImageOutlined';
export { default as ChevronLeftIcon } from '@mui/icons-material/ChevronLeftOutlined';
export { default as ChevronRightIcon } from '@mui/icons-material/ChevronRightOutlined';
export { default as HomeIcon } from '@mui/icons-material/HomeOutlined';
export { default as NewspaperIcon } from '@mui/icons-material/NewspaperOutlined';
export { default as InformationCircleIcon } from '@mui/icons-material/InfoOutlined';
export { default as ChevronDoubleLeftIcon } from '@mui/icons-material/SkipPreviousOutlined';
export { default as ChevronDoubleRightIcon } from '@mui/icons-material/SkipNextOutlined';
export { default as ChartBarIcon } from '@mui/icons-material/BarChartOutlined';
export { default as CheckCircleIcon } from '@mui/icons-material/CheckCircleOutlined';
export { default as SunIcon } from '@mui/icons-material/WbSunnyOutlined';
export { default as MoonIcon } from '@mui/icons-material/DarkModeOutlined';
export { default as SproutIcon } from '@mui/icons-material/GrassOutlined';
export { default as MedalIcon } from '@mui/icons-material/EmojiEventsOutlined';
export { default as DirectionsIcon } from '@mui/icons-material/DirectionsOutlined';
export { default as HeartHandshakeIcon } from '@mui/icons-material/PeopleOutlineOutlined';
export { default as UserCircleIcon } from '@mui/icons-material/AccountCircleOutlined';
export { default as QrCodeIcon } from '@mui/icons-material/QrCodeOutlined';
export { default as EllipsisHorizontalIcon } from '@mui/icons-material/MoreHorizOutlined';
export { default as ShareIcon } from '@mui/icons-material/ShareOutlined';
export { default as PencilIcon } from '@mui/icons-material/EditOutlined';
export { default as TrashIcon } from '@mui/icons-material/DeleteOutlineOutlined';
export { default as LinkIcon } from '@mui/icons-material/LinkOutlined';

// Brand Social Icons - Custom SVG (keep original)

export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
  </svg>
);

export const YoutubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
  </svg>
);

export const TiktokIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.52.01 1.04.01 1.56.02.83.01 1.66.01 2.49.02.32.01.64.01.96.02.04 0 .09-.01.13.02.1.02.21.03.31.05.23.04.46.09.68.16.25.08.5.18.73.31.22.12.44.27.64.44.33.28.62.63.85 1.01.19.31.33.65.43 1.01.07.25.12.5.15.76.03.24.05.48.06.73.01.2.01.4.01.6 0 .33 0 .66 0 .99.01.32.01.64.01.96 0 1.55.01 3.1.01 4.64 0 .83.01 1.66.01 2.49 0 .28-.01.56-.02.84-.02.26-.05.52-.1.78-.1.52-.27 1.02-.53 1.5-.26.48-.59.92-.98 1.32-.41.41-.88.75-1.4.99-.27.12-.55.22-.83.31-.29.09-.58.15-.88.2-.28.05-.56.08-.85.11-.27.03-.55.05-.82.06-.09.01-.18.01-.28.01-.33 0-.66.01-1 .01s-2.01 0-3.01.01c-.32.01-.64.01-.96.02-.52.01-1.04.01-1.56.02-.83.01-1.66.01-2.49.02-.32.01-.64.01-.96.02a21.32 21.32 0 0 1-3.13-.02c-.22 0-.44-.01-.66-.02-.27-.01-.53-.03-.8-.06-.52-.06-1.04-.18-1.53-.38-.47-.19-.92-.44-1.32-.76-.4-.32-.75-.69-.99-1.13-.19-.34-.34-.7-.44-1.08-.09-.33-.15-.67-.18-1.02-.03-.32-.05-.64-.06-.96-.01-.52-.01-1.04-.01-1.56 0-1.66-.01-3.32-.01-4.98 0-.32.01-.64.01-.96.01-.28.02-.56.04-.84.04-.52.14-1.04.31-1.54.19-.56.46-1.08.81-1.56.37-.5.8-1.01 1.3-1.39.29-.22.6-.41.93-.57.38-.18.77-.32 1.17-.42.2-.05.4-.08.6-.11.23-.03.46-.05.7-.06.27-.01.53-.01.8-.01.32 0 .64-.01.96-.01.52-.01 1.04-.01 1.56-.01.58 0 1.17 0 1.75.01.33 0 .66 0 .99.01.27.01.54.01.81.02.26.01.52.03.78.06.52.06 1.04.18 1.53.38.47.19.92.44 1.32.76.4.32.75.69.99 1.13.19.34.34.7.44 1.08.09.33.15.67.18 1.02.03.32.05.64.06.96.01.52.01 1.04.01 1.56 0 .09 0 .18 0 .28v.02c0 .09 0 .18 0 .28.01.28.01.55.01.83 0 .24-.01.48-.02.72s-.02.48-.04.72c-.02.24-.05.48-.09.71-.08.48-.22.95-.42 1.4-.18.43-.42.83-.73 1.2-.31.37-.68.69-1.09.95-.41.26-.86.45-1.33.56-.47.11-.95.16-1.44.16-.34 0-.68 0-1.02-.03-.31-.03-.62-.07-.92-.13-.25-.05-.5-.12-.73-.22-.22-.09-.44-.2-.64-.33-.33-.22-.62-.49-.85-.81-.19-.26-.34-.55-.44-.86-.09-.3-.15-.6-.18-.91-.03-.3-.05-.6-.06-.9v-.02c0-.09 0-.18 0-.28 0-.28-.01-.55-.01-.83v-7.3c0-.09 0-.18 0-.28.01-.28.01-.55.01-.83 0-.24.01-.48.02-.72s.02-.48.04-.72c.02-.24.05-.48.09-.71.08-.48.22-.95.42-1.4.18-.43.42.83-.73-1.2.31-.37.68-.69 1.09-.95.41-.26.86.45 1.33.56.47-.11.95-.16 1.44-.16.34 0 .68 0 1.02.03.31-.03.62-.07.92-.13.25-.05.5-.12.73-.22.22-.09.44-.2.64-.33.33-.22.62-.49.85-.81.19-.26.34-.55.44-.86.09-.3.15-.6.18-.91.03-.3.05-.6.06-.9v-.02c0-.09 0-.18 0-.28 0-.28-.01-.55-.01-.83 0-.24-.01-.48-.02-.72s-.02-.48-.04-.72c-.02-.24-.05-.48-.09-.71-.08-.48-.22-.95-.42-1.4-.18-.43-.42-.83-.73-1.2-.31-.37-.68-.69-1.09-.95-.41-.26-.86-.45-1.33-.56-.47-.11-.95-.16-1.44-.16z"/>
  </svg>
);

export const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z" />
  </svg>
);

export const TwitterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153zm-1.613 19.59h2.546L7.49 3.09h-2.73l12.484 17.653z" />
    </svg>
);

export const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
);

export const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export const TelegramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export const ZaloIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="currentColor">
    <path d="M24,4C13.5,4,5,12.1,5,22c0,4.8,2,9.2,5.3,12.5c0,0,0,0.1,0,0.1c0,1.4-0.5,5.3-0.5,5.4c-0.1,0.4,0,0.8,0.3,1.1 C10.3,41.4,10.7,41.5,11,41.5c0.1,0,3.7-0.2,6.5-1.5c0,0,0.1,0,0.1,0C19.9,41.3,21.9,42,24,42c10.5,0,19-8.1,19-18S34.5,4,24,4z"/>
    <path fill="#fff" d="M27.5,25.3l-5.8-5.8c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l5.1,5.1l-5.1,5.1c-0.4,0.4-0.4,1,0,1.4 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l5.8-5.8C28,26.3,28,25.7,27.5,25.3z"/>
    <path fill="#fff" d="M32.9,16.5h-6.2c-0.6,0-1,0.4-1,1v12.9c0,0.6,0.4,1,1,1h6.2c0.6,0,1-0.4,1-1v-12.9 C33.9,16.9,33.5,16.5,32.9,16.5z M31.9,29.4h-4.2V18.5h4.2V29.4z"/>
    <path fill="#fff" d="M22.6,16.5h-6.2c-0.6,0-1,0.4-1,1v7.1c0,3.4,2.8,6.2,6.2,6.2c0.6,0,1-0.4,1-1V17.5 C22.6,16.9,22.2,16.5,22.6,16.5z M20.6,28.7c-1.9-0.3-3.2-1.9-3.2-3.9v-6.2h3.2V28.7z"/>
  </svg>
);

