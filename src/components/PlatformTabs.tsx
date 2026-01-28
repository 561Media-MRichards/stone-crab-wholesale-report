'use client';

import { PlatformFilter } from '@/lib/types';
import { PLATFORM_COLORS, PLATFORM_FILTER_LABELS } from '@/lib/constants';

interface PlatformTabsProps {
  selectedPlatform: PlatformFilter;
  onPlatformChange: (platform: PlatformFilter) => void;
}

const platforms: PlatformFilter[] = ['all', 'google_ads', 'meta_ads'];

export function PlatformTabs({ selectedPlatform, onPlatformChange }: PlatformTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {platforms.map((platform) => {
        const isSelected = selectedPlatform === platform;
        const color = platform === 'all' ? '#7a8f9d' : PLATFORM_COLORS[platform];

        return (
          <button
            key={platform}
            onClick={() => onPlatformChange(platform)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? 'text-white border-2'
                : 'text-[#7a8f9d] bg-[#132d3d] border border-white/10 hover:bg-[#1a3648]'
            }`}
            style={{
              backgroundColor: isSelected ? `${color}20` : undefined,
              borderColor: isSelected ? color : undefined,
              color: isSelected ? color : undefined,
            }}
          >
            {platform !== 'all' && (
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: color }}
              />
            )}
            {PLATFORM_FILTER_LABELS[platform]}
          </button>
        );
      })}
    </div>
  );
}
