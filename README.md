# mission-pawsible
A web app for tracking separation anxiety training.

Some of the core features include:
- Submitting a training session
- Viewing old training sessions
- Editing or deleting old training sessions
- Data visualization to easily display training progress

The app was built during my time at Launch Academy as my final project. Some of the technologies used in this build include: React, Express, PostgreSQL, Knex, Objection and Node.


This app is available to view [here](mission-pawsible.herokuapp.com), or you can download this repository and view on your machine by typing the below commands in your terminal and navigating to http://localhost:3000 in your browser:
```
yarn install
creadedb mission-pawsible_development
cd server
yarn run migrate:latest
cd ..
yarn run dev
```
