document.getElementById('fetchStats').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert("Please enter a LeetCode username.");
        return;
    }

    const GRAPHQL_URL = 'https://leetcode.com/graphql';
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

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables })
        });

        const data = await response.json();
        if (!data.data.matchedUser) {
            document.getElementById('stats').innerHTML = `<p>User not found.</p>`;
            return;
        }

        const stats = data.data.matchedUser.submitStatsGlobal.acSubmissionNum;
        const totalSolved = stats.find(d => d.difficulty === "All").count;

        document.getElementById('stats').innerHTML = `
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Total Problems Solved:</strong> ${totalSolved}</p>
            <p><strong>Easy:</strong> ${stats[1].count}</p>
            <p><strong>Medium:</strong> ${stats[2].count}</p>
            <p><strong>Hard:</strong> ${stats[3].count}</p>
        `;

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('stats').innerHTML = `<p>Error fetching stats.</p>`;
    }
});
