# Sistema de Controle Financeiro Pessoal

## Introdução

A gestão eficiente das finanças pessoais tornou-se uma necessidade crescente na sociedade contemporânea. Diante desse cenário, este trabalho apresenta o desenvolvimento de um sistema de controle financeiro pessoal, com o objetivo de auxiliar os usuários a organizar suas contas de maneira eficiente e organizada, acompanhar seus gastos e alcançar suas metas financeiras.

O sistema permite o registro de contas, orçamentos, categorias e transações, além de oferecer uma tela de dashboard que consolida informações relevantes, proporcionando uma visão geral das finanças do usuário.

Para a construção desse sistema, foram utilizadas tecnologias modernas e robustas. O backend foi desenvolvido utilizando Python com o framework FastAPI, que possibilita a criação de APIs rápidas e eficientes. O frontend foi construído com TypeScript e React, proporcionando uma interface de usuário dinâmica e interativa. A estilização foi realizada com Tailwind CSS e Shadcn, garantindo um design moderno e responsivo.

Testes automatizados E2E foram desenvolvidos com Cypress para garantir a confiabilidade do sistema. O banco de dados escolhido foi o PostgreSQL, devido à sua robustez e escalabilidade. O projeto completo está disponível sob a licença GPL.

## Instalação e Uso

### 1. Verificação de Dependências

Assegure-se de que as seguintes ferramentas estão instaladas em seu sistema:

- Git
- Docker
- Docker Compose

### 2. Clonagem do Repositório

Clone o repositório para seu ambiente local:

```bash
git clone git@github.com:BernardoTM/personal-financial-control.git
cd personal-financial-control
```

### 3. Configuração de Variáveis de Ambiente

Crie um arquivo .env no diretório raiz com as seguintes configurações:

- POSTGRES_DATABASE: Nome do banco de dados
- POSTGRES_USER: Usuário do banco de dados
- POSTGRES_PASSWORD: Senha do banco de dados
- SECRET_KEY: Chave de criptografia para o token JWT

### 4. Construção e Execução da Aplicação

Construa e rode os contêineres Docker:

```bash
docker-compose up --build
```

Isso iniciará todos os serviços necessários para que a aplicação funcione localmente.

### 5. Persistência de Dados

Os dados gerados pela aplicação serão persistidos em um volume Docker mapeado para pg_data:/var/lib/postgresql/data, garantindo que não sejam perdidos após a interrupção ou remoção dos contêineres.

### 6. Acesso à Aplicação

Com os contêineres em execução, acesse a aplicação via navegador em http://localhost:3000.

### 7. Encerramento da Aplicação

Para parar e remover os contêineres, use:

```bash
docker-compose down
```

Se desejar remover todos os dados, utilize:

```bash
docker-compose down -v
```

### 8. Executando os Testes

Para executar os testes automatizados, siga os passos abaixo:

1. Certifique-se de que a aplicação está rodando: A aplicação precisa estar em execução para que os testes possam ser realizados.

2. Instalação das dependências de testes:

- Navegue até a pasta de testes:

```bash
cd test-cpress
```

- Instale as dependências necessárias:

```bash
npm install
```

3. Rodando os testes:

- Execute o comando para iniciar o Cypress:

```bash
npm run cpress:web
```

- Escolha a opção E2E.
- Selecione o navegador desejado.
- Selecione o initializesTests para configurar um usuário para os testes.
- Rode os demais testes.
