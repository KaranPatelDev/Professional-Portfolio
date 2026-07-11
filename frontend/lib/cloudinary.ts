/** Forces a Cloudinary URL to download as an attachment (Content-Disposition)
 * instead of opening inline in the browser tab, with a clean filename. */
export function toAttachmentUrl(url: string, filename = "Karan-Patel-Resume"): string {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/fl_attachment:${filename}/`);
}
