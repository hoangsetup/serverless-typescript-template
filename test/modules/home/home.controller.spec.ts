import 'reflect-metadata';
import 'mocha';
import {expect} from 'chai';
import {HomeController} from '../../../src/modules/home/home.controller';

describe('Home Controller', () => {
  it('should give back `Home sweet home`', async () => {
    let controller = new HomeController();
    expect(await controller.get()).to.equal('Home sweet home');
  });
});
