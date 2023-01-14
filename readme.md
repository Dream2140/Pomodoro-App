## GENERAL

This is starting kit that allows to start developing on already configured `Node.js` development server.

It has already build-in structure of application, according to components approach and examples of further development direction.

## NOTE

Main goal of this starting kit is quick starting developing on working server for students, it's not an sample app or best practices, so students can modify, extend configs according to their needs during productivity app iteration

All improvements, that are not mentioned in phase acceptance criteria will be evaluated in the last phase.

## OVERVIEW

`package.json` has all project's dependencies

`webpack.config.js` module bundler configuration. This is basic configuration for quick start and should be changed during development.

`src` folder should contain all project's sources

`src/app` folder should contain all components. All they should be splitted into a logical parts. Components folder should contain common and reusable components.

All specific components should be inside pages folder. For example - `app/pages/task-list/task` etc.

As a result each component should contain `index.js` file for exporting component, component itself, files with unit test for this component and template for this component if required.

`src/assets` folder should contain assets of your application

- `less` folder should contain all common styles and helpers

- `images` folder should contain all images of the project

- `fonts` folder should contain all custom fonts

`static` folder used for holding `*.html` files while building markup on first phase, after students will start using template engine and all html should be moved to a separate views inside the components and static folder can be deleted.

## STEPS TO INSTALL AND RUN DEVELOPMENT ENV
1. install Node.js from official site https://nodejs.org/
1. run terminal of your choice and make sure that you are in root of a project
1. run `npm install` - this will install all required packages
1. run `npm start` command - this will run server on http://localhost:3000 (to access HTML files from static folder use URL like http://localhost:3000/static/task-list.html)
1. you can run `npm run build` to see resulting structure in file system (helps with path to images etc.)
