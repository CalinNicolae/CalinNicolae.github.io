# posts.json documentation

`data/posts.json` is the single source of truth for all blog content on this portfolio. It is a JSON array of post objects. Every page that displays post data fetches this file at runtime: `blog.js` for the listing page, `post.js` for individual post pages, and `index.js` for the featured posts grid on the home page.

No build step processes this file. Changes take effect as soon as the file is saved and deployed.

---

## Table of contents

- [Field reference](#field-reference)
- [Validation rules](#validation-rules)

---

## Field reference

The table below lists every field used in the codebase. "Required" means the JavaScript will malfunction or display broken output if the field is absent.

| Field | Type | Required | Used by | Description |
|---|---|---|---|---|
| id | string | YES | blog.js, post.js, index.js | Unique identifier. Used as the URL query parameter `?id=`. |
| title | string | YES | blog.js, post.js, index.js | Post title displayed in cards and on the post page. |
| date | string | NO | blog.js, post.js, index.js | Display date string. Used for sorting and shown in post headers. |
| category | string | YES | blog.js, post.js, index.js | Used to build the filter bar and shown as a tag label. |
| tags | array of strings | NO | Not rendered | Metadata. Not displayed anywhere. |
| excerpt | string | YES | blog.js, post.js, index.js | Short description shown on cards and in page meta description. |
| readTime | string | NO | blog.js, post.js | Human-readable read time, e.g. "3 minutes". Shown in post header. |
| content | string | YES | post.js | Relative path to the HTML fragment file for the post body. |
| coverImage | string | NO | blog.js, post.js, index.js (indirectly) | Relative path to the cover image. Shown on cards and post pages. |
| speakerName | string | NO | post.js | Name shown in the speaker card section. |
| speakerBio | string | NO | post.js | Bio text shown in the speaker card section. |
| gallery | array of objects | NO | post.js | List of gallery images shown below the post body. |

---

## Validation rules

There is no schema validation at runtime. The JavaScript assumes the JSON is well-formed and that required fields are present. The following rules prevent broken rendering:

- `id` must be unique. Duplicate ids cause the wrong post to load.
- `id` must not contain characters that break URL query strings.
- `content` must point to an existing, fetchable file. A missing file shows a fallback message rather than crashing.
- `coverImage` must point to an existing image. A missing image shows the browser's broken image icon.
- `gallery[].src` must point to an existing image for the same reason.
- `date` values should be parseable by `new Date()` for reliable sort order.
