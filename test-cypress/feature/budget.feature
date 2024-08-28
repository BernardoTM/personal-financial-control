Scenario: Submetendo um orçamento com campos válidos
  Dado que estou na página de registro de orçamentos
  Quando entro com "500,00" no campo de valor do orçamento
  E seleciono com "Casa" no campo de categoria
  E clico no botão de salvar
  Então a lista de orçamentos registrados deve ser atualizada com o novo item

Scenario: Submetendo uma orçamento como nome que já exite
  Dado que estou na página de registro de orçamento
  Quando entro com "500,00" no campo de valor do orçamento
  E seleciono "Casa" no campo de categoria
  E clico no botão salvar
  Então devo ver a mensagem "Não foi possível criar a orçamento pois já existe um orçamento para essa categoria." no canto inferior direito da página

Scenario: Deletando uma orçamento
  Dado que estou na página orçamento
  Quando clico no ícone lixeira 
  Então deve aparecer um popup de confirmação 
  Quando clico no botão deletar
  Então o item deve ser removido da lista 


