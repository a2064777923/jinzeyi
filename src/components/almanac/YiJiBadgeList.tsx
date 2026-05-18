import { getLocale } from 'next-intl/server';
import {
  Check,
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
  X,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { convertToTraditional } from '@/lib/opencc';

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
  density?: 'compact' | 'comfortable';
  className?: string;
}

export async function YiJiBadgeList({
  items,
  type,
  density = 'compact',
  className,
}: YiJiBadgeListProps) {
  const locale = await getLocale();
  const localize = (value: string) =>
    locale === 'zh-hant' ? convertToTraditional(value) : value;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => {
        const Icon = YI_JI_ICONS[item];
        const StatusIcon = type === 'yi' ? Check : X;
        const label = localize(item);

        return (
          <Badge
            key={item}
            variant="outline"
            className={cn(
              'h-auto rounded-md border px-2.5 font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5',
              density === 'comfortable' ? 'py-1.5 text-sm' : 'py-1 text-xs',
              type === 'yi'
                ? 'border-lucky/35 bg-lucky/14 text-lucky shadow-lucky/10 hover:bg-lucky/18'
                : 'border-ominous/40 bg-ominous/14 text-ominous shadow-ominous/10 hover:bg-ominous/18'
            )}
          >
            <StatusIcon className="mr-1 size-3.5 shrink-0 stroke-[2.6]" aria-hidden="true" />
            {Icon && <Icon className="mr-1 size-3.5 shrink-0 stroke-[2.4]" aria-hidden="true" />}
            {label}
          </Badge>
        );
      })}
    </div>
  );
}
