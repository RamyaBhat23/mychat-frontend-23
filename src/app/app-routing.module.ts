import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

const routes: Routes = [
  { path:'', redirectTo:'/login', pathMatch:'full'},//first statement. default
  { path:'home', component:HomeComponent },
  { path:'login', component:LoginComponent },
  { path:'**', component:PagenotfoundComponent }//last statement
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }