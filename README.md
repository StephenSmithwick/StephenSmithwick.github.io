# StephenSmithwick.github.io
This is a personal static jekyll site which deploys as part of Github Pages: [StephenSmithwick.github.io
](https://StephenSmithwick.github.io).

## Dependencies
- Ruby 2.7.6
- Jekyll + Ruby dependencies in Gemfile

## To build locally
- Install ruby
  - I recommend first installing rbenv + rbenv-gemset via homebrew (`brew install rbenv rbenv-gemset`)
  - Add rbenv shims to your path in your rc file (in my `~/.zprofile ` I added `eval "$(rbenv init - zsh)"`).
  - from the project directory: `rbenv install`
- Install Jekyll `bundle install`

### running server
Please use `just serve` to start a local jekyll server.

Below are other just commands:

```jq
just --list
Available recipes:
    build-comments                   # build comments-app
    clean                            # clean project
    default                          # list commands
    install-comments                 # move comments-app into jekyll and update references
    new-post category slug +title    # creates a new post with todays date and specified Title, slug, and category
    post-analysis field="categories" # Breakdown posts by any meta field (date, layout, title, date, categories)
    post-categories                  # List all post categories currently used
    post-needs-work target="all"     # Breakdown of posts by `need-works` field
    post-summary                     # Summarize all posts
    serve                            # Run Dev Server Locally
```
## Overview of content in blog
- **Resume** - Found under `/resume` Uses the `resume` layout and styles. A resume is composed of a selection of resume sections under `/_resume_sections/`
- **Posts** - A collection of useful blog posts for future reference found under `/_posts/` the title follows the following format: `YYYY-MM-DD-${slug}.md`.  Use `just new-post` to create a new post
- **Fonts** - OpenSans for CV and AtkinsonHyperlegible for blog
- **Comments** - `/comments-service` is the neon/next.js middleware hosted in vercel.  `/comments-solid` is the web client embedded at the bottom of every post.  It is compiled and installed under `/comments-app` (`just install-comments`)


Thanks for taking a look :)
