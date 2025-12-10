import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

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
    await prisma.vegetarianDish.deleteMany();
    await prisma.diyIdea.deleteMany();
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

    // Load data from JSON files
    const dataDir = path.join(__dirname, 'data');

    const stations = JSON.parse(fs.readFileSync(path.join(dataDir, 'recycling_stations.json'), 'utf-8'));
    const vegetarianRestaurants = JSON.parse(fs.readFileSync(path.join(dataDir, 'vegetarian_restaurants.json'), 'utf-8'));
    const vegetarianDishes = JSON.parse(fs.readFileSync(path.join(dataDir, 'vegetarian_dishes.json'), 'utf-8'));
    const diyIdeas = JSON.parse(fs.readFileSync(path.join(dataDir, 'diy_ideas.json'), 'utf-8'));
    const donationPoints = JSON.parse(fs.readFileSync(path.join(dataDir, 'donation_points.json'), 'utf-8'));

    // Create stations
    await prisma.station.createMany({
      data: stations,
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

    // Create Vegetarian Restaurants
    await prisma.vegetarianRestaurant.createMany({
      data: vegetarianRestaurants,
    });

    // Create Vegetarian Dishes
    await prisma.vegetarianDish.createMany({
      data: vegetarianDishes,
    });

    // Create DIY Ideas
    await prisma.diyIdea.createMany({
      data: diyIdeas,
    });

    // Create Donation Points
    await prisma.donationPoint.createMany({
      data: donationPoints,
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
