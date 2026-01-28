export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getCurrentTime(request: Request): number {
  const testMode = process.env.TEST_MODE === '1';
  
  if (testMode) {
    const testNowHeader = request.headers.get('x-test-now-ms');
    if (testNowHeader) {
      return parseInt(testNowHeader, 10);
    }
  }
  
  return Date.now();
}