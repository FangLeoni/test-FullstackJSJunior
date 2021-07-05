import { Router } from "express";
import path from "path";

import { 
  getAllUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteAllUsers, 
  deleteUser 
} from './databaseRequests';

const routes = Router();


// Listar todos usuários
routes.get("/api/v1/users", getAllUsers)

// Listar único usuário
routes.get("/api/v1/users/:user_id", getUser)

// Criar único usuário // Body: JSON (email,senha)
routes.post("/api/v1/users", createUser)

// Alterar único usuário // Body: JSON (email,senha)

routes.put("/api/v1/users/:user_id", updateUser)

// Deletar todos usuários
routes.delete("/api/v1/users", deleteAllUsers)

// Deletar único usuário
routes.delete("/api/v1/users/:user_id", deleteUser)


export { routes }