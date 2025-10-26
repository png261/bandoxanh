import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding news articles...');

  // Clear existing news
  await prisma.newsArticle.deleteMany();

  // Seed News Articles
  const articles = await prisma.newsArticle.createMany({
    data: [
      {
        title: 'Hà Nội ra mắt hệ thống phân loại rác thông minh tại 10 quận nội thành',
        category: 'Chính sách',
        excerpt: 'UBND Thành phố Hà Nội vừa triển khai thí điểm hệ thống thùng rác thông minh tích hợp cảm biến AI và IoT, giúp phân loại rác tự động và tối ưu hóa việc thu gom.',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
        date: '20/10/2024',
        isFeatured: true,
        content: `UBND Thành phố Hà Nội vừa chính thức triển khai thí điểm hệ thống thùng rác thông minh tại 10 quận nội thành, đánh dấu bước tiến quan trọng trong việc quản lý chất thải đô thị.

Hệ thống mới được trang bị cảm biến AI và công nghệ IoT, có khả năng:
- Nhận diện và phân loại rác tự động
- Cảnh báo khi thùng rác đầy qua ứng dụng di động
- Thu thập dữ liệu về lượng rác từng khu vực
- Tối ưu hóa lộ trình thu gom

Theo ông Nguyễn Văn A, Phó giám đốc Sở Tài nguyên và Môi trường Hà Nội: "Đây là giải pháp công nghệ tiên tiến giúp nâng cao hiệu quả quản lý rác thải, đồng thời nâng cao ý thức của người dân trong việc phân loại rác tại nguồn."

Dự án được kỳ vọng sẽ giảm 30% lượng rác không được phân loại đúng cách và tiết kiệm 20% chi phí vận hành thu gom rác trong vòng 2 năm tới.`,
      },
      {
        title: 'Sinh viên Hà Nội khởi nghiệp từ tái chế rác thải nhựa thành gạch xây dựng',
        category: 'Khởi nghiệp xanh',
        excerpt: 'Nhóm sinh viên Đại học Bách Khoa Hà Nội đã thành công trong việc biến rác thải nhựa thành gạch không nung thân thiện môi trường, với độ bền cao hơn gạch truyền thống.',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
        date: '18/10/2024',
        isFeatured: false,
        content: 'Nhóm sinh viên đã nghiên cứu và phát triển quy trình chuyển hóa rác thải nhựa thành vật liệu xây dựng bền vững...',
      },
      {
        title: 'Chiến dịch "Một triệu chai nhựa" thu về hơn 1.2 triệu chai trong tháng đầu',
        category: 'Sự kiện',
        excerpt: 'Chiến dịch do Bộ Tài nguyên và Môi trường phát động đã nhận được sự hưởng ứng nhiệt tình từ cộng đồng, vượt 20% mục tiêu đề ra.',
        imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
        date: '15/10/2024',
        isFeatured: false,
        content: 'Chiến dịch thu hồi chai nhựa đã đạt được thành công vượt mong đợi với sự tham gia của hàng ngàn hộ gia đình...',
      },
      {
        title: 'Nhật Bản hỗ trợ Việt Nam 50 triệu USD cho dự án xử lý rác thải',
        category: 'Hợp tác quốc tế',
        excerpt: 'Chính phủ Nhật Bản cam kết hỗ trợ tài chính và chuyển giao công nghệ xử lý rác thải tiên tiến cho các tỉnh thành Việt Nam.',
        imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
        date: '12/10/2024',
        isFeatured: false,
        content: 'Thỏa thuận hợp tác được ký kết trong chuyến thăm chính thức của Thủ tướng Nhật Bản tới Việt Nam...',
      },
      {
        title: 'Ứng dụng di động giúp người dân kiếm tiền từ phân loại rác',
        category: 'Công nghệ',
        excerpt: 'Ứng dụng "Rác Xanh" cho phép người dùng quét mã QR trên bao bì sản phẩm để biết cách phân loại đúng và tích điểm đổi quà.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        date: '10/10/2024',
        isFeatured: false,
        content: 'Startup công nghệ trong nước đã phát triển ứng dụng di động giúp người dân dễ dàng phân loại rác và được thưởng...',
      },
      {
        title: 'Mô hình "Zero Waste" thành công tại khu đô thị Ecopark',
        category: 'Mô hình điển hình',
        excerpt: 'Sau 6 tháng triển khai, khu đô thị Ecopark đã giảm 85% lượng rác thải ra môi trường nhờ mô hình "Zero Waste" toàn diện.',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        date: '08/10/2024',
        isFeatured: false,
        content: 'Mô hình sống không rác thải đã mang lại kết quả ấn tượng với sự tham gia tích cực của toàn bộ cư dân...',
      },
    ],
  });

  console.log(`✅ Created ${articles.count} news articles`);
  console.log('🎉 News seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding news:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
