import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './profile/profile.component'
import { UserService } from './service/user.service'
import { GalleryComponent } from './gallery/gallery.component'
import { ProductModule } from './../product/product.module';
import { UserMainComponent } from './main/main.component'
import { ConcernUsersComponent } from './concern/users/concernusers.component'
import { UsershoppingComponent } from './shopping/shopping.component'
import { UserHobbyComponent } from './hobby/hobby.component'

@NgModule({
    declarations: [
        UserProfileComponent,
        GalleryComponent,
        UserMainComponent,
        ConcernUsersComponent,
        UsershoppingComponent,
        UserHobbyComponent,
    ],
    exports: [
        UserProfileComponent,
        GalleryComponent,
        UserHobbyComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ProductModule,
        RouterModule.forChild([
            {path: 'users/:username', component: UserMainComponent},
            {path: 'users/:username/gallery', component: GalleryComponent},
            {path: 'users/:username/profile', component: UserProfileComponent},
            {path: 'users/:username/shopping', component: UsershoppingComponent},
            {path: 'users/:username/concerned/users', component: ConcernUsersComponent}
          ]),
    ],

    providers:[
        UserService,
    ],
})

export class UserModule { }