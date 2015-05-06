---
layout: default
title: All posts
permalink: /posts/
---

<div>
  <div class="container">
	  <div class="row">
	    <div class="col-md-12">
	      <ul class="list-unstyled">
	        {% for post in site.posts %}
	          <li>
	            <h3>
	              <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
	              <small>{{ post.date | date: "%b %-d, %Y" }}</small>
	            </h3>
	            <p>
	              {{ post.content }}
	            </p>
	          </li>
	        {% endfor %}
	      </ul>
	      <p class="text-muted">subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></p>
	    </div>
	  </div>
</div>