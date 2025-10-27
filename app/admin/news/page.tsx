'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import SearchBar from '@/components/admin/SearchBar';
import StatsCards from '@/components/admin/StatsCards';
import Modal from '@/components/admin/Modal';
import ImageUpload from '@/components/ImageUpload';

interface NewsArticle {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  isFeatured: boolean;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Môi trường',
    excerpt: '',
    content: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    isFeatured: false,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Không thể tải danh sách tin tức');
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      category: 'Môi trường',
      excerpt: '',
      content: '',
      imageUrl: '',
      date: new Date().toISOString().split('T')[0],
      isFeatured: false,
    });
    setShowModal(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingNews(article);
    setFormData({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      imageUrl: article.imageUrl,
      date: article.date,
      isFeatured: article.isFeatured,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setSaving(true);
    try {
      const url = editingNews ? `/api/news/${editingNews.id}` : '/api/news';
      const method = editingNews ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save');

      const saved = await res.json();
      
      if (editingNews) {
        setNews(news.map(n => n.id === saved.id ? saved : n));
        toast.success('Cập nhật thành công!');
      } else {
        setNews([saved, ...news]);
        toast.success('Thêm tin tức thành công!');
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Không thể lưu tin tức');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa tin tức này?')) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setNews(news.filter(n => n.id !== id));
      toast.success('Xóa thành công!');
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Không thể xóa tin tức');
    }
  };

  const filteredNews = news.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader title="Quản lý Tin tức" description="Quản lý các bài viết và tin tức về môi trường" icon="📰" />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} onAddClick={handleAdd} addButtonText="Thêm tin tức" placeholder="🔍 Tìm kiếm theo tiêu đề, danh mục hoặc nội dung..." />
        <StatsCards stats={[
          { label: 'Tổng số tin', value: news.length, color: 'text-purple-600' }, 
          { label: 'Đang hiển thị', value: filteredNews.length, color: 'text-pink-600' },
          { label: 'Nổi bật', value: news.filter(n => n.isFeatured).length, color: 'text-orange-600' }
        ]} />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tiêu đề</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Danh mục</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ngày đăng</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNews.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">{searchTerm ? 'Không tìm thấy tin tức nào' : 'Chưa có tin tức nào'}</td></tr>
                ) : (
                  filteredNews.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{article.category}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{new Date(article.date).toLocaleDateString('vi-VN')}</td>
                      <td className="px-6 py-4 text-center">
                        {article.isFeatured && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">⭐ Nổi bật</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(article)} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">✏️ Sửa</button>
                          <button onClick={() => handleDelete(article.id)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">🗑️ Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingNews ? '✏️ Chỉnh sửa tin tức' : '➕ Thêm tin tức mới'} onSave={handleSave} saving={saving} isEditing={!!editingNews}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" placeholder="VD: Cách phân loại rác thải tại nguồn" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none">
                  <option value="Môi trường">Môi trường</option>
                  <option value="Tái chế">Tái chế</option>
                  <option value="Sự kiện">Sự kiện</option>
                  <option value="Hướng dẫn">Hướng dẫn</option>
                  <option value="Tin tức">Tin tức</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đăng</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt *</label>
              <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" placeholder="Tóm tắt ngắn về nội dung bài viết..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
              <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={6} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" placeholder="Nội dung chi tiết của bài viết..."></textarea>
            </div>
            <div>
              <ImageUpload
                currentUrl={formData.imageUrl}
                onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Hình ảnh bài viết"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <span className="text-sm font-medium text-gray-700">⭐ Đánh dấu là tin nổi bật</span>
              </label>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
