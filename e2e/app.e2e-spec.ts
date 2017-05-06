import { MyPlaylistsPage } from './app.po';

describe('my-playlists App', () => {
  let page: MyPlaylistsPage;

  beforeEach(() => {
    page = new MyPlaylistsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
