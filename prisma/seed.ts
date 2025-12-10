import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');



  // Seed generic data

  try {
    // Clear existing data
    await prisma.comment.deleteMany();
    await prisma.pollOption.deleteMany();
    await prisma.poll.deleteMany();
    await prisma.post.deleteMany();
    await prisma.userAward.deleteMany();
    await prisma.award.deleteMany();
    await prisma.user.deleteMany();
    await prisma.newsArticle.deleteMany();
    await prisma.station.deleteMany();
    await prisma.recyclingEvent.deleteMany();
    await prisma.wasteAnalysis.deleteMany();
    await prisma.bikeRental.deleteMany();
    await prisma.vegetarianRestaurant.deleteMany();
    await prisma.donationPoint.deleteMany();

    // Create awards
    const award1 = await prisma.award.create({
      data: {
        name: 'Bắt đầu hành trình xanh',
        description: 'Hoàn thành bài viết đầu tiên',
        icon: '🌱',
      },
    });
    const award2 = await prisma.award.create({
      data: {
        name: 'Nhà tái chế',
        description: 'Tham gia 5 chương trình tái chế',
        icon: '♻️',
      },
    });
    const award3 = await prisma.award.create({
      data: {
        name: 'Người dẫn đầu cộng đồng',
        description: 'Nhận 100 lượt thích',
        icon: '👑',
      },
    });

    // Create users
    const user1 = await prisma.user.create({
      data: {
        clerkId: 'seed_user_1',
        email: 'nguyenvana@example.com',
        name: 'Nguyễn Văn A',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        joinDate: 'January 15, 2024',
        bio: 'Yêu thích tái chế và bảo vệ môi trường',
      },
    });
    const user2 = await prisma.user.create({
      data: {
        clerkId: 'seed_user_2',
        email: 'tranthib@example.com',
        name: 'Trần Thị B',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        joinDate: 'February 20, 2024',
        bio: 'Cộng tác viên môi trường',
      },
    });
    const user3 = await prisma.user.create({
      data: {
        clerkId: 'seed_user_3',
        email: 'levanc@example.com',
        name: 'Lê Văn C',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        joinDate: 'March 10, 2024',
        bio: 'Người sáng lập BandoXanh',
      },
    });

    // Assign awards to users
    await prisma.userAward.create({
      data: {
        userId: user1.id,
        awardId: award1.id,
      },
    });

    // Create news articles
    await prisma.newsArticle.createMany({
      data: [
        {
          title: 'Cách phân loại rác thải đúng cách',
          category: 'Hướng dẫn',
          excerpt: 'Học cách phân loại rác thải để bảo vệ môi trường',
          imageUrl: 'https://images.unsplash.com/photo-1559289801-4824c16323df?w=800',
          date: 'October 20, 2024',
          isFeatured: true,
          content: 'Phân loại rác thải là bước đầu tiên để bảo vệ môi trường. Hãy học cách phân loại rác thành: rác hữu cơ, rác tái chế, rác nguy hiểm và rác thường.',
        },
        {
          title: 'Tác động của nhựa đến môi trường',
          category: 'Tin tức',
          excerpt: 'Nhựa đang ô nhiễm đại dương và đe dọa các loài sinh vật',
          imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800',
          date: 'October 18, 2024',
          isFeatured: false,
          content: 'Mỗi năm, hàng triệu tấn nhựa được thải ra và ô nhiễm đại dương. Chúng ta cần hành động ngay để giảm sử dụng nhựa một lần.',
        },
      ],
    });

    // Create stations - Real data from Hanoi 2024
    await prisma.station.createMany({
      data: [
        {
          name: 'Điểm thu gom rác điện tử - Nghĩa Tân',
          address: '45 Nghĩa Tân, Quận Cầu Giấy, Hà Nội',
          latitude: 21.0423,
          longitude: 105.7934,
          hours: '8:00 - 17:00 (T2-T6)',
          wasteTypes: JSON.stringify(['Điện tử', 'Pin', 'Thiết bị gia dụng']),
          image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
        },
        {
          name: 'Điểm thu gom rác điện tử - Hoàn Kiếm',
          address: '02 Cổ Tân, Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
          latitude: 21.0242,
          longitude: 105.8544,
          hours: '8:00 - 17:00 (T2-T6)',
          wasteTypes: JSON.stringify(['Điện tử', 'Pin']),
          image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
        },
        {
          name: 'Điểm thu gom rác điện tử - Ba Đình',
          address: '12-14 Phan Đình Phùng, Quán Thánh, Quận Ba Đình, Hà Nội',
          latitude: 21.0397,
          longitude: 105.8382,
          hours: '8:00 - 17:00 (T2-T6)',
          wasteTypes: JSON.stringify(['Điện tử', 'Pin', 'Thiết bị IT']),
          image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
        },
        {
          name: 'Chi Cục Bảo Vệ Môi Trường Hà Nội',
          address: '17 Trung Yên 3, Trung Hòa, Quận Cầu Giấy, Hà Nội',
          latitude: 21.0119,
          longitude: 105.7915,
          hours: '8:00 - 17:00 (T2-T6)',
          wasteTypes: JSON.stringify(['Điện tử', 'Pin', 'Hóa chất']),
          image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
        },
        {
          name: 'TH true mart - Thu gom vỏ hộp sữa',
          address: '280 Tây Sơn, Đống Đa, Hà Nội',
          latitude: 21.0089,
          longitude: 105.8232,
          hours: '8:00 - 17:30 hàng ngày',
          wasteTypes: JSON.stringify(['Vỏ hộp sữa', 'Giấy']),
          image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
        },
        {
          name: 'Điểm thu gom phân loại rác - Nam Đồng',
          address: 'Phường Nam Đồng, Quận Đống Đa, Hà Nội',
          latitude: 21.0132,
          longitude: 105.8289,
          hours: '6:00 - 21:00',
          wasteTypes: JSON.stringify(['Nhựa', 'Giấy', 'Hữu cơ', 'Kim loại']),
          image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400',
        },
      ],
    });

    // Create Bike Rentals - Real data
    await prisma.bikeRental.createMany({
      data: [
        {
          name: 'TNGo - Hồ Gươm',
          address: 'Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
          latitude: 21.0285,
          longitude: 105.8522,
          price: '10.000 VNĐ/giờ',
          hours: '5:00 - 23:00',
          instructions: 'Tải app TNGo, quét mã QR trên xe để mở khóa. Trả xe tại bất kỳ trạm TNGo nào.',
          terms: 'Yêu cầu đặt cọc 200.000 VNĐ. Giữ xe cẩn thận.',
          image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800',
        },
        {
          name: 'TNGo - Công viên Thống Nhất',
          address: 'Trần Nhân Tông, Hai Bà Trưng, Hà Nội',
          latitude: 21.0167,
          longitude: 105.8450,
          price: '10.000 VNĐ/giờ',
          hours: '5:00 - 23:00',
          instructions: 'Tải app TNGo, quét mã QR trên xe để mở khóa.',
          terms: 'Yêu cầu đặt cọc. Trả xe đúng trạm.',
          image: 'https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=800',
        },
        {
          name: 'TNGo - Hồ Tây',
          address: 'Thanh Niên, Tây Hồ, Hà Nội',
          latitude: 21.0531,
          longitude: 105.8250,
          price: '10.000 VNĐ/giờ',
          hours: '5:00 - 23:00',
          instructions: 'Tải app TNGo, quét mã QR trên xe.',
          terms: 'Yêu cầu đặt cọc.',
          image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800',
        },
      ],
    });

    // Create Vegetarian Restaurants - Real data from Hanoi 2024
    await prisma.vegetarianRestaurant.createMany({
      data: [
        {
          name: 'Zenith Vegan Restaurant & Café',
          address: '99B ngõ 275 Âu Cơ, Tây Hồ, Hà Nội',
          latitude: 21.0589,
          longitude: 105.8195,
          priceRange: '80.000 - 200.000 VNĐ',
          hours: '9:00 - 16:00 hàng ngày',
          menu: 'Cơm bento, phở chay, mì soba, tacos, pizza, pasta. Kết hợp món Âu - Á.',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        },
        {
          name: 'Nhà hàng Chay Vị Lai',
          address: '67 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
          latitude: 21.0245,
          longitude: 105.8465,
          priceRange: '100.000 - 300.000 VNĐ',
          hours: '10:30 - 14:00, 17:30 - 22:00',
          menu: 'Lẩu chay, salad, soup, tráng miệng. Ẩm thực chay Á - Âu theo mùa.',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        },
        {
          name: 'Ưu Đàm Chay',
          address: '55 Nguyễn Du, Hoàn Kiếm, Hà Nội',
          latitude: 21.0178,
          longitude: 105.8510,
          priceRange: '100.000 - 250.000 VNĐ',
          hours: 'T2-T5: 9:00-22:00, T6-CN: 9:00-22:30',
          menu: 'Sâm đất tấn bí đỏ, pizza sầu riêng, cơm, lẩu. Phong cách Phật Giáo.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
        },
        {
          name: 'Sadhu Chay - Lotte Mall',
          address: 'Tầng 3 Lotte Mall West Lake, Tây Hồ, Hà Nội',
          latitude: 21.0667,
          longitude: 105.8156,
          priceRange: '250.000 - 400.000 VNĐ',
          hours: '10:00 - 22:00',
          menu: 'Buffet chay phục vụ tại bàn. Món ăn chế biến tinh tế, thanh tịnh.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
        },
        {
          name: 'Cồ Đàm Chay',
          address: '68 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
          latitude: 21.0227,
          longitude: 105.8509,
          priceRange: '150.000 - 350.000 VNĐ',
          hours: '10:00 - 22:00',
          menu: 'Ẩm thực chay sáng tạo, thẩm mỹ cao trong không gian sang trọng.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
        },
        {
          name: 'Veggie Castle - Ngọc Khánh',
          address: '38 Ngọc Khánh, Ba Đình, Hà Nội',
          latitude: 21.0235,
          longitude: 105.8156,
          priceRange: '100.000 - 180.000 VNĐ',
          hours: '10:00 - 21:00',
          menu: 'Buffet thuần chay, thực đơn thay đổi hàng ngày. Rau củ tươi sạch.',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        },
        {
          name: 'Buffet Chay Hương Thiền',
          address: '261 Xã Đàn, Nam Đồng, Đống Đa, Hà Nội',
          latitude: 21.0108,
          longitude: 105.8311,
          priceRange: '80.000 - 150.000 VNĐ',
          hours: '10:00 - 21:00',
          menu: 'Buffet chay hơn 100 món thuần chay Việt và món giả mặn.',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
        },
        {
          name: 'Haan Vegan',
          address: '71 Đào Tấn, Ngọc Khánh, Ba Đình, Hà Nội',
          latitude: 21.0267,
          longitude: 105.8123,
          priceRange: '60.000 - 120.000 VNĐ',
          hours: '10:00 - 21:00',
          menu: 'Lẩu Thái chay, bún riêu cua chay, phở xào, nem Hà Nội. Menu thay đổi mỗi ngày.',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        },
      ],
    });

    // Create Donation Points - Real data from Hanoi 2024
    await prisma.donationPoint.createMany({
      data: [
        {
          name: 'Tủ Quần Áo 0 Đồng - Bà Triệu',
          address: '226 Bà Triệu, Hai Bà Trưng, Hà Nội',
          latitude: 21.0145,
          longitude: 105.8512,
          hours: '24/7',
          acceptedItems: 'Quần áo cũ còn sạch sẽ, dùng tốt',
          beneficiary: 'Ai thiếu đến lấy - Ai thừa ủng hộ',
          image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
          beneficiaryImage: 'https://images.unsplash.com/photo-1524677708096-7c957816ec48?w=800',
        },
        {
          name: 'Tủ Quần Áo 0 Đồng - Thái Hà',
          address: '70 Thái Hà, Đống Đa, Hà Nội',
          latitude: 21.0123,
          longitude: 105.8210,
          hours: '24/7',
          acceptedItems: 'Quần áo cũ sạch sẽ, gấp gọn',
          beneficiary: 'Người lao động nghèo',
          image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        },
        {
          name: 'Tủ Quần Áo 0 Đồng - Tây Sơn',
          address: '420 Tây Sơn, Đống Đa, Hà Nội',
          latitude: 21.0067,
          longitude: 105.8198,
          hours: '24/7',
          acceptedItems: 'Quần áo, giày dép còn dùng được',
          beneficiary: 'Người có hoàn cảnh khó khăn',
          image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        },
        {
          name: 'E2K - Điểm quyên góp Hồ Tùng Mậu',
          address: '18, ngách 1, ngõ 199 Hồ Tùng Mậu, Nam Từ Liêm, Hà Nội',
          latitude: 21.0389,
          longitude: 105.7634,
          hours: '8:00 - 20:00',
          acceptedItems: 'Quần áo, sách truyện, văn phòng phẩm',
          beneficiary: 'Dự án 2.000 đồng - Hỗ trợ hoàn cảnh khó khăn',
          image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
        },
        {
          name: 'Nhóm Thiện Nguyện 74 Liên Cơ',
          address: '74 Liên Cơ, Đại Mỗ, Nam Từ Liêm, Hà Nội',
          latitude: 21.0156,
          longitude: 105.7523,
          hours: '8:00 - 18:00',
          acceptedItems: 'Quần áo ấm, chăn màn, đồ dùng học tập',
          beneficiary: 'Trẻ em vùng cao, gia đình khó khăn',
          image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
          beneficiaryImage: 'https://images.unsplash.com/photo-1524677708096-7c957816ec48?w=800',
        },
        {
          name: 'Sạp Hàng S-Nối - Quỹ Từ Thiện Ngọc Đức',
          address: 'P1204, N17.3, KĐT Sài Đồng, Long Biên, Hà Nội',
          latitude: 21.0367,
          longitude: 105.9123,
          hours: '9:00 - 17:00 (T2-T7)',
          acceptedItems: 'Quần áo cũ, đồ dùng gia đình',
          beneficiary: 'Gây quỹ hỗ trợ em nhỏ, gia đình khó khăn',
          image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        },
      ],
    });


    // Create posts
    const post1 = await prisma.post.create({
      data: {
        content: 'Hôm nay tôi đã tham gia chương trình tái chế cộng đồng. Rất vui được làm phần nhỏ để bảo vệ môi trường!',
        timestamp: 'October 22, 2024 at 2:30 PM',
        authorId: user1.id,
        likes: 15,
      },
    });

    const post2 = await prisma.post.create({
      data: {
        content: 'Các bạn đã biết? Mỗi tuần tôi tiết kiệm được 5kg nhựa bằng cách sử dụng túi vải.',
        timestamp: 'October 21, 2024 at 10:15 AM',
        authorId: user2.id,
        likes: 28,
      },
    });

    // Create comments
    await prisma.comment.create({
      data: {
        content: 'Tuyệt vời! Tôi cũng muốn tham gia.',
        timestamp: 'October 22, 2024 at 3:00 PM',
        postId: post1.id,
        authorId: user2.id,
      },
    });

    // Create polls
    const poll = await prisma.poll.create({
      data: {
        question: 'Bạn sử dụng túi tái chế bao nhiêu lần một tuần?',
        postId: post2.id,
        votedBy: JSON.stringify([user1.id]),
      },
    });

    await prisma.pollOption.createMany({
      data: [
        {
          text: 'Mỗi ngày',
          votes: 45,
          pollId: poll.id,
        },
        {
          text: '3-4 lần',
          votes: 32,
          pollId: poll.id,
        },
        {
          text: '1-2 lần',
          votes: 18,
          pollId: poll.id,
        },
        {
          text: 'Chưa bao giờ',
          votes: 5,
          pollId: poll.id,
        },
      ],
    });

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
