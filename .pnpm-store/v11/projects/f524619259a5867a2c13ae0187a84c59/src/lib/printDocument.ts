export type PrintableDocument = Blob | string;

/**
 * Opens a PDF or image in a hidden print frame and starts the browser print
 * dialog after the document has loaded.
 */
export function printDocument(source: PrintableDocument): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  let objectUrl: string | null = null;
  let documentUrl: string;

  if (source instanceof Blob) {
    objectUrl = URL.createObjectURL(source);
    documentUrl = objectUrl;
  } else {
    documentUrl = source;
  }
  const iframe = document.createElement("iframe");

  iframe.setAttribute("title", "Print document");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  iframe.src = documentUrl;

  const cleanup = () => {
    iframe.remove();

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };

  iframe.onload = () => {
    window.setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      window.setTimeout(cleanup, 1_000);
    }, 500);
  };

  document.body.appendChild(iframe);
}
