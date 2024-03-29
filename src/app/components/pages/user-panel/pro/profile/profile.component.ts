import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { FilterService, SelectItemGroup } from 'primeng/api';
import { Search } from 'src/app/models/service/search';
import { Password } from 'src/app/models/user/password';
import { State } from 'src/app/models/user/state';
import { User } from 'src/app/models/user/user';
import { UserAdress } from 'src/app/models/user/useradress';
import { ApiService } from 'src/app/shared/api/api.service';
import { CategoryService } from 'src/app/shared/api/category.service';
import { UploadService } from 'src/app/shared/api/upload.service';
import { UserService } from 'src/app/shared/api/user.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

            fileData: File = null;
            Disabled: boolean;
            categories: Object;
            sub: any;
            filteredSub: any[]; states : any;



          public c : any;
          public user: User  = new User ;
          public users: UserAdress  = new UserAdress ;

          public image = 'assets/img/Logo_e.jpg';

          public password!: Password ;
          public currentuser : any = null;
          public passwordForm: FormGroup;
          public searchForm: FormGroup;
          public usertwoform : FormGroup;
          private  notifier: NotifierService;
          selectedCountries: any[];
          selectedServices: any[];
          selectedCategories: any[];

          filteredCountries: any[];
          filteredServices: any[];


            serach = new Search ;

          //selectedCountry: Country;
          selectedCountry: string;
          selcttedService : string;
          selcttedcategory : string;
          selcttedsubcategory : string;

          countries: any[];
          services : any;
          servicesArray : any[] ;



          formsearch : FormGroup ;

          selectedCity3: string;
          groupedCities: SelectItemGroup[];
          groupedServices: SelectItemGroup[];
          groupeddServices: any[];

 public line : any = [
  {title:"Affaires"}, {title:"Résidence"}, {title:"Cellulaire"}, {title:"Autre"}

 ];



  selecteds: any;

 public userForm: FormGroup;
  constructor(public auth: AuthService ,
    public userapi : UserService ,
    public router: Router ,
    public fb: FormBuilder,
    public upload : UploadService,private http: HttpClient ,
    public category : CategoryService,
    notifierService: NotifierService,  private filterService: FilterService
     )
  {
    this.notifier = notifierService;

    this.auth.Profile().subscribe((data: any)=> {this.user = data ;   console.log(this.user.role)});

    this.auth.profileUser().subscribe(data=>  {this.users = data ; console.log(this.users = data ) ;  }) ;

    this.passwordForm = this.fb.group({
      password_current: [''],
      new_password: [''],
      new_confirm_password: [''],
    });

    this.searchForm = this.fb.group({
      label: [''],

    });



    this.usertwoform = new FormGroup(
      {
       firstname: new FormControl('' , {validators: Validators.max(12) , updateOn:'submit'}),
       email:  new FormControl('' , {validators: Validators.email , updateOn:'submit'}),
       lastname: new FormControl('' , {validators: Validators.max(12) , updateOn:'submit'}),
       username: new FormControl('' , {validators: Validators.max(12) , updateOn:'submit'}),
       phone: new FormControl('' , {validators: Validators.max(12) , updateOn:'submit'}),
       adresse: new FormControl('' , {validators: Validators.max(12) , updateOn:'submit'}),
       website: new FormControl('' , {validators: Validators.max(12) , updateOn:'submit'}),
       LinkedIn:new FormControl('' , {validators: Validators.max(12) , updateOn:'submit'}),
       langue: new FormControl('' , {validators: Validators.max(12) , updateOn:'submit'}),
       isEmailActive: new FormControl('' ),
      }
    );

    this.category.getAllServices() .subscribe(
      response => {  this.services = response ;  },
      error => { console.log(error);  });

      this.category.getAllSubCategory() .subscribe(
        response => {  this.sub = response ;  },
        error => { console.log(error);  });

        this.userapi.getAllStates().subscribe(
          response => {
            this.states = response ;

          }) ;

        this.countries = [

          {name: 'germany', code: 'DE'},
          {name: 'japan', code: 'JP'},
          {name: 'usa', code: 'US'}
      ];


  }

  breadcrumb = [ {  title: 'My Profile',subTitle: 'User Panel'}]

  ngOnInit():void  {
    this.router.navigateByUrl('professionnel/profile');
    this.category.getAllCategories().subscribe(
      response => {
        this.categories = response ;



      },) ;





}

  successAlert()
  {
    Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Password change successfully',
    showConfirmButton: false,
    timer: 1500
  }) ;
}



  updateprofile()
  {
   // const data : any = {name: this.user.username , email:this.user.email}
  let currentuser = this.users ;

    this.userapi.updateAdress(this.users.user.id , currentuser) .subscribe(
      response => {
        this.notifier.notify('success', 'User updated successfully');
        console.log(response);

      },
      error => {
        console.log(error);
      });
  }

  updatepassword()
  {
      this.auth.changepassword(this.passwordForm.value).
      subscribe( response => {
        this.successAlert() ;
        console.log(response);
      },
      error => {
        console.log(error);
      });
  }


  onUpload() {
    const formData = new FormData();
    formData.append('file', this.fileData);

    const isUploading = true;

    this.http.put("http://127.0.0.1:8000/api/auth/upload-image", formData , {  reportProgress: true,
    observe: 'events'  } ).subscribe(events => {
      if(events.type == HttpEventType.UploadProgress) {
          console.log('Upload progress: ', Math.round(events.loaded / events.total * 100) + '%');
      } else if(events.type === HttpEventType.Response) {
          console.log(events);
      }
  });



}

filteredGroups : any[] ;

filterGroupedServices(event) {
  let query :any;
  let tes = new Search ;
  tes.label="a" ;

  this.category.serachService(tes).subscribe(
    response => {
      query = response ;

      console.log('query        '+query);

    },
    error => {
      console.log(error);
    });

  let filteredGroups = [];

  for (let optgroup of this.c) {
      let filteredSubOptions = this.filterService.filter(optgroup.label, ['label'], query, "contains");
      if (filteredSubOptions && filteredSubOptions.length) {
          filteredGroups.push({
              label: optgroup.label,
              items: filteredSubOptions

          });
      }
  }
  console.log(query) ;
  this.filteredGroups = filteredGroups;
}





filterServices(event) {
  //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
  let filtered : any[] = [];
  let query = event.query;
  for(let i = 0; i < this.services.length; i++) {
      let serv = this.services[i];
      console.log(serv) ;
      if (serv.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(serv);} }


       this.filteredServices = filtered;



      }


      filterSubCategories(event) {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        let query = event.query;
        for(let i = 0; i < this.sub.length; i++) {
            let sub = this.sub[i];
            console.log(sub) ;
            if (sub.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(sub);} }


             this.filteredSub = filtered;



            }


}
