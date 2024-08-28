export class Categorie {
    elements = {
      nameInput: () => cy.get('[id="name"]'),
      descriptionInput: () => cy.get('[id="description"]'),
      submitButton: () => cy.get('[id="submit"]'),
      deleteButton: () => cy.xpath('/html/body/div/div[1]/div/div/div/div/main/div[2]/div[2]/div[2]/button'),
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

    submit() {
        this.elements.submitButton().click()
    }


  }
  const categorie = new Categorie()
  
describe('Categoria', () => {
    describe('Submetendo uma categoria com campos inválidos', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de categoria', () => {
            cy.visit('/categorie/create')
        })
        it("Preenche o nome", ()=>{
            categorie.typeName("")
        })
        it("Rrenche a descrição", ()=>{
            categorie.typeDescription("")
        })
        it("Clica no botão", ()=>{
            categorie.submit()
        })
        it("Verifica mensagem", ()=>{
            cy.contains('O nome deve ter no mínimo 4 caracteres').should('exist');
        })
    })

    describe('Submetendo uma categoria com campos válidos', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de categoria', () => {
            cy.visit('/categorie/create')
        })
        it("Preenche o nome", ()=>{
            categorie.typeName("Alimentação")
        })
        it("Preenche a descrição", ()=>{
            categorie.typeDescription("Supermercados, restaurantes e padarias")
        })
        it("Clica no botão", ()=>{
            categorie.submit()
        })
        it("Verifica url", ()=>{
            cy.url().should('not.contain', '/create');
        })
        it("Verifica se foi criado", ()=>{
            cy.contains('Alimentação').should('exist');
        })
    })

    describe('Submetendo uma categoria como nome que já exite', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de categoria', () => {
            cy.visit('/categorie/create')
        })
        it("Preenche o nome", ()=>{
            categorie.typeName("Alimentação")
        })
        it("Preenche a descrição", ()=>{
            categorie.typeDescription("Supermercados, restaurantes e padarias")
        })
        it("Clica no botão", ()=>{
            categorie.submit()
        })
        it("Verifica mensagem", ()=>{
            cy.contains('Não foi possível criar a categoria pois já existe um categoria com o mesmo nome.').should('exist');
        })
    })

    describe('Deletando uma categoria', () => {
        it('Faz login', () => {
            cy.login("test@test.com", "test@test.com")
          })
        it('Navega para a pagina de criação de categoria', () => {
            cy.visit('/categorie')
        })

        it("Clica no icone de lixeira", ()=>{
            categorie.elements.deleteButton().click()
        })
        it("Clica no botão de deletar", ()=>{
            categorie.elements.confirmatButton().click()
        })
        it("Verifica se o item existe", ()=>{
            cy.contains('Alimentação').should('not.exist');
        })
    })
  })

