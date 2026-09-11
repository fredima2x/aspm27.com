const supportedOS = [
  "Windows", "macOS", "Linux"
]

const downloadButton = document.querySelector('.download-button');
const downloadOSLabel = document.querySelector('.download-os-label');
const downloadLabel = document.querySelector('.download-label');
const downloadVersionLabel = document.querySelector('.download-version-label');
const altDownloadContainer = document.querySelector('.alt-download-container');
const sizeLabel = document.querySelector('.download-size-label');
const downloadIcon = document.querySelector('.download-icon');

let downloadURLs = {};
let operatingSystem = "";

function getOS() {
  const ua = navigator.userAgent;

  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";

  return false
}

function getAssetSuffix(os) {
  let suffix = "";

  if (os === "Windows") { suffix = ".exe" }
  if (os === "macOS") { suffix = ".dmg" }
  if (os === "Linux") { suffix = ".AppImage" }
  if (os === "Linux-deb") { suffix = ".deb" }
  if (os === "Linux-rpm") { suffix = ".rpm" }

  return suffix
}

async function getLatestRelease() {
  const response = await fetch(
    "https://api.github.com/repos/fredima2x/aspm27/releases/latest"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch latest release");
  }

  return await response.json();
}

function getAssetURL(release, os) {
  const suffix = getAssetSuffix(os);

  const asset = release.assets.find(asset => {
    const name = asset.name.toLowerCase();

    return (
      name.includes("aspm27") &&
      name.endsWith(suffix.toLowerCase())
    );
  });

  if (!asset) {
    console.error(`Kein ${os}-Asset gefunden!`);
    return null;
  }

  return asset.browser_download_url;
}

function getAssetSize(release, os) {
  const asset = release.assets.find(asset => {
    const name = asset.name.toLowerCase();

    return (
      name.includes("aspm27") &&
      name.endsWith(getAssetSuffix(os).toLowerCase())
    );
  });

  if (!asset) {
    console.error(`Kein ${os}-Asset gefunden!`);
    return null;
  }

  return asset.size;
}

function formatBytes(bytes) {
  const units = ['B', 'K', 'M', 'G', 'T'];
  let i = 0;

  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }

  return `${bytes.toFixed(i === 0 ? 0 : 1).replace(/\.0$/, '')}${units[i]}`;
}

async function init() {
  const release = await getRelease();
  if (!release) return;

  downloadURLs = updateDownloadURLs(release);
  operatingSystem = getOS();

  updateDownloadLabel(operatingSystem, release);
  updateAlternativeDownloads(operatingSystem)
  updateSizeLabel(release, operatingSystem);
  updateDownloadIcon(operatingSystem)
}

function updateDownloadLabel(current, release) {
  if (downloadVersionLabel) {
    downloadVersionLabel.textContent = release.tag_name;
  }

  if (downloadOSLabel) {
    if (!current || !supportedOS.includes(current)) {
      downloadOSLabel.textContent = "Your OS is not supported!";
    } else {
      downloadOSLabel.textContent = `${current} (${getAssetSuffix(current)})`;
    }
  }
}

function updateDownloadURLs(release) {
  return {
    "Windows": getAssetURL(release, "Windows"),
    "macOS": getAssetURL(release, "macOS"),
    "Linux": getAssetURL(release, "Linux"),
    "Linux-deb": getAssetURL(release, "Linux-deb"),
    "Linux-rpm": getAssetURL(release, "Linux-rpm"),
  };
}

async function getRelease() {
  const cachedRelease = localStorage.getItem("latest_github_release");
  const lastUpdate = localStorage.getItem("latest_github_release_last_update");
  const oneHour = 60 * 60 * 1000;
  let release;

  if (
    !cachedRelease ||
    !lastUpdate ||
    Date.now() - Number(lastUpdate) >= oneHour
  ) {
    try {
      release = await getLatestRelease();
    } catch {
      console.error("Error Fetching Release Information!")
      return;
    }

    localStorage.setItem("latest_github_release", JSON.stringify(release));
    localStorage.setItem("latest_github_release_last_update", Date.now().toString());
  } else {
    release = JSON.parse(cachedRelease);
  }

  return release;
}

function updateAlternativeDownloads(current) {
  if (!altDownloadContainer) return;

  let alternativeDownloads = [
    "Windows",
    "macOS",
    "Linux",
    "Linux-deb",
    "Linux-rpm"
  ];

  alternativeDownloads = alternativeDownloads.filter(
    element => element !== current
  );

  altDownloadContainer.innerHTML = "";

  // "Other versions" immer als erste Option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Other versions";
  defaultOption.selected = true;
  defaultOption.disabled = true;

  altDownloadContainer.appendChild(defaultOption);

  alternativeDownloads.forEach((os) => {
    const element = document.createElement("option");

    element.value = os;
    element.textContent = `${os} (${getAssetSuffix(os)})`;

    altDownloadContainer.appendChild(element);
  });
}

function updateDownloadIcon(os) {
  if (!downloadIcon) return;

  let suffix;
  if (os === "Windows") { suffix = "windows2" }
  if (os === "macOS") { suffix = "macos" }
  if (os === "Linux" || os === "Linux-rpm" || os === "Linux-deb") { suffix = "linux" }

  if (!suffix) return;

  downloadIcon.src = `./assets/${suffix}.svg`;
  downloadIcon.alt = `${os} logo`;
}

function updateSizeLabel(release, os) {
  if (!sizeLabel) return;

  const assetSize = getAssetSize(release, os);
  if (assetSize == null) return;

  const size = formatBytes(assetSize);
  sizeLabel.textContent = `${size}`;
}

try {
  await init();
} catch(error) {
  console.log(`Unexpected error in init(): ${error}`);
}

if (altDownloadContainer) {
  altDownloadContainer.addEventListener('change', async () => {
    operatingSystem = altDownloadContainer.value;

    if (downloadOSLabel) {
      downloadOSLabel.textContent = `${operatingSystem} (${getAssetSuffix(operatingSystem)})`;
    }

    updateSizeLabel(await getRelease(), operatingSystem)
    updateAlternativeDownloads(operatingSystem)
    updateDownloadIcon(operatingSystem)

    if (downloadLabel) {
      downloadLabel.textContent = "Download";
    }
  });
}

if (downloadButton) {
  downloadButton.addEventListener('click', () => {
    const url = downloadURLs[operatingSystem];

    if (!url) {
      console.error("Keine Download-URL für", operatingSystem);
      return;
    }

    if (downloadLabel) {
      downloadLabel.textContent = "Downloading...";
    }

    window.location.href = url;
  });
}
