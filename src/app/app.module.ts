import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { RouterModule } from '@angular/router'; 
import { HeaderComponent } from "./core/components/header/header.component";
import { LoginComponent } from "./pages/login/login.component";

@NgModule({
  declarations: [],
  imports: [BrowserModule, AppRoutingModule, RouterModule, HeaderComponent, LoginComponent], 
  providers: []
})
export class AppModule {}