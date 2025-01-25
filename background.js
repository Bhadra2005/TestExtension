const GRAPHQL_URL = 'https://leetcode.com/graphql';

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'fetchStats') {
    const username = message.username;

    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `;
    const variables = { username };

    fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.data && data.data.matchedUser) {
          // Extract the count of problems solved by difficulty
          const solvedProblems = data.data.matchedUser.submitStatsGlobal.acSubmissionNum;

          const easySolved = solvedProblems.find(difficulty => difficulty.difficulty === 'Easy')?.count || 0;
          const mediumSolved = solvedProblems.find(difficulty => difficulty.difficulty === 'Medium')?.count || 0;
          const hardSolved = solvedProblems.find(difficulty => difficulty.difficulty === 'Hard')?.count || 0;
          const totalSolved = easySolved + mediumSolved + hardSolved;

          // Send the fetched data to the popup
          chrome.runtime.sendMessage({
            type: 'userStats',
            easySolved,
            mediumSolved,
            hardSolved,
            totalSolved
          });
        } else {
          chrome.runtime.sendMessage({ type: 'userStats', easySolved: 'User not found' });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        chrome.runtime.sendMessage({ type: 'userStats', easySolved: 'Error fetching data' });
      });
  }
});
