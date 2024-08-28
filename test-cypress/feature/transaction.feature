Scenario: Submetendo uma transação do tipo receita com campos válidos
  Dado que estou na página de registro de transações
  Quando clico no botão de receita
  Então mudo para o formulário de receita
  Quando entro com "Salário" no campo de descrição
  E entro com "1000,00" no campo de valor
  E seleciono "Academia" no campo de categoria
  E seleciono "American Express" no campo de conta
  Quando clico no botão salvar
  Então a lista de transações registradas deve ser atualizada com o novo item

Scenario: Verifica saldo da conta após criação de uma receita
  Dado que uma receita foi criada
  Quando navego para a página de conta 
  Então o saldo de ter sido atualizada

Scenario: Verifica receita total no dashboard após criação de uma receita
  Dado que uma receita foi criada
  Quando navego para a página de dashboard
  Então o receita total de ter sido atualizada

Scenario: Verifica saldo no dashboard após criação de uma receita
  Dado que uma receita foi criada
  Quando navego para a página de dashboard
  Então o saldo de ter sido atualizada

Scenario: Submetendo uma transação do tipo despesa com campos válidos
  Dado que estou na página de registro de transações
  E entro "Halteres" no campo de descrição
  E entro "250,00" no campo de valor
  E seleciono "Academia" no campo de categoria
  E seleciono "American Express" no campo de conta
  Quando clico no botão salvar
  Então a lista de transações registradas deve ser atualizada com o novo item

Scenario: Verifica saldo da conta após criação de uma despesa
  Dado que uma despesa foi criada
  Quando navego para a página de conta 
  Então o saldo de ter sido atualizada

Scenario: Verifica despesa total no dashboard após criação de uma despesa
  Dado que uma despesa foi criada
  Quando navego para a página de dashboard
  Então o despesa total de ter sido atualizada

Scenario: Verifica saldo no dashboard após criação de uma despesa
  Dado que uma despesa foi criada
  Quando navego para a página de dashboard
  Então o saldo de ter sido atualizada

Scenario: Deletando uma transação do tipo despesa
  Dado que estou na página categorias
  Quando clico no ícone de deletar 
  Então aparece um popup de confirmação 
  Quando clico no botão de deletar
  Então o item deve ser removido da lista 

Scenario: Verifica saldo da conta após deleção de uma despesa
  Dado que uma despesa foi deletada
  Quando navego para a página de conta 
  Então o saldo de ter sido atualizada

Scenario: Verifica despesa total no dashboard após deleção de uma despesa
  Dado que uma despesa foi deletada
  Quando navego para a página de dashboard
  Então o despesa total de ter sido atualizada

Scenario: Verifica saldo no dashboard após deleção de uma despesa
  Dado que uma despesa foi deletada
  Quando navego para a página de dashboard
  Então o saldo de ter sido atualizada

Scenario: Deletando uma transação do tipo receita
  Dado que estou na página categorias
  Quando clico no ícone de deletar 
  Então Aparecer um popup de confirmação 
  Quando clico no botão de deletar
  Então o item deve ser removido da lista 

Scenario: Verifica saldo da conta após deleção de uma receita
  Dado que uma receita foi deletada
  Quando navego para a página de conta 
  Então o saldo de ter sido atualizada

Scenario: Verifica receita total no dashboard após deleção de uma receita
  Dado que uma receita foi deletada
  Quando navego para a página de dashboard
  Então o receita total de ter sido atualizada

Scenario: Verifica saldo no dashboard após deleção de uma receita
  Dado que uma receita foi deletada
  Quando navego para a página de dashboard
  Então o saldo de ter sido atualizada
