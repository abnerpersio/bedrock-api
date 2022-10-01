# Bedrock API

<img alt="Bloco de bedrock do Minecraft" src="./assets/bedrock.png" width="100px" />

This is a project created for learning about security in my Node.JS apps.

I learned a lot of things about Metasploit, nmap function, Rate Limiter, NGINX, Docker, Jest testings with MongoDB and made my think about a lot of thinks. 

### How to run the project

#### With docker:

Configure enviroment variables in `docker-compose.yaml` file in `api` and `mongo` sections

Run `docker-compose up`

**See the magic happening :)**

##### Without docker

**Requirements:**

- MongoDB running

Create `.env` file in root

Fill enviroment variables according `.env.example` file (don't forget MongoDB access)

Run `npm install` or `yarn`

Run `npm run build` or `yarn build`

Run `npm run start` or `yarn start`

**See the magic happening :)**

If you want, you can change the content in `src` folder 
run `npm run dev` or `yarn dev` to see your changes happening in real time

### Techs used:

- Typescript
- Express
- MongoDB
- Docker
- NGINX
- Jest for automated tests


See what is happening and my newest changes at the `develop` branch

### See my notes at Notion:

[Click here to read my notes](https://abnerpersio.notion.site/Notas-bedrock-api-3a1749e12b294bc7894007ea3dc8db2f)
