// Smudgy Client Launcher - Main JavaScript File

// Version fetch meow
async function fetchVersion() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/OBS-Akuma/smudgy-client/refs/heads/main/package.json');
        const data = await res.json();
        const versionDisplay = document.getElementById('versionDisplay');
        if (versionDisplay) versionDisplay.textContent = `v${data.version || '0.0.0'}`;
    } catch(e) {
        const versionDisplay = document.getElementById('versionDisplay');
        if (versionDisplay) versionDisplay.textContent = 'v?.?.?';
    }
}

// Tab switching
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabs = document.querySelectorAll('.tab-content');

    function switchTab(id) {
        tabs.forEach(t => t.classList.remove('active'));
        tabBtns.forEach(b => b.classList.remove('active'));
        const targetTab = document.getElementById(`${id}-tab`);
        if (targetTab) targetTab.classList.add('active');
        const targetBtn = document.querySelector(`.tab-btn[data-tab="${id}"]`);
        if (targetBtn) targetBtn.classList.add('active');
    }

    tabBtns.forEach(b => {
        b.addEventListener('click', () => switchTab(b.dataset.tab));
    });
}

// Version tab selector (launch tab pill buttons)
function initVersionTabs() {
    const verTabs = document.querySelectorAll('.ver-tab');
    verTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            verTabs.forEach(v => v.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Launch animation — smaller fly icons (32px)
function initLaunchAnimation() {
    const launchBtn = document.getElementById('launchBtn');
    const mainUI = document.querySelector('.launcher');
    const iconLayer = document.getElementById('iconLayer');
    const flashOverlay = document.getElementById('flashOverlay');

    if (!launchBtn) return;

    const iconSVGs = [
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A8E50" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C12 2 7 6 7 12c0 2.5 1 4.5 2.5 6L12 22l2.5-4C16 16.5 17 14.5 17 12c0-6-5-10-5-10z"/><circle cx="12" cy="12" r="2" fill="#1A8E50" stroke="none"/><path d="M7.5 15.5L5 18M16.5 15.5L19 18"/></svg>`,
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A8E50" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="12" rx="4"/><path d="M7 13h4M9 11v4"/><circle cx="16" cy="12" r="1" fill="#1A8E50" stroke="none"/><circle cx="15" cy="15" r="1" fill="#1A8E50" stroke="none"/></svg>`,
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A8E50" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9 9 9"/></svg>`,
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A8E50" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A8E50" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 3v6c0 5-4 9-8 11C8 20 4 16 4 11V5z"/><path d="M9 12l2 2 4-4"/></svg>`,
        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A8E50" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="7"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>`,
    ];

    function spawnParticle(x, y, color) {
        const p = document.createElement('div');
        p.className = 'anim-particle';
        const size = 3 + Math.random() * 7;
        p.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${color};border-radius:50%;position:fixed;`;
        document.body.appendChild(p);
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 220;
        const dur = 600 + Math.random() * 400;
        p.animate([
            { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`, opacity: 0 }
        ], { duration: dur, easing: 'cubic-bezier(0.2,0.9,0.4,1)', fill: 'forwards' });
        setTimeout(() => p.remove(), dur + 50);
    }

    function spawnRipple(x, y) {
        const r = document.createElement('div');
        r.className = 'ripple-ring';
        r.style.cssText = `left:${x}px;top:${y}px;`;
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 900);
    }

    launchBtn.addEventListener('click', () => {
        launchBtn.disabled = true;
        const rect = launchBtn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        spawnRipple(cx, cy);

        const created = [];
        iconSVGs.forEach(svg => {
            const el = document.createElement('div');
            el.className = 'fly-icon';
            el.innerHTML = svg;
            el.style.left = `${cx - 16}px`;
            el.style.top = `${cy - 16}px`;
            if (iconLayer) iconLayer.appendChild(el);
            created.push(el);
        });

        created.forEach((el, i) => {
            const angle = (Math.PI * 2 / created.length) * i - Math.PI / 2;
            const radius = 120 + Math.random() * 50;
            const tx = Math.cos(angle) * radius;
            const ty = Math.sin(angle) * radius;
            const rot = (Math.random() - 0.5) * 60;
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transition = `transform 0.65s cubic-bezier(0.22,1,0.36,1), opacity 0.3s`;
                el.style.transform = `translate(${tx}px,${ty}px) rotate(${rot}deg) scale(1)`;
            }, i * 30);
        });

        setTimeout(() => {
            created.forEach(el => {
                el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s';
                el.style.transform = 'translate(0px,0px) rotate(360deg) scale(1.2)';
                el.style.opacity = '0.95';
            });
        }, 800);

        setTimeout(() => {
            spawnRipple(cx, cy);
            spawnRipple(cx, cy);
        }, 850);

        setTimeout(() => {
            created.forEach((el, i) => {
                const angle = (Math.PI * 2 / created.length) * i + Math.random() * 0.8 - 0.4;
                const dist = 380 + Math.random() * 180;
                el.style.transition = 'transform 0.75s cubic-bezier(0.2,0.8,0.4,1.1), opacity 0.45s';
                el.style.transform = `translate(${Math.cos(angle) * dist}px,${Math.sin(angle) * dist}px) rotate(${(Math.random() - 0.5) * 720}deg) scale(0.3)`;
                el.style.opacity = '0';
            });
            const colors = ['#1A8E50', '#14703e', '#00cc66', '#ffffff', '#aaffcc'];
            for (let i = 0; i < 50; i++) {
                setTimeout(() => spawnParticle(cx, cy, colors[Math.floor(Math.random() * colors.length)]), Math.random() * 200);
            }
            if (flashOverlay) {
                flashOverlay.style.opacity = '0.12';
                setTimeout(() => { flashOverlay.style.opacity = '0'; }, 180);
            }
            document.body.animate([
                { transform: 'translate(0,0)' },
                { transform: 'translate(-6px,3px)' },
                { transform: 'translate(5px,-4px)' },
                { transform: 'translate(-3px,2px)' },
                { transform: 'translate(2px,-1px)' },
                { transform: 'translate(0,0)' }
            ], { duration: 340, easing: 'ease-out' });
            setTimeout(() => { if (mainUI) mainUI.classList.add('fade-out'); }, 300);
        }, 1400);

        setTimeout(() => {
            created.forEach(el => el.remove());
            window.location.href = 'https://kirka.io';
        }, 2800);
    });
}

