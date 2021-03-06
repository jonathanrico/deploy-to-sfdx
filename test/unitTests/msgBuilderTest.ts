/* globals it, describe */

import * as chai from 'chai';
import * as msgBuilder from '../../src/lib/deployMsgBuilder';

const assert = chai.assert;
const expect = chai.expect; // we are using the "expect" style of Chai

describe('urlTestsMaster', () => {
	it('handles master repos', () => {

		const req = {
			query: {
				template: 'https://github.com/mshanemc/cg4Integrate'
			}
		};

		expect(msgBuilder(req).repo).to.equal('cg4Integrate');
		expect(msgBuilder(req).username).to.equal('mshanemc');
		expect(msgBuilder(req).branch).to.be.an('undefined');

		const message = msgBuilder(req);
		assert.isOk(message.deployId);
		// username-repo-timestamp
		assert(message.deployId.split('-').length === 3, `invalid deploytId ${message.deployId}`);
		assert(message.deployId.split('-')[0] === message.username, 'incorrect username for deployId');
		assert(message.deployId.split('-')[1] === message.repo, 'incorrect repo for deployId');

	});
});

describe('urlTestsBranch', () => {
	it('handles branch repos', () => {

		const req = {
			query: {
				template: 'https://github.com/mshanemc/cg4Integrate/tree/passwordSet'
			}
		};

		expect(msgBuilder(req).username).to.equal('mshanemc');
		expect(msgBuilder(req).repo).to.equal('cg4Integrate');
		expect(msgBuilder(req).branch).to.equal('passwordSet');
		expect(msgBuilder(req).firstname).to.be.an('undefined');
		expect(msgBuilder(req).lastname).to.be.an('undefined');
		expect(msgBuilder(req).email).to.be.an('undefined');

		const message = msgBuilder(req);
		assert.isOk(message.deployId);
		// username-repo-timestamp
		assert(message.deployId.split('-').length === 3, `invalid deploytId ${message.deployId}`);
		assert(message.deployId.split('-')[0] === message.username, 'incorrect username for deployId');
		assert(message.deployId.split('-')[1] === message.repo, 'incorrect repo for deployId');

	});

	it('prevents bad urls', () => {
		const req = {
			query: {
				template: 'https://github.com/mshanemc/df17IntegrationWorkshops/tree/master; wget http://'
			}
		};

		expect( () => msgBuilder(req)).to.throw();
	});
});

describe('userinfo', () => {
	it('handles email, firstname, lastname', () => {

		const req = {
			query: {
				template: 'https://github.com/mshanemc/cg4Integrate/tree/passwordSet',
				firstname: 'shane',
				lastname: 'mclaughlin',
				email : 'shane.mclaughlin@salesforce.com'
			}
		};

		expect(msgBuilder(req).username).to.equal('mshanemc');
		expect(msgBuilder(req).repo).to.equal('cg4Integrate');
		expect(msgBuilder(req).branch).to.equal('passwordSet');
		expect(msgBuilder(req).firstname).to.equal('shane');
		expect(msgBuilder(req).lastname).to.equal('mclaughlin');
		expect(msgBuilder(req).email).to.equal('shane.mclaughlin@salesforce.com');

		const message = msgBuilder(req);
		assert.isOk(message.deployId);
		// username-repo-timestamp
		assert(message.deployId.split('-').length === 3, `invalid deploytId ${message.deployId}`);
		assert(message.deployId.split('-')[0] === message.username, 'incorrect username for deployId');
		assert(message.deployId.split('-')[1] === message.repo, 'incorrect repo for deployId');

	});
});