/**
 * Production-Ready GitHub Projects - Top 5 Side-by-Side Cards
 * Perfect loading spinner, error handling, sequential animations
 */

(function() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const GITHUB_USER = 'soumyajoykundu'; // UPDATE THIS with your exact GitHub username
  const API_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=10&direction=desc`;

  // Inject responsive grid + spinner CSS
  const style = document.createElement('style');
  style.id = 'projects-style';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .projects-grid .loading-card {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem 2rem;
    }
    .projects-grid .repo-card {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .projects-grid .repo-card.animate {
      opacity: 1;
      transform: translateY(0);
    }
    .repo-card:hover {
      transform: translateY(-12px) !important;
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.3) !important;
    }
  `;
  document.head.appendChild(style);

  // PERFECT LOADING STATE
  container.innerHTML = `
    <div class="card loading-card">
      <h3 style="margin-bottom: 1rem; color: var(--accent);">🔄 Fetching Repositories</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Loading your latest GitHub projects...</p>
      <div style="width: 48px; height: 48px; border: 4px solid var(--border); border-top: 4px solid var(--accent); border-radius: 50%; animation: spin 1s linear infinite; margin: auto;"></div>
    </div>
  `;

  fetch(API_URL, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'soumyajoykundu-portfolio/1.0'
    }
  })
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API: ${response.status} - ${errorData.message || 'Service unavailable'}`);
      }
      return response.json();
    })
    .then(repos => {
      container.innerHTML = '';
      
      // Smart filtering: Non-forks + descriptions + exclude user profile repo
      const topRepos = repos
        .filter(repo => 
          !repo.fork && 
          repo.description?.trim() && 
          !repo.name.toLowerCase().includes('readme') &&
          repo.stargazers_count >= 0
        )
        .sort((a, b) => {
          // Stars > Updated > Name
          return b.stargazers_count - a.stargazers_count ||
                 new Date(b.updated_at) - new Date(a.updated_at) ||
                 a.name.localeCompare(b.name);
        })
        .slice(0, 5); // TOP 5 ONLY

      if (topRepos.length === 0) {
        container.innerHTML = `
          <div class="card loading-card">
            <h3 style="color: var(--text-primary);">📭 No Public Projects</h3>
            <p style="color: var(--text-secondary);">Add descriptions to your repositories or check privacy settings.</p>
            <a href="https://github.com/${GITHUB_USER}" target="_blank" 
               style="background: linear-gradient(135deg, var(--accent), var(--accent-hover)); color: white; padding: 0.75rem 1.5rem; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; margin-top: 1rem;">
              Visit GitHub →
            </a>
          </div>
        `;
        return;
      }

      // CREATE BEAUTIFUL SIDE-BY-SIDE CARDS
      topRepos.forEach((repo, index) => {
        const card = document.createElement('div');
        card.className = 'card repo-card';
        card.innerHTML = `
          <div class="repo-header">
            <h3 style="margin: 0 0 0.75rem 0; font-size: 1.3rem; color: var(--text-primary); font-weight: 700;">${repo.name}</h3>
            <div class="repo-stats">
              <span style="font-size: 1.1rem; font-weight: 700; color: var(--accent);">⭐ ${repo.stargazers_count}</span>
              ${repo.language ? `
                <span class="language-badge" style="background: ${getLanguageColor(repo.language)}; color: white; padding: 0.3rem 0.8rem; border-radius: 16px; font-size: 0.8rem; font-weight: 600;">${repo.language}</span>
              ` : ''}
              <div style="font-size: 0.85rem; color: var(--text-secondary);">
                Updated ${new Date(repo.updated_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
          
          <p style="margin: 1.5rem 0; line-height: 1.7; color: var(--text-primary);">${repo.description}</p>
          
          <div class="repo-actions">
            <a href="${repo.html_url}" target="_blank" class="repo-btn primary"
               style="background: linear-gradient(135deg, var(--accent), var(--accent-hover)); color: white; padding: 0.75rem 1.5rem; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease;">
              View Code <span>→</span>
            </a>
            ${repo.homepage ? `
              <a href="${repo.homepage}" target="_blank" class="repo-btn secondary"
                 style="color: var(--accent); border: 2px solid var(--accent); background: transparent; padding: 0.75rem 1.5rem; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease;">
                Live Demo
              </a>
            ` : ''}
          </div>
        `;
        
        container.appendChild(card);
        
        // Sequential animation (100ms stagger)
        setTimeout(() => {
          card.classList.add('animate');
        }, index * 150);
      });
    })
    .catch(error => {
      console.error('GitHub API Error:', error);
      container.innerHTML = `
        <div class="card loading-card">
          <h3 style="color: var(--text-primary);">📡 GitHub API Unavailable</h3>
          <p style="color: var(--text-secondary);">Featured projects above showcase production work at Sedin Technologies.</p>
          <a href="https://github.com/${GITHUB_USER}" target="_blank" 
             style="background: linear-gradient(135deg, var(--accent), var(--accent-hover)); color: white; padding: 0.75rem 1.5rem; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block; margin-top: 1.5rem;">
            Visit GitHub →
          </a>
        </div>
      `;
    });

  // Language color mapping
  function getLanguageColor(language) {
    const colors = {
      'JavaScript': '#f7df1e',
      'Python': '#3776ab', 
      'TypeScript': '#3178c6',
      'Java': '#007396',
      'C++': '#f34b7d',
      'C': '#a8b9cc',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'HTML': '#e34f26',
      'CSS': '#1572B6',
      'Jupyter Notebook': '#fc4e2a'
    };
    return colors[language] || '#6b7280';
  }
})();
