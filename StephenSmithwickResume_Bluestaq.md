---
layout: resume
title: "Resume - Stephen Smithwick"
date: 2025-03-17
categories: resume
hide: true
---

{% for section in site.resume_bluestaq %}
<section {% if section.class %} class="{{ section.class }}" {% endif %}>
    {% if section.header %}
        <h2>{{ section.header }}</h2>
    {% endif %}

    {{ section.content | markdownify }}
</section>
{% endfor %}
