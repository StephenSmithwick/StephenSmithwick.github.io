#! /bin/bash

(cd js-frameworks/solid-comments && pnpm install && pnpm build)
cp -r js-frameworks/solid-comments/dist/* comments-app

echo "This is a temporary solution to aid in integrating the solid comments client into the blog.  Until we have a better build approach you will also need to update the references to assets in _includes/comments.html after running this script"
