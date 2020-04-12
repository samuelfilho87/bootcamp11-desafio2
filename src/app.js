const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/*
 * Middlewares
 */
function validateRepositoryId(req, res, next) {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex === -1) {
    return res.status(400).json({ error: 'Invalid repository ID.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId)

/*
 * Repositories routes
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs, like } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(like) {
    return response.status(400).json({ error: 'Not be possible to update repository likes manually.' });
  }

  const repository = {id, title, url, techs, likes: repositories[repositoryIndex].likes }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

/*
 * Repositories likes
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
