import MarkdownIt from "markdown-it";
import mila from "markdown-it-link-attributes";
import { light as emoji } from "markdown-it-emoji";
import sub from "markdown-it-sub";
import sup from "markdown-it-sup";
import mark from "markdown-it-mark";
import ins from "markdown-it-ins";
import deflist from "markdown-it-deflist";
import abbr from "markdown-it-abbr";
import container from "markdown-it-container";
import footnote from "markdown-it-footnote";
import anchor from "markdown-it-anchor";

export const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(mila, { attrs: { target: "_blank", rel: "noopener" } })
  .use(emoji)
  .use(sub)
  .use(sup)
  .use(mark)
  .use(ins)
  .use(deflist)
  .use(abbr)
  .use(container, "warning")
  .use(footnote)
  .use(anchor);