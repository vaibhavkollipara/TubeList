import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';


export class FadeInOut {

    public static animation = trigger('flyInOut', [
      state('in', style({opacity : 1, transform: 'scale(1)'})),
      transition('void => *', [
        style({opacity : 0, transform: 'scale(0)'}),
        animate('500ms')
      ]),
      transition('* => void', [
        animate('500ms', style({ opacity : 1, transform: 'scale(0)'}))
      ])
    ]);
}
