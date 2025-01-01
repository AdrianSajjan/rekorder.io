class Offscreen {
  creating: Promise<void> | null = null;

  static createInstance() {
    return new Offscreen();
  }

  async setup(path: string) {
    const url = chrome.runtime.getURL(path);
    const contents = await chrome.runtime.getContexts({ contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT], documentUrls: [url] });

    if (contents.length > 0) return;

    if (this.creating) {
      await this.creating;
    } else {
      this.creating = chrome.offscreen.createDocument({
        url: path,
        reasons: [chrome.offscreen.Reason.USER_MEDIA, chrome.offscreen.Reason.DISPLAY_MEDIA, chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: 'Record users desktop screen and audio and microphone audio',
      });
      await this.creating;
      this.creating = null;
    }
  }
}

const offscreen = Offscreen.createInstance();

export { offscreen, Offscreen };
