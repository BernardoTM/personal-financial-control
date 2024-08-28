export class Account {
    elements = {
      nameInput: () => cy.get('[id="name"]'),
      descriptionInput: () => cy.get('[id="description"]'),
      openingBalanceInput: () => cy.get('[id="opening_balance"]'),
      submitButton: () => cy.get('[id="submit"]'),
      deleteButton: () => cy.xpath('/html/body/div/div[1]/div/div/div/div/main/div[2]/div[2]/div[3]/button'),
      confirmatButton: () => cy.xpath('/html/body/div[3]/div[2]/button[2]'),
    }
  
    typeName(text) {
      if(!text) return;
      this.elements.nameInput().type(text)
    }
  
    typeDescription(text) {
      if(!text) return;
      this.elements.descriptionInput().type(text)
    }
    typeOpeningBalance(text) {
        if(!text) return;
        this.elements.openingBalanceInput().type(text)
      }

    submit() {
        this.elements.submitButton().click()
    }


  }
  const account = new Account()
  
describe('Conta', () => {
    describe('Submetendo uma conta com campos inválidos', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de conta', () => {
            cy.visit('/account/create')
        })
        it("Preenche o nome", ()=>{
            account.typeName("")
        })
        it("Preenche a descrição", ()=>{
            account.typeDescription("")
        })
        it("Preenche valor inicial", ()=>{
            account.typeOpeningBalance("")
        })
        it("Clica no botão", ()=>{
            account.submit()
        })
        it("Verifica mensagem", ()=>{
            cy.contains('O nome deve ter no mínimo 4 caracteres').should('exist');
        })
    })

    describe('Submetendo uma conta com campos válidos', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de conta', () => {
            cy.visit('/account/create')
        })
        it("Preenche o nome", ()=>{
            account.typeName("Banco Inter")
        })
        it("Preenche a descrição", ()=>{
            account.typeDescription("Conta Corrente")
        })
        it("Preenche valor inicial", ()=>{
            account.typeOpeningBalance("8000")
        })
        it("Clica no botão", ()=>{
            account.submit()
        })
        it("Verifica url", ()=>{
            cy.url().should('not.contain', '/create');
        })
        it("Verifica se foi criado", ()=>{
            cy.contains('Banco Inter').should('exist');
        })
    })

    describe('Submetendo uma conta como nome que já existe', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de conta', () => {
            cy.visit('/account/create')
        })
        it("Preenche o nome", ()=>{
            account.typeName("Banco Inter")
        })
        it("Preenche a descrição", ()=>{
            account.typeDescription("Conta Corrente")
        })
        it("Clica no botão", ()=>{
            account.submit()
        })
        it("Verifica mensagem", ()=>{
            cy.contains('Não foi possível criar a conta pois já existe um conta com o mesmo nome.').should('exist');
        })
    })

    describe('Deletando uma conta', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de conta', () => {
            cy.visit('/account')
        })

        it("Clica no icone de lixeira", ()=>{
            account.elements.deleteButton().click()
        })
        it("Clica no botão de deletar", ()=>{
            account.elements.confirmatButton().click()
        })
        it("Verifica se o item existe", ()=>{
            cy.contains('Banco Inter').should('not.exist');
        })
    })
  })

