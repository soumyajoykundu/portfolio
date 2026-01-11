/**
 * Fetches and displays GitHub repositories with error handling, sorting, and filtering
 * Replace 'soumyajoykundu' with your exact GitHub username from CV
 */

(function() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const GITHUB_USER = 'soumyajoykundu'; // Update from your CV/GitHub link[file:1]
  const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=9&direction=desc`;

  // Loading state
  container.innerHTML = `
    <div class="card" style="text-align: center; padding: 3rem;">
      <div style="font-size: 1.2rem; margin-bottom: 1rem;">Loading projects...</div>
      <div style="width: 40px; height: 40px; border: 3px solid var(--border); border-top: 3px solid var(--accent); border-radius: 50%; animation: spin 1s linear infinite; margin: auto;"></div>
    </div>
  `;

  // CSS for spinner (injected dynamically)
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);

  fetch(API_URL, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Site' // GitHub API requirement
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return response.json();
    })
    .then(repos => {
      container.innerHTML = '';
      
      // Filter & sort: only repos with descriptions, exclude forks
      const filteredRepos = repos
        .filter(repo => !repo.fork && repo.description && repo.stargazers_count > 0)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6); // Top 6 relevant repos

      if (filteredRepos.length === 0) {
        container.innerHTML = '<div class="card">No public projects found. Check GitHub settings.</div>';
        return;
      }

      filteredRepos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <h3 style="margin: 0;">${repo.name}</h3>
            <div style="font-size: 0.9rem; color: var(--text-secondary);">
              ⭐ ${repo.stargazers_count} 
              ${repo.language ? `| ${repo.language}` : ''}
            </div>
          </div>
          <p>${repo.description}</p>
          <div style="margin-top: 1.5rem;">
            <a href="${repo.html_url}" target="_blank" style="background: var(--accent); color: white; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; font-weight: 500; transition: background 0.3s;">
              View on GitHub
            </a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" style="margin-left: 1rem; color: var(--accent); text-decoration: none;">Live Demo</a>` : ''}
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('GitHub API Error:', error);
      container.innerHTML = `
        <div class="card">
          <h3>Projects Temporarily Unavailable</h3>
          <p>Unable to fetch from GitHub. Please check your internet or try again later. Featured projects listed above.</p>
          <a href="https://github.com/${GITHUB_USER}" target="_blank" style="color: var(--accent);">Visit GitHub →</a>
        </div>
      `;
    });
})();
