## Testing production build lcoally

Set the values in your `.env.local.` to use the correct values for your environment.

Modify your host files so the url of the environment to test point to `127.0.0.1`.

Generate a fake certificate to host on https. You only need to do that once, or if it expired. You can write whatever you want in the questions asked.

```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

Install the `http-server` module globally.

```
npm i -g http-server
```

Start the server using the certificate. The following example is for QA environment, change the value after `-a` to test other environment.

```
http-server --ssl --cert cert.pem -a kf-qa.netlify.com -p 443 build
```

⚠️ Navigate to `https://kf-qa.netlify.com/index.html` to view the page, as the routing is not configured properly. `https://kf-qa.netlify.com/` won't work.
