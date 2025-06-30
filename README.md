Aqui está uma versão aprimorada e organizada do seu `README.md`, com foco claro para **desenvolvedores que irão rodar o projeto**, separando as instruções para frontend, backend (Docker) e banco de dados com `Prisma`. Também inclui comandos com explicação e links úteis:

---

````md
# Projeto de movies (Angular + Electron + Node.js + Prisma)

Este projeto fullstack permite cadastrar **usuários, movies e categorias**, com autenticação via JWT, usando:

- **Frontend:** Angular + Electron
- **Backend:** Node.js + Express + Prisma
- **Banco de dados:** MySQL (via Docker)

---

## 🧰 Pré-requisitos

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)

---

## ⚙️ Como executar o projeto

### 1. Suba o backend e banco de dados (Docker)

Execute o seguinte comando na raiz do projeto:

```sh
docker-compose up -d
````

Isso iniciará:

* MySQL (`localhost:3306`)
* Backend Node.js (`localhost:3000`)

> Obs.: o Swagger estará disponível em `http://localhost:3000/api-docs`

---

### 2. Sincronize o banco com o Prisma

Após o container `backend` estar rodando, execute:

```sh
docker exec -it backend sh
npx prisma db push
```

Isso cria as tabelas no MySQL com base no schema atual do Prisma.

---

### 3. Inicie o frontend



> Certifique-se de que o backend (`localhost:3000`) esteja ativo para que as requisições funcionem corretamente.

---

## 📁 Estrutura do Projeto

```
/
├── backend/         # Backend Node.js + Express + Prisma
├── frontend/        # 
├── docker-compose.yml
└── README.md
```

---

## ✅ Funcionalidades

* Cadastro e login de usuários
* Search movies
* CRUD de movies
* CRUD de categorias
* Autenticação com JWT
* Integração total via REST
* Documentação automática via Swagger

---

## 🚀 Tecnologias Usadas

* **Frontend:** 
* **Backend:** Express, TypeScript, Prisma ORM
* **Database:** MySQL (Docker)
* **Autenticação:** JWT

---

## 🧪 Documentação da API

Disponível via Swagger:

```
http://localhost:3000/api-docs
```

## 🧪 SAÚDE da API

```
  console.log("Health endpoint at http://localhost:3000/health");
  console.log("Health DB endpoint at http://localhost:3000/health/db");
```

---

## 🛠️ Recomendações de IDE

* [VS Code](https://code.visualstudio.com/)

  * Extensão recomendada: [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  * Desative o [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) para evitar conflitos

---

