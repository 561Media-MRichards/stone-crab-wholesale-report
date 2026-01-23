# Stone Crab Wholesale - Paid Media Report

Interactive dashboard analyzing Google Ads month-over-month performance for Stone Crab Wholesale. Built to help determine if promotional budget is better spent on Google Ads customer acquisition vs. customer discounts.

**Live Dashboard**: https://google-ads-dashboard-5m3fw4jjp-mrichards-4873s-projects.vercel.app

---

## Project Overview

### Purpose
This report provides a comprehensive view of paid media performance to support budget allocation decisions. Key question being answered: **Should promotional dollars go toward Google Ads for new customer acquisition, or toward discounts for existing customers?**

### Key Findings (All-Time)
| Metric | Value |
|--------|-------|
| Total Ad Spend | $62,466 |
| Total Revenue | $249,521 |
| Total Conversions | 1,166 |
| **Cost Per Acquisition (CPA)** | **$54** |
| **Return on Ad Spend (ROAS)** | **3.99x** |
| Avg Order Value | $214 |

**Interpretation**: For every $1 spent on Google Ads, the campaign generates $3.99 in revenue. Each new customer costs approximately $54 to acquire through paid ads.

---

## Data Sources & Notes

### Primary Data: Google Ads
- **Date Range**: November 2024 - January 2026
- **Source Files**: Campaign reports exported from Google Ads
- **Metrics Tracked**: Impressions, Clicks, Spend, Conversions, Conversion Value

### Data Gaps & Handling

#### Seasonal Pause (July - September 2025)
- **Status**: Intentionally paused
- **Reason**: Stone crab is a seasonal product (stone crab season runs mid-October through mid-May)
- **Display**: Shown as "Paused" with grayed styling

#### Tracking Issues (October - November 2025)
- **Problem**: Google Ads showed impressions but reported 0 or very low conversions during these months
- **Solution**: Backfilled with Shopify attribution data
- **Shopify Data Included**:
  - Google Paid (direct attribution)
  - Google Unknown (partial attribution)
  - Unattributed orders (assumed Google influence)
- **Display**: Shown with orange "Shopify" badge

### Monthly Data Summary

| Month | Impressions | Clicks | Spend | Conversions | Revenue | CPA | ROAS | Source |
|-------|-------------|--------|-------|-------------|---------|-----|------|--------|
| Nov 2024 | 7,086 | 1,027 | $2,772.90 | 115.67 | $21,975.10 | $24 | 7.92x | Google Ads |
| Dec 2024 | 46,129 | 4,735 | $12,074.25 | 483.43 | $102,185.09 | $25 | 8.46x | Google Ads |
| Jan 2025 | 51,398 | 2,955 | $9,958.35 | 93.91 | $19,989.95 | $106 | 2.01x | Google Ads |
| Feb 2025 | 26,090 | 2,283 | $7,785.03 | 122.00 | $22,666.92 | $64 | 2.91x | Google Ads |
| Mar 2025 | 32,347 | 2,835 | $7,711.20 | 81.00 | $17,481.95 | $95 | 2.27x | Google Ads |
| Apr 2025 | 13,856 | 1,094 | $3,785.24 | 54.00 | $13,224.08 | $70 | 3.49x | Google Ads |
| May 2025 | 15,338 | 1,009 | $3,723.21 | 33.00 | $7,403.30 | $113 | 1.99x | Google Ads |
| Jun 2025 | 3,132 | 161 | $507.15 | 6.00 | $925.70 | $85 | 1.83x | Google Ads |
| Jul 2025 | — | — | — | — | — | — | — | Paused |
| Aug 2025 | — | — | — | — | — | — | — | Paused |
| Sep 2025 | — | — | — | — | — | — | — | Paused |
| Oct 2025 | 7,859 | 586 | $1,324.36 | 30 | $7,982.46 | $44 | 6.03x | Shopify |
| Nov 2025 | 4,931 | 382 | $611.20 | 39 | $9,180.47 | $16 | 15.02x | Shopify |
| Dec 2025 | 35,398 | 2,348 | $9,838.12 | 80.00 | $19,623.31 | $123 | 1.99x | Google Ads |
| Jan 2026 | 11,937 | 789 | $2,374.89 | 28.00 | $6,882.48 | $85 | 2.90x | Google Ads |

