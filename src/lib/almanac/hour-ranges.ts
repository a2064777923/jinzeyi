const HOUR_RANGE_BY_BRANCH: Record<string, string> = {
  子: '23:00-00:59',
  丑: '01:00-02:59',
  寅: '03:00-04:59',
  卯: '05:00-06:59',
  辰: '07:00-08:59',
  巳: '09:00-10:59',
  午: '11:00-12:59',
  未: '13:00-14:59',
  申: '15:00-16:59',
  酉: '17:00-18:59',
  戌: '19:00-20:59',
  亥: '21:00-22:59',
};

export function getModernHourRange(hourName: string): string {
  const branch = hourName.trim().charAt(0);
  return HOUR_RANGE_BY_BRANCH[branch] ?? '';
}
