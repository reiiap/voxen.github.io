const menuButton = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

if (menuButton && navList) {
  menuButton.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
}

const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach(item => observer.observe(item));

const statusHost = document.querySelector('[data-server-host]');
const statusOnline = document.querySelector('[data-status-online]');
const statusPlayers = document.querySelector('[data-status-players]');
const statusVersion = document.querySelector('[data-status-version]');
const statusLatency = document.querySelector('[data-status-latency]');
const statusMotd = document.querySelector('[data-status-motd]');

async function loadServerStatus() {
  if (!statusHost) return;

  const host = statusHost.getAttribute('data-server-host') || 'play.voxensmp.net';
  const endpoint = `https://api.mcsrvstat.us/3/${host}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    const onlineText = data.online ? 'Online' : 'Offline';
    statusOnline.textContent = onlineText;
    statusOnline.classList.toggle('status-live', data.online);
    statusOnline.classList.toggle('status-offline', !data.online);

    const players = data.players?.online ?? 0;
    const maxPlayers = data.players?.max ?? '?';
    statusPlayers.textContent = `${players}/${maxPlayers}`;

    statusVersion.textContent = data.version || '-';
    statusLatency.textContent = data.debug?.ping ? `${data.debug.ping} ms` : 'N/A';

    const motdRaw = data.motd?.clean?.join(' ') || 'Selamat datang di VoxenSMP';
    statusMotd.textContent = motdRaw;
  } catch (error) {
    statusOnline.textContent = 'Gagal Ambil Data';
    statusOnline.classList.add('status-offline');
    statusPlayers.textContent = '-';
    statusVersion.textContent = '-';
    statusLatency.textContent = '-';
    statusMotd.textContent = 'API mcstats tidak bisa diakses sementara.';
  }
}

loadServerStatus();
setInterval(loadServerStatus, 60000);
