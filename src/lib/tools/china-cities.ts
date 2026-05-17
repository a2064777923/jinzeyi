export interface ChinaCity {
  id: string;
  name: string;
  province: string;
  longitude: number;
  timezone: 'UTC+8';
}

export const CHINA_CITIES: ChinaCity[] = [
  { id: 'beijing', name: '北京', province: '北京', longitude: 116.4074, timezone: 'UTC+8' },
  { id: 'shanghai', name: '上海', province: '上海', longitude: 121.4737, timezone: 'UTC+8' },
  { id: 'guangzhou', name: '广州', province: '广东', longitude: 113.2644, timezone: 'UTC+8' },
  { id: 'shenzhen', name: '深圳', province: '广东', longitude: 114.0579, timezone: 'UTC+8' },
  { id: 'hangzhou', name: '杭州', province: '浙江', longitude: 120.1551, timezone: 'UTC+8' },
  { id: 'nanjing', name: '南京', province: '江苏', longitude: 118.7969, timezone: 'UTC+8' },
  { id: 'suzhou', name: '苏州', province: '江苏', longitude: 120.5853, timezone: 'UTC+8' },
  { id: 'tianjin', name: '天津', province: '天津', longitude: 117.2000, timezone: 'UTC+8' },
  { id: 'chongqing', name: '重庆', province: '重庆', longitude: 106.5516, timezone: 'UTC+8' },
  { id: 'chengdu', name: '成都', province: '四川', longitude: 104.0665, timezone: 'UTC+8' },
  { id: 'wuhan', name: '武汉', province: '湖北', longitude: 114.3054, timezone: 'UTC+8' },
  { id: 'xian', name: '西安', province: '陕西', longitude: 108.9398, timezone: 'UTC+8' },
  { id: 'zhengzhou', name: '郑州', province: '河南', longitude: 113.6254, timezone: 'UTC+8' },
  { id: 'changsha', name: '长沙', province: '湖南', longitude: 112.9388, timezone: 'UTC+8' },
  { id: 'hefei', name: '合肥', province: '安徽', longitude: 117.2272, timezone: 'UTC+8' },
  { id: 'fuzhou', name: '福州', province: '福建', longitude: 119.2965, timezone: 'UTC+8' },
  { id: 'xiamen', name: '厦门', province: '福建', longitude: 118.0894, timezone: 'UTC+8' },
  { id: 'jinan', name: '济南', province: '山东', longitude: 117.1201, timezone: 'UTC+8' },
  { id: 'qingdao', name: '青岛', province: '山东', longitude: 120.3826, timezone: 'UTC+8' },
  { id: 'shenyang', name: '沈阳', province: '辽宁', longitude: 123.4315, timezone: 'UTC+8' },
  { id: 'dalian', name: '大连', province: '辽宁', longitude: 121.6147, timezone: 'UTC+8' },
  { id: 'changchun', name: '长春', province: '吉林', longitude: 125.3235, timezone: 'UTC+8' },
  { id: 'harbin', name: '哈尔滨', province: '黑龙江', longitude: 126.5349, timezone: 'UTC+8' },
  { id: 'shijiazhuang', name: '石家庄', province: '河北', longitude: 114.5149, timezone: 'UTC+8' },
  { id: 'taiyuan', name: '太原', province: '山西', longitude: 112.5492, timezone: 'UTC+8' },
  { id: 'hohhot', name: '呼和浩特', province: '内蒙古', longitude: 111.7492, timezone: 'UTC+8' },
  { id: 'nanchang', name: '南昌', province: '江西', longitude: 115.8582, timezone: 'UTC+8' },
  { id: 'nanning', name: '南宁', province: '广西', longitude: 108.3669, timezone: 'UTC+8' },
  { id: 'haikou', name: '海口', province: '海南', longitude: 110.3312, timezone: 'UTC+8' },
  { id: 'guiyang', name: '贵阳', province: '贵州', longitude: 106.6302, timezone: 'UTC+8' },
  { id: 'kunming', name: '昆明', province: '云南', longitude: 102.8329, timezone: 'UTC+8' },
  { id: 'lhasa', name: '拉萨', province: '西藏', longitude: 91.1409, timezone: 'UTC+8' },
  { id: 'lanzhou', name: '兰州', province: '甘肃', longitude: 103.8343, timezone: 'UTC+8' },
  { id: 'xining', name: '西宁', province: '青海', longitude: 101.7782, timezone: 'UTC+8' },
  { id: 'yinchuan', name: '银川', province: '宁夏', longitude: 106.2309, timezone: 'UTC+8' },
  { id: 'urumqi', name: '乌鲁木齐', province: '新疆', longitude: 87.6168, timezone: 'UTC+8' },
];

export function getChinaCity(id: string): ChinaCity | undefined {
  return CHINA_CITIES.find((city) => city.id === id);
}
