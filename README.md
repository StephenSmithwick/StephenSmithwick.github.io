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
- Start serving local content `bundle exec jekyll serve`
- Clean up local content `bundle exec jekyll clean`

## Overview of content in blog
- **Resume** - Uses `resume.html`, `resume.scss` and none of the blog styling and layouts are used. The resume is composed of a collection of ordered sections under `_resume` with the following format: `${order}_${section_name}.md`
- **Posts** - A collection of useful blog posts for future reference found under `_posts/` the title follows the following format: `YYYY-MM-DD-${title}.md`
- **Fonts** - OpenSans for CV and AtkinsonHyperlegible for blog
- **Greasemonkey** - Useful Greasemonkey/Tampermonkey scripts to add value to this blog.

## This project has Just Recipes
```bash
just --list
Available recipes:
    build-comments                   # build js-frameworks/solid-comments
    default                          # list commands
    install-comments                 # move js-frameworks/solid-comments into jekyll and update references
    new-post category slug +title    # creates a new post with todays date and specified Title, slug, and category
    post-analysis field="categories" # Breakdown posts by any meta field (date, layout, title, date, categories)
    post-categories                  # List all post categories currently used
    post-needs-work target="all"     # Breakdown of posts by `need-works` field
    post-summary                     # Summarize all posts
```

Thanks for taking a look :)
