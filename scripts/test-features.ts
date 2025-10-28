/**
 * Test script để kiểm tra các tính năng chính của website
 * Chạy: npx tsx scripts/test-features.ts
 */

const BASE_URL = 'http://localhost:3002';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message?: string;
  error?: string;
}

const results: TestResult[] = [];

function logResult(result: TestResult) {
  const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
  console.log(`${icon} ${result.name}`);
  if (result.message) console.log(`   → ${result.message}`);
  if (result.error) console.log(`   ⚠️  ${result.error}`);
  results.push(result);
}

async function testAPI(endpoint: string, expectedStatus: number = 200) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (response.status === expectedStatus) {
      return { success: true, data: await response.json() };
    }
    return { success: false, error: `Status ${response.status}` };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function runTests() {
  console.log('🧪 Bắt đầu kiểm tra tính năng...\n');
  console.log('='.repeat(60));
  console.log('📡 API ENDPOINTS');
  console.log('='.repeat(60));

  // Test Stations API
  const stationsTest = await testAPI('/api/stations');
  logResult({
    name: 'GET /api/stations - Lấy danh sách điểm thu gom',
    status: stationsTest.success ? 'PASS' : 'FAIL',
    message: stationsTest.success ? `Found ${stationsTest.data?.length || 0} stations` : undefined,
    error: stationsTest.error
  });

  // Test Events API
  const eventsTest = await testAPI('/api/events');
  logResult({
    name: 'GET /api/events - Lấy danh sách sự kiện',
    status: eventsTest.success ? 'PASS' : 'FAIL',
    message: eventsTest.success ? `Found ${eventsTest.data?.length || 0} events` : undefined,
    error: eventsTest.error
  });

  // Test News API
  const newsTest = await testAPI('/api/news');
  logResult({
    name: 'GET /api/news - Lấy danh sách tin tức',
    status: newsTest.success ? 'PASS' : 'FAIL',
    message: newsTest.success ? `Found ${newsTest.data?.length || 0} news articles` : undefined,
    error: newsTest.error
  });

  // Test Posts API
  const postsTest = await testAPI('/api/posts');
  logResult({
    name: 'GET /api/posts - Lấy danh sách bài viết cộng đồng',
    status: postsTest.success ? 'PASS' : 'FAIL',
    message: postsTest.success ? `Found ${postsTest.data?.length || 0} posts` : undefined,
    error: postsTest.error
  });

  // Test Gemini API (identify)
  console.log('\n' + '='.repeat(60));
  console.log('🤖 AI FEATURES');
  console.log('='.repeat(60));

  logResult({
    name: 'Gemini AI Integration',
    status: process.env.GEMINI_API_KEY ? 'PASS' : 'FAIL',
    message: process.env.GEMINI_API_KEY ? 'API key configured' : 'Missing GEMINI_API_KEY',
  });

  // Test Supabase Storage
  console.log('\n' + '='.repeat(60));
  console.log('📦 STORAGE');
  console.log('='.repeat(60));

  logResult({
    name: 'Supabase Storage - Public Config',
    status: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'PASS' : 'FAIL',
    message: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing env vars',
  });

  logResult({
    name: 'Supabase Storage - Service Role Key',
    status: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PASS' : 'FAIL',
    message: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured for admin uploads' : 'Missing SUPABASE_SERVICE_ROLE_KEY',
  });

  // Test Authentication
  console.log('\n' + '='.repeat(60));
  console.log('🔐 AUTHENTICATION');
  console.log('='.repeat(60));

  logResult({
    name: 'Clerk Authentication',
    status: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY ? 'PASS' : 'FAIL',
    message: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Configured' : 'Missing Clerk keys',
  });

  // Test Database
  console.log('\n' + '='.repeat(60));
  console.log('💾 DATABASE');
  console.log('='.repeat(60));

  logResult({
    name: 'Prisma Database Connection',
    status: process.env.DATABASE_URL ? 'PASS' : 'FAIL',
    message: process.env.DATABASE_URL ? 'Configured' : 'Missing DATABASE_URL',
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📈 Total: ${results.length}`);
  console.log(`🎯 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n⚠️  CÓ LỖI CẦN KHẮC PHỤC!');
    process.exit(1);
  } else {
    console.log('\n🎉 TẤT CẢ TESTS ĐỀU PASSED!');
    process.exit(0);
  }
}

runTests().catch(console.error);
