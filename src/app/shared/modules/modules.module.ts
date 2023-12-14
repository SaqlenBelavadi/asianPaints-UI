import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { MaterialModule } from './material.module';


const exportable: any[] = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  LayoutModule,
  MaterialModule,
  BreadcrumbModule
];

@NgModule({
  exports: [exportable]
})
export class ModulesModule { }
