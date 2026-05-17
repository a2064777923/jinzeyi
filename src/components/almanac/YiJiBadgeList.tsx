import {
  Heart,
  Truck,
  Handshake,
  Store,
  Shovel,
  Wrench,
  Flower2,
  Flame,
  MapPin,
  BedSingle,
  Gift,
  FileText,
  Sprout,
  Pickaxe,
  Cross,
  Home,
  Frame,
  Baby,
  Users,
  Droplets,
  Scissors,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const YI_JI_ICONS: Record<string, LucideIcon> = {
  '嫁娶': Heart,
  '移徙': Truck,
  '交易': Handshake,
  '開市': Store,
  '开市': Store,
  '動土': Shovel,
  '动土': Shovel,
  '修造': Wrench,
  '祈福': Flower2,
  '祭祀': Flame,
  '出行': MapPin,
  '安床': BedSingle,
  '納采': Gift,
  '纳采': Gift,
  '立券': FileText,
  '栽種': Sprout,
  '栽种': Sprout,
  '破土': Pickaxe,
  '安葬': Cross,
  '入宅': Home,
  '掛匾': Frame,
  '挂匾': Frame,
  '求嗣': Baby,
  '會友': Users,
  '会友': Users,
  '沐浴': Droplets,
  '剃頭': Scissors,
  '剃头': Scissors,
};

interface YiJiBadgeListProps {
  items: string[];
  type: 'yi' | 'ji';
}

export function YiJiBadgeList({ items, type }: YiJiBadgeListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = YI_JI_ICONS[item];
        return type === 'yi' ? (
          <Badge
            key={item}
            variant="outline"
            className="bg-gold/10 text-gold border-gold/20 rounded-full"
          >
            {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
            {item}
          </Badge>
        ) : (
          <Badge
            key={item}
            variant="secondary"
            className="rounded-full"
          >
            {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
            {item}
          </Badge>
        );
      })}
    </div>
  );
}
