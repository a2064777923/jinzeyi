export interface DailyAlmanac {
  solar: {
    year: number;
    month: number;
    day: number;
  };
  lunar: {
    year: string;      // e.g., "丙午年"
    month: string;     // e.g., "四月"
    day: string;       // e.g., "初一"
    lunarDate: string; // full lunar date string, e.g., "农历丙午年四月初一"
  };
  ganZhi: {
    year: string;   // e.g., "丙午"
    month: string;  // e.g., "癸巳"
    day: string;    // e.g., "辛卯"
  };
  zodiac: string;     // e.g., "兔"
  yi: string[];       // 宜 (recommended activities)
  ji: string[];       // 忌 (activities to avoid)
  direction: {
    chong: string;    // 冲煞方位 (opposite earthly branch)
    sha: string;      // 煞 (ominous direction)
    caiShen: string;  // 财神方位 (wealth god direction)
    xiShen: string;   // 喜神方位 (joy god direction)
    fuShen: string;   // 福神方位 (mascot god direction)
  };
  gods: string[];     // 吉神凶煞
  duty: string;       // 值神 (duty officer)
  twentyEightStar: string; // 二十八星宿
  pengZu: string;     // 彭祖百忌
  sound: string;      // 纳音
  fetusDay: string;   // 胎神
}

export interface HourlyFortune {
  name: string;       // 时辰名 (e.g., "子时")
  ganZhi: string;     // 干支 (e.g., "戊子")
  star: string;       // 星神 (e.g., "金匮")
  fortune: '吉' | '凶';
  yi: string[];       // 宜
  ji: string[];       // 忌
}

export interface CalendarDay {
  solarDay: number;      // 1-31
  lunarDay: string;      // 初一, 十五, ...
  fortune: '吉' | '凶';
  isToday: boolean;
  dateStr: string;       // YYYY-MM-DD
  weekday: number;       // 0=Sun, 6=Sat
}

export interface SolarTerm {
  name: string;       // 节气名 (e.g., "立春")
  date: string;       // YYYY-MM-DD
  isJie: boolean;     // true=节, false=气
  year: number;
}
