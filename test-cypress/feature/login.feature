Scenario: Fazendo login com email inválido
  Dado que estou na página de login
  Quando entro com "bernardo" no campo de email
  E entro com "123456789" no campo de senha
  E clico no botão de salvar
  Então devo ver a mensagem "Email ou senha estão errados" abaixo do campo de email

Scenario: Fazendo login com senha inválida
  Dado que estou na página de login
  Quando entro com "bernardo@gmail.com" no campo de email
  E entro com "1234" no campo de senha
  E clico no botão de salvar
  Então devo ver a mensagem "Email ou senha estão errados" abaixo do campo de senha

Scenario: Fazendo login com um usuário não registrado
  Dado que estou na página de login
  Quando entro com "bernardo@gmail.com" no campo de email
  E entro com "123456789" no campo de senha
  E clico no botão de salvar
  Então devo ver a mensagem "Email ou senha estão errados" no canto inferior direito da página

Scenario: Fazendo login com um usuário válido
  Dado que estou na página de login
  Quando entro com "bernardo@gmail.com" no campo de email
  E entro com "bernardo@gmail.com" no campo de senha
  E clico no botão de salvar
  Então devo ser direcionado para a página de dashboard
