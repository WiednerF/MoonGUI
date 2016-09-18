import { MoonGui2Page } from './app.po';

describe('moon-gui2 App', function() {
  let page: MoonGui2Page;

  beforeEach(() => {
    page = new MoonGui2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
