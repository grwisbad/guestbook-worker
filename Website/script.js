document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll("section[id]");
  
  window.addEventListener("scroll", navHighlighter);
  
  function navHighlighter() {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute("id");
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(".nav-links a[href*=" + sectionId + "]").classList.add("active");
      } else {
        document.querySelector(".nav-links a[href*=" + sectionId + "]").classList.remove("active");
      }
    });
  }
  
  const cards = document.querySelectorAll('.experience-card, .project-card, .skill-card');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });

  const WORKER_URL = 'https://guestbook-worker.ericvla2468.workers.dev/api/comments';

  let currentPage = 1;
  const COMMENTS_PER_PAGE = 4;

  async function fetchComments(page = 1) {
    const response = await fetch(`${WORKER_URL}?page=${page}&limit=${COMMENTS_PER_PAGE}`);
    const data = await response.json();
    const comments = data.comments || data; // support both [{},{}] and {comments: [...]}
    const total = data.total || comments.length;
    const commentsSection = document.getElementById('comments');

    commentsSection.innerHTML = comments.map(
      c => `<div class="comment"><strong>${c.author}</strong>: ${c.content}<small>${new Date(c.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' })}</small></div>`
    ).join('');

    // Pagination
    const totalPages = Math.ceil(total / COMMENTS_PER_PAGE);
    const pagination = document.createElement('div');
    pagination.className = 'pagination';

    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }

    if (totalPages > 1) {
      commentsSection.appendChild(pagination);
      pagination.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn')) {
          currentPage = parseInt(e.target.dataset.page);
          fetchComments(currentPage);
        }
      });
    }
  }

  async function addComment(event) {
    event.preventDefault();
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;
    const button = document.querySelector('#comment-form button');

    button.disabled = true;
    button.textContent = 'Submitting...';

    try {
      await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      });

      document.getElementById('author').value = '';
      document.getElementById('content').value = '';
      button.textContent = 'Add Comment';
      button.disabled = false;
      fetchComments(currentPage);
    } catch (error) {
      button.textContent = 'Add Comment';
      button.disabled = false;
      alert('There was an error submitting your comment. Please try again.');
    }
  }

  document.getElementById('comment-form').addEventListener('submit', addComment);
  fetchComments();
});