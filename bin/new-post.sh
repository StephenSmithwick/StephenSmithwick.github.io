#! /bin/bash

if [ "$#" -lt 3 ]; then
    echo "usage: $0 [slug] [category] [Title]"
    exit 1
fi


post_dir="$(dirname "$(readlink -f "$0")")/../_posts";
slug="$1"; shift
category="$1"; shift
title=$@

echo "post_dir=$post_dir
slug=$slug
category=$category
title=$title"

echo "
---
layout: post
title:  $title
categories: $category
published: true
# last_edit:
---
" > "${post_dir}/$(date "+%Y-%m-%d")-${slug}.md"
