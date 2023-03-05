---
layout: resume
title: "Resume - Stephen Smithwick"
date: 2023-03-05
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