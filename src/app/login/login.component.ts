import { Component, OnInit } from '@angular/core';
import { element } from 'protractor';
import { AuthenticationService } from '../authentication.service';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';

const SOCKET_ENDPOINT = 'https://dashboard.heroku.com/apps/mychat-backend-23';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private authenticationservice:AuthenticationService, private router:Router) { }

  public username;
  public current_room;
  public room_array=[];
  public none_display;
  public user:string;
  public selected_room:string;
  public room_password;//manager
  public customer_room_password;
  public socket;

//array length gets initialised only once. doesn't get updated. so use "array.length" rather than variable.

	ngOnInit(): void {
		this.setupSocketConnection();
		if(this.authenticationservice.roomArray.length==0){
		this.none_display=true;
		}
		else{
		this.none_display=false;
		}
		this.authenticationservice.roomArray.forEach(element=>{
		this.room_array.push(element.name);
		});
	}

	//update rooms for new connections
	updateRooms(rooms){
		//array override
		this.authenticationservice.roomArray = rooms;
		this.room_array = this.authenticationservice.roomArray;
	}

  	setupSocketConnection() {
		this.socket = io(SOCKET_ENDPOINT);
	
		//routing to home
		this.socket.on("join-successful", ()=>
		{
			this.authenticationservice.user_name = this.username;
			this.router.navigate(["/home"]);	
		});
		
		//initialize available rooms on new connection
		this.socket.on("stateinitialize", (rooms)=>
		{
			this.updateRooms(rooms);
		})

		//updating available rooms to all clients on a new creation
		this.socket.on('roomupdate', (data) => {
			this.updateRooms(data);	
		});

		this.socket.on('wrong-password', ()=>{
		document.getElementById('room-password-error').style.display="block";
		});	
	}

	manager()
	{
		document.getElementById('manager').style.display="block";
		document.getElementById('customer').style.display="none";
		this.user = "manager";
	}

	customer(){
		document.getElementById('customer').style.display="block";
		document.getElementById('manager').style.display="none";
		this.user = "customer";
	}

	signin(){
		if(this.user=="manager"){
			//.emit didn't work in service
			this.authenticationservice.current_room = this.current_room;
			this.socket.emit('join', {u: this.username, r: this.current_room, t: this.user, p:this.room_password});  
		}
		if(this.user=="customer"){
			this.current_room = this.selected_room;
			this.authenticationservice.current_room = this.current_room;
			this.room_password = this.customer_room_password;
			this.socket.emit('join', {u: this.username, r: this.current_room, t: this.user, p:this.room_password});
		}
	}
}