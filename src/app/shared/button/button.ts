import { NgClass } from '@angular/common';
import { Component ,Input,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'sh-button',
  standalone:true,
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class Button {
    @Input() label:string='click';
    @Input() className:string='btn';
    @Input() disabled:boolean=false;

    @Output() clicked=new EventEmitter<void>();
     
    onClick(){
      if(!this.disabled){
        this.clicked.emit();
      }
    }
}
