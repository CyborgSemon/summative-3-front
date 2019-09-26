# Summative 3 Front End

### Ensure that you have NPM and Node.js installed on your computer
To get set up, clone or download the repo, then rename the `configExample.json` file to `config.json`.

### AJAX requests are used in this project. So it must be on a live site, or a virtual server to work.

If you are going to be running this site on your own computer (XAMPP, MAMP, etc), your `config.json` file should look something like this:
```json
{
	"SERVER_URL": "http://localhost",
	"SERVER_PORT": "3000"
}
```
However, if you are running this project inside a virtual server (virtualbox, etc), you will most likely need to change the `SERVER_URL` section to match whatever your virtual server is set to. The port is set to `3000` by default, but you can change it in the `server.js` file on the back end repo if needed (You will need [grunt](https://gruntjs.com/getting-started) installed on the server to make the change)
Once that is done, open the root folder up in terminal and type:

```sh
npm install
```

This should get the front end all set up.
Check out the [back end repo](https://github.com/CyborgSemon/summative-3-back) README.md to set up the server part of this project.
