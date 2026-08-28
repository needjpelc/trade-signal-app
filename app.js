function generateMarketData() {
  let prices = [100];
  for (let i = 1; i < 20; i++) {
    let change = (Math.random() - 0.48) * 4;
    prices.push(parseFloat((prices[i - 1] + change).toFixed(2)));
  }
  return prices;
}

function calculateRSI(prices) {
  let gains = 0, losses = 0;
  for (let i = 1; i < prices.length; i++) {
    let diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }
  let avgGain = gains / 14;
  let avgLoss = losses / 14;
  if (avgLoss === 0) return 100;
  let rs = avgGain / avgLoss;
  return Math.round(100 - (100 / (1 + rs)));
}

function calculateSignal() {
  const prices = generateMarketData();
  const rsi = calculateRSI(prices);
  
  let signalText = "WAIT / NEUTRAL";
  let signalClass = "neutral";
  let upProb = 50;

  if (rsi < 35) {
    signalText = "BUY (UP)";
    signalClass = "up";
    upProb = Math.floor(70 + Math.random() * 20);
  } else if (rsi > 65) {
    signalText = "SELL (DOWN)";
    signalClass = "down";
    upProb = Math.floor(10 + Math.random() * 20);
  } else {
    upProb = Math.floor(45 + Math.random() * 10);
  }

  document.getElementById("signal").innerText = signalText;
  document.getElementById("signal").className = "status " + signalClass;
  document.getElementById("up-prob").innerText = upProb + "%";
  document.getElementById("rsi-val").innerText = rsi;

  updateChart(prices);
}

let chartInstance = null;
function updateChart(prices) {
  const ctx = document.getElementById('marketChart').getContext('2d');
  
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: prices.map((_, i) => `T-${20 - i}`),
      datasets: [{
        label: 'Price Trend',
        data: prices,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#334155' } },
        y: { grid: { color: '#334155' } }
      }
    }
  });
}

calculateSignal();
