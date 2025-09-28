# Desafio Backend

API RESTful desenvolvida em Node.js com AdonisJS para gestão escolar. Permite cadastrar e gerenciar alunos, professores e salas, além de controlar a alocação de alunos em salas, seguindo regras de negócio como capacidade, disponibilidade e vínculo do professor responsável.

---

## **Funcionalidades**

### Aluno
- **Cadastro**: criar conta informando nome, e-mail, matrícula e data de nascimento.  
- **Edição**: atualizar dados pessoais.  
- **Exclusão**: remover cadastro.  
- **Consulta**: visualizar informações do perfil.  
- **Salas**: consultar todas as salas em que está alocado, incluindo professor responsável e número da sala.  

### Professor
- **Cadastro**: criar conta informando nome, e-mail, matrícula e data de nascimento.  
- **Edição**: atualizar dados pessoais.  
- **Exclusão**: remover cadastro.  
- **Consulta**: visualizar informações do perfil.  
- **Salas**: cadastrar, editar, excluir e consultar salas.  
- **Alocação**: adicionar ou remover alunos em suas próprias salas.  
- **Listagem de alunos**: consultar todos os alunos de uma sala.  

### Sala
- **Cadastro**: criada pelo professor com número, capacidade e disponibilidade.  
- **Regras**:  
  - Não é permitido alocar o mesmo aluno mais de uma vez.  
  - A capacidade da sala não pode ser excedida.  
  - Somente o professor criador pode alocar ou remover alunos.  

---

## **Como rodar o projeto**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/rodrigojsdeveloper/challenge-adonisjs.git
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor**
   ```bash
   npm run dev
   ```

4. **Acesse a API**
   ```bash
   http://localhost:3333
   ```

### **Importante**

Ao rodar `npm run dev`, o projeto irá:  

- Verificar se o container Docker do banco de dados (Postgres) está rodando e iniciá-lo se necessário.  
- Criar o banco de dados automaticamente dentro do container.  
- Executar todas as migrations para criar as tabelas.  
- Iniciar a API AdonisJS no modo de desenvolvimento.

---

## **Todas as Rotas**

| Método | Rota                                         | Descrição                                 |
|--------|----------------------------------------------|-------------------------------------------|
| POST   | /students                                    | Cadastro de aluno                         |
| PUT    | /students/:id                                | Editar aluno                              |
| DELETE | /students/:id                                | Excluir aluno                             |
| GET    | /students/:id                                | Consultar aluno                           |
| GET    | /students/:studentId/classrooms              | Salas do aluno                            |
| POST   | /teachers                                    | Cadastro de professor                     |
| PUT    | /teachers/:id                                | Editar professor                          |
| DELETE | /teachers/:id                                | Excluir professor                         |
| GET    | /teachers/:id                                | Consultar professor                       |
| POST   | /classrooms                                  | Cadastro de sala                          |
| PUT    | /classrooms/:id                              | Editar sala                               |
| DELETE | /classrooms/:id                              | Excluir sala                              |
| GET    | /classrooms/:id                              | Consultar sala                            |
| POST   | /classrooms/:classroomId/students/:studentId | Alocar aluno em sala                      |
| DELETE | /classrooms/:classroomId/students/:studentId | Remover aluno da sala                     |
| GET    | /classrooms/:classroomId/students            | Listar alunos de uma sala                 |

---

## **Regras de Negócio**

- **Cadastro de aluno e professor**: obrigatório informar nome, e-mail, matrícula e data de nascimento.  
- **Cadastro de sala**: obrigatório informar número, capacidade e disponibilidade.  
- **Alocação de aluno**:  
  - Um aluno não pode ser alocado mais de uma vez na mesma sala.  
  - A capacidade da sala não pode ser excedida.  
  - Apenas o professor criador da sala pode alocar ou remover alunos.  
- **Consulta de salas do aluno**: deve retornar o nome do aluno, o nome do professor e o número da sala.
