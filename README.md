# Requirements

`sudo apt install nginx uwsgi python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools python3-venv uwsgi-plugin-python3`

# Installation

1. Clone repo
2. Build python virtualenv
3. Activate and install the need python libraries

`source apis/venv/bin/activate`
`pip install flask requests`

4. Create uwsgi ini file

```
[uwsgi]
plugin = python3
uid = www-data
gid = www-data
chdir = /var/www/apis
virtualenv = /var/www/apis/venv
module = wsgi:app
master = true
processes = 5
vacuum = true
die-on-term = true
touch-reload = /var/www/apis/wow.py
```

5. Create nginx configuration for the site

```
server {
    listen 80;
    server_name decent.team;

    location / {
        root /var/www/html;
    }

    location /api {
        include uwsgi_params;
        uwsgi_pass unix:/run/uwsgi/app/wow/socket;
    }
}
```
