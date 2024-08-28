class RegisterForm {
    elements = {
      emailInput: () => cy.get('[id="email"]'),
      passwordInput: () => cy.get('[id="password"]'),
      submitButton: () => cy.get('[id="submit"]'),
    }
  
    typeEmail(text) {
      if(!text) return;
      this.elements.emailInput().type(text)
    }
  
    typePassword(text) {
      if(!text) return;
      this.elements.passwordInput().type(text)
    }
    submit() {
        this.elements.submitButton().click()
    }
  }
  const registerForm = new RegisterForm()
  
describe('Login', () => {
    describe('Enviar email invalido', () => {
      it('Navega para a pagina de login', () => {
        cy.clearCookies();
        cy.visit('/')
      })
      it("Preenche o email", ()=>{
        registerForm.typeEmail("bernardo")
      })
      it("Preenche a senha", ()=>{
        registerForm.typePassword("123456789")
      })
      it("Clica no botão", ()=>{
        registerForm.submit()
      })
      it("Verifica mensagem", ()=>{
        cy.contains('Email inválido').should('exist');
      })
    })

    describe('Enviar senha invalida', () => {
      it('Navega para a pagina de login', () => {
        cy.clearCookies();
        cy.visit('/')
      })
      it("Preenche o email", ()=>{
        registerForm.typeEmail("test@test.com")
      })
      it("Preenche a senha", ()=>{
        registerForm.typePassword("1234")
      })
      it("Clica no botão", ()=>{
        registerForm.submit()
      })
      it("Verifica mensagem", ()=>{
        cy.contains('A senha deve ter no mínimo 8 caracteres').should('exist');
      })
    })

    describe('Enviar email e senha errados', () => {
      it('Navega para a pagina de login', () => {
        cy.clearCookies();
        cy.visit('/')
      })
      it("Preenche o email", ()=>{
        registerForm.typeEmail("test@test.com")
      })
      it("Preenche a senha", ()=>{
        registerForm.typePassword("123456789")
      })
      it("Clica no botão", ()=>{
        registerForm.submit()
      })
      it("Verifica mensagem", ()=>{
        cy.contains('Email ou senha estão errados').should('exist');
      })
    })

    describe('Enviar email e senha validos', () => {
        it('Navega para a pagina de login', () => {
          cy.clearCookies();
          cy.visit('/')
        })
        it("Preenche o email", ()=>{
          registerForm.typeEmail("test@test.com")
        })
        it("Preenche a senha", ()=>{
          registerForm.typePassword("test@test.com")
        })
        it("Clica no botão", ()=>{
          registerForm.submit()
        })
        it("Verifica mensagem", ()=>{
          cy.contains('Dashboard').should('exist');
        })
      })
  })

