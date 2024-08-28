Scenario: Submetendo uma categoria com campos inválidos
  Dado que estou na página de registro de categorias
  Quando entro com "" no campo de nome da categoria
  E clico no botão de salvar
  Então devo ver a mensagem "O nome deve ter no mínimo 4 caracteres" abaixo do campo de nome da categoria

Scenario: Submetendo uma categoria com campos válidos
  Dado que estou na página de registro de categorias
  Quando entro com "Alimentação" no campo de nome da categoria
  E entro com "Supermercados, restaurantes e padarias" no campo de descrição da categoria
  E clico no botão de salvar
  Então a lista de categorias registradas deve ser atualizada com o novo item

Scenario: Submetendo uma conta como nome que já existe
  Dado que estou na página de registro de categorias
  Quando entro com "Alimentação" no campo de nome da categoria
  E clico no botão de salvar
  Então devo ver a mensagem "Não foi possível criar a categoria pois já existe um categoria com o mesmo nome." no canto inferior direito da página

Scenario: Deletando uma conta
  Dado que estou na página categorias
  Quando clico no ícone lixeira
  Então deve aparecer um popup de confirmação 
  Quando clico no botão deletar
  Então o item deve ser removido da lista 
