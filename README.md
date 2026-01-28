# StephenSmithwick.github.io
This is a personal static jekyll site which deploys as part of Github Pages: [StephenSmithwick.github.io
](https://StephenSmithwick.github.io).

## Dependencies
- Ruby 2.7.6
- Jekyll + Ruby dependencies in Gemfile

## To build locally
- Install build dependencies: just, ruby, pnpm - `brew install rbenv rbenv-gemset pnpm`
- Add rbenv shims to your path in your rc file (in my `~/.zprofile ` I added `eval "$(rbenv init - zsh)"`).
- Install project dependencies: `just install-dependencies`
- Install Jekyll `bundle install`

### running server
Please use `just serve` to start a local jekyll server.

Below are other just commands:

```jq
just --list
Available recipes:
    build-comments-app             # build comments-app
    clean                          # clean project
    default                        # list commands
    install-comments-app           # move comments-app into jekyll and update references
    install-dependencies           # Install Project dependencies
    new-post category slug +title  # creates a new post with todays date and specified title, slug, and category
    post-categories                # List all post categories currently used
    post-needs-work target="all"   # Breakdown of posts by `need-works` field
    post-stats field="categories"  # Breakdown posts by any meta field (date, layout, title, date, categories)
    post-summary                   # Summarize all posts
    serve +options="--unpublished" # Run Jekyll Server Locally
    serve-comments                 # Run Comments Server Locally
```

### Updating dependencies

Main Blog (jekyll)
: Update dependencies `bundle update`.
: Build and test locally: `just serve`.

Comments client (comments-solid)
: Update dependencies: `(cd comments-solid && pnpm update)`.
: Build and test locally: `just serve`.

Comments server (comments-service)
: Update dependencies: `(cd comments-service && pnpm update)`.
: Start comment service locally `just serve-comments`.
: Update `_config.yml` > comments > app_url to point to localhost. 
: Build and test locally `just serve`.

## Overview of content in blog
- **Resume** - Found under `/resume` Uses the `resume` layout and styles. A resume is composed of a selection of resume sections under `/_resume_sections/`
- **Posts** - A collection of useful blog posts for future reference found under `/_posts/` the title follows the following format: `YYYY-MM-DD-${slug}.md`.  Use `just new-post` to create a new post
- **Fonts** - OpenSans for CV and AtkinsonHyperlegible for blog
- **Comments** - `/comments-service` is the neon/next.js middleware hosted in vercel.  `/comments-solid` is the web client embedded at the bottom of every post.  It is compiled and installed under `/comments-app` (`just install-comments`)


Thanks for taking a look :)
