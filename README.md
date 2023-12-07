![image](https://github.com/gdamou/fifo-queue/assets/46034621/d1342649-1374-4131-b386-9aba3bd46413)
# Introduction

Hi!

This project aims to create a FIFO queue using React, TypeScript, and Express. It is a technical test for the startup Waalaxy.

# How to Run the Project

**You need to have Node 18 or higher installed on your machine.**

1. Clone this repository.
2. Move the `.env` file I sent you by email to `/packages/backend`. It will give you access to Redis.
3. Run `npm start` at the root of the project. This will ensure everything is installed and will start both the frontend and backend.

# How to Run Tests

Run `npm test` at the root of the project.

# Features

- Fully typesafe.
- Unit tests on the backend.
- GH Action to run tests for each push.
- Redis store to handle queue data.
- WebSocket to send queue events (action removed, queue status when a new client connects).
- Endpoint to add an action to the queue from the UI (`/queue/add`).
- Validate both front and back external source data with Zod.
- Share types/schemas between both packages.
- Similar design system to the Waalaxy app.
- Toast notifications displaying the result of the action added to the queue.

# Technical Choices

## Monorepo

Using TypeScript for both the frontend and backend gives us the advantage of having the same language, and we can use this to share some elements between them. In this project, I mainly used the monorepo to share dependencies, Zod schemas, and types.

Three packages are in the repository:

- `frontend`: The frontend app built with React.
- `backend`: The Node.js Express API.
- `shared`: Package that groups shared logic between both frontend and backend.

In the future, we can imagine having another package `ui-kit`, which will be the design system of our application, or maybe a `mobile` package for the mobile version.

## Scalable Architecture

If the project were real and more than a technical test, we would have used the monorepo as a `microservice architecture` to scale easily. The `backend` package would have been a `queue service` package that could independently handle all the queue logic.
Since it was just a technical test, I simplified it and created simple monorepo packages for each part of the app.

## Queue Logic

When implementing the logic of a FIFO queue, we need a solution that allows fast access to the queue. I have personally used `BullMQ` to handle this sort of system and feel that Redis is the easiest and best way to implement queue logic.
We need to be aware, in the context of scaling, of the cost of Redis. Since we access the store often, costs can grow quickly. Some data stored by Redis (like total credits, for example) may not need to be accessed as often.

## Data Validation

Zod is a powerful tool that helps us validate data. I use it in every application I make. In the backend, it helps us validate data coming from endpoints and data from any external source (like Redis). In the frontend, we also validate data coming from web socket.

## PandaCSS and Ark UI

PandaCSS is my first choice for every React application in terms of CSS solutions. It allows for fully typesafe CSS-in-TS styles, combining the DX of CSS-in-TS with the performance of atomic CSS by building atomic classes at build time.
Ark UI helped me easily implement headless UI components (Toaster) without dealing with all the different problems I would have faced when building those components from scratch. Ark UI uses state machines to handle all possible states of a component, ensuring nothing unexpected can happen.

## Mobile Version

I initially considered making a responsive frontend for the application, but since Waalaxy is used with a Chrome extension, I didn't find it relevant to handle a mobile version.

# Improvements

If I had more time to develop this project, I would:

- Not push anything to the main branch but use branches and PRs instead.
- Add E2E tests on the frontend.
- Add the possibility of having users with a unique queue for each.
- Implement better error handling on both the backend and frontend.
