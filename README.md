# Virma backend
This repository contains backend source code for Virma application. Application is hosted at https://virma.lounaistieto.fi.

# Getting started

## Prerequisities
Main frameworks used are Express, Passport & Sequelize. Express is a node.js framework that works as a server that serves API endpoints. Passport is used for handling application's authentication and Sequelize for modeling database tables & executing queries against them.

For possible db sync with backend Sequalize is used. However, currently it has been configured in a way where it doesn't sync db models to connected PostgreSQL instance. This can be done by running backend with uncommenting sequelize.sync() command on db/index.js file. On this project sequelize is used to make queries against PostgreSQL and is has nice query syntax for simple queries.

## Installing and running backend
First install npm packages

```
$ npm install
```

Then configure backend config.js -file to the project root. In this file it is mandatory to define prod and dev object that follow this structure:

```
const prod = {
  username: <db-user>,
  password: <db-pass>,
  db: <db-name>,
  host: <db-host>,
  port: <db-port>,
  apiHost: <api-host>,
  senderEmail: <application-email>,
  directUrl: <application-direct-url>,
  sessionSecret: <sessionSecret>
}

const dev = {
  ...
}

const config = process.env.NODE_ENV === 'development' ? dev : prod;

module.exports = config;
```

If you are developing locally run with "npm start-dev". It runs the backend with dev configs (running by default at http://localhost:8081).

```
cross-env NODE_ENV=development node server/server.js
```

In production run with "npm start". This runs the following script with prod configs and forever (server will run continuously).

```
cross-env NODE_ENV=production forever start server/server.js
```

In order to use forever, it needs to be installed globally with the following command -> npm install forever -g

# Development
Local development can be done easily with setting up a local PostgreSQL server and connecting backend into it.

1. Install PostgreSQL and preferrably PgAdmin for viewing db content
2. Setup config.js files with locally running PostgreSQL instance connection details
3. Manually add table scripts into PostgreSQL instance or sync them with sequelize (explained above)
4. Start backend with development settings

# Deployment
Deployment instructions are based on the current deployment. Different technologies can be used. 

When moving new bundle to the server, it is also necessary to move static assets seperately (css, .jpg, .json files).

### Ubuntu 16.04
- Default configuration.
- Remember to open ports for (Sendmail, Nginx & PostgreSQL)
  - e.g. 22, 443, 80, 5432

### PostgreSQL + PostGIS
- Default installation (remember to create PostGIS extension!)
- Add the following tables (e.g. points and points_approval are identical tables)
  - These can be added with command-line using psql or for example with pgAdmin

#### points & points_approval (points_approval is identical with different table name)
```
CREATE SEQUENCE public.points_gid_seq;
ALTER SEQUENCE public.points_gid_seq OWNER TO postgres;

CREATE TABLE public.points (
    gid integer DEFAULT nextval('public.points_gid_seq'::regclass) NOT NULL,
    class1_fi character varying(254),
    class1_se character varying(254),
    class1_en character varying(254),
    class2_fi character varying(254),
    class2_se character varying(254),
    class2_en character varying(254),
    name_fi character varying(254),
    name_se character varying(254),
    name_en character varying(254),
    address character varying(254),
    municipali character varying(254),
    subregion character varying(254),
    region character varying(254),
    info_fi character varying(254),
    info_se character varying(254),
    info_en character varying(254),
    chall_clas character varying(254),
    accessibil character varying(254),
    equipment character varying(254),
    www_fi character varying(254),
    www_se character varying(254),
    www_en character varying(254),
    telephone character varying(254),
    email character varying(254),
    ownerclass character varying(254),
    owner character varying(254),
    upkeeper character varying(254),
    upkeepinfo character varying(254),
    upkeepclas character varying(254),
    shapeestim character varying(254),
    sh_es_date date,
    sh_es_pers character varying(254),
    updater_id character varying(254),
    x_eureffin numeric,
    y_eureffin numeric,
    "timestamp" date,
    zip character varying(254),
    munici_nro character varying(254),
    subreg_nro character varying(254),
    region_nro character varying(254),
    special character varying(254),
    no_address character varying(1),
    publicinfo character varying(1),
    geom public.geometry(Point,3067)
);

ALTER TABLE public.points OWNER TO postgres;
ALTER TABLE ONLY public.points ADD CONSTRAINT points_copy_pkey PRIMARY KEY (gid);
CREATE INDEX points_geom_idx ON public.points USING gist (geom);
```

##### Point example from virma.fi:
|gid|geom|id|class1_fi|class1_se|class1_en|class2_fi|class2_se|class2_en|name_fi|name_se|name_en|municipali|subregion|region|info_fi|info_se|info_en|chall_clas|length_m|accessibil|www_fi|www_se|www_en|email|telephone|upkeeper|upkeepinfo|upkeepclas|shapeestim|sh_es_date|sh_es_pers|timestamp|updater_id|special|munici_nro|subreg_nro|region_nro|publicinfo|picture|www_picture|hidden|datasource|ski_route|
|---|----|--|---------|---------|---------|---------|---------|---------|-------|-------|-------|----------|---------|------|-------|-------|-------|----------|--------|----------|------|------|------|-----|---------|--------|----------|----------|----------|----------|----------|---------|----------|-------|----------|----------|----------|----------|-------|-----------|------|----------|---------|
|103|MULTILINESTRING ((...))|103|Virkistysreitti|Rekreationsrutt|Recreational route|Retkeilyreitti|Vandringsled|Hiking trail|Kirjaisten Gloetin reitti|Gloets vandringsrutt i Kirjais|Gloet hiking trail in Kirjais|Parainen|Turunmaa|Varsinais-Suomi|Reitin pituus 4 km. Matkan varrella näk..|Ruttens län...|Length of the trail...|Vaativa, paljon korkeuseroja|4600||https://retkipaikka.fi/nauvon-saaristossa-kevatta-etsimassa/|||||ei tietoa ylläpitäjästä||ei tietoa ylläpitoluokasta||||2022-08-15|XX||445|21|02|F|picture author|https://placehold.co/600x400/EEE/31343C.jpg|false|notknown|false|


#### routes & routes_approval (routes_approval is identical with different table name)
```
CREATE SEQUENCE public.routes_gid_seq;
ALTER SEQUENCE public.routes_gid_seq OWNER TO postgres;

CREATE TABLE public.routes (
    gid integer DEFAULT nextval('public.routes_gid_seq'::regclass) NOT NULL,
    class1_fi character varying(254),
    class1_se character varying(254),
    class1_en character varying(254),
    class2_fi character varying(254),
    class2_se character varying(254),
    class2_en character varying(254),
    name_fi character varying(254),
    name_se character varying(254),
    name_en character varying(254),
    municipali character varying(254),
    subregion character varying(254),
    region character varying(254),
    info_fi character varying(254),
    info_se character varying(254),
    info_en character varying(254),
    chall_clas character varying(254),
    length_m character varying(254),
    accessibil character varying(254),
    www_fi character varying(254),
    www_se character varying(254),
    www_en character varying(254),
    email character varying(254),
    telephone character varying(254),
    upkeeper character varying(254),
    upkeepinfo character varying(254),
    upkeepclas character varying(254),
    shapeestim character varying(254),
    sh_es_date date,
    sh_es_pers character varying(254),
    "timestamp" date,
    updater_id character varying(254),
    special character varying(254),
    munici_nro character varying(254),
    subreg_nro character varying(254),
    region_nro character varying(254),
    publicinfo character varying(1),
    geom public.geometry(MultiLineString,3067)
);

ALTER TABLE public.routes OWNER TO postgres;
ALTER TABLE ONLY public.routes ADD CONSTRAINT routes_copy_pkey PRIMARY KEY (gid);
CREATE INDEX routes_geom_idx ON public.routes USING gist (geom);
```

##### Route example from virma.fi:
|id|geom|fid|gid|class1_fi|class1_se|class1_en|class2_fi|class2_se|class2_en|name_fi|name_se|name_en|address|municipali|subregion|region|info_fi|info_se|info_en|chall_clas|accessibil|equipment|www_fi|www_se|www_en|telephone|email|ownerclass|owner|upkeeper|upkeepinfo|upkeepclas|shapeestim|sh_es_date|sh_es_pers|updater_id|x_eureffin|y_eureffin|timestamp|zip|munici_nro|subreg_nro|region_nro|special|no_address|publicinfo|picture|www_picture|hidden|datasource|
|--|----|---|---|---------|---------|---------|---------|---------|---------|-------|-------|-------|-------|----------|---------|------|-------|-------|-------|----------|----------|---------|------|------|------|---------|-----|----------|-----|--------|----------|----------|----------|----------|----------|----------|----------|----------|---------|---|----------|----------|----------|-------|----------|----------|-------|-----------|------|----------|
|1150|POINT (246289.5 6711694.571699469)|1177|1150|Virkistyskohde|rekreationsobjekt|recreational attraction|Luonto- tai lintutorni|natur- eller fågeltorn|nature or bird watching tower|Järvelän näköala- ja lintutorni|||Järveläntie|Lieto|Turku|Varsinais-Suomi|Kesällä 2013 valmistunut Järvelän näkö..||||||https://lieto.fi/palvelut-ja-asiointi/liikunta/ulkoilualueet-ja-ulkoilureitit/lintutorni/|||||Kunta|Liedon kunta|||satunnainen||2021-10-27||authornam|246289.5|6711694.57169947|2022-08-11||423|023|02||F|F|picture author|https://placehold.co/600x400/EEE/31343C.jpg|false|notknown|

#### areas & areas_approval (areas_approval is identical with different table name)
```
CREATE SEQUENCE public.areas_gid_seq;
ALTER SEQUENCE public.areas_gid_seq OWNER TO postgres;

CREATE TABLE public.areas (
    gid integer DEFAULT nextval('public.areas_gid_seq'::regclass) NOT NULL,
    class1_fi character varying(254),
    class2_fi character varying(254),
    name_fi character varying(254),
    municipali character varying(254),
    info_fi character varying(254),
    class1_se character varying(254),
    class1_en character varying(254),
    class2_se character varying(254),
    class2_en character varying(254),
    name_se character varying(254),
    name_en character varying(254),
    address character varying(254),
    subregion character varying(254),
    region character varying(254),
    info_se character varying(254),
    info_en character varying(254),
    accessibil character varying(254),
    equipment character varying(254),
    www_fi character varying(254),
    www_se character varying(254),
    www_en character varying(254),
    telephone character varying(254),
    email character varying(254),
    ownerclass character varying(254),
    owner character varying(254),
    upkeeper character varying(254),
    upkeepinfo character varying(254),
    upkeepclas character varying(254),
    shapeestim character varying(254),
    sh_es_date date,
    sh_es_pers character varying(254),
    updater_id character varying(254),
    "timestamp" date,
    zip character varying(254),
    munici_nro character varying(254),
    subreg_nro character varying(254),
    region_nro character varying(254),
    no_address character varying(1),
    publicinfo character varying(1),
    special character varying(254),
    geom public.geometry(MultiPolygon,3067)
);

ALTER TABLE public.areas OWNER TO postgres;
ALTER TABLE ONLY public.areas ADD CONSTRAINT areas_pkey PRIMARY KEY (gid);
CREATE INDEX areas_geom_idx ON public.areas USING gist (geom);
```

#### users
```
CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    username text NOT NULL,
    password text NOT NULL,
    email text,
    admin boolean DEFAULT false,
    organization text,
    updater_id text,
    resetPasswordToken text,
    resetPasswordExpires timestamp without time zone,
    failedLoginAttempts integer DEFAULT 0,
    failedLoginTime timestamp without time zone
);

ALTER TABLE public.users OWNER TO postgres;
CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.users_id_seq OWNER TO postgres;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

# Initially it is preferrable to create at least one super user for the application. This can be done for example running psql command on the server command-line or using pgAdmin.

# psql (command-line)
$ sudo -i -u postgres (prompts for password)
$ psql
$ \c <db_name>
$ run following command

# pgAdmin (application)
1. On connected db -> right click -> Query Tool...
2. Paste following command and press run

INSERT INTO public.users(username, password, email, admin, organization, updater_id)
VALUES ('<username>', '<password>', '<email>', true, '<organization>', '<updater_id>'); 
```

#### logs
```
CREATE SEQUENCE public.logs_id_seq;
ALTER SEQUENCE public.logs_id_seq OWNER TO postgres;

CREATE TABLE public.logs (
    id integer DEFAULT nextval('public.logs_id_seq'::regclass) NOT NULL,
    operation text NOT NULL,
    target_name text,
    target_table text,
    "timestamp" timestamp without time zone,
    executor text
);

ALTER TABLE public.logs OWNER TO postgres;
ALTER TABLE ONLY public.logs ADD CONSTRAINT logs_pkey PRIMARY KEY (id);
```

### Nginx
```
sudo apt-get nginx
```

Certbot (Let's Encrypt) (for Nginx installation)
```
1. sudo apt-get update
2. sudo apt-get install software-properties-common
3. sudo add-apt-repository ppa:certbot/certbot
4. sudo apt-get update
5. sudo apt-get isntall python-certbot nginx
6. sudo certbot --nginx (asks for email address)
7. sudo certbot renew --dry-run

Nginx /etc/nginx/sites-enabled/default should look something after Certbot like this...

server {
  listen 80 default_server;
  listen [::]:80 default_server;

  listen 443 ssl;
  ssl_certificate <path-to-certificate>;
  ssl_certificate_key <path-to-cerfiticate-key>;

  include <letsencrypt-configs>
  ssl_dhparam <letsencrypt-configs>

  root <path-to-frontend>
  index index.html

  server_name <app-dns>

  location / {
    if ($ssl_protocol = "") {
      rewrite ^ https://$server_name$request_uri?;

      proxy_http_version 1.1.;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy-set_header Host $host;
      proxy_cache_bypass $http_upgrade;

      try_files $uri $uri/ =404;
    }
  }

  location /api {
    proxy_pass http://127.0.0.1:<backend_port>;
  }

  location /service {
    proxy_pass http://127.0.0.1:<frontend_port>;
  }
}
```

### Sendmail
```
1. sudo apt-get install sendmail
2. sudo sendmailconfig (set custom config)
3. service sendmail restart
4. Test mail can be send with following command -> echo "My test email" | /usr/sbin/sendmail my-email@address.com
```

### Install Mapproxy
In order to install Mapproxy files mapproxy.yaml & seed.yaml are needed.

```
$ sudo apt-get install aptitude
$ sudo aptitude install python-imaging python-yaml libproj-dev
$ easy_install pip
$ pip install MapProxy

Put Mapproxy on

$ mapproxy-util serve-develop -b 0.0.0.0 mapproxy.yaml &>/dev/null &

Load tiles (mapproxy has to be on while loading tiles)

$ mapproxy-seed -f mapproxy.yaml -s seed.yaml --progress-file .mapproxy_seed_progress
```

mapproxy.yaml
```
caches:
 TaustakarttaCache:
  grids: [JHS180]
  bulk_meta_tiles: true
  sources: [TaustakarttaSource]
  cache:
   type: sqlite
   directory: /opt/mapproxy/Taustakartta

layers:
 - name: Taustakartta
   sources: [TaustakarttaCache]
   title: Taustakartta

grids:
 JHS180:
  bbox: [-548576, 6291456, 1548576, 8388608]
  bbox_srs: EPSG:3067
  res: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]
  origin: sw
  srs: EPSG:3067

services:
 wmts:
  md:
   abstract: Valonia
   contact:
    country: Finland
    organization: Valonia
   title: Valonia

sources:
 TaustakarttaSource:
  coverage:
   bbox: [14.3349, 58.9984, 34.6744, 70.4674]
   bbox_srs: EPSG:4326
  req:
   layers: taustakartta_11,taustakartta_10,taustakartta_09,taustakartta_08,taustakartta_07,taustakartta_06,taustakartta_05,taustakartta_04,taustakartta_03,taustakartta_02,taustakartta_01
   transparent: true
   url: http://tiles.kartat.kapsi.fi/taustakartta?
  supported_srs: ['EPSG:3067', 'EPSG:4326']
  type: wms

```

seed.yaml
```
seeds:
 Taustakartta:
  caches: [TaustakarttaCache]
  grids: [JHS180]
  levels:
   to: 10
```

### Install Frontend
- Install as instructed on frontend README.md.

### Install Backend
- Install as instructed above.

### Automatic reloads for services

#### Backend
```
1. cd /etc/systemd/system
2. systemctl virma_backend
3. vi virma_backend.service (content below)
4. sudo systemctl enable virma_backend.service

[Unit]
Description=Node.js virma_backend server

[Service]
PIDFile=/tmp/virma_backend.pid
User=ubuntu
Group=ubuntu
Restart=always
KillSignal=SIGQUIT
WorkingDirectory=/opt/virma_backend/
ExecStart=/usr/bin/npm start

[Install]
WantedBy=multi-user.target
```

#### Mapproxy
```
1. cd /etc/systemd/system
2. systemctl mapproxy
3. vi mapproxy.service (content below)
4. sudo systemctl enable mapproxy.service

[Unit]
Description=mapproxy server

[Service]
PIDFile=/tmp/mapproxy.pid
User=ubuntu
Group=ubuntu
Restart=always
KillSignal=SIGQUIT
WorkingDirectory=/opt/mapproxy/
ExecStart=/usr/local/bin/mapproxy-util serve-develop -b 0.0.0.0 mapproxy.yaml

[Install]
WantedBy=multi-user.target
```

# Repository structure

```
.
|-- db
|   |-- models               Contains sequelize models for db
|-- emailTemplates           EmailTemplates for sendmail
|-- server                   Server routes, scripts and services
|   |-- routes               api routes
|   |-- scripts              backend scripts
|   |-- services             backend services
|   |-- api.js               api routes config
|   |-- server.js            Express server run scripts
|-- views                    Routing views
|-- config.js                Backend configuration
|-- package.json             Configure npm package & scripts
```

# License
Virma is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT)
