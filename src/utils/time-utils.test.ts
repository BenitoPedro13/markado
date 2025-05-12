import { timeStringToDate, dateToTimeString } from './time-utils';
import dayjs from '@/lib/dayjs';

describe('time-utils', () => {
  describe('timeStringToDate', () => {
    it('should convert local time to UTC correctly', () => {
      // Test case: 9:00 AM in São Paulo (UTC-3) should be 12:00 PM UTC
      const result = timeStringToDate('09:00', 'America/Sao_Paulo');
      
      // Log the result for debugging
      console.log('Input: 09:00 America/Sao_Paulo');
      console.log('Result:', result);
      console.log('Result in São Paulo:', dayjs(result).tz('America/Sao_Paulo').format('HH:mm'));
      console.log('Result in UTC:', dayjs(result).utc().format('HH:mm'));
      
      // Verify the time is correct in UTC
      expect(dayjs(result).utc().format('HH:mm')).toBe('12:00');
    });

    it('should handle different times correctly', () => {
      const testCases = [
        { input: '09:00', timezone: 'America/Sao_Paulo', expectedUTC: '12:00' },
        { input: '17:00', timezone: 'America/Sao_Paulo', expectedUTC: '20:00' },
        { input: '00:00', timezone: 'America/Sao_Paulo', expectedUTC: '03:00' },
        { input: '23:59', timezone: 'America/Sao_Paulo', expectedUTC: '02:59' },
      ];

      testCases.forEach(({ input, timezone, expectedUTC }) => {
        const result = timeStringToDate(input, timezone);
        console.log(`\nTest case: ${input} ${timezone}`);
        console.log('Result:', result);
        console.log('Result in São Paulo:', dayjs(result).tz('America/Sao_Paulo').format('HH:mm'));
        console.log('Result in UTC:', dayjs(result).utc().format('HH:mm'));
        
        expect(dayjs(result).utc().format('HH:mm')).toBe(expectedUTC);
      });
    });
  });

  describe('dateToTimeString', () => {
    it('should convert UTC time back to local time correctly', () => {
      // Create a UTC date representing 9:00 AM in São Paulo
      const utcDate = dayjs().utc().hour(12).minute(0).second(0).millisecond(0).toDate();
      
      const result = dateToTimeString(utcDate, 'America/Sao_Paulo');
      
      console.log('\nTest case: UTC to São Paulo');
      console.log('Input UTC:', dayjs(utcDate).utc().format('HH:mm'));
      console.log('Result:', result);
      
      expect(result).toBe('09:00');
    });
  });
}); 