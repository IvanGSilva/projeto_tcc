# Plataforma Web para Promover o Transporte Comunitário de Curtas Distâncias

Este é um projeto de uma aplicação web de mobilidade urbana focado em melhorar o transporte de curta distância em pequenos centros. Inspirado no modelo do BlaBlaCar, o aplicativo oferece caronas para viagens intra-municipais em locais onde o transporte público é deficiente e serviços como Uber e 99 não estão disponíveis.

---

## 🚀 Funcionalidades

- Cadastro de usuários e motoristas.
- Pesquisa de caronas disponíveis por destino.
- Solicitação de caronas em tempo real.
- Histórico de viagens.
- Mensagens entre passageiros e motoristas.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React.js**: Interface do usuário responsiva e dinâmica.

### **Backend**
- **Node.js** com Express.js: Para gerenciar as rotas e lógica do servidor.
- **MongoDB**: Banco de dados NoSQL para armazenar usuários, viagens e mensagens.

### **Outras Ferramentas**
- **Visual Studio Code** (VSCode) para desenvolvimento.
- **MongoDBCompass** para gerenciamento visual do banco de dados.
- **Git e GitHub** para controle de versão.

---

## 📦 Como Executar o Projeto

### 1. **Pré-requisitos**
Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (versão mais recente)
- **Git**
- **MongoDB** (certifique-se de que o servidor está rodando)

### 2. **Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 3. **Instale as dependências dentro da pasta servidor
```bash
npm install
```

### 4. **Configure o arquivo .env dentro da pasta do servidor
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/seu-banco-de-dados
```

### 5. **Instale as dependências dentro da pasta cliente
```bash
npm install
```

### 6. **Crie uma conta na Google Cloud Console e gere uma APIkey(1) para as seguintes APIs com restrição por URL:**
Maps JavaScript API;
Geocoding API;
Places API;
Directions API;

### 7. **Gere uma APIkey(2) para a seguinte API com restrição por IP:**
Distance Matrix

### 8. **Crie os arquivos apikey.js em:**
cliente>src>components>Home>Map para a apikey(1)
servidor>utils para a apikey(2)

### 9. **Inicie o servidor e o cliente**
```bash
(na pasta servidor)
nodemon .\index.js

(na pasta cliente)
npm start
```

### 7. **Acesse a sua aplicação no navegador
Acesse: http://localhost:3000

### 📚Estrutura do Projeto:
```
📁 projeto
├── 📁 cliente
│   ├──📁 public         # Arquivos estáticos
│   └──📁 src/
│       ├── 📁 components  # Componentes reutilizáveis e seus módulos de CSS
│       |   ├── 📁 Home    # Componentes relacionados a Home
│       |   ├── 📁 Ride    # Componentes relacionados a Caronas
│       |   ├── 📁 User    # Componentes relacionados a Usuários
│       |   └── 📁 Vehicle # Componentes relacionados a veículos
│       ├── 📁 services    # API para comunicação com o backend
│       └── App.js         # Componente principal do React
|
├── 📁 servidor
│   ├── 📁 models          # Modelos do banco de dados
│   ├── 📁 routes          # Rotas e lógica interna do Sistema
│   ├── 📁 uploads         # Pasta para armazenar imagens (avatar de usuários)
│   |   ├── 📁 original    # Pasta para guardar a versão da imagem que foi enviada via upload
│   |   └── 📁 webp        # Pasta para guardar a versão tratada das imagens
│   ├── 📁 utils           # Pasta com utilitários do sistemas como validadores
│   └── index.js           # Arquivo principal do servidor
|
└── README.md              # Documentação do projeto
```

### 🛡️ Licença
Este projeto é licenciado sob a MIT License.

### 👨‍💻 Contribuindo
Sinta-se à vontade para contribuir com este projeto!
Crie um fork com suas modificações, crie uma branch, envie seus commits e abra uma pull request!

### 📞 Contato
Autor: [Ivan Gonçalves da Silva]
E-mail: [ivan.silva.dev@gmail.com]
LinkedIn: www.linkedin.com/in/ivansilvadev
