describe.only('Login', () => {
	const emailAddress = Cypress.env('USER_EMAIL')
	const password = Cypress.env('USER_PASSWORD')

	it('successfully logs in', () => {
		cy.guiLogin(emailAddress, password)
	})
})