// Keybind logic
function initKeybind() {
    const keybindBtn = document.getElementById('keybindBtn');
    if (!keybindBtn) return;

    keybindBtn.addEventListener('click', () => {
        keybindBtn.textContent = 'Press a key...';
        const handler = (e) => {
            e.preventDefault();
            let key = e.key;
            if (key === ' ') key = 'Space';
            if (key === 'Escape') key = 'Esc';
            if (key === 'Shift') key = e.location === 1 ? 'Left Shift' : (e.location === 2 ? 'Right Shift' : 'Shift');
            else if (key === 'Control') key = e.location === 1 ? 'Left Ctrl' : (e.location === 2 ? 'Right Ctrl' : 'Ctrl');
            else if (key === 'Alt') key = e.location === 1 ? 'Left Alt' : (e.location === 2 ? 'Right Alt' : 'Alt');
            else if (key === 'Meta') key = e.location === 1 ? 'Left Win' : (e.location === 2 ? 'Right Win' : 'Win');
            else if (key.length === 1) key = key.toUpperCase();
            keybindBtn.textContent = key;
            document.removeEventListener('keydown', handler);
        };
        document.addEventListener('keydown', handler, { once: true });
        setTimeout(() => {
            if (keybindBtn.textContent === 'Press a key...') {
                keybindBtn.textContent = 'Click to set';
            }
        }, 5000);
    });
}

