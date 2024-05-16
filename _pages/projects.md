---
title: Projects
# layout: collection
permalink: /projects/
collection: projects
# entries_layout: grid
classes: wide
---

<style>

*[data-tooltip] {
  position: relative;
  display: inline-block;
}

*[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 85%);
  width: 120px;
  border-radius: 6px;
  padding: 5px;
  font-size: 20px;

  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;

  opacity: 0;
  transition: opacity 0.25s;
  z-index: 1;

  pointer-events: none;
}

*[data-tooltip]:hover::before {
  opacity: 0.99;
}

.card-container {
    display: grid;
    gap: 10px; /* Adjust the gap between images */
    max-width: 1200px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.card img, .card a, .card {
    width: 100%;
    height: auto;
    display: block;
}

</style>


<div class="card-container">
    {% for project in site.projects %}
    <div class="card">
        <a href='{{ site.baseurl }}{{ project.url }}' data-tooltip='{{ project.title }}'><img style="border-radius: 6%; object-fit: cover;" src='{{ project.header.teaser }}'></a>
    </div>
    {% endfor %}
</div>