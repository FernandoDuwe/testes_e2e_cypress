Cypress.Commands.add('fillSignupFormAndSubmit', (email, password) => {
	cy.intercept('GET', '**/notes').as('getNotes')
	cy.visit('/signup')
	cy.get('#email').type(email)
	cy.get('#password').type(password, { log: false })
	cy.get('#confirmPassword').type(password, { log: false })
	cy.contains('button', 'Signup').click()
	cy.get('#confirmationCode').should('be.visible')
	cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'), {
		sentTo: email
	}).then(message => {
		const confirmationCode = message.html.body.match(/\d{6}/)[0]
		cy.get('#confirmationCode').type(`${confirmationCode}{enter}`)
		cy.wait('@getNotes')
	})
})

Cypress.Commands.add('guiLogin', (email, password) => {
	cy.intercept('GET', '**/notes').as('getNotes')

	cy.visit('/login')
	cy.get('#email').type(email)
	cy.get('#password').type(password, { log: false })
	cy.contains('button', 'Login').click()
	cy.wait('@getNotes')

	cy.contains('h1', 'Your Notes').should('be.visible')
	cy.contains('a', 'Create a new note').should('be.visible')
})

// Comando para efetaur o login e guardar a sessão atual
Cypress.Commands.add('sessionLogin', (
	username = Cypress.env('USER_EMAIL'),
	password = Cypress.env('USER_PASSWORD')
) => {
	const login = () => cy.guiLogin(username, password)
	cy.session(username, login)
})

// CRUD
Cypress.Commands.add('createNote', (note, password = false) => {
	cy.get('#content').type(note)
	cy.contains('button', 'Create').click()

	if (password) {
		cy.get('#file').selectFile('cypress/fixtures/example.json')
	}

	cy.wait('@getNotes')
	cy.contains('.list-group-item', note)
		.should('be.visible')
})

Cypress.Commands.add('updateNote', (note, attachFile = false) => {
	cy.get('#content')
		.as('contentField')
		.clear()
	cy.get('@contentField')
		.type(note)

	if (attachFile) {
		cy.get('#file').selectFile('cypress/fixtures/example.json')
	}

	cy.contains('button', 'Save').click()
})