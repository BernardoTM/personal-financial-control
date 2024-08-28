class Budget {
    elements = {
      valueInput: () => cy.get('[id="value"]'),
      categorieInput: () => cy.xpath('/html/body/div/div[1]/div/div/div/div/main/div/form/div[1]/div[2]/div[2]/button'),
      submitButton: () => cy.get('[id="submit"]'),
      deleteButton: () => cy.xpath('/html/body/div/div[1]/div/div/div/div/main/div[2]/div/div[3]/button'),
      confirmatButton: () => cy.xpath('/html/body/div[3]/div[2]/button[2]'),
    }
  
    typeValue(text) {
        if(!text) return;
        this.elements.valueInput().type(text)
      }

    submit() {
        this.elements.submitButton().click()
    }


  }
  const budget = new Budget()
  
describe('Orçamento', () => {

    describe('Submetendo um orçamento com campos válidos', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de orçamento', () => {
            cy.visit('/budget/create')
        })

        it("Preenche valor", ()=>{
            budget.typeValue("50000")
        })
        it("Seleciona a categoria", ()=>{
            budget.elements.categorieInput().click();
            cy.focused().type('{downarrow}{enter}')
        })
        it("Clica no botão", ()=>{
            budget.submit()
        })
        it("Verifica url", ()=>{
            cy.url().should('not.contain', '/create');
        })
        it("Verifica se foi criado", ()=>{
            cy.contains('Academia').should('exist');
        })
    })

    describe('Submetendo um orçamento como nome que já exite', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de orçamento', () => {
            cy.visit('/budget/create')
        })
        it("Preenche valor", ()=>{
            budget.typeValue("50000")
        })
        it("Seleciona a categoria", ()=>{
            budget.elements.categorieInput().click();
            cy.focused().type('{downarrow}{enter}')
        })
        it("Clica no botão", ()=>{
            budget.submit()
        })
        it("Verifica mensagem", ()=>{
            cy.contains('Não foi possível criar a orçamento pois já existe um orçamento para essa categoria.').should('exist');
        })
    })

    describe('Deletando um orçamento', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de orçamento', () => {
            cy.visit('/budget')
        })

        it("Clica no icone de lixeira", ()=>{
            budget.elements.deleteButton().click()
        })
        it("Clica no botão de deletar", ()=>{
            budget.elements.confirmatButton().click()
        })
        it("Verifica se o item existe", ()=>{
            cy.contains('Banco Inter').should('not.exist');
        })
    })
  })

