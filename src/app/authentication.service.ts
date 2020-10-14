import { Injectable } from '@angular/core';
import { element } from 'protractor';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private router:Router) { }

  //name of the user
  public user_name;

  //room in which the user is
  public current_room;

  //array of rooms available for joining
  public roomArray=[];
  
}