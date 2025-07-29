![NestJS Badge](https://img.shields.io/badge/NestJS-ES2016-red.svg)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js Badge](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![RabbitMQ Badge](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 1. About the Project

Welcome to the **URL Shortener API**! This application offers a scalable solution for managing shortened URLs and efficiently tracking their access counts.

The core functionality includes:
* **Efficient URL Shortening**: Transform long, cumbersome URLs into concise, easy-to-share short codes.
* **Seamless Redirection**: Instantly redirect users from a short URL to its original destination.
* **Asynchronous Access Tracking**: Utilizes a decoupled message queuing system to count URL accesses without impacting immediate redirect performance.

Stack:
* **NestJS**: A progressive Node.js framework, providing a solid foundation for building efficient, reliable, and scalable server-side applications with TypeScript.
* **TypeORM**: A versatile Object Relational Mapper (ORM) for seamless and type-safe interaction with the database.
* **RabbitMQ**: Employed as an asynchronous message broker to handle high-volume event processing, specifically for incrementing URL access counts, ensuring excellent decoupling and system responsiveness.
* **PostgreSQL**: Relational database serving as the primary data store.
* **Swagger**: Integrated for automatic generation of interactive API documentation, making it easy to understand and test all available endpoints.
* **Docker & Docker Compose**: Providing a streamlined and reproducible development and deployment environment, ensuring consistency across different machines.

---

## 2. Features

* **URL Shortening**: Create unique short codes for long URLs.
* **URL Redirection**: Redirect users from short URLs to original long URLs.
* **Access Counter**: Asynchronously track the number of times a short URL has been accessed using RabbitMQ.
* **URL Deletion**: Authenticated users can delete URLs they own.
* **API Documentation**: Auto-generated interactive API documentation with Swagger.
* **Global Validation Pipes**: Ensures incoming data adheres to defined schemas.
---

## 3. Getting Started

Follow these detailed steps to running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, make sure you have the following installed on your system:

* **Node.js**: LTS version (e.g., v18.x or v20.x). You can download it from [nodejs.org](https://nodejs.org/en/).
* **npm**: The Node.js package manager, which comes with Node.js.
* **Git**: For cloning the repository. You can download it from [git-scm.com](https://git-scm.com/).
* **Docker & Docker Compose**: Essential for the Docker setup. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop).
* **PostgreSQL**: (Only for **local development** without Docker) Install it from [postgresql.org](https://www.postgresql.org/download/).
* **RabbitMQ**: (Only for **local development** without Docker) Install it from [rabbitmq.com](https://www.rabbitmq.com/download.html).

### Local Development Setup

This setup allows you to run the NestJS application directly on your machine, connecting to locally installed PostgreSQL and RabbitMQ instances.

1.  **Install Node.js dependencies:**
    Navigate into the project directory and install all required Node.js packages:
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the **root** of your project by copying the provided `.env.example` file:
    ```bash
    cp .env.example .env
    ```
    Now, open the newly created `.env` file and **fill in the required values**. Ensure your `RABBITMQ_URL` and database credentials point to your *locally running* RabbitMQ and PostgreSQL instances.

    Here's an example `.env` for local setup (adjust ports and credentials as per your actual local setup):
    ```env
    PORT=3000
    NODE_ENV=development

    # Database Configuration (for local PostgreSQL)
    DATABASE_TYPE=postgres
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USERNAME=your_db_user      # e.g., postgres
    DATABASE_PASSWORD=your_db_password  # e.g., mysecretpassword
    DATABASE_NAME=your_db_name          # e.g., url_shortener_db

    # RabbitMQ Configuration (for local RabbitMQ)
    RABBITMQ_URL=amqp://localhost:5672
    ```

3.  **Start local PostgreSQL and RabbitMQ instances:**
    Before running the NestJS app, ensure your PostgreSQL and RabbitMQ servers are actively running and accessible.
    * **PostgreSQL**: Make sure your PostgreSQL server is started, and you've created a database matching your `DATABASE_NAME` (e.g., `url_shortener_db`) with the specified `DATABASE_USERNAME` and `DATABASE_PASSWORD`.
    * **RabbitMQ**: Ensure your RabbitMQ server is started and listening on the port defined in `RABBITMQ_URL`.

4.  **Run database migrations:**
    With your database running and `.env` configured, apply the necessary database schema changes by running TypeORM migrations. This sets up your tables and relationships:
    ```bash
    npm run typeorm migration:run
    ```

5.  **Run the application in development mode:**
    Finally, start the NestJS application. It will run in development mode, enabling hot-reloading for faster development:
    ```bash
    npm run start:dev
    ```
    Your application will now be accessible at `http://localhost:3000` (or the `PORT` specified in your `.env`). It will also establish connections to RabbitMQ, acting as both a message sender and a message listener.

### Docker Setup

This setup leverages Docker Compose to spin up the application, PostgreSQL, and RabbitMQ in isolated containers. This provides a consistent, reproducible development environment without needing local installations of PostgreSQL or RabbitMQ.

1.  **Ensure Docker and Docker Compose are installed** on your machine.

2.  **Set up environment variables:**
    Create a `.env` file in the **root** of your project by copying the provided example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and fill in the required values. For Docker Compose, you'll typically point `RABBITMQ_URL` and database credentials to the **service names** defined in your `docker-compose.yml`.

    Here's an example `.env` for Docker Compose setup:
    ```env
    PORT=3000
    NODE_ENV=development

    # Database Configuration (for Docker PostgreSQL service)
    DATABASE_TYPE=postgres
    DATABASE_HOST=postgres_db       # This matches the service name in docker-compose.yml
    DATABASE_PORT=5432
    DATABASE_USERNAME=docker_user   # Matches POSTGRES_USER in docker-compose.yml
    DATABASE_PASSWORD=docker_password # Matches POSTGRES_PASSWORD in docker-compose.yml
    DATABASE_NAME=my_docker_db      # Matches POSTGRES_DB in docker-compose.yml

    # RabbitMQ Configuration (for Docker RabbitMQ service)
    RABBITMQ_URL=amqp://rabbitmq:5672 # This matches the service name in docker-compose.yml
    ```
    **Important:** Carefully adjust the `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`, and `RABBITMQ_URL` host to precisely match the values configured in your `docker-compose.yml` for the respective services.

3.  **Build and run the Docker containers:**
    This command will build your application's Docker image (if not already built) and then start all services defined in your `docker-compose.yml` (NestJS, PostgreSQL, RabbitMQ).
    ```bash
    docker-compose up --build
    ```
    * The `--build` flag ensures that your application's Docker image is rebuilt from scratch, which is crucial after any code changes.
    * To run containers in the background (detached mode), use: `docker-compose up --build -d`

4.  **Access the application:**
    Once all containers are up and running, your NestJS application will be accessible at:
    ```
    http://localhost:3000
    ```
    (Or the `PORT` specified in your `.env` file).

6.  **View logs (optional):**
    To see real-time logs from all running services:
    ```bash
    docker-compose logs -f
    ```
    To view logs for a specific service (e.g., just your NestJS application):
    ```bash
    docker-compose logs -f app
    ```

7.  **Stop and clean up containers (optional):**
    When you're done, you can stop all services and remove their containers:
    ```bash
    docker-compose down
    ```
    To also remove any volumes (useful for a fresh database slate on next startup):
    ```bash
    docker-compose down -v
    ```

---

## 4. API Endpoints

The API documentation is fully interactive and available via Swagger.

* **Swagger UI:** `http://localhost:3000/docs` (or your configured port)

---


## 5. Horizontal Scalability: Improvements & Challenges

### Key Improvement Points

To enhance horizontal scalability:
* **Load Balancing**: Implement a **load balancer** (e.g., Nginx, AWS ELB, Google Cloud Load Balancer) in front of multiple instances of the NestJS application. This will distribute incoming API requests evenly across all running application containers.
* **Caching Strategy**: Introduce a **distributed caching layer** (e.g., Redis) for frequently accessed data, especially for URL lookups during redirection. This reduces the load on the database and speeds up response times. Implement caching at both the application level and potentially at the database query level.
* **Statelessness of Application Instances**: Ensure all application instances remain **stateless**. This application is largely stateless thanks to JWT for authentication and RabbitMQ for asynchronous processing, which is crucial for horizontal scaling. Any session state or temporary data should be managed externally (e.g., in Redis).

### Major Challenges

Implementing horizontal scalability also brings its own set of challenges:

* **Database Contention**: Even with read replicas, **write-heavy operations** (like shortening URLs or incrementing access counts if not fully asynchronous) can still lead to contention on the primary database. Strategies like database sharding or implementing eventual consistency models for certain data might become necessary.
* **Consistency vs. Availability**: When distributing data across multiple nodes (e.g., in a sharded database or a distributed cache), maintaining strong consistency across all nodes can be challenging. You might need to make trade-offs, accepting **eventual consistency** for some less critical data to maintain high availability.
* **Monitoring and Observability**: As the number of services and instances grows, **monitoring** becomes exponentially more complex. Implementing robust logging, metrics and tracing is essential to identify bottlenecks and troubleshoot issues in a distributed environment.
* **Distributed Transactions**: If new features introduce complex business logic that spans multiple services and requires strong consistency across them, managing **distributed transactions** can be a significant architectural challenge.
* **Unique Short Code Generation at Scale**: Ensuring the generation of truly unique and collision-free short codes at very high rates across multiple application instances can become a subtle challenge, potentially requiring a dedicated distributed service or a robust mechanism to handle collisions efficiently.
