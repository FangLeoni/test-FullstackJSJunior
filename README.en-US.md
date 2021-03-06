
# API RESTFUL USANDO NODEJS, Express & TS

Read in another language: [Português](README.md), [English](README.en-US.md)

## Goal
- Create 4 endpoints GET/POST/PUT/DELETE

Many tools can be utilized to make the requests: Postman, Insomnia or VS Code extensions like REST Client.

After the download of the compacted project or via git clone:
```sh
git clone https://github.com/Fizer65/test-FullstackJSJunior.git
```

### NodeJS
To download the project dependencies:
```sh
npm install
```

To start:
```sh
node run start
```
### Yarn

To download the project dependencies:
```sh
yarn install
```

To start:
```sh
yarn start
```

# How to use
#### Used port: 3333
Route example: `http://localhost:3333/api/v1/users` 

|  HTTP  |        	ROUTE          |	         BODY           |	    DESCRIPTION    |
|--------|-------------------------|--------------------------|--------------------|
| GET    |	/api/v1/users          |	              	        |  List all users    | 
| GET    |	/api/v1/users/user_id  |		    	                |  Get single User   |
| POST   |	/api/v1/users          |  JSON (email,password)	  |	 Create User       |
| PUT    |	/api/v1/users/user_id  |  JSON (email,password)   |	 Alter one user    |
| DELETE |	/api/v1/users	         |	                    	  |  Delete all users  |
| DELETE |  /api/v1/users/user_id  |		                 	    |  Delete One User   |

### - List All Users
- Request with `GET` protocol in `/api/v1/users`. 
- Returns all the users of the database with: ID, email and password.
```json
{
	"id": "c7494539-f73e-4996-bc07-656ee899305e",
	"email": "example@gmail.com",
	"password": "hardPassword"
}
```

### - Get single User
- Request with `GET` protocol in `/api/v1/users/user_id`.
- The `user_id` is the target user ID
- Returns: ID, email and password.

```json
{
	"id": "c7494539-f73e-4996-bc07-656ee899305e",
	"email": "example@gmail.com",
	"password": "hardPassword"
}
```

### - Create User
- Request with `POST` protocol in `/api/v1/users/`. 
- Also needs a JSON body with email and password:

```json
{
	"email": "example@gmail.com",
	"password": "password"
}
```
##### `⚠️ Warning`: Users with repeated emails will be blocked.
- The ID will be automatic generated with the UUID package.  
- Returns a `200 OK` status if the request was successful

### - Alter One User
- Request with `PUT` protocol in `/api/v1/users/user_id`. 
- The `user_id` is the target user ID that will be altered
- Also needs a JSON body with the new email and the new password:
```json
{
	"email": "new.example@gmail.com",
	"newPassword": "newPassword"
}
```
- Returns a `200 OK` status if the request was successful

### - Delete All Users
- Request with `DELETE` protocol in `/api/v1/users/`. 
- ##### `⚠️ Warning`: Doing this will delete every user in your database. Be careful before using this route.

- Returns a `200 OK` status if the request was successful

### - Delete One User
- Request with `DELETE` protocol in `/api/v1/users/user_id`. 
- The `user_id` is the target user ID that will be deleted.
- Returns a `200 OK` status if the request was successful 

