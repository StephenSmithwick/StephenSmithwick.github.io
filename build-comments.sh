#! /bin/bash

echo "This is a temporary solution to aid in integrating the solid comments client into the blog.  Until we have a better build approach you will also need to update the references to assets in _includes/comments.html after running this script"

# build and replace
(cd js-frameworks/solid-comments && pnpm install && pnpm build) \
&& rm -rf comments-app && mkdir -p comments-app \
&& cp -r js-frameworks/solid-comments/dist/* comments-app



js=$(ls comments-app/assets/*.js)
css=$(ls comments-app/assets/*.css)

cat << HTML > _includes/comments.html
<script type="module" crossorigin src="/${js}"></script>
<link rel="stylesheet" crossorigin href="/${css}">
<script>window.POST_SLUG="{{ page.slug }}"</script>

<noscript>You need to enable Comments.</noscript>

<div id="comments"></div>
<a href="{{ site.comments.app_url }}?post={{ page.slug }}">- comments app</a>
HTML
