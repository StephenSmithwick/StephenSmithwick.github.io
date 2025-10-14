---
layout: page
title: "Resume Variants"
---

<ul class="blog-list">
    {% for page in site.pages %}{% if page.layout == 'resume' %}
    <li>
        <span class="title">
            <a href="{{ page.url | prepend: site.baseurl }}" >
                {{ page.title }}
            </a>
            <span class="category">{{ page.categories }}</span>
        </span>
        <span class="edit">
            {% if page.last_edit %} edited: {{page.last_edit | date: "%b
            %-d, %Y"}} {% endif %}
        </span>
    </li>
    {% endif %} {% endfor %}
</ul>
