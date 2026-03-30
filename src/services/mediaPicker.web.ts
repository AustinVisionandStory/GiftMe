export async function pickAvatarImage() {
  if (typeof document === "undefined") {
    throw new Error("Image selection is unavailable in this browser.");
  }

  return new Promise<string | null>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    const cleanup = () => {
      input.onchange = null;
      input.onerror = null;
      input.remove();
    };

    input.onchange = () => {
      const file = input.files?.[0] ?? null;
      cleanup();
      resolve(file ? URL.createObjectURL(file) : null);
    };

    input.onerror = () => {
      cleanup();
      reject(new Error("We couldn't open the image picker."));
    };

    document.body.appendChild(input);
    input.click();
  });
}
