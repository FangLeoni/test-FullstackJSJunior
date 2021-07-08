import { Request, Response } from 'express';
import path from 'path';
import { promises as fs }  from 'fs';
import { v4 as uuid } from 'uuid';

type TUser = {
	id:string; 
	email:string;
	password:string;
}

type TDatabase = {
	users:Array<TUser>
}

const databasePath:string = path.join(__dirname,'database','database.json');

// Listar todos usuários
async function getAllUsers(req: Request,res: Response){

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		const usersJSON:TDatabase = JSON.parse(readReturn);

		if(usersJSON.users.length !== 0) {
			return res.json(usersJSON)
		} else {
			return res.status(500).send("Não temos mais usuários");
		}
	} catch(err) {
		console.error(err);
		return res.status(500).send("Erro ao ler arquivo durante seleção de todos os usuários")
	}
    
};

// Listar único usuário
async function getUser(req: Request,res: Response){

	const reqId:string = req.params.user_id;

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		const usersJSON:TDatabase = JSON.parse(readReturn);
		
		if(usersJSON.users.length !== 0) {
			usersJSON.users.some((user:TUser, index:number) => {
				if(reqId === user.id){
					return res.json(user)
				} else if( index === usersJSON.users.length -1) {
					console.log("Ele entrou no else if")
					return res.status(500).send("Usuário não encontrado");
				}
			})
		} else {
			return res.status(500).send("Não temos mais usuários");
		}

	} catch(err) {
		console.error(err);
		return res.status(500).send("Erro ao ler arquivo durante seleção de usuário")
	}
    
};

// Criar único usuário // Body: JSON (email,senha) // Params: ID
async function createUser (req: Request,res: Response){

	const newId:string = uuid();
	const newEmail:string = req.body.email;
	const newPassword:string = req.body.password;

	if( newEmail === "" || newPassword === "" ) {
		return res.status(500).send("Campo vazio!")
	}

	let usersStringified:string;

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		const usersJSON:TDatabase = JSON.parse(readReturn);
		usersJSON.users.push({
			"id": newId,
			"email": newEmail,
			"password": newPassword
		})
		
		usersStringified = JSON.stringify(usersJSON,null, 2);

	} catch(err) {
		console.error(err);
		return res.status(500).send("Erro ao ler arquivo durante criação de usuário")
	}

	try {
		await fs.writeFile(databasePath, usersStringified,'utf8')

		return res.send("Usuário criado com sucesso!")
		
	} catch(err) {
		console.error(err);
		return res.status(500).send("Erro ao criar usuário!")
	}
};


// Alterar único usuário // Body: JSON (email, newPassword, oldPassword) // Params: ID
async function updateUser(req: Request,res: Response){
	
	const reqId:string = req.params.user_id;
	const reqNewEmail:string = req.body.email;
	const reqNewPassword:string = req.body.newPassword;


	if( reqNewEmail === "" || reqNewPassword === "" ) {
		return res.status(500).send("Campo vazio!")
	}
	

	let usersJSON:TDatabase;

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		usersJSON = JSON.parse(readReturn);

	} catch(err) {
		console.error(err);
		return res.status(500).send("Erro ao ler arquivo durante atualização de usuário!")
	}

	if(usersJSON.users.length !== 0) {
		usersJSON.users.some( async (user:TUser, index:number) => {
			if( reqId === user.id ){
	
				usersJSON.users.splice(index,1)
				usersJSON.users.push({
					"id": reqId,
					"email": reqNewEmail,
					"password": reqNewPassword
				})
	
				let usersStringified = JSON.stringify(usersJSON,null, 2);
					
				try {
					await fs.writeFile(databasePath, usersStringified,'utf8')
	
					return res.send("Usuário atualizado com sucesso!")
					
				} catch(err) {
					console.error(err);
					return res.status(500).send("Erro ao atualizar usuário!")
				}
			} else if( index === usersJSON.users.length -1) {
				return res.status(500).send("Usuário não encontrado");
			}
		})
	} else {
		return res.status(500).send("Não temos mais usuários");
	}

};


// Deletar todos usuários
async function deleteAllUsers(req: Request,res: Response){
	
	const emptyDatabase:TDatabase = {
		"users": []
	}

	const emptyDatabaseString:string = JSON.stringify(emptyDatabase,null, 2);

	try {
		await fs.writeFile(databasePath, emptyDatabaseString,'utf8')

		return res.send("Todos os usuários foram deletados com sucesso!")
		
	} catch(err) {
		console.error(err);
		return res.status(500).send("Erro ao deletar todos os usuários!")
	}
    
};


// Deletar único usuário  // Params: ID
async function deleteUser (req: Request,res: Response){

	const reqId:string = req.params.user_id;
	let usersJSON:TDatabase;

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		usersJSON = JSON.parse(readReturn);

	} catch(err) {
		console.error(err);
		return res.status(500).send("Erro ao ler base de dados para deletar usuário!")
	}

	if(usersJSON.users.length !== 0) {

		usersJSON.users.some( async (user:TUser, index:number) => {
			if( reqId === user.id ){
	
				usersJSON.users.splice(index,1)
				let usersStringified = JSON.stringify(usersJSON,null, 2);
	

				try {
					await fs.writeFile(databasePath, usersStringified,'utf8')
			
					return res.send("Usuário Deletado com sucesso!")
					
				} catch(err) {
					console.error(err);
					return res.status(500).send("Erro ao deletar usuário!")
				}

			} else if( index === usersJSON.users.length -1) {
				return res.status(500).send("Usuário não encontrado!");
			}
		})

	} else {
		return res.status(500).send("Não temos mais usuários");
	}

};

export {
	getAllUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteAllUsers, 
  deleteUser
}


