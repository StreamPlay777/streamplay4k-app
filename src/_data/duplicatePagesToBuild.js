/**
 * The subset of _data/duplicatePages.js that this build should render.
 *
 * Keeping the filter here (rather than returning `permalink: false` per page)
 * means a draft record is simply absent from the pagination source: drafts are
 * visible while developing and never reach a production build, the sitemap or
 * any collection.
 */
import duplicatePages from "./duplicatePages.js";
import site from "./site.js";

export default duplicatePages.filter((record) => {
  if (!record || !record.slug || !record.sourceTemplate) return false;
  if (record.status === "draft" && site.isProduction) return false;
  return true;
});
