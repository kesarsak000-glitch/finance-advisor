import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, Target, Calendar } from 'lucide-react';

const FinanceInvestmentTracker = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    housing: '',
    utilities: '',
    food: '',
    transportation: '',
    entertainment: '',
    other: '',
    currentSavings: '',
    riskTolerance: 'moderate',
    investmentHorizon: '5-10',
    age: ''
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRecommendations = () => {
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = {
      housing: parseFloat(formData.housing) || 0,
      utilities: parseFloat(formData.utilities) || 0,
      food: parseFloat(formData.food) || 0,
      transportation: parseFloat(formData.transportation) || 0,
      entertainment: parseFloat(formData.entertainment) || 0,
      other: parseFloat(formData.other) || 0
    };

    const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
    const monthlySavings = income - totalExpenses;
    const savingsRate = income > 0 ? (monthlySavings / income) * 100 : 0;
    const currentSavings = parseFloat(formData.currentSavings) || 0;

    const allocations = {
      conservative: { stocks: 30, bonds: 50, realEstate: 10, cash: 10 },
      moderate: { stocks: 50, bonds: 30, realEstate: 15, cash: 5 },
      aggressive: { stocks: 70, bonds: 15, realEstate: 10, cash: 5 }
    };

    const allocation = allocations[formData.riskTolerance];
    const recommendations = generateRecommendations(
      formData.riskTolerance,
      formData.investmentHorizon,
      monthlySavings,
      currentSavings,
      parseInt(formData.age) || 30
    );

    const emergencyFundTarget = totalExpenses * 5;
    const emergencyFundProgress = (currentSavings / emergencyFundTarget) * 100;

    setResults({
      income,
      totalExpenses,
      monthlySavings,
      savingsRate,
      currentSavings,
      allocation,
      recommendations,
      emergencyFundTarget,
      emergencyFundProgress,
      expenses
    });
  };

  const generateRecommendations = (risk, horizon, monthlySavings, currentSavings, age) => {
    const recs = [];

    if (currentSavings < monthlySavings * 3) {
      recs.push({
        category: 'Emergency Fund',
        priority: 'High',
        action: 'Build 3-6 months of expenses in a high-yield savings account',
        allocation: Math.min(monthlySavings * 0.5, monthlySavings),
        details: 'Target: High-yield savings (4-5% APY). Recommended: Marcus, Ally, or American Express savings accounts.'
      });
    }

    if (age < 65) {
      const retirementAllocation = monthlySavings * (risk === 'aggressive' ? 0.4 : risk === 'moderate' ? 0.3 : 0.25);
      recs.push({
        category: 'Retirement (401k/IRA)',
        priority: 'High',
        action: 'Maximize tax-advantaged retirement accounts',
        allocation: retirementAllocation,
        details: risk === 'aggressive' 
          ? 'Focus on low-cost index funds: 70% stocks (VTI, VOO), 30% bonds (BND)'
          : risk === 'moderate'
          ? 'Balanced portfolio: 50% stocks (VTI, VXUS), 30% bonds (BND), 20% target-date fund'
          : 'Conservative mix: 30% stocks (VTI), 50% bonds (BND, VGIT), 20% stable value'
      });
    }

    if (monthlySavings > 500 && currentSavings > monthlySavings * 3) {
      recs.push({
        category: 'Index Funds/ETFs',
        priority: 'Medium',
        action: 'Invest in diversified index funds',
        allocation: monthlySavings * (risk === 'aggressive' ? 0.3 : risk === 'moderate' ? 0.25 : 0.15),
        details: risk === 'aggressive'
          ? 'Growth-focused: VTI (Total Market), QQQ (Tech), VGT (Technology), VXUS (International)'
          : risk === 'moderate'
          ? 'Balanced growth: VOO (S&P 500), VTI (Total Market), VXUS (International), BND (Bonds)'
          : 'Income-focused: SCHD (Dividend), VYM (High Dividend), VCIT (Corporate Bonds)'
      });
    }

    if (currentSavings > 5000 && monthlySavings > 300) {
      recs.push({
        category: 'Real Estate Investment',
        priority: 'Medium',
        action: 'Consider REITs or real estate crowdfunding',
        allocation: monthlySavings * 0.15,
        details: 'REITs: VNQ (Vanguard Real Estate), SCHH (Real Estate ETF) or platforms like Fundrise, RealtyMogul for direct investment.'
      });
    }

    if (risk === 'aggressive' && monthlySavings > 1000) {
      recs.push({
        category: 'Alternative Investments',
        priority: 'Low',
        action: 'Small allocation to growth opportunities',
        allocation: monthlySavings * 0.1,
        details: 'Consider: Small-cap growth funds (VB, IJR), sector-specific ETFs (clean energy, AI), or 5-10% in individual stocks. High risk - diversify heavily.'
      });
    }

    recs.push({
      category: 'Debt Management',
      priority: 'High',
      action: 'Prioritize high-interest debt',
      allocation: 0,
      details: 'Pay off credit cards and loans over 6% interest before investing. This guarantees a return equal to the interest rate.'
    });

    return recs;
  };

  const expenseData = results ? [
    { name: 'Housing', value: results.expenses.housing, color: '#3b82f6' },
    { name: 'Utilities', value: results.expenses.utilities, color: '#8b5cf6' },
    { name: 'Food', value: results.expenses.food, color: '#ec4899' },
    { name: 'Transportation', value: results.expenses.transportation, color: '#f59e0b' },
    { name: 'Entertainment', value: results.expenses.entertainment, color: '#10b981' },
    { name: 'Other', value: results.expenses.other, color: '#6366f1' },
  ].filter(item => item.value > 0) : [];

  const allocationData = results ? [
    { name: 'Stocks', value: results.allocation.stocks, color: '#3b82f6' },
    { name: 'Bonds', value: results.allocation.bonds, color: '#10b981' },
    { name: 'Real Estate', value: results.allocation.realEstate, color: '#f59e0b' },
    { name: 'Cash', value: results.allocation.cash, color: '#6366f1' }
  ] : [];

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'conservative': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-blue-100 text-blue-800';
      case 'aggressive': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Smart Finance & Investment Advisor</h1>
          </div>
          <p className="text-gray-600 mb-8">Get personalized investment recommendations based on your financial situation and goals</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Income & Savings
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income ($)</label>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Savings ($)</label>
                <input
                  type="number"
                  name="currentSavings"
                  value={formData.currentSavings}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Monthly Expenses</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Housing</label>
                  <input
                    type="number"
                    name="housing"
                    value={formData.housing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilities</label>
                  <input
                    type="number"
                    name="utilities"
                    value={formData.utilities}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food</label>
                  <input
                    type="number"
                    name="food"
                    value={formData.food}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transportation</label>
                  <input
                    type="number"
                    name="transportation"
                    value={formData.transportation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entertainment</label>
                  <input
                    type="number"
                    name="entertainment"
                    value={formData.entertainment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other</label>
                  <input
                    type="number"
                    name="other"
                    value={formData.other}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="150"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
              <select
                name="riskTolerance"
                value={formData.riskTolerance}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="conservative">Conservative - Lower risk, steady returns</option>
                <option value="moderate">Moderate - Balanced risk and growth</option>
                <option value="aggressive">Aggressive - Higher risk, maximum growth</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Timeline</label>
              <select
                name="investmentHorizon"
                value={formData.investmentHorizon}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="0-2">Short term (0-2 years)</option>
                <option value="3-5">Medium term (3-5 years)</option>
                <option value="5-10">Long term (5-10 years)</option>
                <option value="10+">Very long term (10+ years)</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateRecommendations}
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Generate Investment Plan
          </button>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial Overview</h2>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Monthly Income</p>
                  <p className="text-2xl font-bold text-blue-600">${results.income.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">${results.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Monthly Savings</p>
                  <p className="text-2xl font-bold text-green-600">${results.monthlySavings.toFixed(2)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{results.savingsRate.toFixed(1)}%</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-800">Emergency Fund Status</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Target: ${results.emergencyFundTarget.toFixed(2)} (5 months of expenses)
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full transition-all"
                    style={{ width: `${Math.min(results.emergencyFundProgress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {results.emergencyFundProgress.toFixed(1)}% Complete
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Expense Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended Asset Allocation</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={allocationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className={`mt-4 inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(formData.riskTolerance)}`}>
                  {formData.riskTolerance.charAt(0).toUpperCase() + formData.riskTolerance.slice(1)} Portfolio
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Personalized Investment Recommendations</h2>
              </div>
              <div className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{rec.category}</h3>
                        <p className="text-gray-600 mt-1">{rec.action}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(rec.priority)}`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    {rec.allocation > 0 && (
                      <div className="bg-blue-50 px-3 py-2 rounded-md mb-3">
                        <p className="text-sm font-semibold text-blue-800">
                          Suggested Monthly Investment: ${rec.allocation.toFixed(2)}
                        </p>
                      </div>
                    )}
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700 leading-relaxed">{rec.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Key Investment Principles
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Start early and invest consistently - even small amounts compound significantly over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Diversify across different asset classes to manage risk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Keep fees low - choose low-cost index funds and ETFs when possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Don't try to time the market - stay invested for the long term</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Rebalance your portfolio annually to maintain your target allocation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceInvestmentTracker;