/* ============================================================
   Art Wealth — Calculators
   Three simple Australian calculators:
     1. Retirement balance projection
     2. Personal insurance needs
     3. Mortgage offset vs extra super
   All figures indicative only. General information, not advice.
   ============================================================ */

(function () {
  'use strict';

  // ---------- Helpers ----------
  function fmtMoney(n) {
    if (!isFinite(n)) return '$0';
    var abs = Math.abs(n);
    var rounded = Math.round(n);
    return (rounded < 0 ? '-' : '') + '$' + Math.abs(rounded).toLocaleString('en-AU');
  }
  function fmtPct(n, dp) { return (n).toFixed(dp || 1) + '%'; }

  function $(id) { return document.getElementById(id); }
  function on(id, ev, fn) { var el = $(id); if (el) el.addEventListener(ev, fn); }

  // ---------- Tab switcher ----------
  var tabs = document.querySelectorAll('.calc-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-target');
      tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
      document.querySelectorAll('.calc-panel').forEach(function (p) {
        p.classList.toggle('active', p.id === target);
      });
      // Scroll to anchor
      if (history.replaceState) {
        history.replaceState(null, '', '#' + target);
      }
    });
  });

  // Open via hash on load
  var hash = window.location.hash ? window.location.hash.slice(1) : '';
  if (hash && document.getElementById(hash) && document.getElementById(hash).classList.contains('calc-panel')) {
    tabs.forEach(function (t) {
      var match = t.getAttribute('data-target') === hash;
      t.classList.toggle('active', match);
    });
    document.querySelectorAll('.calc-panel').forEach(function (p) {
      p.classList.toggle('active', p.id === hash);
    });
  }

  // ---------- 1. RETIREMENT PROJECTION ----------
  function calcRetirement() {
    var age      = +$('r-age').value;
    var retire   = +$('r-retire').value;
    var salary   = +$('r-salary').value;
    var balance  = +$('r-balance').value;
    var extra    = +$('r-extra').value;
    var ret      = +$('r-return').value / 100;

    if (retire <= age) retire = age + 1;

    var years = retire - age;
    var months = years * 12;
    var monthlyRate = ret / 12;

    var sgRate = 0.12;                  // 12% from 1 July 2025
    var contribTax = 0.15;              // contributions tax
    var sgMonthly = (salary * sgRate) * (1 - contribTax) / 12;
    var extraMonthly = extra * (1 - contribTax) / 12;
    var contribMonthly = sgMonthly + extraMonthly;

    var bal = balance;
    var totalSG = 0;
    var totalExtra = 0;
    for (var i = 0; i < months; i++) {
      bal = bal * (1 + monthlyRate) + contribMonthly;
      totalSG += sgMonthly;
      totalExtra += extraMonthly;
    }

    var growth = bal - balance - totalSG - totalExtra;
    var income = bal * 0.04; // 4% rule

    $('r-age-val').textContent      = age;
    $('r-retire-val').textContent   = retire;
    $('r-salary-val').textContent   = fmtMoney(salary);
    $('r-balance-val').textContent  = fmtMoney(balance);
    $('r-extra-val').textContent    = fmtMoney(extra);
    $('r-return-val').textContent   = fmtPct(ret * 100);

    $('r-balance-out').textContent  = fmtMoney(bal);
    $('r-income-out').textContent   = 'Roughly ' + fmtMoney(income) + ' / year of retirement income';
    $('r-years-out').textContent    = years;
    $('r-sg-out').textContent       = fmtMoney(totalSG);
    $('r-add-out').textContent      = fmtMoney(totalExtra);
    $('r-growth-out').textContent   = fmtMoney(growth);
  }

  ['r-age','r-retire','r-salary','r-balance','r-extra','r-return']
    .forEach(function (id) { on(id, 'input', calcRetirement); });

  if ($('r-age')) calcRetirement();

  // ---------- 2. INSURANCE NEEDS ----------
  function calcInsurance() {
    var income   = +$('i-income').value;
    var years    = +$('i-years').value;
    var debt     = +$('i-debt').value;
    var kids     = +$('i-kids').value;
    var kidcost  = +$('i-kidcost').value;
    var buffer   = +$('i-buffer').value;
    var existing = +$('i-existing').value;

    var incomeRep = income * years;
    var kidsTotal = kids * kidcost;
    var gross = incomeRep + debt + kidsTotal + buffer;
    var lifeNeeded = Math.max(0, gross - existing);

    // IP — 70% of pre-tax income; convert after-tax to pre-tax roughly via /0.68
    // (keeps it conservative; assumes ~32% effective tax)
    var preTax = income / 0.68;
    var monthlyIP = (preTax * 0.70) / 12;

    $('i-income-val').textContent   = fmtMoney(income);
    $('i-years-val').textContent    = years;
    $('i-debt-val').textContent     = fmtMoney(debt);
    $('i-kids-val').textContent     = kids;
    $('i-kidcost-val').textContent  = fmtMoney(kidcost);
    $('i-buffer-val').textContent   = fmtMoney(buffer);
    $('i-existing-val').textContent = fmtMoney(existing);

    $('i-life-out').textContent       = fmtMoney(lifeNeeded);
    $('i-increp-out').textContent     = fmtMoney(incomeRep);
    $('i-debtout-out').textContent    = fmtMoney(debt);
    $('i-kidsout-out').textContent    = fmtMoney(kidsTotal);
    $('i-bufferout-out').textContent  = fmtMoney(buffer);
    $('i-existingout-out').textContent= '-' + fmtMoney(existing).replace('-','');
    $('i-ip-out').textContent         = fmtMoney(monthlyIP);
  }

  ['i-income','i-years','i-debt','i-kids','i-kidcost','i-buffer','i-existing']
    .forEach(function (id) { on(id, 'input', calcInsurance); });

  if ($('i-income')) calcInsurance();

  // ---------- 3. MORTGAGE OFFSET vs EXTRA SUPER ----------
  function calcOffset() {
    var amount = +$('o-amount').value;          // spare cashflow per year (after-tax)
    var years  = +$('o-years').value;
    var rate   = +$('o-rate').value / 100;      // mortgage rate
    var mtr    = +$('o-mtr').value;             // marginal tax rate (decimal)
    var sret   = +$('o-super').value / 100;     // super return

    // Path A: into offset
    // Each year, deposit `amount` (after-tax) into offset
    // It "earns" mortgage rate (tax-free saving on interest)
    // Future value of an annuity, monthly compounding
    var monthlyOffsetRate = rate / 12;
    var monthlyDeposit = amount / 12;
    var months = years * 12;
    var offsetFV = monthlyDeposit * (Math.pow(1 + monthlyOffsetRate, months) - 1) / monthlyOffsetRate;

    // Path B: into super (gross)
    // Salary sacrificing $X requires forgoing $X gross income
    // After-tax cost of $X gross = X * (1 - mtr)
    // To match "amount" of after-tax cashflow, super contribution gross = amount / (1 - mtr)
    // Net into super after 15% contributions tax = grossContrib * 0.85
    var grossContrib = amount / (1 - mtr);
    var netIntoSuper = grossContrib * 0.85;
    var monthlySuperDeposit = netIntoSuper / 12;
    var monthlySuperRate = sret / 12;
    var superFV = monthlySuperDeposit * (Math.pow(1 + monthlySuperRate, months) - 1) / monthlySuperRate;

    // UI update
    $('o-amount-val').textContent  = fmtMoney(amount);
    $('o-years-val').textContent   = years;
    $('o-rate-val').textContent    = fmtPct(rate * 100);
    $('o-mtr-val').textContent     = Math.round(mtr * 100) + '%';
    $('o-super-val').textContent   = fmtPct(sret * 100);
    $('o-yearslabel').textContent  = years;

    $('o-offset-out').textContent     = fmtMoney(offsetFV);
    $('o-superout-out').textContent   = fmtMoney(superFV);
    $('o-offset-net-out').textContent = fmtMoney(amount) + ' (after-tax)';
    $('o-super-net-out').textContent  = fmtMoney(grossContrib) + ' (' + fmtMoney(netIntoSuper) + ' after 15% tax)';

    var diff = superFV - offsetFV;
    if (Math.abs(diff) < 500) {
      $('o-winner').textContent = 'Roughly even';
      $('o-diff-out').textContent = 'The two strategies produce similar outcomes — other factors matter most.';
    } else if (diff > 0) {
      $('o-winner').textContent = 'Super wins';
      $('o-diff-out').textContent = 'Super is ahead by ' + fmtMoney(diff) + ' — but funds are locked until preservation age.';
    } else {
      $('o-winner').textContent = 'Offset wins';
      $('o-diff-out').textContent = 'Offset is ahead by ' + fmtMoney(-diff) + ' — and you keep full access to the money.';
    }
  }

  ['o-amount','o-years','o-rate','o-mtr','o-super']
    .forEach(function (id) { on(id, 'input', calcOffset); on(id, 'change', calcOffset); });

  if ($('o-amount')) calcOffset();

})();
