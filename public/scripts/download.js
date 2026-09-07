const supportedOS = [
  "Windows", "macOS", "Linux"
]

const downloadButton = document.querySelector('.download-button');
const downloadOSLabel = downloadButton.querySelector('.download-os-label');
const downloadLabel = downloadButton.querySelector('.download-label');
const downloadVersionLabel = downloadButton.querySelector('.download-version-label')
const altDownloadContainer = document.querySelector('.alt-download-container')

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

async function init() {
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

  downloadURLs = {
    "Windows": getAssetURL(release, "Windows"),
    "macOS": getAssetURL(release, "macOS"),
    "Linux": getAssetURL(release, "Linux"),
    "Linux-deb": getAssetURL(release, "Linux-deb"),
    "Linux-rpm": getAssetURL(release, "Linux-rpm"),
  };

  operatingSystem = getOS();

  downloadVersionLabel.textContent = release.tag_name;

  if (!operatingSystem || !supportedOS.includes(operatingSystem)) {
    downloadOSLabel.textContent = "Your OS is not supported!";
  } else {
    downloadOSLabel.textContent = `${operatingSystem} (${getAssetSuffix(operatingSystem)})`;
  }

  let alternativeDownloads = [];
  alternativeDownloads.push("Windows");
  alternativeDownloads.push("macOS");
  alternativeDownloads.push("Linux");
  alternativeDownloads.push("Linux-deb");
  alternativeDownloads.push("Linux-rpm");

  alternativeDownloads = alternativeDownloads.filter(
    element => element !== operatingSystem
  );

  altDownloadContainer.innerHTML = "";

  alternativeDownloads.forEach((os) => {
    let element = document.createElement("a");

    element.href = downloadURLs[os];
    element.className = `alt-download-${os}`;
    element.textContent = `- ${os} (${getAssetSuffix(os)})`;

    altDownloadContainer.appendChild(element);
  });
}

await init();

downloadButton.addEventListener('click', () => {
  const url = downloadURLs[operatingSystem];

  if (!url) {
    console.error("Keine Download-URL für", operatingSystem);
    return;
  }

  downloadLabel.textContent = "Downloading...";
  window.location.href = url;
});
