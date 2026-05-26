import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './service/login';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    ToastModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    ButtonModule,
    ImageModule,
    IconFieldModule,
    InputIconModule,
    IftaLabelModule
  ],
  providers: [MessageService, LoginService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Login {
  @ViewChild('username') username?: ElementRef;
  @ViewChild('password') password?: ElementRef;
  formLogin: FormGroup = new FormGroup({});
  data: any[] = [];
  onChecked: boolean = false;
  localIps: string[] = [];
  visible: boolean = false;
  progress = signal(0);
  interval: any = null;
  private message = inject(MessageService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService

  ) { }


  ngOnInit(): void {
    this.formLogin = this.fb.group({
      user: ['', Validators.required],
      passw: ['', Validators.required],
      acceso: [false]
    });

  }


  async func_inicia_sesion() {
    const logindata = {
      user: this.formLogin.value.user,
      clave: this.formLogin.value.passw
    }

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      for (const key in this.formLogin.controls) {
        this.formLogin.controls[key].markAsDirty();
      }
      return;
    }

    this.showSppiner();

    this.loginService.funct_retorna_usuario_s(logindata.user, logindata.clave).subscribe({
      next: data => {
        const dataObj = JSON.parse(JSON.stringify(data));
        if (this.onChecked == false) {
          this.message.clear('confirm');
          localStorage.setItem('user', dataObj.data.user);
          localStorage.setItem('token', dataObj.data.token);
          this.router.navigate(['/menu']);
        } else {
          localStorage.setItem('user', dataObj.data.user);
          localStorage.setItem('token', dataObj.data.toke);
          this.router.navigate(['/inventario-web']);
        }

      }, error: (err) => {
        this.message.clear('confirm');
        this.message.add({ severity: 'error', summary: 'Error:', detail: 'Credenciales incorrectas', life: 3000 });
        console.error('Error:', err);
      },
    })

  }

  onEnterPressed(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.password?.nativeElement.focus();
    }
  }

  onCheckboxChange(event: any) {
    if (event.checked == true) {
      this.onChecked = true;
    } else {
      this.onChecked = false;
    }
  }

  showSppiner() {
    this.message.add({
      key: 'confirm',
      severity: 'info',
      sticky: true,
      closable: true
    });
  }
}
