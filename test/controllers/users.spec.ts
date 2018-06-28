// import 'reflect-metadata';
// import 'mocha';
// import {expect} from 'chai';
//
// import {UsersController} from '../../src/modules/users/users.controller';
// import {UsersService} from '../../src/modules/users/users.service';
//
// describe('Users Controller', () => {
//   let controller: UsersController;
//   before(() => {
//     controller = new UsersController(new UsersService());
//   });
//
//   it('should get back all user', async () => {
//     expect(await controller.getUsers()).to.deep.equal(
//       [{
//         email: 'lorem@ipsum.com',
//         name: 'Lorem',
//       }, {
//         email: 'doloe@sit.com',
//         name: 'Dolor',
//       }],
//     );
//   });
//
//   it('should give back the right user', async () => {
//     expect(await controller.getUser('Lorem')).to.deep.equal({
//       email: 'lorem@ipsum.com',
//       name: 'Lorem',
//     });
//   });
// });
