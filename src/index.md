---
layout: base
---

<img class="image" src="https://source.unsplash.com/0kCrlrs8gXg/700x900" width="800" height="480" style="object-position: 0% 86.25%; height: auto; aspect-ratio: 5/3;">

<div class="meta">
<figure>
<img class="reference" src="https://source.unsplash.com/0kCrlrs8gXg/700x900" alt="reference for original image">
<figcaption><a href="https://source.unsplash.com/0kCrlrs8gXg/700x900">View full original image</a></figcaption>
</figure>

```css
.image {
  max-width: 100%;
  height: auto;
  aspect-ratio: 5/3;
  object-fit: cover;
  object-position: 0% 86.25%;
}
```

</div>

<article>

## About

This utility was built with the static site generator [Eleventy](https://11ty.dev) and was created by [Stephanie Eckles](https://twitter.com/5t3ph) who is both [a big fan of 11ty](https://11ty.rocks) and an advocate for [modern CSS](https://moderncss.dev).

The primary dependency is the [sharp package resize API](https://sharp.pixelplumbing.com/api-resize) to help calculate the focal point using [Shannon entropy](https://en.wikipedia.org/wiki/Entropy_%28information_theory%29). Dynamically generated results are possible thanks to [Eleventy Serverless](https://www.11ty.dev/docs/plugins/serverless/).

<small><em>Credit for demo photo goes to <a href="https://unsplash.com/photos/0kCrlrs8gXg">Joshua Oyebanji</a> on Unsplash</em>.</small>

## API Options

Send a full, absolute image path as the `image` URL parameter to `{{ meta.url }}/generate/` to receive the default adjustments based on an aspect-ratio of `5/3`.

[{{ meta.url }}/generate/?image=https://source.unsplash.com/0kCrlrs8gXg/700x900]({{ meta.url }}/generate/?image=https://source.unsplash.com/0kCrlrs8gXg/700x900)

### Custom Ratio

To customize the ratio used, add `&ratio=x/y`.

[{{ meta.url }}/generate/?image=https://source.unsplash.com/0kCrlrs8gXg/700x900&ratio=8/3]({{ meta.url }}/generate/?image=https://source.unsplash.com/0kCrlrs8gXg/700x900&ratio=8/3)

_Note:_ if you'd like a square, pass `&ratio=1/1`.

### Use Image Dimensions

Optionally, pass a desired image width and height to be used _instead of_ an aspect ratio for determining the `object-position` value.

[{{ meta.url }}/generate/?image=https://source.unsplash.com/0kCrlrs8gXg/700x900&width=700&height=500]({{ meta.url }}/generate/?image=https://source.unsplash.com/0kCrlrs8gXg/700x900&width=700&height=500)

</article>