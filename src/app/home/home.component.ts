import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import * as io from 'socket.io-client';
import { AuthenticationService } from '../authentication.service';

const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(private authenticationservice:AuthenticationService) { }

  ngOnInit(): void {
    this.setupSocketConnection();
  }

  socket;
  message:string;
  showEmojiPicker = false;
  msgArray:any=[];
  id=0;
  deleteMsgArray:any=[];
  idarray:any=[];
  public username = this.authenticationservice.user_name;
  public room = this.authenticationservice.current_room;
  delete_click = true;

  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);//if this is in SendMessage(), then I will get my msgs back(2 copies)

    //after entering home, update his currentroom
    this.socket.emit('room-join', this.authenticationservice.current_room);
    
    this.socket.on('message-to-rooms', (msgdata) => {
      const element = document.createElement('li');
      console.log("ramya good job");
      element.innerHTML = msgdata.username +": "+ msgdata.message;
      element.style.background = 'white';
      element.style.padding =  '5px 5px';
      element.style.margin = '10px';
      element.style.borderRadius = '3px';
      element.setAttribute('id', (msgdata.id).toString());
      element.setAttribute('class', msgdata.username);
      document.getElementById('message-list').appendChild(element);
  });

    // this.socket.on('delete-from-rooms', (deleteArray) => {
    //   let array = document.getElementsByClassName(deleteArray.class);
    //       deleteArray.forEach(deletedata =>{
    //         Array.prototype.forEach.call(array, () => {
    //           array.item(deletedata.id).innerHTML = "this message has been deleted";   
    //         });  
    //       });
    // });
}

SendMessage() {
  this.socket.emit('send-message', {username:this.username, message:this.message, id:this.id, room: this.room});//emitting event
  const element = document.createElement('li');
  element.setAttribute('id', (this.id).toString());
  element.setAttribute('class', this.username);
  element.innerHTML = this.message;
  element.style.background = 'white';
  element.style.padding =  '5px 5px';
  element.style.margin = '10px';
  element.style.textAlign = 'right';
  element.style.borderRadius = '3px';
  document.getElementById('message-list').appendChild(element);
  this.id++;
    
  // element.on('click', event =>{}) doesn't work
  // element.onclick = event => 
  // {
  //     if(this.delete_click)
  //   {
  //     let deleteid = element.getAttribute("id");
  //     let deleteclass = element.getAttribute("class");

  //     element.style.backgroundColor="rgba(12, 27, 66, 0.3)";
  //     element.style.color="white";
  //     this.deleteMsgArray.push({ id: deleteid, class: deleteclass});  
  //     window.addEventListener('keydown', (event: KeyboardEvent)=> {
  //       if (event.key == "Delete" && this.deleteMsgArray.length > 0) {
  //         this.deleteMsgArray.forEach(e=> {
  //               this.socket.emit('delete-message', this.deleteMsgArray, this.authenticationservice.current_room );
  //               document.getElementById(e.id).remove();
  //         });
  //         this.deleteMsgArray = [];
  //       }
  //     });
  //     this.delete_click = false;
  //   }
  //   else
  //   {
  //     let cancel_delete_id = element.getAttribute("id");
  //     if (this.deleteMsgArray.find(x => x.id == cancel_delete_id)) {
  //       this.deleteMsgArray.splice(this.deleteMsgArray.findIndex(x => x.id == cancel_delete_id), 1);
  //     }
  //     console.log(this.deleteMsgArray);
  //     document.getElementById(cancel_delete_id).style.backgroundColor = "white";
  //     document.getElementById(cancel_delete_id).style.color = "black";
  //     this.delete_click = true;
  //   }     
  //   }
  this.message = '';
}

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}

addEmoji(event) {
  this.message = event.emoji.native;
  this.showEmojiPicker = true;
}

logout(){
  this.socket.close();
}
}