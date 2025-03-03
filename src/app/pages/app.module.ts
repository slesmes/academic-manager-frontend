import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { RouterModule } from '@angular/router'; 
import { HeaderComponent } from "../core/components/header/header.component";

@NgModule({
  imports: [BrowserModule, AppRoutingModule, RouterModule, HeaderComponent], 
  providers: []
})
export class AppModule {}