"Now I am become death, the destroyer of REST APIs"

Just a fairly-limited script that requests with a bunch of probably-invalid combinations of headers against a given URL.

```
$ npm install -g .
$ oppenheimer http://your-url.example.com/some-path
```

If the API returns a 5XX status for the request, it's considered a failure. You'll get a report at the end.
