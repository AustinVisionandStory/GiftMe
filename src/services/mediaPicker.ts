import { Platform } from "react-native";

type MediaPickerModule = {
  pickAvatarImage: () => Promise<string | null>;
};

let mediaPickerModulePromise: Promise<MediaPickerModule> | null = null;

async function getMediaPickerModule() {
  if (mediaPickerModulePromise) {
    return mediaPickerModulePromise;
  }

  mediaPickerModulePromise =
    Platform.OS === "web"
      ? import("./mediaPicker.web")
      : import("./mediaPicker.native");

  return mediaPickerModulePromise;
}

export async function pickAvatarImage() {
  const mediaPicker = await getMediaPickerModule();
  return mediaPicker.pickAvatarImage();
}
