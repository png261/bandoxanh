import React from 'react';
import { LeafIcon, FacebookIcon, YoutubeIcon, TiktokIcon, InstagramIcon, MailIcon } from './Icons';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com' },
    { name: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com' },
    { name: 'TikTok', icon: TiktokIcon, href: 'https://tiktok.com' },
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
  ];

  return (
    <footer className="bg-brand-gray-dark dark:bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <LeafIcon className="h-10 w-10 text-brand-green" />
              <h2 className="ml-3 text-3xl font-bold">BandoXanh</h2>
            </div>
            <p className="mt-4 text-gray-400 max-w-md">
              Dự án phi lợi nhuận với mục tiêu ứng dụng công nghệ để giải quyết các vấn đề về rác thải tại Việt Nam.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Liên kết nhanh</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-brand-green transition-colors">Trang chủ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-green transition-colors">Bản đồ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-green transition-colors">Tin tức</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-green transition-colors">Về dự án</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Kết nối với chúng tôi</h3>
            <div className="flex items-center space-x-2 text-gray-400 mb-4">
              <MailIcon className="w-5 h-5"/>
              <a href="mailto:contact@bandoxanh.vn" className="hover:text-brand-green transition-colors">contact@bandoxanh.vn</a>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.href} aria-label={link.name} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-green transition-colors">
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BandoXanh. All rights reserved. Một dự án vì cộng đồng.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;