---
title: "How StreamPlay4K articles are structured"
slug: "how-streamplay4k-articles-are-structured"
description: "An internal reference article showing every field and feature the blog template supports. Never published — it stays a draft."
date: 2026-01-15
updated: 2026-01-15
author: "StreamPlay4K"
category: "Editorial"
tags: ["reference", "editorial"]
featuredImage: ""
featuredImageAlt: ""
canonical: ""
draft: true
---

This article exists to prove the blog pipeline works end to end. It carries
`draft: true`, so it renders during development and is excluded from
production builds, the sitemap and every collection.

## Front matter

Every article supports `title`, `slug`, `description`, `date`, `updated`,
`author`, `category`, `tags`, `featuredImage`, `featuredImageAlt`, `canonical`
and `draft`. Anything left empty falls back to a sensible default, so a future
admin can create a record with only the fields it actually has.

### Headings and anchors

Level 2 and 3 headings get IDs automatically, which is what makes deep links
and the table of contents work. A table of contents appears on its own once an
article has three or more of them.

## Metadata

Titles, descriptions, canonicals and robots directives are resolved centrally,
so an article never assembles its own `<head>`. A canonical is self-referencing
unless `canonical` is set.

## Related articles

Articles in the same category are linked at the foot of the page, up to three
of them.
