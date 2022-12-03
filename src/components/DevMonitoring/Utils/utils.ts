import config from '../../../config';
import { useDevMonitoringStore } from '../../../pinia/devMonitoringStore';

async function showErrorScreenShot(screenShotId: string) {
  const devMonitoringStore = useDevMonitoringStore();
  const image = await devMonitoringStore.getScreenshot(screenShotId);
  const contentType = 'image/png';
  const byteCharacters = atob(image.substring(`data:${contentType};base64,`.length));
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += config.screenHeight) {
    const slice = byteCharacters.slice(offset, offset + config.screenHeight);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  const blobUrl = URL.createObjectURL(blob);

  window.open(blobUrl, '_blank');
}

async function getScreenshot(screenShotId: string) {
  const devMonitoringStore = useDevMonitoringStore();
  const image = await devMonitoringStore.getScreenshot(screenShotId);
  const contentType = 'image/png';
  const byteCharacters = atob(image.substring(`data:${contentType};base64,`.length));
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += config.screenHeight) {
    const slice = byteCharacters.slice(offset, offset + config.screenHeight);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

export { showErrorScreenShot, getScreenshot };
