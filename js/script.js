document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-nav');

    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking on a nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Carousel functionality
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentSlide = 0;

    // Create dots
    carouselSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        carouselSlides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function goToSlide(index) {
        showSlide(index);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto slide change
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));

    // Scroll to section
    const scrollDown = document.querySelector('.hero-scroll');
    scrollDown.addEventListener('click', () => {
        document.querySelector('.photo-carousel').scrollIntoView({ behavior: 'smooth' });
    });

    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number:not(.infinity)');

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // Intersection Observer for stats animation
    const statsSection = document.querySelector('.love-stats');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);

    // Smooth scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Timeline Animation
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.5s ease ${index * 0.2}s`;
        observer.observe(item);
    });
}

// Initialize timeline animation when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Keep existing navbar and other functionality
    // ... (código anterior permanece o mesmo)

    // Initialize timeline animation
    animateTimeline();

    // Smooth scroll for timeline header
    const scrollDown = document.querySelector('.header-scroll');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            document.querySelector('.timeline-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Gallery Functionality
function initGallery() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.grid-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    const images = Array.from(document.querySelectorAll('.grid-item img'));
    const captions = Array.from(document.querySelectorAll('.overlay-content'));

    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightbox();
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    });

    // Navigation
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;

        if (e.key === 'Escape') {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });

    function updateLightbox() {
        const imgSrc = images[currentImageIndex].getAttribute('src');
        const caption = captions[currentImageIndex].innerHTML;

        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', images[currentImageIndex].getAttribute('alt'));
        lightboxCaption.innerHTML = caption;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightbox();
    }

    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Simulate loading more items
            const hiddenItems = document.querySelectorAll('.grid-item[style*="display: none"]');
            const itemsToShow = Math.min(3, hiddenItems.length);

            for (let i = 0; i < itemsToShow; i++) {
                hiddenItems[i].style.display = 'block';
                setTimeout(() => {
                    hiddenItems[i].style.opacity = '1';
                }, 50);
            }

            // Hide button if no more items
            if (itemsToShow < 3) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Keep existing navbar and other functionality
    // ... (código anterior permanece o mesmo)

    // Initialize gallery
    initGallery();

    // Smooth scroll for gallery header
    const scrollDown = document.querySelector('.gallery-header .header-scroll');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            document.querySelector('.gallery-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Favorites Functionality
function initFavorites() {
    // Smooth scroll for favorites header
    const scrollDown = document.querySelector('.favorites-header .header-scroll');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            document.querySelector('.favorites-container').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Add new quote functionality
    const addQuoteBtn = document.querySelector('.btn-add');
    if (addQuoteBtn) {
        addQuoteBtn.addEventListener('click', function () {
            const textarea = this.previousElementSibling;
            const quoteText = textarea.value.trim();

            if (quoteText) {
                const quotesGrid = document.querySelector('.quotes-grid');
                const newQuoteItem = document.createElement('div');
                newQuoteItem.className = 'quote-item';

                newQuoteItem.innerHTML = `
                    <blockquote>
                        <p>"${quoteText}"</p>
                        <footer>- Luiza & Mário</footer>
                    </blockquote>
                    <p class="memory">"Adicionado em ${new Date().toLocaleDateString('pt-BR')}"</p>
                `;

                // Insert before the last item (which is the add new quote form)
                quotesGrid.insertBefore(newQuoteItem, quotesGrid.lastElementChild);
                textarea.value = '';

                // Show confirmation
                const originalText = this.textContent;
                this.textContent = 'Adicionado!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }
        });
    }

    // Play music preview on hover (simulated)
    const musicItems = document.querySelectorAll('.favorites-grid .favorite-item');
    musicItems.forEach(item => {
        const spotifyLink = item.querySelector('.favorite-link[href*="spotify"]');
        if (spotifyLink) {
            item.addEventListener('mouseenter', () => {
                // In a real implementation, you might use the Spotify API to play a preview
                console.log('Playing preview for: ' + item.querySelector('h3').textContent);
            });
        }
    });
}

// Initialize favorites when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile menu toggle (if not already initialized)
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-nav');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            menu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Initialize favorites page
    if (document.querySelector('.favorites-container')) {
        initFavorites();
    }
});

// Future Page Functionality
function initFuturePage() {
    // Smooth scroll for future header
    const scrollDown = document.querySelector('.future-header .header-scroll');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            document.querySelector('.future-container').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Initialize lightbox for future images
    const zoomableImages = document.querySelectorAll('.zoomable');
    if (zoomableImages.length > 0) {
        zoomableImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                const lightbox = document.querySelector('.lightbox');
                const lightboxImg = document.querySelector('.lightbox-image');
                const lightboxCaption = document.querySelector('.lightbox-caption');

                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.nextElementSibling.textContent;
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease';
            observer.observe(item);
        });
    }
}

// Initialize future page when loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the future page
    if (document.querySelector('.future-container')) {
        initFuturePage();
    }

    // Keep existing functionality for other pages
    if (document.querySelector('.photo-grid')) {
        initGallery();
    }

    // ===== CÓDIGO DO ÁUDIO ATUALIZADO ===== //
    const audio = document.getElementById('bgAudio');
    let audioInteractionDone = false;

    // Função para liberar o áudio após interação
    function enableAudio() {
        if (audioInteractionDone) return;

        audio.volume = 0.3;
        audio.play()
            .then(() => {
                audioInteractionDone = true;
            })
            .catch(error => {
                console.log("Falha ao reproduzir:", error);
            });
    }

    // Tenta reproduzir quando houver qualquer interação do usuário
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
    document.addEventListener('scroll', enableAudio, { once: true });

    // Tenta autoplay (caso o navegador permita)
    setTimeout(() => {
        audio.volume = 0.3;
        audio.play()
            .catch(error => {
                console.log("Autoplay bloqueado, aguardando interação...");
                // Mostra um aviso mais amigável
                const audioWarning = document.createElement('div');
                audioWarning.style.position = 'fixed';
                audioWarning.style.bottom = '20px';
                audioWarning.style.right = '20px';
                audioWarning.style.backgroundColor = 'rgba(0,0,0,0.8)';
                audioWarning.style.color = 'white';
                audioWarning.style.padding = '10px';
                audioWarning.style.borderRadius = '5px';
                audioWarning.style.zIndex = '1000';
                audioWarning.innerHTML = 'Clique em qualquer lugar para ativar a música de fundo';
                document.body.appendChild(audioWarning);

                setTimeout(() => {
                    document.body.removeChild(audioWarning);
                }, 5000);
            });
    }, 1000);
});

// ===== CONTROLE DE ÁUDIO À PROVA DE ERROS =====
document.addEventListener('DOMContentLoaded', function () {
    // Elementos com verificação de existência
    const toggleBtn = document.getElementById('toggleAudio');
    const audioIframe = document.getElementById('audioIframe');

    if (!toggleBtn || !audioIframe) return;

    let audioPlaying = false;

    // Função segura para controle do áudio
    function controlAudio(action) {
        try {
            if (audioIframe.contentWindow) {
                audioIframe.contentWindow.postMessage({ action }, '*');
                localStorage.setItem('audioState', action === 'play' ? 'on' : 'off');
                return true;
            }
        } catch (error) {
            console.error("Erro no controle de áudio:", error);
        }
        return false;
    }

    // Controle pelo botão (com verificação)
    toggleBtn.addEventListener('click', () => {
        audioPlaying = !audioPlaying;
        if (controlAudio(audioPlaying ? 'play' : 'pause')) {
            toggleBtn.textContent = audioPlaying ? '🔊' : '🔇';
        }
    });

    // Restaura estado anterior (com tratamento de erro)
    try {
        const savedState = localStorage.getItem('audioState');
        if (savedState === 'on') {
            audioPlaying = true;
            setTimeout(() => controlAudio('play'), 500); // Delay para garantir carregamento
            toggleBtn.textContent = '🔊';
        }
    } catch (e) {
        console.log("Erro ao restaurar estado do áudio:", e);
    }
});

// JavaScript será adicionado posteriormente para atualizar os contadores
document.addEventListener('DOMContentLoaded', function () {
    // Datas de referência
    const metDate = new Date('2024-06-08T23:45:00');
    const loveDate = new Date('2024-09-08T17:35:00');

    function updateCounters() {
        const now = new Date();

        // Calcula diferença desde que se conheceram
        updateTimeDifference(now, metDate, 'met');

        // Calcula diferença desde que começaram a namorar
        updateTimeDifference(now, loveDate, 'love');

        // Atualiza a cada segundo
        setTimeout(updateCounters, 1000);
    }

    function updateTimeDifference(now, startDate, prefix) {
        const diff = now - startDate;

        // Calcula os valores
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        // Calcula meses e anos aproximados
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        let months = (currentYear - startYear) * 12 + (currentMonth - startMonth);
        if (now.getDate() < startDate.getDate()) months--;

        const years = Math.floor(months / 12);
        months = months % 12;

        // Atualiza os elementos HTML
        document.getElementById(`${prefix}-years`).textContent = years;
        document.getElementById(`${prefix}-months`).textContent = months;
        document.getElementById(`${prefix}-weeks`).textContent = weeks;
        document.getElementById(`${prefix}-days`).textContent = days;
        document.getElementById(`${prefix}-hours`).textContent = hours % 24;
        document.getElementById(`${prefix}-minutes`).textContent = minutes % 60;
        document.getElementById(`${prefix}-seconds`).textContent = seconds % 60;
    }

    // Inicia os contadores
    updateCounters();
});

// Configurações
const JSONBIN_API_KEY = '$2a$10$k5yoNnGcYVgXP5ynEya1L.JCvGLqSB09uhPtFsyFfBuRd2znDNasS';
const JSONBIN_BIN_ID = '685d7cc08a456b7966b635f5';
const IMGBB_API_KEY = '5c0a6b5494c21e4e392f7fd946d4fd64';

// Credenciais válidas
const VALID_USERS = {
    'mario': 'mario123',
    'luiza': 'luiza123'
};

// Elementos do modal
const uploadModal = document.getElementById('uploadModal');
const openModalBtn = document.getElementById('openUploadModal');
const closeModalBtn = document.querySelector('.close-modal');
const photoFileInput = document.getElementById('photoFile');
const imagePreview = document.getElementById('imagePreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadForm = document.getElementById('uploadForm');
const submitBtn = uploadForm.querySelector('button[type="submit"]');

// Elementos do login modal
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// Função para mostrar mensagens
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.bottom = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.padding = '10px 20px';
    alert.style.backgroundColor = type === 'error' ? '#ff4444' : '#4CAF50';
    alert.style.color = 'white';
    alert.style.borderRadius = '5px';
    alert.style.zIndex = '1000';
    document.body.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
}

// Função para mostrar/ocultar loading
function toggleLoading(show) {
    const loadingElement = document.getElementById('loadingOverlay');
    if (show) {
        if (!loadingElement) {
            const loader = document.createElement('div');
            loader.id = 'loadingOverlay';
            loader.innerHTML = `
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>Enviando foto...</p>
        </div>
      `;
            document.body.appendChild(loader);
        }
    } else {
        if (loadingElement) {
            loadingElement.remove();
        }
    }
}

// Função para adicionar foto ao grid
function addPhotoToGrid(photo) {
    const grid = document.querySelector('.photo-grid');
    grid.innerHTML += `
    <div class="grid-item" data-category="${photo.category}">
      <img src="${photo.url}" alt="${photo.title}">
      <div class="photo-overlay">
        <div class="overlay-content">
          <h3>${photo.title}</h3>
          <p>${photo.description}</p>
          <div class="photo-date">
            <i class="far fa-calendar-alt"></i> ${new Date(photo.date).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Função principal de upload
uploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById('photoTitle').value;
    const description = document.getElementById('photoDescription').value;
    const date = document.getElementById('photoDate').value;
    const category = document.getElementById('photoCategory').value;
    const fileInput = document.getElementById('photoFile');

    if (!fileInput.files[0]) {
        showAlert('Selecione uma foto!', 'error');
        return;
    }

    try {
        // Mostrar loading
        toggleLoading(true);
        submitBtn.disabled = true;

        // 1. Upload para ImgBB
        const imgFormData = new FormData();
        imgFormData.append('image', fileInput.files[0]);

        const imgResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: imgFormData
        });

        const imgData = await imgResponse.json();

        // 2. Preparar dados da foto
        const photoData = {
            title,
            description,
            date,
            url: imgData.data.url,
            category,
            timestamp: new Date().toISOString()
        };

        // 3. Salvar no JSONBin
        const binResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify({
                photos: [...(await loadPhotos()), photoData]
            })
        });

        // 4. Mostrar na galeria
        addPhotoToGrid(photoData);
        showAlert('Foto adicionada com sucesso!');

        // Fechar modal e resetar formulário
        uploadModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.reset();
        imagePreview.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';

    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao enviar foto', 'error');
    } finally {
        // Ocultar loading
        toggleLoading(false);
        submitBtn.disabled = false;
    }
});

