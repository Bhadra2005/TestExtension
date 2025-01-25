document.getElementById('fetchStats').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
  
    if (username) {
      // Send the username to the background script
      chrome.runtime.sendMessage({ type: 'fetchStats', username: username });
    } else {
      document.getElementById('totalSolved').textContent = 'Please enter a username.';
    }
  });
  
  // Listen for the response from the background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'userStats') {
      // Display total solved problems
      document.getElementById('totalSolved').textContent = `Total Problems Solved: ${message.totalSolved}`;
  
      // Display solved problems by difficulty
      document.getElementById('easySolved').textContent = `Easy Problems Solved: ${message.easySolved}`;
      document.getElementById('mediumSolved').textContent = `Medium Problems Solved: ${message.mediumSolved}`;
      document.getElementById('hardSolved').textContent = `Hard Problems Solved: ${message.hardSolved}`;
    }
  });
