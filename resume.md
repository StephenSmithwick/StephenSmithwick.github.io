---
layout: resume
title: "Stephen Smithwick"
date: 2022-09-19 20:33:58
categories: resume
---

{% for section in site.resume %}
<section {% if section.class %} class="{{ section.class }}" {% endif %}>
    {% if section.header %}
        <h2>{{ section.header }}</h2>
    {% endif %}

    {{ section.content | markdownify }}
</section>
{% endfor %}