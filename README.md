# StephenSmithwick.github.io
My github page.  Deploys as a static site as part of Github Pages.  Uses Jekyl to render markdown sass and html
into personal html pages.

## Dependencies
- Ruby 2.7.6
- Jekyll + Ruby dependencies in Gemfile

## To build locally
- Install ruby 
  - I recommend first installing rbenv + rbenv-gemset via homebrew (`brew install rbenv rbenv-gemsets`) 
  - Add rbenv shims to your path in your rc file (in my `~/.zprofile ` I added `eval "$(rbenv init - zsh)"`).
  - from the project directory: `rbenv install`
- Install Jekyll `bundle install`
- Start serving local content `bundle exec jekyll serve`

## Overview of content in blog
- **Resume** - Uses `resume.html`, `resume.scss` and none of the blog styling and layouts are used. The resume is composed of a collection of ordered sections under `_resume` with the following format: `${order}_${section_name}.md`
- **Posts** - A collection of useful blog posts for future reference found under `_posts/` the title follows the following format: `YYYY-MM-DD-${title}.md`
- **Fonts** - OpenSans for CV and AtkinsonHyperlegible for blog
- **Greasemonkey** - Useful Greasemonkey/Tampermonkey scripts to add value to this blog.

## Reviewing feedback
The Contact Form submits to this google sheet: 
  [stephensmithwick.github.io/submissions](https://docs.google.com/spreadsheets/d/1JKbfmLUuQCjdYEyA0UPPoTFH158ZPrFjYEwnQ_4DIs4) 
(Note: Access is restricted)

Thanks for taking a look :)
