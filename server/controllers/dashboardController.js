const { monthlyExpenses, monthlySavings, expenseCategoryTotals, user, loan } = require('../models/dummyData');

const getSummary = (req, res) => {
  const totalExpenses = monthlyExpenses.reduce((sum, row) => {
    const { month, ...cats } = row;
    return sum + Object.values(cats).reduce((a, b) => a + b, 0);
  }, 0);

  const currentSavings = monthlySavings[monthlySavings.length - 1].balance;

  res.json({
    user,
    totalExpenses,
    currentSavings,
    monthlyIncome: 5500,
    loanPaid: loan.loanPaid,
    loanRemaining: loan.loanRemaining,
  });
};

const getMonthlyExpenses = (req, res) => {
  res.json(monthlyExpenses);
};

const getMonthlySavings = (req, res) => {
  res.json(monthlySavings);
};

const getExpenseCategoryTotals = (req, res) => {
  const data = Object.entries(expenseCategoryTotals).map(([name, value]) => ({ name, value }));
  res.json(data);
};

const getPredictivePlan = (req, res) => {
  const categories = ['Rent', 'Utilities', 'Taxes', 'Groceries', 'Health', 'Entertainment', 'Transport'];
  const monthlyIncome = 5500;
  const months = monthlyExpenses.length;

  // Average monthly spend per category
  const avgExpenses = {};
  categories.forEach(cat => {
    avgExpenses[cat] = Math.round(
      monthlyExpenses.reduce((sum, row) => sum + (row[cat] || 0), 0) / months
    );
  });

  const currentMonthlyTotal = Object.values(avgExpenses).reduce((a, b) => a + b, 0);

  // Trim rules: how much can realistically be cut per category
  const trimRules = {
    Rent:          0,     // fixed commitment
    Taxes:         0,     // fixed commitment
    Utilities:     0.08,  // small efficiency gains
    Groceries:     0.12,  // meal planning & bulk buying
    Health:        0.10,  // reduce non-essential health spending
    Entertainment: 0.35,  // biggest discretionary cut
    Transport:     0.15,  // carpool / route optimisation
  };

  const idealExpenses = {};
  categories.forEach(cat => {
    idealExpenses[cat] = Math.round(avgExpenses[cat] * (1 - trimRules[cat]));
  });

  const idealMonthlyTotal = Object.values(idealExpenses).reduce((a, b) => a + b, 0);
  const monthlySaved     = currentMonthlyTotal - idealMonthlyTotal;
  const idealSurplus     = monthlyIncome - idealMonthlyTotal;

  // Allocate surplus: 60% to loan repayment, 40% to savings
  const loanAllocation    = Math.round(idealSurplus * 0.60);
  const savingsAllocation = Math.round(idealSurplus * 0.40);

  const loanRemaining  = loan.loanRemaining;
  const monthsToPayoff = loanAllocation > 0 ? Math.ceil(loanRemaining / loanAllocation) : null;
  const yearsToPayoff  = monthsToPayoff ? +(monthsToPayoff / 12).toFixed(1) : null;

  // Build chart-ready arrays
  const breakdown = categories.map(cat => ({
    category: cat,
    current: avgExpenses[cat],
    ideal:   idealExpenses[cat],
    saving:  avgExpenses[cat] - idealExpenses[cat],
  }));

  res.json({
    breakdown,
    currentMonthlyTotal,
    idealMonthlyTotal,
    monthlySaved,
    idealSurplus,
    loanAllocation,
    savingsAllocation,
    monthsToPayoff,
    yearsToPayoff,
    loanRemaining,
    trimRules,
  });
};

module.exports = { getSummary, getMonthlyExpenses, getMonthlySavings, getExpenseCategoryTotals, getPredictivePlan };
