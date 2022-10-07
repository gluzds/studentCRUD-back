## NodeJS SimpleCRUD

This API was built using [Express](https://expressjs.com). It's based on REST, which returns JSON-encoded responses, and uses the standard HTTP status.

### Entity
It contains a single entity with the attributes name, address, and photo as we can see below:

![Student table](./student_table.png?raw=true)

The photo attribute does not store the image itself, but the location in the file system.

### Architecture

This application was designed to run inside Docker containers, one for the NodeJS application, on port 3333, and another running MySQL, on 3306. Currently, this setup is running on an AWS EC2.
![Architecture](./arch.png?raw=true)

The configuration can be seen in the docker-compose.yml file:

```yaml
  app:
    build: .
    command: yarn start
    restart: on-failure
    ports:
      - '3333:3333'
    networks:
      - backend
    volumes:
      - .:/usr/app
    depends_on:
      - mysql
```
```yaml
  mysql:
    container_name: 'node-db'
    image: mysql:5.7
    command: --default-authentication-plugin=mysql_native_password --init-file /data/application/init.sql
    volumes:
      - ./init.sql:/data/application/init.sql
    restart: always
    ports:
      - '3306:3306'
    networks:
      - backend
    environment:
      MYSQL_ROOT_PASSWORD: root
```

### Prerequisites

#### Node

Since this application was build on NodeJS we will need it in order to run. It can be downloaded
[here](https://nodejs.org/en/download/).

#### Docker

We use Docker to make it simpler to run both components, as it offer several pre-configured images with the technologies needed already set. Also allows to run each component in an isolated environment, reducing issues relate to it.

-   To install Docker on Windows follow the instructions [here](https://docs.docker.com/docker-for-windows/)
-   To install Docker on Mac follow the instructions [here](https://docs.docker.com/docker-for-mac/)
-   To install Docker on Linux follow the instructions [here](https://docs.docker.com/install/)

Also, we use Docker Compose, which enable us to configure multiple containers in the same file and run all at once with a single command. 
For Mac and Windows users Docker compose is installed by default with Docker; however, if you're running on Linux you will need to install it manually following the [instructions](https://docs.docker.com/compose/install/)

### Running the application

To start up the NodeJS application and MySQL database there are only a few commands needed, that are shown below:

```console
git clone https://github.com/gluzds/studentCRUD-back.git
cd studentCRUD-back
npm install
docker-compose up
```

### Endpoints

First, let's take a quick look on what **CRUD** stand for:
**Create**, **Read**, **Update** and **Delete** are the four basic functions of persistent storage.
Which relates to some HTTP methods available, the table below display these:
![Architecture](./Http.png?raw=true)

#### Create Endpoints

`POST` - **/students**

This endpoint receives an image file, so the header needs to have **Content-Type** set to "multipart/form-data". The content will look like:
```
photo: (binary)
name: gdfgdfgdf
address: gdfgfd
```
If the entity is created the endpoint will return an HTTP status **201**

`GET` - **/students**

Retrieves all the students stored in the database, the response will be an array of objects in JSON format.
```
[
    {
        "id": 1,
        "name": "Maria Silva",
        "address": "Rua Anita Garibaldi 200",
        "photo": "/1665114592428.jpg"
    },
    {
        "id": 15,
        "name": "José Alves",
        "address": "Rua Protásio Alves 1700, 1101",
        "photo": "/1665114713882.jpeg"
    }
]
```
`GET` - **/students/{id}**

Retrieves a single student where the ID matches the one provided in the URL, the response will be an array with a single object. If none exists with the given ID, it returns HTTP status **404**.
```
[
    {
        "id": 15,
        "name": "José Alves",
        "address": "Rua Protásio Alves 1700, 1101",
        "photo": "/1665114713882.jpeg"
    }
]
```
`UPDATE` - **/students/{id}**

Update the data from a single entity. This endpoint receives an image file, so the header needs to have **Content-Type** set to "multipart/form-data". The request payload should look like below:
```
photo: (binary)
name: gdfgdfgdf
address: gdfgfd
```
If the request succeeds the endpoint will return an HTTP status **201**.

`DELETE` - **/students/{id}**

This endpoint will delete the student with the id provided in the route params. If the request succeeds it will return an HTTP status **200**.