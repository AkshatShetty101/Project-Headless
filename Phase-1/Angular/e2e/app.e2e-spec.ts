import { MyInterfacePage } from './app.po';

describe('my-interface App', () => {
  let page: MyInterfacePage;

  beforeEach(() => {
    page = new MyInterfacePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
