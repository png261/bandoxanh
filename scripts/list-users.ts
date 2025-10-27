import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('📋 Đang tải danh sách users...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        clerkId: true,
        isAdmin: true,
        createdAt: true,
      } as any,
      orderBy: {
        createdAt: 'desc',
      },
    }) as any[];

    if (users.length === 0) {
      console.log('❌ Không có user nào trong database');
      process.exit(0);
    }

    console.log(`✅ Tìm thấy ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      const adminBadge = user.isAdmin ? '👑 ADMIN' : '👤 User';
      const date = new Date(user.createdAt).toLocaleDateString('vi-VN');
      
      console.log(`${index + 1}. ${adminBadge}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Name: ${user.name || 'N/A'}`);
      console.log(`   🆔 Clerk ID: ${user.clerkId}`);
      console.log(`   📅 Joined: ${date}`);
      console.log('');
    });

    const adminCount = users.filter(u => u.isAdmin).length;
    console.log(`📊 Thống kê:`);
    console.log(`   Tổng users: ${users.length}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Regular users: ${users.length - adminCount}`);

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
