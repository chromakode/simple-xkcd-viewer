# A simple xkcd comic viewer

As an exercise, here's a simple xkcd viewer written in vanilla ES2017 with no
libraries. This was my first time using async/await rather than bare promises.
I like how that turned out, though to my inexperienced eye it was harder to
tell where my code was asynchronous, which led to some early race conditions.

Unfortnuately xkcd's API endpoints don't include permissive CORS headers, so I
needed to use their JSONP API, which made a fetch function necessary. For
convenience, I also wrote a little hyperscript implementation to help me
organize my DOM creation code.

Some of xkcd's comics are special and interactive -- these sometimes don't have
an image equivalent. This implementation makes no effort to treat these
specially. I originally hoped to include support for xkcd's high DPI 2x images,
but unfortunately these aren't available in the current API. I tried
manipulating the image URLs, replacing ".png" -> "_2x.png", but that didn't
work in all cases.
