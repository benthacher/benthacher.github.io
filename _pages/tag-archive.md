---
title: "Projects by Tag"
permalink: /tags/
collection: projects
# author_profile: true
---

{% include group-by-array.html collection=site.projects field='tags' %}

<ul>
  {% for tag in group_names %}
    {% assign projects = group_items[forloop.index0] %}

    <li>
      <h2>{{ tag }}</h2>
      <ul>
        {% for project in projects %}
        <li>
          <a href='{{ site.baseurl }}{{ project.url }}'>{{ project.title }}</a>
        </li>
        {% endfor %}
      </ul>
    </li>
  {% endfor %}
</ul>