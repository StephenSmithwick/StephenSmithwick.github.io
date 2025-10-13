date := `date "+%Y-%m-%d"`
post := `cat post.header.template.md`
comments_html := `cat comments-solid/comments.template.html`

# list commands
default:
    just --list

# Run Jekyll Server Locally
serve: install-comments-app
    bundle exec jekyll serve

# Run Comments Server Locally
serve-comments: install-comments-app
    (cd comments-service && pnpm dev)

# clean project
clean:
    bundle exec jekyll

# build comments-app
build-comments-app:
    (cd comments-solid && pnpm install && pnpm build)

# move comments-app into jekyll and update references
install-comments-app: build-comments-app
    #! /bin/bash
    rm -rf comments-app && mkdir -p comments-app
    cp -r comments-solid/dist/* comments-app

    js=$(ls comments-app/assets/*.js)
    css=$(ls comments-app/assets/*.css)

    cat << HTML > _includes/comments.html
    {{comments_html}}
    HTML

# creates a new post with todays date and specified title, slug, and category
new-post category slug +title:
    #! /bin/bash
    title="{{title}}"
    category="{{category}}"
    cat << POST > "_posts/{{date}}-{{slug}}.md"
    {{post}}
    POST

# List all post categories currently used
post-categories:
    @ ggrep -Poh "(?<=categories: ).*" -R _posts/. \
    | sort | uniq \
    | awk '\
    NR == 1 { ls = $0 } \
    NR >  1 { ls = ls "\033[34m, \033[31m" $0 } \
    END     { print "\033[31m", ls, "\033[0m" }'

# Summarize all posts
post-summary:
    @ ggrep -m 10 -P "(?<=(categories|title): ).*" -R _posts/. \
    | awk -F: '\
    $1 != prefix  { prefix=$1; print "\n\033[34m" prefix "\033[0m"; $1="" } \
    { field=$2; $1=$2=""; print "\033[32m" field ": \033[0m" $0 }'

# Breakdown posts by any meta field (date, layout, title, date, categories)
post-analysis field="categories":
    @ ggrep -Poh "(?<=^{{field}}: ).*$" -R _posts/. \
    | sort | uniq -c | sort -nr \
    | awk '{ printf "%20s \033[34m", $2 "(" $1 ")"; for(i=0;i<$1;i++) printf "▐"; print "\033[0m" }'

# Breakdown of posts by `need-works` field
post-needs-work target="all": && (post-analysis "needs-work")
    @ if [[ "{{target}}" != "all" ]]; then \
        printf "\e[34m{{target}}: \e[0m\n"; \
        grep -rl "needs-work: *{{target}}" _posts | sed "s/_posts\//\t/"; \
        echo; \
    fi
