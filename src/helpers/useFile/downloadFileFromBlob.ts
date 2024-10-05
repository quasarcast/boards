export function downloadFileFromBlob (blobUrl: string, fileName: string) {
  // Create a temporary anchor element
  const anchor = document.createElement('a')

  // Set the href attribute to the blob URL
  anchor.href = blobUrl

  // Set the download attribute with the desired file name
  anchor.download = fileName

  // Append the anchor to the body (required for some browsers)
  document.body.appendChild(anchor)

  // Programmatically trigger the click event to start the download
  anchor.click()

  // Remove the anchor from the document after the download starts
  document.body.removeChild(anchor)

  // Revoke the blob URL if it's no longer needed (optional)
  URL.revokeObjectURL(blobUrl)
}
