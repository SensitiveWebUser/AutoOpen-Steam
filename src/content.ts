(() => {
  const CONSTANTS = {
    URL_PARAM_ID: 'id',
    STORAGE_KEY_PREFERENCE: 'defaultPreference',
    DEFAULT_PREFERENCE: 'ask' as PreferenceOption,
    STEAM_PROTOCOL_URL: 'steam://url/CommunityFilePage',
    BUTTON_ID: 'autoopen-steam-button',
    BUTTON_CLASS: 'autoopen-steam-btn',
    BUTTON_CONTAINER_CLASS: 'autoopen-steam-container',
    BUTTON_TEXT: 'Open in Desktop App',
    SELECTOR_TARGET_CONTAINER: '.workshopItemDetailsHeader',
    SELECTOR_SUBSCRIBE_BUTTON: '.btn_green_steamui, .general_btn.subscribe',
    INIT_FLAG: '__autoOpenSteamInitialized',
    ID_VALIDATION_REGEX: /^\d+$/,
  } as const;

  function getWorkshopId(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get(CONSTANTS.URL_PARAM_ID);
    return id && CONSTANTS.ID_VALIDATION_REGEX.test(id) ? id : null;
  }

  async function getPreference(): Promise<PreferenceOption> {
    return new Promise((resolve) => {
      chrome.storage.sync.get([CONSTANTS.STORAGE_KEY_PREFERENCE], (result) => {
        resolve(
          (result[CONSTANTS.STORAGE_KEY_PREFERENCE] as PreferenceOption) ||
            CONSTANTS.DEFAULT_PREFERENCE
        );
      });
    });
  }

  function openInSteamApp(workshopId: string): void {
    window.location.href = `${CONSTANTS.STEAM_PROTOCOL_URL}/${workshopId}`;
  }

  function createButton(workshopId: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.id = CONSTANTS.BUTTON_ID;
    button.className = CONSTANTS.BUTTON_CLASS;
    button.textContent = CONSTANTS.BUTTON_TEXT;
    button.type = 'button';
    button.addEventListener('click', () => openInSteamApp(workshopId));
    return button;
  }

  function createButtonContainer(button: HTMLButtonElement): HTMLDivElement {
    const container = document.createElement('div');
    container.className = CONSTANTS.BUTTON_CONTAINER_CLASS;
    container.appendChild(button);
    return container;
  }

  function insertButtonIntoDOM(
    buttonContainer: HTMLDivElement,
    targetContainer: HTMLElement
  ): void {
    const subscribeButton = targetContainer.querySelector(CONSTANTS.SELECTOR_SUBSCRIBE_BUTTON);
    if (subscribeButton?.parentElement) {
      subscribeButton.parentElement.insertBefore(buttonContainer, subscribeButton.nextSibling);
    } else {
      targetContainer.insertBefore(buttonContainer, targetContainer.firstChild);
    }
  }

  function injectButton(workshopId: string): void {
    if (document.getElementById(CONSTANTS.BUTTON_ID)) {
      return;
    }

    const targetContainer = document.querySelector<HTMLElement>(
      CONSTANTS.SELECTOR_TARGET_CONTAINER
    );
    if (!targetContainer) {
      return;
    }

    const button = createButton(workshopId);
    const buttonContainer = createButtonContainer(button);
    insertButtonIntoDOM(buttonContainer, targetContainer);
  }

  function isAlreadyInitialized(): boolean {
    return (window as any)[CONSTANTS.INIT_FLAG] === true;
  }

  function markAsInitialized(): void {
    (window as any)[CONSTANTS.INIT_FLAG] = true;
  }

  function setupMutationObserver(): void {
    const observer = new MutationObserver(() => {
      if (!document.getElementById(CONSTANTS.BUTTON_ID)) {
        const newId = getWorkshopId();
        if (newId) {
          injectButton(newId);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  const init = async (): Promise<void> => {
    if (isAlreadyInitialized()) {
      return;
    }
    markAsInitialized();

    const workshopId = getWorkshopId();
    if (!workshopId) {
      return;
    }

    const preference = await getPreference();
    if (preference === 'disabled') {
      return;
    }

    if (preference === 'always') {
      openInSteamApp(workshopId);
    } else if (preference === 'ask') {
      injectButton(workshopId);
      setupMutationObserver();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
