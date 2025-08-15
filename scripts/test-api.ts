import APITester from '../src/lib/test-api'

async function main() {
  console.log('🧪 Form Builder API Test Suite')
  console.log('================================\n')
  
  const tester = new APITester()
  await tester.runAllTests()
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

export default main