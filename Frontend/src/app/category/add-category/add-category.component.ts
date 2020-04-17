import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { activity } from 'src/app/models/category.enum';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  public thingForm: FormGroup;
  public imagePreview: string;
  constructor(private dialogRef: MatDialogRef<AddCategoryComponent>,
              private categoryService: CategoryService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.thingForm = this.formBuilder.group({
      Nom: [null, Validators.required],
      Type: [activity['0'], Validators.required],
      image: [null, Validators.required]
    });
   }

  closeModal() {
    this.dialogRef.close();
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.thingForm.get('image').patchValue(file);
    this.thingForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if (this.thingForm.get('image').valid) {
        this.imagePreview = reader.result as string;
      } else {
        this.imagePreview = null;
      }
    };
    reader.readAsDataURL(file);
  }

  onAddCategory( ) {
     const Nom = this.thingForm.get('Nom').value;
     const Type = this.thingForm.get('Type').value;
     const Photo = '';
     const category = new Category(Nom, Type, Photo);
     console.log('category', category);
     this.categoryService.addCategory(category, this.thingForm.get('image').value).then((data) => {
       console.log(data);
     }).catch((err) => {
       console.error("voici l'erreur" , err);
     });
     this.dialogRef.close({action: 1, data: this.categoryService.getCategories()});
  } // méthode permettant d'ajouter une catégorie à la liste de catégorie
}
