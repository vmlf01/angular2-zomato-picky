import { ZomatoPickyPage } from './app.po';

describe('zomato-picky App', function() {
  let page: ZomatoPickyPage;

  beforeEach(() => {
    page = new ZomatoPickyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
