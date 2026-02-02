// Scroll event for projects page sections
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.projects-hero, .projects-section');
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionBottom = section.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight - 100) {
      section.classList.add('visible');
    }
    if (sectionBottom < 100) {
      section.classList.remove('visible');
    }
  });
});

// Header scroll visibility
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('visible');
  } else {
    header.classList.remove('visible');
  }
});

// Fade in hero section on page load
window.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.querySelector('.projects-hero');
  setTimeout(() => {
    heroSection.classList.add('visible');
  }, 100);
});

// Project Modal Functions
function openProjectModal(projectId, projectTitle, githubUrl) {
  const modal = document.getElementById('projectModal');
  const titleElement = document.getElementById('modalProjectTitle');
  const githubLink = document.getElementById('modalGithubLink');
  const readmeContent = document.getElementById('readmeContent');
  
  titleElement.textContent = projectTitle;
  githubLink.href = githubUrl;
  readmeContent.innerHTML = 'Loading README...';
  
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Fetch README from GitHub
  fetchReadmeFromGithub(githubUrl, readmeContent);
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('projectModal');
  if (event.target == modal) {
    closeProjectModal();
  }
};

// Fetch README from GitHub API
async function fetchReadmeFromGithub(githubUrl, contentElement) {
  try {
    // Extract owner and repo from GitHub URL
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];
    
    // Fetch README from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    if (response.ok) {
      const readmeText = await response.text();
      contentElement.innerHTML = marked(readmeText);
    } else {
      contentElement.innerHTML = `
        <p>README not found in repository.</p>
        <p>Visit the <a href="${githubUrl}" target="_blank" style="color: #4da6ff;">GitHub repository</a> to learn more about this project.</p>
      `;
    }
  } catch (error) {
    console.error('Error fetching README:', error);
    contentElement.innerHTML = `
      <p>Unable to load README from GitHub.</p>
      <p>Visit the <a href="${githubUrl}" target="_blank" style="color: #4da6ff;">GitHub repository</a> to learn more about this project.</p>
    `;
  }
}

// Simple markdown parser (since we can't use external library easily)
function marked(markdown) {
  let html = markdown
    // Headers
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: #4da6ff;">$1</a>')
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  return '<p>' + html + '</p>';
}
