const menuButton = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

if (menuButton && navList) {
  menuButton.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
}

const reveals = document.querySelectorAll('.reveal');

if (reveals.length) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.14 }
  );

  reveals.forEach(item => observer.observe(item));
}

const statusHost = document.querySelector('[data-server-host]');
const statusOnline = document.querySelector('[data-status-online]');
const statusPlayers = document.querySelector('[data-status-players]');
const statusVersion = document.querySelector('[data-status-version]');
const statusLatency = document.querySelector('[data-status-latency]');
const statusMotd = document.querySelector('[data-status-motd]');

async function loadServerStatus() {
  if (!statusHost) return;

  const host = statusHost.getAttribute('data-server-host') || 'voxensmp.xyz';
  const endpoint = `https://api.mcsrvstat.us/3/${host}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Network response error');

    const data = await response.json();

    if (statusOnline) {
      const onlineText = data.online ? 'Online' : 'Offline';
      statusOnline.textContent = onlineText;
      statusOnline.classList.toggle('status-live', Boolean(data.online));
      statusOnline.classList.toggle('status-offline', !data.online);
    }

    if (statusPlayers) {
      const players = data.players?.online ?? 0;
      const maxPlayers = data.players?.max ?? '?';
      statusPlayers.textContent = `${players}/${maxPlayers}`;
    }

    if (statusVersion) statusVersion.textContent = data.version || '-';
    if (statusLatency) statusLatency.textContent = data.debug?.ping ? `${data.debug.ping} ms` : 'N/A';

    if (statusMotd) {
      const motdRaw = data.motd?.clean?.join(' ') || 'Selamat datang di VoxenSMP';
      statusMotd.textContent = motdRaw;
    }
  } catch (error) {
    if (statusOnline) {
      statusOnline.textContent = 'Gagal Ambil Data';
      statusOnline.classList.add('status-offline');
      statusOnline.classList.remove('status-live');
    }
    if (statusPlayers) statusPlayers.textContent = '-';
    if (statusVersion) statusVersion.textContent = '-';
    if (statusLatency) statusLatency.textContent = '-';
    if (statusMotd) statusMotd.textContent = 'API mcstats tidak bisa diakses sementara.';
  }
}

loadServerStatus();
setInterval(loadServerStatus, 60000);
