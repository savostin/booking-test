# Coding challenge
## Booking API

### Task description
Prepare a RESTful API in Nodejs to manage hotel bookings:

- Mock hotels data with rooms
- Prepare API endpoints to handle features:
    - find hotels rooms available in the specific period
    - make a booking - use selected hotel, room, user information, time period etc (example on booking.com)
    - update booking
    - cancel booking
- Use cache and secure endpoints.
- Prepare unit tests and functional tests.
- Make a deployment on the popular free hosting provider.

Using Typescript - nice welcome.

### Deployment process
- Install Docker
- Clone repo
- Create .env file in the root dir. See [.env.example](/.env.example)
- Run 
```
docker build -t booking .
docker run -p ${LOCAL_PORT}:${WEB_PORT} --name booking booking
```
- As an alternative use [Devcontainers for VSCode](https://code.visualstudio.com/docs/devcontainers/containers)

### How to use
- The API endpoint is /api/v1/
- Swagger UI is on [http://localhost:${LOCAL_PORT}/api/v1/docs/](/api/v1/docs/)

### Developer notes
- Used frameworks and technologies:
    - Node.js LTS (Typescript)
    - SQLite3 (the simplest way to deploy)
    - TypeORM
    - Express.js, Helmet
    - TSOA, Swagger
    - Winston (logs)
- At the start the app fills DB with some random data (see src/database/init.demo.ts). The first user has a static API key from .env for testing purpose.
- The API uses simple authentication by API key in headers.

- Known bugs:
    - Dates issue: as the reservation starts at the midday it should be possible to make a 2 reservations at that days. But as hotel might have its own checkin/checkout time for this task it's simplified to dissallow reservation at boundary  days.
    - Errors (especially input validation ones) are not really informative.
    - Some files like tsoa.json are hardcoded and doesn't use .env
    - No unit tests. Sorry.

- Future improvements:
    - Utilise .env as wide as possible.
    - Switch to a proper database engine to support more types. For example hotel and room facilities are not supported.
    - Add hotel checkin/checkout times and allow reservations for boundary dates. 
    - More logging and telemetry.
    - Improve error messages and return codes.
    - Add more convinient authentication method, like JWT.
