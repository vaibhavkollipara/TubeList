import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyplaylistsComponent } from './myplaylists.component';

describe('MyplaylistsComponent', () => {
  let component: MyplaylistsComponent;
  let fixture: ComponentFixture<MyplaylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyplaylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyplaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
