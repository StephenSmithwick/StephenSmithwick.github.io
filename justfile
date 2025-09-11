date := `date "+%Y-%m-%d"`
post := '''
    ---
    layout: post
    title:  ${title}
    categories: ${category}
    published: true
    # last_edit:
    ---
'''
comments_html := '''
    <script type="module" crossorigin src="/${js}"></script>
    <link rel="stylesheet" crossorigin href="/${css}">
    <script>window.POST_SLUG="{{ page.slug }}"</script>

    <noscript>You need to enable javascript to make a comment.</noscript>

    <div id="comments"></div>
    <a href="{{ site.comments.app_url }}?post={{ page.slug }}">- comments app</a>
'''

# list commands
default:
    just --list

# build js-frameworks/solid-comments
build-comments:
    (cd js-frameworks/solid-comments && pnpm install && pnpm build)

# move js-frameworks/solid-comments into jekyll and update references
install-comments: build-comments
    #! /bin/bash
    js=$(ls comments-app/assets/*.js)
    css=$(ls comments-app/assets/*.css)

    cat << HTML > _includes/comments.html
    {{comments_html}}
    HTML

# creates a new post with todays date and specified Title, slug, and category
new-post category slug +title:
    #! /bin/bash
    title="{{title}}"
    category="{{category}}"
    cat << POST > "_posts/{{date}}-{{slug}}.md"
    {{post}}
    POST

# List all post categories currently used
post-categories:
    @ ggrep -Poh "(?<=categories: ).*" -R _posts/. | sort | uniq

# Summarize all posts
post-summary:
    @ ggrep -m 10 -P "(?<=(categories|title): ).*" -R _posts/. \
    | awk -F: '\
    NR==1         { prefix=$1 } \
    $1 != prefix  { prefix=$1; print "\n" prefix; $1=""; print $0 } \
    $1 == prefix  { $1=""; print $0 }'