// Função para carregar fotos existentes
async function loadPhotos() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });
        const data = await response.json();
        return data.record?.photos || [];
    } catch (error) {
        console.error('Erro ao carregar fotos:', error);
        return [];
    }
}

// Controle do Login
let isAuthenticated = false;

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (VALID_USERS[username] && VALID_USERS[username] === password) {
        isAuthenticated = true;
        loginModal.style.display = 'none';
        uploadModal.style.display = 'block';
        loginError.style.display = 'none';
    } else {
        loginError.style.display = 'block';
        loginError.textContent = 'Usuário ou senha incorretos';
    }
});

// Controle do Modal de Upload
openModalBtn.addEventListener('click', () => {
    if (isAuthenticated) {
        uploadModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        loginModal.style.display = 'block';
        document.getElementById('loginUsername').focus();
    }
});

closeModalBtn.addEventListener('click', () => {
    uploadModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    uploadForm.reset();
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
});

// Fechar modais ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
        uploadModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        uploadForm.reset();
        imagePreview.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
    }

    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        loginForm.reset();
        loginError.style.display = 'none';
    }
});

// Pré-visualização da imagem
photoFileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
        }

        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';
    }
});

// Carrega fotos ao iniciar
document.addEventListener('DOMContentLoaded', async () => {
    const photos = await loadPhotos();
    photos.forEach(photo => addPhotoToGrid(photo));
});