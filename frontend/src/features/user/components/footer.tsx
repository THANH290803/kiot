'use client'

import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-primary text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold font-serif mb-4">ELEGANCE</h3>
                        <p className="text-sm text-gray-300">
                            Khám phá bộ sưu tập thời trang thanh lịch và chuyên nghiệp cho phụ nữ hiện đại.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Cửa hàng</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-gray-300 transition-colors">
                                    Sản phẩm mới
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300 transition-colors">
                                    Bộ sưu tập
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300 transition-colors">
                                    Giảm giá
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300 transition-colors">
                                    Hàng bán chạy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-semibold mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-gray-300 transition-colors">
                                    Liên hệ chúng tôi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300 transition-colors">
                                    Câu hỏi thường gặp
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300 transition-colors">
                                    Chính sách bảo mật
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-gray-300 transition-colors">
                                    Điều khoản sử dụng
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">Liên hệ</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                                <span>+84 (0) 123 456 789</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                                <span>support@elegance.vn</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                <span>123 Đường Lê Lợi, Quận 1, TP.HCM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 pt-8">
                    {/* Social Links */}
                    <div className="flex justify-center gap-6 mb-6">
                        <a href="#" className="hover:text-gray-300 transition-colors">
                            Facebook
                        </a>
                        <a href="#" className="hover:text-gray-300 transition-colors">
                            Instagram
                        </a>
                        <a href="#" className="hover:text-gray-300 transition-colors">
                            Pinterest
                        </a>
                        <a href="#" className="hover:text-gray-300 transition-colors">
                            TikTok
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-center text-sm text-gray-400">
                        <p>&copy; 2024 ELEGANCE. Tất cả các quyền được bảo lưu.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