---

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (561 Media brand theme)
- **Charts**: Recharts
- **Deployment**: Vercel

### Brand Colors (561 Media Theme)
| Color | Hex | Usage |
|-------|-----|-------|
| Dark Navy | `#0b2430` | Background |
| Card Background | `#132d3d` | Cards, panels |
| Secondary | `#1a3648` | Table headers |
| Orange Accent | `#EC6A2A` | CPA highlight, Shopify badge |
| Blue Accent | `#54baf8` | Spend highlight, Google Ads badge |
| Green | `#10b981` | ROAS highlight, positive growth |
| Muted Text | `#7a8f9d` | Labels, secondary text |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page (imports Dashboard)
│   ├── layout.tsx        # Root layout with fonts
│   └── globals.css       # 561 Media brand styles
├── components/
│   ├── Dashboard.tsx     # Main dashboard container
│   ├── MetricsCards.tsx  # KPI cards (Spend, CPA, ROAS)
│   ├── YearMonthFilter.tsx # Year dropdown & legend
│   ├── PerformanceChart.tsx # Recharts visualization
│   └── DataTable.tsx     # Monthly breakdown table
└── lib/
    ├── types.ts          # TypeScript interfaces
    ├── data.ts           # Monthly data array
    └── calculations.ts   # KPI calculation functions
```

---

## Updating Data

### Adding New Monthly Data

1. Edit `src/lib/data.ts`
2. Add new entry to the `monthlyData` array:

```typescript
{
  month: 'February 2026',
  year: 2026,
  monthIndex: 1,  // 0-indexed (Jan=0, Feb=1, etc.)
  impressions: 12345,
  clicks: 890,
  spend: 2500.00,
  conversions: 35.00,
  conversionValue: 8500.00,
  source: 'google_ads',  // or 'shopify' or 'paused'
},
```

3. Update `availableYears` array if adding a new year

### Calculating Spend from Campaign Reports
Spend is calculated as: `Clicks × Avg. CPC`

Example from CSV:
```
Clicks: 789
Avg. CPC: $3.01
Spend: 789 × 3.01 = $2,374.89
```

---

## Development

### Local Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Deployment
Push to `main` branch triggers automatic Vercel deployment, or manually:
```bash
vercel --prod
```

---

## Changelog

### v1.0.0 - January 23, 2026
**Initial Release**
- Built interactive MOM performance dashboard
- Added primary acquisition metrics (Total Spend, CPA, ROAS)
- Added secondary metrics (Revenue, Conversions, Clicks, Impressions, AOV, Conv Rate)
- Created monthly data table with per-month CPA and ROAS
- Integrated Shopify attribution data for Oct-Nov 2025 tracking gap
- Applied 561 Media dark theme branding
- Added year filtering functionality
- Deployed to Vercel

**Data Notes:**
- Google Ads data: Nov 2024 - Jun 2025, Dec 2025 - Jan 2026
- Shopify backfill: Oct - Nov 2025 (tracking issues)
- Paused months: Jul - Sep 2025 (seasonal product)

---

## Client Information

| Field | Value |
|-------|-------|
| Client | Stone Crab Wholesale |
| Agency | 561 Media |
| Campaign Name | 561\| SEM \| CPA \| US |
| Product Type | Seasonal (Stone Crab - Oct to May) |
| Logo | [Stone Crab Wholesale Logo](https://cdn.shopify.com/s/files/1/0828/1214/1878/files/Stone-Crab-Whosale-Logo-Hori-white.png) |

---

## Links

- **Live Dashboard**: https://google-ads-dashboard-5m3fw4jjp-mrichards-4873s-projects.vercel.app
- **GitHub Repository**: https://github.com/561Media-MRichards/stone-crab-wholesale-report
- **Vercel Project**: https://vercel.com/mrichards-4873s-projects/google-ads-dashboard

---

## Contact

For questions about this report or data updates, contact 561 Media.
