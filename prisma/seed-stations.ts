import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding stations and events...');

  // Clear existing data
  await prisma.recyclingEvent.deleteMany();
  await prisma.station.deleteMany();

  // Seed Stations
  const stations = await prisma.station.createMany({
    data: [
      {
        name: 'Trạm Tái Chế Quận Hoàn Kiếm',
        address: '59 Hàng Bài, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
        latitude: 21.0227,
        longitude: 105.8521,
        hours: '08:00 - 17:00',
        wasteTypes: JSON.stringify(['Nhựa', 'Giấy', 'Kim loại']),
        image: 'https://source.unsplash.com/400x300/?recycling,plastic,paper',
      },
      {
        name: 'Điểm Thu Gom Rác Điện Tử Cầu Giấy',
        address: '144 Xuân Thủy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội',
        latitude: 21.0368,
        longitude: 105.7825,
        hours: '09:00 - 16:00 (Thứ 7)',
        wasteTypes: JSON.stringify(['Điện tử', 'Pin']),
        image: 'https://source.unsplash.com/400x300/?e-waste,electronic-recycling',
      },
      {
        name: 'Nhà máy xử lý rác hữu cơ Sóc Sơn',
        address: 'Khu liên hợp xử lý chất thải rắn Nam Sơn, Sóc Sơn, Hà Nội',
        latitude: 21.2833,
        longitude: 105.8000,
        hours: '24/7',
        wasteTypes: JSON.stringify(['Hữu cơ']),
        image: 'https://source.unsplash.com/400x300/?compost,organic-waste',
      },
      {
        name: 'Trạm Xanh Ba Đình',
        address: '19C Ngọc Hà, Phường Ngọc Hà, Quận Ba Đình, Hà Nội',
        latitude: 21.0375,
        longitude: 105.8288,
        hours: '07:30 - 18:00',
        wasteTypes: JSON.stringify(['Thủy tinh', 'Giấy', 'Nhựa']),
        image: 'https://source.unsplash.com/400x300/?recycling-bins,glass,plastic',
      },
    ],
  });

  console.log(`✅ Created ${stations.count} stations`);

  // Seed Events
  const events = await prisma.recyclingEvent.createMany({
    data: [
      {
        name: 'Ngày Hội Tái Chế Rác Thải Điện Tử',
        address: 'Cung Văn hóa Lao động Hữu nghị Việt Xô, 91 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
        latitude: 21.0210,
        longitude: 105.8450,
        date: '25/08/2024',
        time: '08:00 - 17:00',
        organizer: 'Việt Nam Tái Chế (WVR)',
        description: 'Mang rác thải điện tử cũ của bạn đến để được xử lý đúng cách và nhận những phần quà xanh. Cùng chung tay bảo vệ môi trường!',
        image: 'https://source.unsplash.com/400x300/?e-waste,event',
      },
      {
        name: 'Đổi Vỏ Hộp Sữa Lấy Quà',
        address: 'AEON Mall Long Biên, 27 Đ. Cổ Linh, Long Biên, Hà Nội',
        latitude: 21.0259,
        longitude: 105.8997,
        date: 'Mỗi Thứ 7, Chủ Nhật',
        time: '09:00 - 21:00',
        organizer: 'Tetra Pak Việt Nam',
        description: 'Thu gom vỏ hộp sữa đã qua sử dụng để đổi lấy các sản phẩm tái chế hữu ích như sổ tay, tấm lợp sinh thái. Yêu cầu làm sạch và gấp gọn vỏ hộp.',
        image: 'https://source.unsplash.com/400x300/?milk,carton,recycling',
      },
    ],
  });

  console.log(`✅ Created ${events.count} events`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
