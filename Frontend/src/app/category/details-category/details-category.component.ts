import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-category',
  templateUrl: './details-category.component.html',
  styleUrls: ['./details-category.component.css']
})
export class DetailsCategoryComponent implements OnInit, OnDestroy {
  nomCategory: string;
  typeCategory: string;
  photoCategory: string;
  index: number;
  getCategorySubscribing: Subscription;
  constructor(private dialogRef: MatDialogRef<DetailsCategoryComponent>,
              private categoryService: CategoryService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                if (data !== null) {
                this.index = data.data;
              } }

  ngOnInit(): void {
    this.getCategorySubscribing = this.categoryService.getCategory(this.index).subscribe((data) => {
      const category = ((data.body) as any).Data;
      this.nomCategory = category['Nom'];
      this.typeCategory = category['Type'];
      this.photoCategory = category['imageURL'];
    },
    (err) => {
      console.log(err);
    });
  } // méthode permettant d'affecter des valeurs aux proprietés

  closeModal() {
    this.dialogRef.close();
  } // méthode permettant la fermeture la fenetre popup

  ngOnDestroy() {
    this.getCategorySubscribing.unsubscribe();
  }

}
