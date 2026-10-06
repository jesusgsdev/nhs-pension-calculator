# NHS England Nurse & Midwife Pay and Pension Calculator

A specialized, comprehensive salary and pension calculator engineered for **NHS England Registered Nurses and Midwives**.

## Features

### 1. Agenda for Change (AfC) Pay & Progression
- **Bands 5 to 9**: Built with current 2025/26 Agenda for Change pay circular scales.
- **Pay Step Points**: Supports Entry (< 2 years), Intermediate (2–4/5 years), and Top of Band (4+ or 5+ years) increments.
- **Career History Timeline**: Add and configure multiple career eras (e.g. Band 5 Staff Nurse for 4 years $\to$ Band 6 Deputy Sister for 5 years $\to$ Band 7 Ward Sister for 15 years).
- **High Cost Area Supplement (HCAS)**:
  - Inner London (20%, min £5,323, max £8,085)
  - Outer London (15%, min £4,457, max £5,582)
  - Fringe (5%, min £1,224, max £2,137)
  - National & Custom % options

### 2. Shift Schedules & Working Hours
- **Regular Hours**: Standard 37.5h 5-day week (e.g. 08:00 to 16:00 with 30-min break).
- **Rotational 11.5-Hour Long Shifts**: Day shifts (08:00–20:00) and night shifts (20:00–08:00) with 30-min break (~13 shifts per 4-week rota).
- **Compressed Hours**: 37.5 hours worked across 4 days (e.g. 4 × 9.375h).
- **Part-Time & Flexible FTE**: Automatic pro-rata calculation.
- **Agenda for Change Section 2 Unsocial Hours**:
  - Nights (20:00–06:00) and Saturdays: +30% enhancement
  - Sundays and Bank Holidays: +60% enhancement
  - Contractual pensionable enhancements correctly included in annual pensionable pay.

### 3. NHS Pension Schemes (1995, 2008 & 2015)
- **1995 Section**: Final Salary scheme with 1/80th accrual and automatic 3× lump sum.
- **Special Class Status (SCS)**: Historical status for female nurses and midwives who joined before 6 March 1995, allowing unreduced retirement at **age 55**!
- **2008 Section**: Final Salary scheme with 1/60th accrual and NPA 65.
- **2015 Scheme (CARE)**: Career Average Revalued Earnings with 1/54th accrual, compounded in-service revaluation of Treasury Order CPI + 1.5%, and NPA matching UK State Pension Age.
- **The McCloud Remedy (DCU)**: Evaluates the 1 April 2015 to 31 March 2022 remedy window, displaying a side-by-side comparison between legacy and 2015 CARE benefits.

### 4. Pension Boosting & Retirement Planner
- **ERRBO (Early Retirement Reduction Buy Out)**: 1, 2, or 3 years bought out in the 2015 scheme down to age 65.
- **Additional Pension (AP)**: Purchases of guaranteed, index-linked annual pension in multiples of £250.
- **Added Years**: Legacy 1995 contracts.
- **Retirement Age Slider**: Explore retirement from age 55 to 70 with live actuarial reduction and enhancement factors.
- **Cash Commutation**: Exchange £1 of annual taxable pension for £12 of tax-free cash (up to HMRC 25% capital limit and £268,275 LSA cap).
- **Gross vs. Net Monthly Modeling**: Applies UK Personal Allowance (£12,570), 20% basic rate, 40% higher rate, and State Pension interaction to provide an estimated net monthly take-home pension.

### 5. Role Customization & Visual Explanations
- Role switcher: **Nurse** vs. **Midwife** adjusting terminology and typical career templates (e.g. Preceptorship fast-track).
- Interactive Recharts trajectory chart displaying net monthly pension across retirement ages 55–68.
- Comprehensive in-app guide and tooltips explaining every regulatory concept in plain English.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## Deploying to GitHub Pages

This app is 100% client-side and requires **no backend server**. It is pre-configured to run on GitHub Pages:

1. **Repository**:
   `https://github.com/jesusgsdev/nhs-pension-calculator`

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub $\to$ **Settings** $\to$ **Pages** (`https://github.com/jesusgsdev/nhs-pension-calculator/settings/pages`).
   - Under **Build and deployment** $\to$ **Source**, select **GitHub Actions**.

3. **Automatic Deployment**:
   - The included workflow in `.github/workflows/deploy.yml` automatically runs tests, builds the application, and publishes it to:
     `https://jesusgsdev.github.io/nhs-pension-calculator/`
   - `vite.config.ts` uses `base: './'`, ensuring assets load correctly under repository subpaths.

