type PreferenceOption = 'always' | 'disabled' | 'ask';

const CONSTANTS = {
  STORAGE_KEY_PREFERENCE: 'defaultPreference',
  DEFAULT_PREFERENCE: 'ask' as PreferenceOption,
  ELEMENT_ID_PREFERENCE_SELECT: 'preference',
  ELEMENT_ID_STATUS_MESSAGE: 'status-message',
  ELEMENT_ID_VERSION_NUMBER: 'version-number',
  STATUS_MESSAGE_TEXT: 'Settings saved!',
  STATUS_MESSAGE_DURATION_MS: 2000,
  CSS_CLASS_SHOW: 'show',
  VERSION_PREFIX: 'v',
} as const;

function loadPreference(): void {
  chrome.storage.sync.get([CONSTANTS.STORAGE_KEY_PREFERENCE], (result) => {
    const preference =
      (result[CONSTANTS.STORAGE_KEY_PREFERENCE] as PreferenceOption) ||
      CONSTANTS.DEFAULT_PREFERENCE;
    const selectElement = document.getElementById(
      CONSTANTS.ELEMENT_ID_PREFERENCE_SELECT
    ) as HTMLSelectElement | null;
    if (selectElement) {
      selectElement.value = preference;
    }
  });
}

function showStatusMessage(): void {
  const statusElement = document.getElementById(CONSTANTS.ELEMENT_ID_STATUS_MESSAGE);
  if (!statusElement) {
    return;
  }

  statusElement.textContent = CONSTANTS.STATUS_MESSAGE_TEXT;
  statusElement.classList.add(CONSTANTS.CSS_CLASS_SHOW);

  setTimeout(() => {
    statusElement.classList.remove(CONSTANTS.CSS_CLASS_SHOW);
    statusElement.textContent = '';
  }, CONSTANTS.STATUS_MESSAGE_DURATION_MS);
}

function savePreference(preference: PreferenceOption): void {
  chrome.storage.sync.set({ [CONSTANTS.STORAGE_KEY_PREFERENCE]: preference }, () => {
    showStatusMessage();
  });
}

function displayVersion(): void {
  const manifest = chrome.runtime.getManifest();
  const versionElement = document.getElementById(CONSTANTS.ELEMENT_ID_VERSION_NUMBER);
  if (versionElement) {
    versionElement.textContent = `${CONSTANTS.VERSION_PREFIX}${manifest.version}`;
  }
}

function setupPreferenceChangeListener(): void {
  const selectElement = document.getElementById(
    CONSTANTS.ELEMENT_ID_PREFERENCE_SELECT
  ) as HTMLSelectElement | null;
  if (selectElement) {
    selectElement.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement;
      savePreference(target.value as PreferenceOption);
    });
  }
}

function init(): void {
  loadPreference();
  displayVersion();
  setupPreferenceChangeListener();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
