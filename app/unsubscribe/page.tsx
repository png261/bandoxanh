'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        width: '100%',
        margin: '20px',
        padding: '40px', 
        background: 'white', 
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📧</div>
        <h1 style={{ 
          margin: '0 0 20px', 
          color: '#1f2937',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          Hủy đăng ký email
        </h1>
        
        <p style={{ 
          margin: '0 0 30px', 
          color: '#6b7280',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          {email ? (
            <>
              Bạn đã hủy đăng ký nhận email từ Bandoxanh cho địa chỉ:
              <br />
              <strong style={{ color: '#1f2937' }}>{email}</strong>
            </>
          ) : (
            'Không tìm thấy địa chỉ email.'
          )}
        </p>

        <div style={{ 
          padding: '20px', 
          background: '#f9fafb', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px', lineHeight: '1.6' }}>
            Bạn sẽ không nhận được email về:
          </p>
          <ul style={{ 
            margin: '10px 0 0', 
            padding: '0 0 0 20px',
            textAlign: 'left',
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <li>Thông báo mới từ cộng đồng</li>
            <li>Sự kiện môi trường</li>
            <li>Tin tức về tái chế</li>
            <li>Bản tin định kỳ</li>
          </ul>
        </div>

        <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: '14px' }}>
          Bạn vẫn có thể sử dụng tất cả các tính năng của Bandoxanh.
        </p>

        <a 
          href="https://bandoxanh.org"
          style={{
            display: 'inline-block',
            padding: '12px 30px',
            background: '#22c55e',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'background 0.2s'
          }}
        >
          Quay về trang chủ
        </a>

        <p style={{ 
          margin: '30px 0 0', 
          color: '#9ca3af', 
          fontSize: '12px',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '20px'
        }}>
          Nếu đây là nhầm lẫn, vui lòng liên hệ{' '}
          <a href="mailto:hello@bandoxanh.org" style={{ color: '#22c55e' }}>
            hello@bandoxanh.org
          </a>
        </p>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
