
import React from 'react';
import Image from 'next/image';
import { FacebookIcon, YoutubeIcon, TiktokIcon, InstagramIcon, MailIcon } from './Icons';
import logo from "@/public/logo.png";

const Footer: React.FC = () => {
    const socialLinks = [
        { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/bandoxanh.org/' },
        { name: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com/bandoxanh.org' },
        { name: 'TikTok', icon: TiktokIcon, href: 'https://tiktok.com/bandoxanh.org' },
        { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/bandoxanh.org' },
    ];

    return (
        <footer className="bg-brand-gray-dark dark:bg-black text-white">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand Info */}
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-center">
                            <Image src={logo} alt="BandoXanh Logo" width={200} height={100} />
                        </div>
                        <p className="mt-4 text-gray-400 text-center">
                            Dự án phi lợi nhuận với mục tiêu ứng dụng công nghệ
                            <br />
                            để giải quyết các vấn đề về rác thải tại Việt Nam.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-white">Liên kết nhanh</h3>
                        <ul className="space-y-3">
                            <li><a href="https://bandoxanh.org/map" className="text-gray-400 hover:text-brand-green transition-colors">Bản đồ</a></li>
                            <li><a href="https://bandoxanh.org/identify" className="text-gray-400 hover:text-brand-green transition-colors">Nhận diện</a></li>
                            <li><a href="https://bandoxanh.org/community" className="text-gray-400 hover:text-brand-green transition-colors">Cộng đồng</a></li>
                            <li><a href="https://bandoxanh.org/news" className="text-gray-400 hover:text-brand-green transition-colors">Tin tức</a></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-white">Kết nối với chúng tôi</h3>
                        <div className="flex items-center space-x-2 text-gray-400 mb-4">
                            <MailIcon className="w-5 h-5" />
                            <a href="mailto:contact@bandoxanh.org" className="hover:text-brand-green transition-colors">contact@bandoxanh.org</a>
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
                    <p>
                        &copy; {new Date().getFullYear()} Bản Đồ Xanh. Tất cả quyền được bảo lưu.
                        Dự án vì cộng đồng.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
