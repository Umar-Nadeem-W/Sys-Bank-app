const monthlyExpenses = [
  { month: 'Jan', Rent: 1200, Utilities: 185, Taxes: 340, Groceries: 460, Health: 130, Entertainment: 210, Transport: 155 },
  { month: 'Feb', Rent: 1200, Utilities: 220, Taxes: 340, Groceries: 430, Health: 250, Entertainment: 175, Transport: 140 },
  { month: 'Mar', Rent: 1200, Utilities: 195, Taxes: 340, Groceries: 475, Health: 110, Entertainment: 230, Transport: 160 },
  { month: 'Apr', Rent: 1200, Utilities: 160, Taxes: 340, Groceries: 450, Health: 190, Entertainment: 260, Transport: 170 },
  { month: 'May', Rent: 1200, Utilities: 145, Taxes: 340, Groceries: 490, Health: 120, Entertainment: 300, Transport: 185 },
  { month: 'Jun', Rent: 1200, Utilities: 200, Taxes: 340, Groceries: 510, Health: 140, Entertainment: 320, Transport: 175 },
  { month: 'Jul', Rent: 1350, Utilities: 230, Taxes: 340, Groceries: 530, Health: 160, Entertainment: 280, Transport: 190 },
  { month: 'Aug', Rent: 1350, Utilities: 240, Taxes: 340, Groceries: 505, Health: 135, Entertainment: 255, Transport: 195 },
  { month: 'Sep', Rent: 1350, Utilities: 195, Taxes: 340, Groceries: 480, Health: 175, Entertainment: 220, Transport: 180 },
  { month: 'Oct', Rent: 1350, Utilities: 175, Taxes: 340, Groceries: 465, Health: 200, Entertainment: 190, Transport: 165 },
  { month: 'Nov', Rent: 1350, Utilities: 210, Taxes: 340, Groceries: 520, Health: 155, Entertainment: 240, Transport: 170 },
  { month: 'Dec', Rent: 1350, Utilities: 250, Taxes: 340, Groceries: 590, Health: 130, Entertainment: 380, Transport: 180 },
];

const monthlySavings = [
  { month: 'Jan', balance: 8200 },
  { month: 'Feb', balance: 8750 },
  { month: 'Mar', balance: 9100 },
  { month: 'Apr', balance: 9480 },
  { month: 'May', balance: 9820 },
  { month: 'Jun', balance: 10150 },
  { month: 'Jul', balance: 10500 },
  { month: 'Aug', balance: 11200 },
  { month: 'Sep', balance: 11850 },
  { month: 'Oct', balance: 12300 },
  { month: 'Nov', balance: 12950 },
  { month: 'Dec', balance: 13600 },
];

const expenseCategoryTotals = monthlyExpenses.reduce((acc, row) => {
  const { month, ...cats } = row;
  Object.entries(cats).forEach(([cat, val]) => {
    acc[cat] = (acc[cat] || 0) + val;
  });
  return acc;
}, {});

const user = {
  name: 'Umar',
  accountNumber: 'PK36MEZN0001234567890',
  accountType: 'Premium Current Account',
};

module.exports = { monthlyExpenses, monthlySavings, expenseCategoryTotals, user };
