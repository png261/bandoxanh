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
