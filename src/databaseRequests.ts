import { Request, Response } from 'express';
import path from 'path';
import { promises as fs }  from 'fs';
import { v4 as uuid } from 'uuid';
import argon2 from 'argon2';

type TUser = {
	id:string; 
	email:string;
	password:string;
}

type TDatabase = {
	users:Array<TUser>
}

const databasePath:string = path.join(__dirname,'database','database.json' );

// Listar todos usuários
async function getAllUsers(req: Request,res: Response){

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		const usersJSON:TDatabase = JSON.parse(readReturn);

		if(usersJSON.users.length !== 0) {
			res.json(usersJSON)
		} else {
			res.status(404).send("Não temos mais usuários");
		}
	} catch(err) {
		console.log(err);
		res.status(404).send("Erro ao ler arquivo durante seleção de todos os usuários")
	}
    
};

// Listar único usuário
async function getUser(req: Request,res: Response){

	const reqId:string = req.params.user_id;

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		const usersJSON:TDatabase = JSON.parse(readReturn);
		
		if(usersJSON.users.length !== 0) {
			usersJSON.users.forEach((user:TUser) => {
				if(reqId === user.id){
					res.json(user)
				}
			})
		} else {
			res.status(404).send("Não temos mais usuários");
		}

	} catch(err) {
		console.log(err);
		res.status(404).send("Erro ao ler arquivo durante seleção de usuário")
	}
    
};

// Criar único usuário // Body: JSON (email,senha) // Params: ID
async function createUser (req: Request,res: Response){

	const newId:string = uuid();
	const newEmail:string = req.body.email;
	const newPassword:string = req.body.password;

	let usersStringified:string;

	let hashPassword:string;
	
	try {
		hashPassword = await argon2.hash(newPassword);
	} catch (err) {
		console.log(err);
		res.status(404).send("Erro ao criptografar a senha do usuário")
	}

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		const usersJSON:TDatabase = JSON.parse(readReturn);
		usersJSON.users.push({
			"id": newId,
			"email": newEmail,
			"password": hashPassword
		})
		
		usersStringified = JSON.stringify(usersJSON,null, 2);

	} catch(err) {
		console.log(err);
		res.status(404).send("Erro ao ler arquivo durante criação de usuário")
	}

	try {
		await fs.writeFile(databasePath, usersStringified,'utf8')

		res.send("Usuário criado com sucesso!")
		
	} catch(err) {
		console.log(err);
		res.status(404).send("Erro ao criar usuário!")
	}
};


// Alterar único usuário // Body: JSON (email, newPassword, oldPassword) // Params: ID
async function updateUser(req: Request,res: Response){

	const reqId:string = req.params.user_id;
	const reqNewEmail:string = req.body.email;
	const reqOldPassword:string = req.body.oldPassword;
	const reqNewPassword:string = req.body.newPassword;

	let usersJSON:TDatabase;

	let hashNewPassword:string;
	
	try {
		hashNewPassword = await argon2.hash(reqNewPassword);
	} catch (err) {
		console.log(err);
		res.status(404).send("Erro ao criptografar a senha do usuário")
	}

	try {
		const readReturn:string = await fs.readFile(databasePath,'utf8');
		
		usersJSON = JSON.parse(readReturn);

	} catch(err) {
		console.log(err);
		res.status(404).send("Erro ao ler arquivo durante atualização de usuário!")
	}

	if(usersJSON.users.length !== 0) {
		usersJSON.users.forEach( async (user:TUser, index:number) => {
			if( reqId === user.id ){
	
				usersJSON.users.splice(index,1)
				usersJSON.users.push({
					"id": reqId,
					"email": reqNewEmail,
					"password": hashNewPassword
				})
	
				if(await argon2.verify(user.password, reqOldPassword)) {
					let usersStringified = JSON.stringify(usersJSON,null, 2);
					
					try {
						await fs.writeFile(databasePath, usersStringified,'utf8')
		
						res.send("Usuário atualizado com sucesso!")
						
					} catch(err) {
						console.log(err);
						res.status(404).send("Erro ao atualizar usuário!")
					}
				} else {
					res.status(404).send("Senha errada!")
				}
	
			} else if( index === usersJSON.users.length -1) {
				res.status(404).send("Usuário não encontrado");
			}
		})
	} else {
		res.status(404).send("Não temos mais usuários");
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

		res.send("Todos os usuários foram deletados com sucesso!")
		
	} catch(err) {
		console.log(err);
		res.status(404).send("Erro ao deletar todos os usuários!")
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
		console.log(err);
		res.status(404).send("Erro ao ler base de dados para deletar usuário!")
	}

	if(usersJSON.users.length !== 0) {

		usersJSON.users.forEach( async (user:TUser, index:number) => {
			if( reqId === user.id ){
	
				usersJSON.users.splice(index,1)
				let usersStringified = JSON.stringify(usersJSON,null, 2);
	

				try {
					await fs.writeFile(databasePath, usersStringified,'utf8')
			
					res.send("Usuário Deletado com sucesso!")
					
				} catch(err) {
					console.log(err);
					res.status(404).send("Erro ao deletar usuário!")
				}

			} else if( index === usersJSON.users.length -1) {
				res.status(404).send("Usuário não encontrado!");
			}
		})

	} else {
		res.status(404).send("Não temos mais usuários");
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


