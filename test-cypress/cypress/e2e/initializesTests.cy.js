
describe('Configurações pre testes', () => {
    it("Criar usuario", ()=>{
        cy.visit('/sing-up')
        cy.get('[id="name"]').type("Test"),
        cy.get('[id="email"]').type("test@test.com"),
        cy.get('[id="password"]').type("test@test.com"),
        cy.get('[id="confirmPassword"]').type("test@test.com"),
        cy.get('[id="submit"]').click()
    })

    it("Criar conta", ()=>{
        cy.login("test@test.com", "test@test.com")
        cy.visit('/account/create')
        cy.get('[id="name"]').type("American Express")
        cy.get('[id="description"]').type("Conta Corrente")
        cy.get('[id="opening_balance"]').type("8000")
        cy.get('[id="submit"]').click()
    })

    it("Criar categoria", ()=>{
        cy.login("test@test.com", "test@test.com")
        cy.visit('/categorie/create')
        cy.get('[id="name"]').type("Academia")
        cy.get('[id="description"]').type("Equipamentos")
        cy.get('[id="submit"]').click()
    })

  })

