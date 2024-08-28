class Transaction {
    elements = {
      descriptionInput: () => cy.get('[id="description"]'),
      valueInput: () => cy.get('[id="value"]'),
      submitButton: () => cy.get('[id="submit"]'),
      receitButton:() => cy.xpath('/html/body/div/div[1]/div/div/div/div/main/div/div[1]/div/button[2]'),
      deleteButton: () => cy.xpath('/html/body/div/div[1]/div/div/div/div/main/div[2]/div/div[1]/div/div/table/div/div/div/tbody/tr[1]/td[7]/button'),
      confirmatButton: () => cy.xpath('/html/body/div[3]/div[2]/button[2]'),
    }
    
    typeValue(text) {
      if(!text) return;
      this.elements.valueInput().type(text)
    }
  
    typeDescription(text) {
      if(!text) return;
      this.elements.descriptionInput().type(text)
    }

    submit() {
        this.elements.submitButton().click()
    }


  }
  const transaction = new Transaction()
  
describe('Transação', () => {
  describe('Submetendo uma receita com campos válidos', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de criação de transação', () => {
        cy.visit('/transaction/create')
    })
    it("Muda para receita", () => {
        transaction.elements.receitButton().click()
    })
    it("Preenche a descrição", ()=>{
        transaction.typeDescription("Salario")
    })
    it("Preenche valor", ()=>{
        transaction.typeValue("100000")
    })
    it("Clica no botão", ()=>{
        transaction.submit()
    })
    it("Verifica se foi criado", ()=>{
        cy.contains('1.000,00').should('exist');
    })
  })

  describe('Verifica saldo da conta após criação de uma receita', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/account')
    })
    it("Verifica saldo", ()=>{
        cy.contains('1.080,00').should('exist');
    })
  })
  
  describe('Verifica receita total no dashboard após criação de uma receita', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/dashboard')
    })
    it("Verifica receita total", ()=>{
        cy.contains('1.000,00').should('exist');
    })
  })

  describe('Verifica saldo no dashbord após criação de uma receita', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/dashboard')
    })
    it("Verifica saldo", ()=>{
        cy.contains('1.000,00').should('exist');
    })
  })
      

  describe('Submetendo uma despesa com campos válidos', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de criação de transação', () => {
        cy.visit('/transaction/create')
    })
    it("Preenche a descrição", ()=>{
        transaction.typeDescription("Halteres")
    })
    it("Preenche valor", ()=>{
        transaction.typeValue("25000")
    })
    it("Clica no botão", ()=>{
        transaction.submit()
    })
    it("Verifica se foi criado", ()=>{
      cy.contains('250,00').should('exist');
    })
  })

  describe('Verifica saldo da conta após criação de uma despesa', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/account')
    })
    it("Verifica saldo", ()=>{
        cy.contains('830,00').should('exist');
    })
  })

  describe('Verifica despesa total no dashboard após criação de uma despesa', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/dashboard')
    })
    it("Verifica despesa total", ()=>{
        cy.contains('250,00').should('exist');
    })
  })

  describe('Verifica saldo no dashbord após criação de uma despesa', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/dashboard')
    })
    it("Verifica saldo", ()=>{
        cy.contains('750,00').should('exist');
    })
  })
    
  describe('Deletando uma receita', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de transação', () => {
        cy.visit('/transaction')
    })

    it("Clica no icone de lixeira", ()=>{
        transaction.elements.deleteButton().click()
    })
    it("Clica no botão de deletar", ()=>{
        transaction.elements.confirmatButton().click()
    })
    it("Verifica se o item existe", ()=>{
        cy.contains('1.000,00').should('not.exist');
    })
    })

  describe('Verifica saldo da conta após deleção de uma receita', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/account')
    })
    it("Verifica saldo", ()=>{
        cy.contains('-170,00').should('exist');
    })
  })
  
  describe('Verifica receita total no dashboard após deleção de uma receita', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/dashboard')
    })
    it("Verifica receita total", ()=>{
        cy.contains('00,00').should('exist');
    })
  })

  describe('Verifica saldo no dashbord após deleção de uma receita', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/dashboard')
    })
    it("Verifica saldo", ()=>{
        cy.contains('250,00').should('exist');
    })
  })
      
  describe('Deletando uma despesa', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de transação', () => {
        cy.visit('/transaction')
    })

    it("Clica no icone de lixeira", ()=>{
        transaction.elements.deleteButton().click()
    })
    it("Clica no botão de deletar", ()=>{
        transaction.elements.confirmatButton().click()
    })
    it("Verifica se o item existe", ()=>{
        cy.contains('250,00').should('not.exist');
    })
  })

  describe('Verifica saldo da conta após deleção de uma despesa', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/account')
    })
    it("Verifica saldo", ()=>{
        cy.contains('80,00').should('exist');
    })
  })

  describe('Verifica despesa total no dashboard após deleção de uma despesa', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/dashboard')
    })
    it("Verifica despesa total", ()=>{
        cy.contains('00,00').should('exist');
    })
  })

  describe('Verifica saldo no dashbord após deleção de uma despesa', () => {
    it('Faz login', () => {
        cy.login("test@test.com", "test@test.com")
      })
    it('Navega para a pagina de conta', () => {
        cy.visit('/dashboard')
    })
    it("Verifica saldo", ()=>{
        cy.contains('00,00').should('exist');
    })
  })
})