// Escape HTML helper
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Format timestamp
function formatNewsDate(ts) {
    if (!ts) return '';
    const ms = ts > 1e12 ? ts : ts * 1000;
    const d = new Date(ms);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Category label colours
const CATEGORY_COLORS = {
    general:     '#1A8E50',
    event:       '#c78c14',
    alert:       '#b03a3a',
    promotional: '#3a6eb0',
};

// Render news filtered by current checkbox states
function renderNews() {
    const newsScroll = document.getElementById('newsScroll');
    if (!newsScroll || !window._newsItems) return;

    const enabledCategories = {
        general:     document.getElementById('general_news')?.checked ?? true,
        promotional: document.getElementById('promotional_news')?.checked ?? true,
        event:       document.getElementById('event_news')?.checked ?? true,
        alert:       document.getElementById('alert_news')?.checked ?? true,
    };

    const filtered = window._newsItems.filter(n => enabledCategories[n.category] !== false);

    if (!filtered.length) {
        newsScroll.innerHTML = `<div class="news-empty">No news for selected categories.</div>`;
        return;
    }

    newsScroll.innerHTML = filtered.map(n => {
        const catColor = CATEGORY_COLORS[n.category] || '#1A8E50';
        const dateStr = formatNewsDate(n.updatedAt);

        let imgHtml;
        if (n.imgType === 'banner' && n.img) {
            imgHtml = `<div class="news-banner-wrap"><img class="news-banner" src="${escapeHtml(n.img)}" alt="" onerror="this.parentElement.style.display='none'"></div>`;
        } else if (n.img) {
            imgHtml = `<img class="news-icon-img" src="${escapeHtml(n.img)}" alt="" onerror="this.style.display='none'">`;
        } else {
            imgHtml = `<div class="news-icon-fallback"><i class="fas fa-newspaper"></i></div>`;
        }

        const isIcon = n.imgType === 'icon' || !n.imgType;

        return `
            <div class="news-item ${isIcon ? 'news-item--icon' : 'news-item--banner'}">
                ${isIcon ? `<div class="news-item-top">
                    ${imgHtml}
                    <div class="news-item-header">
                        <span class="news-cat-badge" style="color:${catColor};border-color:${catColor}20;background:${catColor}18;">${escapeHtml(n.category)}</span>
                        <div class="news-title">${escapeHtml(n.title)}</div>
                    </div>
                </div>` : `${imgHtml}<div class="news-item-header" style="padding:0 10px 0;">
                    <span class="news-cat-badge" style="color:${catColor};border-color:${catColor}20;background:${catColor}18;">${escapeHtml(n.category)}</span>
                    <div class="news-title">${escapeHtml(n.title)}</div>
                </div>`}
                <div class="news-content">${escapeHtml(n.content)}</div>
                <div class="news-footer">
                    ${dateStr ? `<span class="news-date">${dateStr}</span>` : ''}
                    ${n.link ? `<a class="news-btn" href="${escapeHtml(n.link)}" target="_blank">View Post <i class="fas fa-external-link-alt" style="font-size:0.6rem;"></i></a>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Fetch news and store globally, then render
async function loadNews() {
    const newsScroll = document.getElementById('newsScroll');
    if (!newsScroll) return;

    newsScroll.innerHTML = `<div class="news-loading"><i class="fas fa-spinner fa-pulse"></i> Loading news...</div>`;

    try {
        const res = await fetch('https://raw.githubusercontent.com/OBS-Akuma/smudgy-client/refs/heads/main/Api/news.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        window._newsItems = await res.json();
        renderNews();
    } catch(e) {
        console.error('News fetch error:', e);
        newsScroll.innerHTML = `<div class="news-empty">Failed to load news.</div>`;
    }
}

// Wire settings checkboxes -> re-render news live
function initNewsSettings() {
    ['general_news', 'promotional_news', 'event_news', 'alert_news'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', renderNews);
    });
}

// Load Features from JSON
async function loadFeatures() {
    const featuresGrid = document.getElementById('featuresGrid');
    const featuresLoading = document.getElementById('featuresLoading');
    const featuresErrorDiv = document.getElementById('featuresError');
    const featuresNoResults = document.getElementById('featuresNoResults');

    if (!featuresGrid) return;

    try {
        const res = await fetch('https://raw.githubusercontent.com/OBS-Akuma/smudgy-launcher/refs/heads/main/features.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const features = await res.json();
        if (featuresLoading) featuresLoading.style.display = 'none';
        if (features && features.length) {
            featuresGrid.innerHTML = features.map(f => {
                const featureItems = f.features && f.features.length ? f.features : [];
                return `
                    <div class="feature-card">
                        <div class="feature-header">
                            <span class="feature-name">${escapeHtml(f.name)}</span>
                            <span class="feature-category">${escapeHtml(f.category)}</span>
                        </div>
                        <div class="feature-description">${escapeHtml(f.description)}</div>
                        ${featureItems.length ? `<div class="feature-list">${featureItems.map(item => `<span class="feature-list-item">${escapeHtml(item)}</span>`).join('')}</div>` : ''}
                    </div>
                `;
            }).join('');
            if (featuresErrorDiv) featuresErrorDiv.style.display = 'none';
        } else {
            featuresGrid.innerHTML = '';
            if (featuresNoResults) featuresNoResults.style.display = 'block';
        }
    } catch(e) {
        console.error('Features fetch error:', e);
        if (featuresLoading) featuresLoading.style.display = 'none';
        if (featuresErrorDiv) featuresErrorDiv.style.display = 'block';
        if (featuresGrid) featuresGrid.innerHTML = '';
    }
}

// Load Tools from JSON
async function loadTools() {
    const toolsGrid = document.getElementById('toolsGrid');
    const toolsLoading = document.getElementById('toolsLoading');
    const toolsErrorDiv = document.getElementById('toolsError');
    const toolsNoResultsSpan = document.getElementById('toolsNoResults');

    if (!toolsGrid) return;

    try {
        const res = await fetch('https://raw.githubusercontent.com/OBS-Akuma/smudgy-launcher/refs/heads/main/tools.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const tools = await res.json();
        if (toolsLoading) toolsLoading.style.display = 'none';
        if (tools && tools.length) {
            toolsGrid.innerHTML = tools.map(tool => {
                let iconSrc = tool.iconUrl || tool.icon || 'https://placehold.co/38x38/1a1a1a/1A8E50';
                const toolName = tool.name || 'Tool';
                const toolDesc = tool.description || 'Useful resource';
                const toolUrl = tool.url || tool.src || '#';
                return `
                    <div class="tool-card">
                        <a href="${toolUrl}" target="_blank" class="tool-link">
                            <img src="${iconSrc}" class="tool-icon" onerror="this.src='https://placehold.co/38x38/1a1a1a/1A8E50'">
                            <div>
                                <div class="tool-name">${escapeHtml(toolName)}</div>
                                <div class="tool-desc">${escapeHtml(toolDesc)}</div>
                            </div>
                            <div class="tool-arrow"><i class="fas fa-external-link-alt"></i></div>
                        </a>
                    </div>
                `;
            }).join('');
            if (toolsErrorDiv) toolsErrorDiv.style.display = 'none';
        } else {
            toolsGrid.innerHTML = '';
            if (toolsNoResultsSpan) toolsNoResultsSpan.style.display = 'block';
        }
    } catch(e) {
        console.error('Tools fetch error:', e);
        if (toolsLoading) toolsLoading.style.display = 'none';
        if (toolsErrorDiv) toolsErrorDiv.style.display = 'block';
        if (toolsGrid) toolsGrid.innerHTML = '';
    }
}

// Load Clients from JSON
async function loadClients() {
    const clientsGrid = document.getElementById('clientsGrid');
    const clientsLoading = document.getElementById('clientsLoading');
    const clientsErrorDiv = document.getElementById('clientsError');
    const clientsNoResults = document.getElementById('clientsNoResults');

    if (!clientsGrid) return;

    try {
        const res = await fetch('https://raw.githubusercontent.com/imnotkoolkid/KCH/refs/heads/main/data/clients.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const clients = await res.json();
        if (clientsLoading) clientsLoading.style.display = 'none';
        if (clients && clients.length) {
            clientsGrid.innerHTML = clients.map(c => {
                const platformsList = c.platforms && c.platforms.length ? c.platforms.join(', ') : 'multi-platform';
                const devStatus = c.development || 'unknown';
                const isInactive = (devStatus === 'inactive');
                const devBadgeClass = isInactive ? 'badge inactive-dev' : (devStatus === 'active' ? 'badge active' : 'badge');
                return `
                    <div class="client-card">
                        <a href="${c.downloadUrl}" target="_blank" class="client-link">
                            <img src="${c.icon}" class="client-icon-img" onerror="this.src='https://placehold.co/32x32/1a1a1a/1A8E50'">
                            <div>
                                <div class="client-name-card">${escapeHtml(c.name)}</div>
                                <div class="client-owner">by ${escapeHtml(c.owner)}</div>
                                <div class="client-meta">
                                    <span class="${devBadgeClass}">${devStatus}</span>
                                    <span class="badge">${escapeHtml(platformsList)}</span>
                                    <span class="badge">${c.source || 'source'}</span>
                                </div>
                            </div>
                            <div class="tool-arrow"><i class="fas fa-external-link-alt"></i></div>
                        </a>
                    </div>
                `;
            }).join('');
            if (clientsNoResults) clientsNoResults.style.display = 'none';
            if (clientsErrorDiv) clientsErrorDiv.style.display = 'none';
        } else {
            clientsGrid.innerHTML = '';
            if (clientsNoResults) clientsNoResults.style.display = 'block';
        }
    } catch(e) {
        console.error('Clients fetch error:', e);
        if (clientsLoading) clientsLoading.style.display = 'none';
        if (clientsErrorDiv) clientsErrorDiv.style.display = 'block';
        if (clientsGrid) clientsGrid.innerHTML = '';
    }
}

// Global search filtering
function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    const clearBtn = document.getElementById('searchClearBtn');

    if (!searchInput) return;

    function filterItems() {
        const q = searchInput.value.toLowerCase().trim();
        const toolCards = document.querySelectorAll('#toolsGrid .tool-card');
        const clientCards = document.querySelectorAll('#clientsGrid .client-card');
        const featureCards = document.querySelectorAll('#featuresGrid .feature-card');

        toolCards.forEach(card => {
            card.style.display = (!q || card.innerText.toLowerCase().includes(q)) ? '' : 'none';
        });

        clientCards.forEach(card => {
            card.style.display = (!q || card.innerText.toLowerCase().includes(q)) ? '' : 'none';
        });

        featureCards.forEach(card => {
            card.style.display = (!q || card.innerText.toLowerCase().includes(q)) ? '' : 'none';
        });

        const toolsNoResultsDiv = document.getElementById('toolsNoResults');
        if (toolsNoResultsDiv && q) {
            const anyVisible = Array.from(toolCards).some(c => c.style.display !== 'none');
            toolsNoResultsDiv.style.display = anyVisible ? 'none' : 'block';
        } else if (toolsNoResultsDiv) {
            toolsNoResultsDiv.style.display = 'none';
        }

        const featuresNoResultsDiv = document.getElementById('featuresNoResults');
        if (featuresNoResultsDiv && q) {
            const anyVisible = Array.from(featureCards).some(c => c.style.display !== 'none');
            featuresNoResultsDiv.style.display = anyVisible ? 'none' : 'block';
        } else if (featuresNoResultsDiv) {
            featuresNoResultsDiv.style.display = 'none';
        }
    }

    searchInput.addEventListener('input', filterItems);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterItems();
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchVersion();
    initTabs();
    initVersionTabs();
    initLaunchAnimation();
    initKeybind();
    loadNews();
    initNewsSettings();
    loadFeatures();
    loadTools();
    loadClients();
    initSearch();
});
