---
layout: page
title: "Resumes"
---

<div class="home">
    <ul class="blog-list">
        {% for resume in site.pages %}{% if resume.layout == 'resume' %}
        <li>
            <span class="title">
                <a href="{{ resume.url | prepend: site.baseurl }}" >
                    {{ resume.title }}
                </a>
                <span class="category">{{ resume.categories }}</span>
            </span>
            <span class="edit">
                {% if resume.last_edit %} edited: {{resume.last_edit | date: "%b
                %-d, %Y"}} {% endif %}
            </span>
        </li>
        {% endif %} {% endfor %}
    </ul>
</div>
