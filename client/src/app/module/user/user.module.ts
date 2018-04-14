import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './profile/profile.component'
import { UserService } from './service/user.service'

@NgModule({
    declarations: [
        UserProfileComponent,
    ],
    exports: [
        UserProfileComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        RouterModule.forChild([
            {path: 'users/:userId', component: UserProfileComponent},
          ]),
    ],

    providers:[
        UserService,
    ],
})

export class UserModule { }