import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeFirstAdmin() {
  try {
    // Lấy email từ command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.error('❌ Vui lòng cung cấp email của user cần làm admin');
      console.log('Ví dụ: npx ts-node scripts/make-first-admin.ts user@example.com');
      process.exit(1);
    }

    console.log(`🔍 Đang tìm user với email: ${email}...`);

    const user = await prisma.user.findUnique({
      where: { email },
    }) as any;

    if (!user) {
      console.error(`❌ Không tìm thấy user với email: ${email}`);
      console.log('\n💡 Danh sách users hiện có:');
      
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        } as any,
        take: 10,
      }) as any[];

      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.name}) ${u.isAdmin ? '👑 Admin' : ''}`);
      });
      
      process.exit(1);
    }

    if (user.isAdmin) {
      console.log(`ℹ️  User ${user.name} (${user.email}) đã là admin rồi!`);
      process.exit(0);
    }

    console.log(`✅ Tìm thấy user: ${user.name} (${user.email})`);
    console.log(`🔄 Đang cấp quyền admin...`);

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true } as any,
    }) as any;

    console.log(`\n🎉 Thành công! ${updatedUser.name} (${updatedUser.email}) giờ đã là admin!`);
    console.log(`\n📋 Thông tin user:`);
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Clerk ID: ${updatedUser.clerkId}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Admin: ${updatedUser.isAdmin ? '✅ Có' : '❌ Không'}`);
    console.log(`\n🚀 Bây giờ bạn có thể đăng nhập và truy cập /admin/users để quản lý admin khác!`);

  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeFirstAdmin();
