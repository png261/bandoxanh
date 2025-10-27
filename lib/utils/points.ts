// User Title/Rank System
export const USER_TITLES = [
  { level: 1, title: 'Người mới', minPoints: 0, color: 'text-gray-600' },
  { level: 2, title: 'Thành viên', minPoints: 100, color: 'text-blue-600' },
  { level: 3, title: 'Chiến binh xanh', minPoints: 300, color: 'text-green-600' },
  { level: 4, title: 'Bảo vệ môi trường', minPoints: 600, color: 'text-emerald-600' },
  { level: 5, title: 'Chuyên gia tái chế', minPoints: 1000, color: 'text-teal-600' },
  { level: 6, title: 'Đại sứ xanh', minPoints: 1500, color: 'text-cyan-600' },
  { level: 7, title: 'Huyền thoại xanh', minPoints: 2500, color: 'text-purple-600' },
  { level: 8, title: 'Siêu sao môi trường', minPoints: 4000, color: 'text-pink-600' },
  { level: 9, title: 'Thiên thần xanh', minPoints: 6000, color: 'text-indigo-600' },
  { level: 10, title: 'Thần tái chế', minPoints: 10000, color: 'text-amber-600' },
];

// Point system
export const POINTS_CONFIG = {
  POST_CREATE: 10,
  POST_LIKE_RECEIVED: 2,
  COMMENT_CREATE: 5,
  BADGE_EARNED: 50,
  EVENT_ATTENDED: 30,
  EVENT_INTERESTED: 5,
  DAILY_LOGIN: 5,
  WASTE_IDENTIFIED: 15,
};

/**
 * Calculate user level and title based on points
 */
export function calculateUserLevel(points: number): { level: number; title: string; color: string; nextTitle?: string; pointsToNext?: number } {
  let userTitle = USER_TITLES[0];
  let nextTitle: typeof USER_TITLES[0] | undefined;

  for (let i = USER_TITLES.length - 1; i >= 0; i--) {
    if (points >= USER_TITLES[i].minPoints) {
      userTitle = USER_TITLES[i];
      nextTitle = USER_TITLES[i + 1];
      break;
    }
  }

  const result: any = {
    level: userTitle.level,
    title: userTitle.title,
    color: userTitle.color,
  };

  if (nextTitle) {
    result.nextTitle = nextTitle.title;
    result.pointsToNext = nextTitle.minPoints - points;
  }

  return result;
}

/**
 * Award points to a user and update their level/title
 */
export async function awardPoints(userId: number, points: number, reason: string) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });

    if (!user) throw new Error('User not found');

    const newPoints = user.points + points;
    const { level, title } = calculateUserLevel(newPoints);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        points: newPoints,
        level,
        title,
      },
    });

    // Create notification for level up
    if (updatedUser.level > user.points && level > updatedUser.level) {
      await prisma.notification.create({
        data: {
          userId,
          type: 'level_up',
          title: 'Chúc mừng! Bạn đã lên cấp!',
          message: `Bạn đã đạt danh hiệu "${title}"! Tiếp tục phát huy nhé!`,
        },
      });
    }

    return updatedUser;
  } finally {
    await prisma.$disconnect();
  }
}
