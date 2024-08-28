Scenario: Submetendo uma conta com campos inválidos
  Dado que estou na página de registro de contas
  Quando entro com "" no campo do nome da conta
  E entro com "" no campo da descrição da conta
  E clico no botão de salvar
  Então devo ver a mensagem "O nome deve ter no mínimo 4 caracteres" abaixo do campo do nome da conta

Scenario: Submetendo uma conta com campos válidos
  Dado que estou na página de registro de contas
  Quando  entro com "Banco Inter" no campo de nome da conta
  E entro com "Conta Corrente" no campo de descrição da conta
  E entro com "80.00" no campo de valor inicial da conta
  E clico no botão de salvar
  Então a lista de contas registradas deve ser atualizada com o novo item

Scenario: Submetendo uma conta como nome que já existe
  Dado que estou na página de registro de conta
  Quando entro com "Banco Inter" no campo direito nome da conta
  E entro com "Conta Corrente" no campo de descrição da conta
  E clico no botão de salvar
  Então devo ver a mensagem "Não foi possível criar a conta pois já existe um conta com o mesmo nome." no canto inferior direito da página

Scenario: Deletando uma conta
  Dado que estou na página da conta
  Quando clico no ícone de lixeira
  Então Deve aparecer um popup de confirmação 
  Quando clico no botão deletar
  Então o item deve ser removido da lista 



