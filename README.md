# Investment Property Calculator

A comprehensive web application designed to help loan officers and real estate investors analyze investment properties, calculate potential returns, and determine loan eligibility.

## Features

### Property & Loan Analysis
- Purchase price and down payment calculations
- Loan amount and monthly mortgage payment calculations
- Support for various property types (single-family, multi-family, condo, townhouse)

### Income Analysis
- Monthly rental income projections
- Other income sources (parking, laundry, storage)
- Vacancy rate adjustments for realistic income estimates

### Expense Breakdown
- Property taxes
- Insurance costs
- HOA fees
- Maintenance reserves
- Property management fees
- Utilities (if landlord-paid)
- Capital expenditure (CapEx) reserves

### Closing Costs & Fees
- Loan origination fees
- Appraisal and inspection fees
- Title insurance
- Escrow and attorney fees
- Recording fees

### Investment Metrics
- **DSCR (Debt Service Coverage Ratio)** - Critical metric for loan approval
- **Cap Rate** - Net Operating Income / Purchase Price
- **Cash-on-Cash Return** - Annual cash flow / Total cash invested
- **Total ROI** - Including equity buildup
- **Gross Rent Multiplier (GRM)**
- **Break-Even Ratio**

### Loan Approval Assessment
- Clear pass/fail indicators for loan eligibility
- Status indicators for cash flow, DSCR, and cap rate
- Actionable recommendations and warnings
- Loan officer checklist for quick review

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Nsull042790/Investment-Property-Benefit-Calculator.git

# Navigate to project directory
cd Investment-Property-Benefit-Calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling

## Usage

1. Enter property details (purchase price, down payment, interest rate, loan term)
2. Input expected rental income and vacancy rate
3. Fill in operating expenses (taxes, insurance, HOA, maintenance, etc.)
4. Review closing costs and fees
5. Analyze the results:
   - Check the Loan Approval Assessment for a quick pass/fail verdict
   - Review Investment Metrics for detailed return analysis
   - Examine Cash Flow Analysis for monthly/annual projections

## Key Metrics Explained

### DSCR (Debt Service Coverage Ratio)
The most important metric for investment property loan approval. Measures the property's ability to cover its debt obligations.
- ≥ 1.50: Excellent
- 1.25-1.49: Good
- 1.00-1.24: Marginal (may need higher down payment)
- < 1.00: Insufficient (loan unlikely to be approved)

### Cap Rate
Measures return on the property independent of financing.
- ≥ 10%: Excellent
- 7-9.9%: Good
- 5-6.9%: Fair
- < 5%: Poor

### Cash-on-Cash Return
Measures annual return on actual cash invested.
- ≥ 12%: Strong
- 8-11.9%: Good
- 5-7.9%: Fair
- < 5%: Consider alternatives

## License

MIT License

