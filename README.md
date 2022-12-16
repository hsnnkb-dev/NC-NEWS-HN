# Northcoders News API 📰
============================================================================

Click the link 🔗 below to see the project in action 🚀!

https://yesterdays-news.onrender.com

Hosted using Render and Elephant SQL.

## Project Summary
A functional and (almost) complete backend API that simulates a Reddit-like small scale server. Exciting features such as viewing (topics, articles, comments, users), deleting (comments, posts), updating article votes, and filtering, ordering and searching for specific articles.

Test-Driven Development was a core focus of the project, so the project features a comprehensive test suite made with jest, jest-sorted and supertest. The application itself uses express and pg to deliver CRUD operations and the project's primary functionality. Written mainly using JavaScript and SQL.

Try it out using the link 🔗 above!

## Quick-start for Developers 💻
### Project requirements
#### Minimum Node and PostgreSQL versions
- Node.js v18+
- PostgreSQL v14+

#### npm package list

 | Production Dependencies |
 | :--- |
 | express |
 | pg |
 | dotenv |

 | Developer Dependencies |
 | :--- |
 | pg-format |
 | jest |
 | jest-extended |
 | jest-sorted |
 | supertest |
 | husky |

### Prerequisites
Installed on your machine:
- Git
- PostgreSQL
- Node
- Node Package Manager

### Setting up the Project 🔧
Within your terminal input the following commands.
 1. Clone the project using `git clone https://github.com/hsnnkb-dev/HN-nc-news.git` .
 2. `cd` into the root of the project .
 3. Use `npm install` which installs all package dependencies (see list of npm packages above).

### Connecting to the Databases 🔌
These instructions should allow you to connect to the correct databases and run the project locally.
 1. Create environment variable files `.env.test` and `.env.development` at   the root of the project.
 2. Within `.env.test` write "PGDATABASE=nc_news_test".
    Within `.env.development` write "PGDATABASE=nc_news"
	(No quotations needed).
 3. Ensure that `.env.*` is present in the `.gitignore` file.

### Seeding the Databases 🌰
Once again, within your terminal and at the project root, input the following commands.
 1. `npm run setup-dbs` - This creates the relevant databases for the project.
 2. `npm run seed` - This seeds the newly created databases with the appropriate data.
 3. `npm test` - This command uses jest to run the test suite, if all has gone well you should see a bunch of passing tests.

### Next Steps & Contact Me 🎉
Hopefully, the project should be up and running and you should be free to do whatever you would like with it. You can also contact me at hsnnkb.dev@gmail.com 📫!